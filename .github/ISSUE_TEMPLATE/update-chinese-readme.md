---
name: 🚀 Feature Request
about: Suggest a new feature or improvement for Code Translator
title: '[Feature] 同步中文 README 项目名称与仓库名保持一致'
labels: 'documentation, enhancement'
assignees: ''

---

## 背景描述

当前 `README.zh-CN.md` 文件内容仍为 Vitesse 模板的原始内容，与实际项目 **Code Translator** (code-translator) 无关。项目名称和描述需要与仓库名同步更新。

## 问题分析

### 当前状态
- **仓库名称**: `code-translator`
- **项目显示名称**: `Code Translator`
- **英文 README**: ✅ 内容正确，使用 "Code Translator" 作为项目名称
- **中文 README**: ❌ 内容错误，仍为 Vitesse 模板内容

### 需要更新的文件
- `README.zh-CN.md` - 中文 README 文件

## 实现计划

### 阶段一：内容准备
1. 将英文 README.md 的核心内容翻译为中文
2. 保持与英文版相同的结构和技术描述
3. 确保专业术语翻译准确

### 阶段二：关键内容更新
1. 项目标题：`# Code Translator` → `# Code Translator 代码翻译器` 或 `# Code Translator`
2. 项目描述：更新为正确的功能描述
3. 功能列表：翻译 Features 部分
4. 安装说明：翻译 Installation 部分
5. 使用说明：翻译 Usage 部分
6. 配置说明：翻译 Configuration 部分
7. 开发指南：翻译 Development 部分

### 阶段三：一致性检查
1. 验证中英文版本结构一致
2. 确保项目名称在所有位置保持统一
3. 检查链接和引用是否正确

### 阶段四：测试验证
1. 预览 README 渲染效果
2. 验证 Markdown 语法正确性
3. 检查图片链接是否有效

## 预期成果

完成更新后，`README.zh-CN.md` 将：
- ✅ 使用正确的项目名称 "Code Translator"
- ✅ 描述准确的插件功能（代码注释翻译、Markdown 翻译）
- ✅ 提供完整的中文使用文档
- ✅ 与英文 README 保持结构和内容一致

## 优先级

**高优先级** - 当前中文 README 完全不正确，影响项目形象和用户体验。

## 建议实施方式

1. 手动翻译并更新 README.zh-CN.md
2. 或使用 Code Translator 插件本身翻译 README.md 内容后进行人工校对
