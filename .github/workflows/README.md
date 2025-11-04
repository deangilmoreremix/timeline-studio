# GitHub Actions Workflows

Эта папка содержит автоматизированные CI/CD workflows для Timeline Studio.

## 🔄 Основной Pipeline

### 1. Проверка качества кода (`check-all.yml`)
**Триггеры:** push, pull_request, workflow_call

Выполняет все проверки качества кода:
- ✅ Lint JavaScript/TypeScript (Biome)
- ✅ Lint Rust (clippy + rustfmt)
- ✅ Lint CSS (Stylelint)
- ✅ Unit тесты (Vitest)
- ✅ Rust тесты
- ✅ Проверка сборки

**Платформы:** Ubuntu 22.04, Windows latest
**Время выполнения:** ~15-30 минут

### 2. Автоматический релиз (`release.yml`)
**Триггер:** push to main

Создает новую версию используя semantic-release:
1. Запускает `check-all.yml` для проверки качества
2. Анализирует коммиты (conventional commits)
3. Определяет тип версии (major/minor/patch)
4. Обновляет версии в файлах
5. Генерирует CHANGELOG.md
6. Создает git tag
7. Автоматически триггерит `build-release.yml`

**Используемые плагины:**
- @semantic-release/commit-analyzer
- @semantic-release/release-notes-generator
- @semantic-release/changelog
- @semantic-release/npm (npmPublish: false)
- @semantic-release/git
- @semantic-release/github

### 3. Сборка и публикация (`build-release.yml`)
**Триггеры:** push tag v*, workflow_dispatch

Собирает и публикует релизы:
1. Извлекает версию из тега или manual input
2. Создает GitHub Release
3. Собирает бинарники для всех платформ:
   - 🍎 macOS Universal (Intel + Apple Silicon)
   - 🪟 Windows x64 (.msi + .exe)
   - 🐧 Linux (.AppImage + .deb)
4. Загружает артефакты в релиз
5. Обновляет promo страницу

**Время выполнения:** ~60-120 минут (параллельная сборка)

## 📋 Дополнительные Workflows

### `build.yml`
Базовая проверка что проект собирается на Ubuntu.

**Триггер:** push, pull_request

### Линтеры (отдельные workflow)

#### `lint-js.yml`
**Назначение**: Проверка кода JavaScript/TypeScript с Biome
**Триггеры**: Push в main, Pull Requests
**Платформы**: Ubuntu, Windows

#### `lint-rs.yml`
**Назначение**: Проверка Rust кода с clippy
**Триггеры**: Push в main, Pull Requests для src-tauri/**
**Платформы**: Ubuntu, Windows, macOS

#### `lint-css.yml`
**Назначение**: Проверка стилей с Stylelint
**Триггеры**: Push в main, Pull Requests
**Платформы**: Ubuntu

### `version-bump.yml`
Ручное обновление версии (создает PR).

**Триггер:** workflow_dispatch

**Опции:**
- patch (0.0.X)
- minor (0.X.0)
- major (X.0.0)
- custom (любая версия)

### `alpha-release.yml`
Создание тестовых альфа-релизов.

**Триггеры:**
- push to branch `alpha-release-*`
- push tag `v*-alpha`
- workflow_dispatch

### Testing & Documentation

#### `test-coverage.yml`
**Назначение**: Генерация отчетов покрытия
**Триггеры**: Push в main, Pull Requests
**Ключевые особенности**:
- Покрытие для JavaScript и Rust
- Загрузка в Codecov
- HTML отчеты как артефакты

#### `docs.yml`
**Назначение**: Создание API документации
**Триггеры**: Push в main
**Ключевые особенности**:
- TypeDoc для TypeScript
- Cargo doc для Rust

### Deployment

#### `deploy-promo.yml`
**Назначение**: Деплой лендинга на GitHub Pages
**Триггеры**: Push в main (изменения в promo/**)

#### `sync-changelog.yml`
**Назначение**: Обновление changelog на сайте
**Триггеры**: Push в main (CHANGELOG.md)

#### `bundle-analysis.yml`
**Назначение**: Анализ размера JavaScript бандла
**Триггеры**: Pull Requests

## 🚀 Как использовать

### Создать релиз автоматически

1. Делайте коммиты используя conventional commits:
   ```bash
   git commit -m "feat: Add new feature"
   git commit -m "fix: Fix bug"
   git commit -m "docs: Update documentation"
   ```

2. Push в main:
   ```bash
   git push origin main
   ```

3. Автоматически:
   - ✅ check-all проверит код
   - ✅ semantic-release создаст версию и тег
   - ✅ build-release соберет и опубликует релиз

### Создать релиз вручную

1. Перейдите в Actions → Build and Release
2. Нажмите "Run workflow"
3. Укажите версию и тип (release/prerelease)
4. Нажмите "Run workflow"

### Создать альфа-релиз

```bash
git checkout -b alpha-release-feature-name
git push origin alpha-release-feature-name
```

Или создайте тег:
```bash
git tag v2.1.5-alpha
git push origin v2.1.5-alpha
```

## 🔧 Локальная проверка

Перед push рекомендуется запустить проверки локально:

```bash
# Все проверки
npm run check:all

# Только lint
npm run lint

# Только тесты
npm run test

# Проверка Rust
npm run check:rust
```

## 📝 Conventional Commits

Используйте следующие префиксы для коммитов:

- `feat:` - новая функциональность (minor version)
- `fix:` - исправление бага (patch version)
- `docs:` - изменения в документации
- `style:` - форматирование кода
- `refactor:` - рефакторинг
- `perf:` - улучшение производительности
- `test:` - добавление тестов
- `chore:` - обновление зависимостей и т.д.

**Breaking changes** (major version):
```bash
git commit -m "feat!: Change API"
# или
git commit -m "feat: Change API

BREAKING CHANGE: API has changed"
```

## 🐛 Troubleshooting

### Релиз не создался автоматически

1. Проверьте что коммит использует conventional commits format
2. Убедитесь что check-all прошел успешно
3. Проверьте что нет `[skip ci]` в сообщении коммита
4. Посмотрите логи release.yml workflow

### Build-release не запустился после тега

1. Убедитесь что тег имеет формат `v*` (например `v2.1.5`)
2. Проверьте что тег был создан через push (`git push origin v2.1.5`)
3. Посмотрите в Actions - workflow должен появиться через несколько секунд

### Проверки падают

1. Запустите локально: `npm run check:all`
2. Исправьте ошибки
3. Закоммитьте исправления
4. Push снова

## 🔐 Секреты и переменные

Необходимые секреты в репозитории:

- `APPLE_CERTIFICATE` - Сертификат для подписи macOS
- `APPLE_CERTIFICATE_PASSWORD` - Пароль сертификата
- `APPLE_SIGNING_IDENTITY` - Identity для подписи
- `APPLE_ID` - Apple ID для нотариации
- `APPLE_PASSWORD` - App-specific пароль
- `CODECOV_TOKEN` - Токен для Codecov
- `TAURI_PRIVATE_KEY` - Приватный ключ для обновлений
- `TAURI_KEY_PASSWORD` - Пароль ключа

## ⚙️ Настройка окружения

### FFmpeg на Windows

Workflows используют предсобранные FFmpeg библиотеки:

```powershell
FFMPEG_DIR=C:\ffmpeg
FFMPEG_INCLUDE_DIR=C:\ffmpeg\include
FFMPEG_LIB_DIR=C:\ffmpeg\lib
PKG_CONFIG_PATH=C:\ffmpeg\lib\pkgconfig
```

### ONNX Runtime

Для функций распознавания:

```bash
# macOS
ORT_DYLIB_PATH=/opt/homebrew/lib/libonnxruntime.dylib

# Linux
ORT_LIB_PATH=/usr/lib/x86_64-linux-gnu
```

## 💾 Кэширование

Стратегия кэширования для ускорения сборок:

1. **Node зависимости**: По хэшу package-lock.json
2. **Rust зависимости**: По хэшу Cargo.lock
3. **FFmpeg (Windows)**: Отдельный кэш для библиотек
4. **Bun кэш**: По хэшу bun.lockb

## 📊 Метрики производительности

| Workflow | Типичное время | Платформа |
|----------|---------------|-----------|
| lint-js | 2-3 минуты | Ubuntu/Windows |
| lint-rs | 5-8 минут | Все платформы |
| check-all | 15-30 минут | Ubuntu, Windows |
| build | 20-30 минут | Ubuntu |
| build-release | 60-120 минут | Все платформы |
| test-coverage | 8-12 минут | Ubuntu |

## 🔧 Отладка проблем

### Проблема: Mutex lock failed в Rust тестах
**Решение**: Используется скрипт `src-tauri/run-tests.sh` с single-thread режимом

### Проблема: FFmpeg не найден на Windows
**Решение**: Проверьте установку через "FFmpeg Installation Verification" шаг

### Проблема: Biome форматирование
**Решение**: Запустите локально `npm run lint:fix`

### Проблема: check-all падает с timeout
**Решение**: Увеличен timeout до 120 минут в workflow конфигурации

## 📚 Связанные скрипты

Вспомогательные скрипты находятся в `scripts/ci/`:
- `setup-ffmpeg-windows.ps1` - Установка FFmpeg на Windows
- `setup-ffmpeg-macos.sh` - Установка FFmpeg на macOS
- `setup-rust-env-windows.ps1` - Настройка Rust окружения на Windows
- `sync-version.js` - Синхронизация версий
- `sync-changelog.js` - Синхронизация changelog
- `version-sync.mjs` - Универсальная синхронизация версий

## 📖 Дополнительная документация

См. также:
- [CLAUDE.md](../../CLAUDE.md) - Полная документация проекта
- [CONTRIBUTING.md](../../CONTRIBUTING.md) - Руководство для контрибьюторов
- [.releaserc.json](../../.releaserc.json) - Конфигурация semantic-release
