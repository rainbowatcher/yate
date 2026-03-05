# Code Translator

<p align='center'>
A VSCode extension for translating <b>code comments</b> and <b>markdown files</b> directly in your editor.
</p>

<br>

<p align='center'>
<a href="https://marketplace.visualstudio.com/items?itemName=code-translator.code-translator">VSCode Marketplace</a>
</p>

<br>

## Features

- 📝 **Translate Code Comments** - Translate comments in JavaScript, TypeScript, Python, Java, C/C++, Go, Rust, and more
- 📄 **Translate Markdown** - Translate markdown files while preserving formatting (headings, lists, tables, code blocks)
- 🌐 **Multiple Languages** - Support for English, Chinese, Japanese, Korean, Spanish, French, German, Russian, Portuguese, and Italian
- ⚡ **Fast Translation** - Uses free MyMemory Translation API
- 🔧 **Easy to Use** - Simple commands via Command Palette

## Installation

1. Open VS Code
2. Go to Extensions (Ctrl+Shift+X)
3. Search for "Code Translator"
4. Click Install

Or install from the [VSCode Marketplace](https://marketplace.visualstudio.com/items?itemName=code-translator.code-translator).

## Usage

### Translate Selection

1. Select the text you want to translate
2. Open Command Palette (Ctrl+Shift+P)
3. Type "Code Translator: Translate Selection"
4. The selected text will be replaced with the translation

### Translate All Comments

1. Open a code file
2. Open Command Palette (Ctrl+Shift+P)
3. Type "Code Translator: Translate All Comments"
4. All comments in the file will be translated

### Translate Markdown

1. Open a Markdown file
2. Open Command Palette (Ctrl+Shift+P)
3. Type "Code Translator: Translate Markdown"
4. The markdown content will be translated

## Configuration

You can configure the extension in VS Code Settings:

| Setting | Description | Default |
|---------|-------------|---------|
| `code-translator.targetLanguage` | Target language for translation | `en` |
| `code-translator.sourceLanguage` | Source language (use `auto` for automatic detection) | `auto` |
| `code-translator.apiKey` | Translation API key (optional for free tier) | `''` |

### Supported Languages

- `en` - English
- `zh-CN` - Chinese (Simplified)
- `ja` - Japanese
- `ko` - Korean
- `es` - Spanish
- `fr` - French
- `de` - German
- `ru` - Russian
- `pt` - Portuguese
- `it` - Italian

## Supported Languages for Comment Translation

The extension supports comment translation for:

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

## Development

### Prerequisites

- Node.js >= 14.18
- pnpm >= 7.0

### Setup

```bash
pnpm install
```

### Build

```bash
pnpm run compile
```

### Debug

```bash
pnpm run watch
```

Then press F5 in VS Code to start debugging.

## Contribution

Please read [CONTRIBUTING.md](./CONTRIBUTING.md) before creating an Issue or Pull Request.

- You must use the repository Issue/PR templates.
- This rule applies to both human contributors and Agents.
- Incomplete template content may be rejected and asked to be updated.

## License

MIT

---

Made with ❤️ for developers who work with multilingual codebases.
