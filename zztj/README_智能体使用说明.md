# 资治通鉴网页构建智能体

## 功能说明

这个智能体用于自动化完成将markdown内容整合到资治通鉴网页的任务，支持：

1. 自动读取标准HTML模板
2. 将原文和白话文markdown文件转换为HTML
3. 将多个AI分析markdown文件完整整合到对应section
4. 处理markdown的标题、列表、粗体、斜体等格式
5. 保持中国风网页设计风格

## 文件结构要求

项目文件夹需要包含以下文件：

```
e:\zztj\
├── 标准.html                    # HTML模板文件
├── zztj_web_builder.py         # 智能体脚本
├── 智氏兴衰与赵氏崛起\          # 项目文件夹示例
│   ├── 原文.md                 # 原文内容
│   ├── 白话文.md               # 白话文翻译
│   ├── chagpt.md               # ChatGPT分析
│   ├── deepseek.md             # DeepSeek分析
│   ├── 豆包.md                 # 豆包分析
│   ├── gemini.md               # Gemini分析
│   ├── grok.md                 # Grok分析
│   ├── kimi.md                 # Kimi分析
│   ├── 智谱.md                 # 智谱分析
│   ├── 千问.md                 # 千问分析
│   └── index.html              # 生成的网页（输出）
```

## 使用方法

### 方法1：命令行使用

```bash
# 基本用法
python zztj_web_builder.py <项目文件夹路径>

# 完整用法（指定标题和副标题）
python zztj_web_builder.py <项目文件夹路径> <标题> <副标题>

# 示例
python zztj_web_builder.py "e:\zztj\智氏兴衰与赵氏崛起" "智氏兴衰与赵氏崛起" "资治通鉴·周纪"
```

### 方法2：Python脚本调用

```python
from zztj_web_builder import ZZTJWebBuilder
from pathlib import Path

# 创建构建器
builder = ZZTJWebBuilder(Path("e:\\zztj\\智氏兴衰与赵氏崛起"))

# 构建网页
builder.build(title="智氏兴衰与赵氏崛起", subtitle="资治通鉴·周纪")
```

## 核心功能特点

### 1. Markdown转HTML智能转换

- **标题转换**: `#` → `<h2>`, `##` → `<h3>`, `###` → `<h4>`
- **列表转换**: 自动识别有序/无序列表
- **格式转换**: `**粗体**` → `<strong>`, `*斜体*` → `<em>`
- **段落处理**: 自动处理段落和空行

### 2. 智能内容整合

- 自动检测markdown文件是否存在
- 精确匹配每个AI分析到对应的HTML section
- 保持中国风样式设计
- 完整保留AI思考内容，无删减

### 3. AI文件映射

| Markdown文件 | HTML Section ID | 图标 | 名称 |
|-------------|----------------|------|------|
| chagpt.md | chatgpt | 🤖 | ChatGPT |
| deepseek.md | deepseek | 🐋 | DeepSeek |
| 豆包.md | doubao | 🐶 | 豆包 |
| gemini.md | gemini | ✨ | Gemini |
| grok.md | grok | 🦊 | Grok |
| kimi.md | kimi | 🤖 | Kimi |
| 智谱.md | zhipu | 🧠 | 智谱 |
| 千问.md | qianwen | 💡 | 千问 |

## 输出结果

脚本运行后会在项目文件夹内生成 `index.html` 文件，包含：

1. 完整的中国风网页界面
2. 整合后的原文和白话文内容
3. 所有AI的完整分析内容（无删减）
4. 响应式设计，支持移动端和桌面端

## 注意事项

1. 确保 `标准.html` 模板文件在正确的位置
2. markdown文件使用UTF-8编码
3. 模板中的section id必须与配置匹配
4. 若某些markdown文件不存在，会跳过该部分处理

## 技术栈

- Python 3.x
- 正则表达式 (re)
- Pathlib (文件路径处理)

## 许可证

本智能体仅供资治通鉴网页构建使用。
