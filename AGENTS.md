# AGENTS.md - AI 编码代理指南

本文档为使用 Code Translator 代码库的 AI 编码代理提供指导。

## 项目概览

**Code Translator** 主要是一个用于翻译代码注释和 Markdown 文件的 VSCode 扩展。该项目具有双重性质：

- **主要**: 代码翻译的 VSCode 扩展
- **次要**: Vue 3 web 应用（Vitesse 模板）- 大部分为样板代码/未使用

> **注意**: 尽管有 AGENTS.md 惯例，但这不是一个 AI/LLM 项目。

详细功能文档请参阅：
- [`README.md`](README.md)
- [`plans/translate-extension-plan.md`](plans/translate-extension-plan.md)

## 架构概览

### 高级流程

```
用户操作 → VSCode 扩展 → 文件类型检测 → (注释提取器 | Markdown 解析器) → 翻译服务 → 显示结果
```

### 关键目录

| 目录 | 用途 |
|-----------|---------|
| `src/extension/` | 扩展代码（Node.js/CommonJS） |
| `src/`（根目录） | Vue web 应用（浏览器/ESNext） |
| `out/` | 编译后的扩展输出 |
| `plans/` | 架构文档 |

### 核心组件

| 组件 | 文件 | 职责 |
|-----------|------|----------------|
| 扩展主机 | [`src/extension/extension.ts`](src/extension/extension.ts) | 命令注册、webview 管理、用户交互 |
| 翻译服务 | [`src/extension/translator/translate.ts`](src/extension/translator/translate.ts) | MyMemory API 集成 |
| 注释翻译器 | [`src/extension/translator/comments.ts`](src/extension/translator/comments.ts) | 语言特定的注释提取/翻译 |
| Markdown 翻译器 | [`src/extension/translator/markdown.ts`](src/extension/translator/markdown.ts) | 保留结构的 Markdown 翻译 |

> **重要**: 保持扩展（CommonJS）和 web 应用（ESNext）环境之间的分离。

## 开发命令

```bash
# 扩展编译
pnpm run compile          # 单次构建
pnpm run watch            # 开发模式

# 代码检查
pnpm run lint
pnpm run lint:fix

# Web 应用开发
pnpm run dev

# 预发布工作流
pnpm run vscode:prepublish
```

**注意**: 扩展需要 VSCode ^1.75.0 进行测试/调试。

## 代码风格和规范

- **代码检查**: 使用 [`@antfu/eslint-config`](package.json)
- **架构**: 将翻译逻辑保留在 `src/extension/translator/`，扩展生命周期在 `extension.ts`
- **TypeScript**: 启用严格模式，需要类型安全
- **添加语言支持**: 在 [`src/extension/translator/comments.ts`](src/extension/translator/comments.ts) 中添加正则表达式模式
- **分离**: 永远不要混合扩展（CommonJS）和 web 应用（ESNext）模块系统

## 配置和外部依赖

### 翻译 API
- **服务**: MyMemory 翻译 API（免费版）
- **认证**: 默认不需要认证
- **可选**: 增强服务的 API 密钥

### 设置项

| 设置项 | 类型 | 默认值 | 描述 |
|---------|------|---------|-------------|
| `code-translator.targetLanguage` | string | `en` | 翻译目标语言 |
| `code-translator.sourceLanguage` | string | `auto` | 源语言（auto 表示自动检测） |
| `code-translator.apiKey` | string | `""` | 增强服务的可选 API 密钥 |

### 支持的语言

`en`、`zh-CN`、`zh-TW`、`ja`、`ko`、`es`、`fr`、`de`、`ru`、`pt`、`it`

## 安全边界

- **不要**提交 API 密钥或机密
- **Web 应用组件**（`src/` 排除 `src/extension/`）: 大部分未使用，那里的更改优先级较低
- **模块系统**: 永远不要混合 CommonJS 和 ESNext
- **完成更改前**: 运行 `pnpm run lint` 和 `pnpm run compile`

## 快速参考

| 任务 | 命令/文件 |
|------|--------------|
| 构建扩展 | `pnpm run compile` |
| 修复代码检查 | `pnpm run lint:fix` |
| 添加语言支持 | 编辑 `src/extension/translator/comments.ts` |
| 更改翻译 API | 编辑 `src/extension/translator/translate.ts` |
| 添加新命令 | 编辑 `src/extension/extension.ts` + `package.json` |
