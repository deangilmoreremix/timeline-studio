# 🎬 **Integrating Your MUAPI Video Service with Rendiv**

Since you have your own **MUAPI** video generation service, we can simplify the integration significantly. Users only need to set up their own Claude API for code generation.

---

## 🏗️ **Simplified Architecture**

### **What You Have:**
- ✅ **MUAPI**: Your video generation service
- ✅ **Claude API**: For code composition generation (user provides)

### **What We Need to Add:**
- 🔧 **MUAPI Integration** in the Tauri backend
- 🔧 **Claude Code Agent** integration
- 🔧 **Unified API configuration** for both services

---

## 🔧 **Tauri Backend Integration**

### **1. Add MUAPI Commands to `src-tauri/src/ai_commands_impl.rs`**

```rust
/// Generate video using MUAPI
#[tauri::command]
async fn generate_video_muapi(config: MuApiVideoConfig) -> Result<LtxGenerationResult, String> {
    // Call your MUAPI service
    let client = reqwest::Client::new();
    
    let response = client
        .post("https://your-muapi-endpoint.com/generate")
        .json(&serde_json::json!({
            "prompt": config.prompt,
            "duration": config.duration_seconds,
            "resolution": config.resolution,
            "quality": config.quality,
            "model": config.model,
            "api_key": config.api_key
        }))
        .send()
        .await
        .map_err(|e| format!("MUAPI request failed: {}", e))?;

    if !response.status().is_success() {
        return Err(format!("MUAPI error: {}", response.status()));
    }

    let result: serde_json::Value = response.json().await
        .map_err(|e| format!("Failed to parse MUAPI response: {}", e))?;

    // Convert to our standard format
    Ok(LtxGenerationResult {
        success: true,
        output_path: Some(result["video_url"].as_str().unwrap_or("").to_string()),
        error_message: None,
        metrics: Some(LtxPerformanceMetrics {
            generation_time_ms: result["generation_time"].as_u64().unwrap_or(30000),
            vram_used_gb: 0.0, // Not applicable for API
            gpu_utilization: 0,
            throughput_fps: 30.0,
            quality_score: 0.9,
        }),
        metadata: serde_json::from_value(result["metadata"].clone()).unwrap_or_default(),
    })
}

/// Generate video with Claude + MUAPI
#[tauri::command]
async fn generate_video_with_claude_muapi(
    natural_language_prompt: String,
    claude_api_key: String,
    muapi_config: MuApiVideoConfig
) -> Result<LtxGenerationResult, String> {
    // Step 1: Use Claude to generate Rendiv composition code
    let claude_client = AnthropicClient::new(claude_api_key);
    
    let code_prompt = format!(
        "Generate a Rendiv video composition for: '{}'. 
        Return only the React component code using useFrame, interpolate, spring, etc.
        Make it creative and visually appealing.",
        natural_language_prompt
    );

    let composition_code = claude_client
        .complete(&code_prompt)
        .await
        .map_err(|e| format!("Claude API error: {}", e))?;

    // Step 2: Parse and optimize the generated code
    let optimized_code = optimize_rendiv_code(&composition_code)?;

    // Step 3: Generate video using MUAPI with the composition
    let video_config = MuApiVideoConfig {
        prompt: optimized_code, // Use the generated code as prompt/context
        duration_seconds: muapi_config.duration_seconds,
        resolution: muapi_config.resolution,
        quality: muapi_config.quality,
        model: muapi_config.model,
        api_key: muapi_config.api_key,
    };

    generate_video_muapi(video_config).await
}
```

### **2. Add Claude Integration**

```rust
/// Claude client for code generation
pub struct AnthropicClient {
    api_key: String,
    client: reqwest::Client,
}

impl AnthropicClient {
    pub fn new(api_key: String) -> Self {
        Self {
            api_key,
            client: reqwest::Client::new(),
        }
    }

    pub async fn complete(&self, prompt: &str) -> Result<String, Box<dyn std::error::Error>> {
        let response = self.client
            .post("https://api.anthropic.com/v1/messages")
            .header("x-api-key", &self.api_key)
            .header("anthropic-version", "2023-06-01")
            .json(&serde_json::json!({
                "model": "claude-3-5-sonnet-20241022",
                "max_tokens": 4096,
                "temperature": 0.1,
                "system": "You are an expert at writing Rendiv video compositions. Generate clean, efficient React code using useFrame, interpolate, spring, and other Rendiv functions.",
                "messages": [{
                    "role": "user",
                    "content": prompt
                }]
            }))
            .send()
            .await?;

        let result: serde_json::Value = response.json().await?;
        Ok(result["content"][0]["text"].as_str().unwrap_or("").to_string())
    }
}
```

### **3. Update App Builder to Include New Commands**

```rust
// In src-tauri/src/app_builder.rs
builder.invoke_handler(tauri::generate_handler![
    // ... existing commands ...
    
    // MUAPI + Claude commands
    crate::ai_commands_impl::generate_video_muapi,
    crate::ai_commands_impl::generate_video_with_claude_muapi,
])
```

---

## 🎨 **Frontend Integration**

### **1. Update LTX Engine to Use MUAPI**

```typescript
// src/features/timeline/services/ltx-desktop-cuda-engine.ts
export class LTXDesktopCUDAEngine {
  async generateWithMUAPI(
    config: MuApiVideoConfig,
    claudeApiKey?: string
  ): Promise<GenerationResult> {
    try {
      if (claudeApiKey) {
        // Use Claude + MUAPI workflow
        return await invoke('generate_video_with_claude_muapi', {
          naturalLanguagePrompt: config.prompt,
          claudeApiKey,
          muapiConfig: config
        });
      } else {
        // Direct MUAPI call
        return await invoke('generate_video_muapi', config);
      }
    } catch (error) {
      console.error('MUAPI generation failed:', error);
      throw error;
    }
  }
}
```

### **2. Add Claude API Configuration**

```typescript
// src/features/timeline/components/advanced-timeline-integration.tsx
const [claudeApiKey, setClaudeApiKey] = useState('');
const [useClaude, setUseClaude] = useState(false);

const handleGenerateWithClaude = async () => {
  if (!claudeApiKey) {
    alert('Please enter your Claude API key');
    return;
  }

  try {
    const result = await ltxDesktopCUDAEngine.generateWithMUAPI(
      videoConfig,
      claudeApiKey
    );
    // Handle result...
  } catch (error) {
    console.error('Generation failed:', error);
  }
};
```

---

## ⚙️ **Configuration UI**

### **API Settings Panel**

```tsx
// Add to your settings modal
const ApiSettings = () => {
  const [muapiEndpoint, setMuapiEndpoint] = useState('');
  const [muapiApiKey, setMuapiApiKey] = useState('');
  const [claudeApiKey, setClaudeApiKey] = useState('');
  const [useClaudeIntegration, setUseClaudeIntegration] = useState(false);

  return (
    <Card>
      <CardHeader>
        <CardTitle>API Configuration</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* MUAPI Settings */}
        <div className="space-y-2">
          <Label>MUAPI Endpoint</Label>
          <Input
            value={muapiEndpoint}
            onChange={(e) => setMuapiEndpoint(e.target.value)}
            placeholder="https://your-muapi-endpoint.com"
          />
        </div>

        <div className="space-y-2">
          <Label>MUAPI API Key</Label>
          <Input
            type="password"
            value={muapiApiKey}
            onChange={(e) => setMuapiApiKey(e.target.value)}
            placeholder="Your MUAPI key"
          />
        </div>

        {/* Claude Integration */}
        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            checked={useClaudeIntegration}
            onChange={(e) => setUseClaudeIntegration(e.checked)}
          />
          <Label>Enable Claude AI Code Generation</Label>
        </div>

        {useClaudeIntegration && (
          <div className="space-y-2">
            <Label>Claude API Key</Label>
            <Input
              type="password"
              value={claudeApiKey}
              onChange={(e) => setClaudeApiKey(e.target.value)}
              placeholder="Your Anthropic Claude key"
            />
            <p className="text-sm text-muted-foreground">
              Get your key from <a href="https://console.anthropic.com/" target="_blank">Anthropic Console</a>
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
```

---

## 🎯 **User Workflow**

### **Option 1: Direct MUAPI (Technical Users)**
```typescript
// Developer writes custom Rendiv code
const result = await generateVideoMUAPI({
  prompt: "A bouncing ball with physics",
  model: "your-model",
  duration: 5,
  // ... other config
});
```

### **Option 2: Claude + MUAPI (Everyone)**
```typescript
// Natural language to video
const result = await generateWithClaudeMUAPI(
  "Create a cinematic logo reveal with particles and smooth animations",
  claudeApiKey,
  muapiConfig
);
// Claude generates code → MUAPI renders video
```

---

## 📊 **Benefits of This Approach**

### **For Users:**
- ✅ **One API setup**: Just Claude key (MUAPI is your service)
- ✅ **Cost effective**: No multiple external API subscriptions
- ✅ **Consistent quality**: Your video generation service
- ✅ **AI assistance**: Claude helps write complex compositions

### **For You:**
- ✅ **Control**: Own the video generation pipeline
- ✅ **Monetization**: Charge for MUAPI usage
- ✅ **Quality**: Ensure consistent output quality
- ✅ **Integration**: Seamless with your existing infrastructure

---

## 🚀 **Implementation Steps**

### **Phase 1: Backend Integration**
1. Add MUAPI commands to Tauri
2. Implement Claude client
3. Add new invoke handlers

### **Phase 2: Frontend Updates**
1. Update LTX engine for MUAPI
2. Add Claude API configuration UI
3. Update workflow to use Claude + MUAPI

### **Phase 3: User Experience**
1. Add API settings to preferences
2. Update UI to show Claude integration options
3. Add tutorials for natural language video creation

---

## 🎬 **Result**

**Users get:**
- AI-assisted video creation with natural language
- Your high-quality MUAPI video generation
- No need to manage multiple external APIs

**You get:**
- Full control over video generation pipeline
- Monetization through MUAPI service
- Seamless integration with existing infrastructure

**Perfect combination!** 🎯

Want me to implement any specific part of this integration? 🚀