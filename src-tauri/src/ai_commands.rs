use serde::{Deserialize, Serialize};
use std::collections::HashMap;
use tauri::command;

/// LTX CUDA Device Information
#[derive(Serialize, Deserialize, Clone, Debug)]
pub struct CudaDeviceInfo {
    pub id: String,
    pub name: String,
    pub vram_gb: u32,
    pub compute_capability: String,
    pub temperature: i32,
    pub utilization: u32,
    pub memory_used: u64,
    pub memory_total: u64,
}

/// LTX Generation Configuration
#[derive(Serialize, Deserialize, Clone, Debug)]
pub struct LtxGenerationConfig {
    pub model: String,
    pub prompt: String,
    pub duration_seconds: u32,
    pub resolution: String,
    pub quality: String,
    pub use_cuda: bool,
    pub vram_threshold_gb: u32,
    pub batch_size: u32,
    pub enable_tiling: bool,
    pub hybrid_mode: bool,
}

/// LTX Performance Metrics
#[derive(Serialize, Deserialize, Clone, Debug)]
pub struct LtxPerformanceMetrics {
    pub generation_time_ms: u64,
    pub vram_used_gb: f32,
    pub gpu_utilization: u32,
    pub throughput_fps: f32,
    pub quality_score: f32,
}

/// LTX Generation Result
#[derive(Serialize, Deserialize, Clone, Debug)]
pub struct LtxGenerationResult {
    pub success: bool,
    pub output_path: Option<String>,
    pub error_message: Option<String>,
    pub metrics: Option<LtxPerformanceMetrics>,
    pub metadata: HashMap<String, serde_json::Value>,
}

/// CineGen Element Reference
#[derive(Serialize, Deserialize, Clone, Debug)]
pub struct CineGenElement {
    pub id: String,
    pub element_type: String,
    pub name: String,
    pub visual_reference: Option<String>,
    pub consistency_rules: Vec<CineGenConsistencyRule>,
}

/// CineGen Consistency Rule
#[derive(Serialize, Deserialize, Clone, Debug)]
pub struct CineGenConsistencyRule {
    pub rule_type: String,
    pub strength: f32,
    pub description: String,
}

/// Spaces Workflow Node
#[derive(Serialize, Deserialize, Clone, Debug)]
pub struct SpacesNode {
    pub id: String,
    pub node_type: String,
    pub position: SpacesPosition,
    pub data: HashMap<String, serde_json::Value>,
}

/// Spaces Position
#[derive(Serialize, Deserialize, Clone, Debug)]
pub struct SpacesPosition {
    pub x: f32,
    pub y: f32,
}

/// Spaces Workflow Edge
#[derive(Serialize, Deserialize, Clone, Debug)]
pub struct SpacesEdge {
    pub id: String,
    pub source: String,
    pub target: String,
}

/// Rendiv Video Component
#[derive(Serialize, Deserialize, Clone, Debug)]
pub struct RendivComponent {
    pub id: String,
    pub component_type: String,
    pub name: String,
    pub props: HashMap<String, serde_json::Value>,
    pub children: Vec<String>, // Component IDs
}