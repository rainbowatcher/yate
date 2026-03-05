# yate

<p align='center'>
一个用于在编辑器中直接翻译 <b>代码注释</b> 和 <b>Markdown 文件</b> 的 VSCode 扩展。
</p>

<br>

<p align='center'>
<a href="https://marketplace.visualstudio.com/items?itemName=code-translator.code-translator">VSCode 市场</a>
</p>

<br>

## 功能特性

- 📝 **翻译代码注释** - 支持翻译 JavaScript、TypeScript、Python、Java、C/C++、Go、Rust 等多种语言的注释
- 📄 **翻译 Markdown** - 保留格式翻译 Markdown 文件（标题、列表、表格、代码块）
- 🌐 **多语言支持** - 支持英语、中文、日语、韩语、西班牙语、法语、德语、俄语、葡萄牙语和意大利语
- ⚡ **快速翻译** - 使用免费的 MyMemory 翻译 API
- 🔧 **易于使用** - 通过命令面板使用简单命令

## 安装

1. 打开 VS Code
2. 进入扩展市场 (Ctrl+Shift+X)
3. 搜索 "yate" 或 "Code Translator"
4. 点击安装

或从 [VSCode 市场](https://marketplace.visualstudio.com/items?itemName=code-translator.code-translator) 安装。

## 使用方法

### 翻译选中文本

1. 选中要翻译的文本
2. 打开命令面板 (Ctrl+Shift+P)
3. 输入 "yate: 翻译选中文本" 或 "Code Translator: Translate Selection"
4. 选中的文本将被翻译结果替换

### 翻译所有注释

1. 打开代码文件
2. 打开命令面板 (Ctrl+Shift+P)
3. 输入 "yate: 翻译所有注释" 或 "Code Translator: Translate All Comments"
4. 文件中的所有注释将被翻译

### 翻译 Markdown

1. 打开 Markdown 文件
2. 打开命令面板 (Ctrl+Shift+P)
3. 输入 "yate: 翻译 Markdown" 或 "Code Translator: Translate Markdown"
4. Markdown 内容将被翻译

## 配置

你可以在 VS Code 设置中配置扩展：

| 设置 | 描述 | 默认值 |
|---------|-------------|---------|
| `code-translator.targetLanguage` | 翻译目标语言 | `zh-CN` |
| `code-translator.sourceLanguage` | 源语言（使用 `auto` 自动检测） | `auto` |
| `code-translator.apiKey` | 翻译 API 密钥（免费版可选） | `''` |

### 支持的语言

- `en` - 英语
- `zh-CN` - 简体中文
- `ja` - 日语
- `ko` - 韩语
- `es` - 西班牙语
- `fr` - 法语
- `de` - 德语
- `ru` - 俄语
- `pt` - 葡萄牙语
- `it` - 意大利语

## 支持注释翻译的编程语言

该扩展支持以下编程语言的注释翻译：

- JavaScript / TypeScript
- Python
- Java
- C / C++
- Go
- Rust
- Ruby
- PHP
- Swift
- Kotlin
- Scala

## 开发

### 前置条件

- Node.js >= 14.18
- pnpm >= 7.0

### 安装依赖

```bash
pnpm install
```

### 构建

```bash
pnpm run compile
```

### 调试

```bash
pnpm run watch
```

然后在 VS Code 中按 F5 开始调试。

## 贡献指南

在创建 Issue 或 Pull Request 前，请先阅读 [CONTRIBUTING.md](./CONTRIBUTING.md)。

- 必须使用仓库提供的 Issue/PR 模板。
- 该规则同时适用于人工贡献者与 Agent。
- 模板未完整填写的提交可能会被要求补充后再继续评审。

## 许可证

MIT

---

使用 ❤️ 为使用多语言代码库的开发者打造。
