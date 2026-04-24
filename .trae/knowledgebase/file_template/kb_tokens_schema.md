# Design Tokens 字段结构

> **用途**：定义 `tokens.json` 的标准结构，供 PRD 引用、设计资产生成、代码实现使用。

---

## 一、Schema 定义

```json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "title": "DesignTokens",
  "type": "object",
  "required": ["colors", "typography", "spacing", "radii", "shadows"],
  "properties": {
    "colors": {
      "type": "object",
      "description": "色彩系统",
      "properties": {
        "primary": { "type": "string" },
        "secondary": { "type": "string" },
        "accent": { "type": "string" },
        "background": { "type": "string" },
        "surface": { "type": "string" },
        "text": {
          "type": "object",
          "properties": {
            "primary": { "type": "string" },
            "secondary": { "type": "string" },
            "muted": { "type": "string" }
          }
        },
        "status": {
          "type": "object",
          "properties": {
            "success": { "type": "string" },
            "warning": { "type": "string" },
            "error": { "type": "string" },
            "info": { "type": "string" }
          }
        }
      }
    },
    "typography": {
      "type": "object",
      "description": "字体系统",
      "properties": {
        "fontFamily": {
          "type": "object",
          "properties": {
            "heading": { "type": "string" },
            "body": { "type": "string" },
            "mono": { "type": "string" }
          }
        },
        "fontSize": {
          "type": "object",
          "properties": {
            "xs": { "type": "string" },
            "sm": { "type": "string" },
            "base": { "type": "string" },
            "lg": { "type": "string" },
            "xl": { "type": "string" },
            "2xl": { "type": "string" },
            "3xl": { "type": "string" }
          }
        },
        "fontWeight": {
          "type": "object",
          "properties": {
            "normal": { "type": "number" },
            "medium": { "type": "number" },
            "semibold": { "type": "number" },
            "bold": { "type": "number" }
          }
        },
        "lineHeight": {
          "type": "object",
          "properties": {
            "tight": { "type": "number" },
            "normal": { "type": "number" },
            "relaxed": { "type": "number" }
          }
        }
      }
    },
    "spacing": {
      "type": "object",
      "description": "间距系统",
      "properties": {
        "0": { "type": "string" },
        "1": { "type": "string" },
        "2": { "type": "string" },
        "3": { "type": "string" },
        "4": { "type": "string" },
        "5": { "type": "string" },
        "6": { "type": "string" },
        "8": { "type": "string" },
        "10": { "type": "string" },
        "12": { "type": "string" },
        "16": { "type": "string" },
        "20": { "type": "string" },
        "24": { "type": "string" }
      }
    },
    "radii": {
      "type": "object",
      "description": "圆角系统",
      "properties": {
        "none": { "type": "string" },
        "sm": { "type": "string" },
        "base": { "type": "string" },
        "md": { "type": "string" },
        "lg": { "type": "string" },
        "xl": { "type": "string" },
        "full": { "type": "string" }
      }
    },
    "shadows": {
      "type": "object",
      "description": "阴影系统",
      "properties": {
        "sm": { "type": "string" },
        "base": { "type": "string" },
        "md": { "type": "string" },
        "lg": { "type": "string" },
        "xl": { "type": "string" }
      }
    },
    "animation": {
      "type": "object",
      "description": "动画系统（可选）",
      "properties": {
        "duration": {
          "type": "object",
          "properties": {
            "fast": { "type": "string" },
            "normal": { "type": "string" },
            "slow": { "type": "string" }
          }
        },
        "easing": {
          "type": "object",
          "properties": {
            "default": { "type": "string" },
            "in": { "type": "string" },
            "out": { "type": "string" },
            "inOut": { "type": "string" }
          }
        }
      }
    }
  }
}
```

---

## 二、示例

### 2.1 企业级 Dashboard 示例

```json
{
  "colors": {
    "primary": "#2563EB",
    "secondary": "#64748B",
    "accent": "#10B981",
    "background": "#F8FAFC",
    "surface": "#FFFFFF",
    "text": {
      "primary": "#1E293B",
      "secondary": "#475569",
      "muted": "#94A3B8"
    },
    "status": {
      "success": "#10B981",
      "warning": "#F59E0B",
      "error": "#EF4444",
      "info": "#3B82F6"
    }
  },
  "typography": {
    "fontFamily": {
      "heading": "Inter, system-ui, sans-serif",
      "body": "Inter, system-ui, sans-serif",
      "mono": "JetBrains Mono, monospace"
    },
    "fontSize": {
      "xs": "0.75rem",
      "sm": "0.875rem",
      "base": "1rem",
      "lg": "1.125rem",
      "xl": "1.25rem",
      "2xl": "1.5rem",
      "3xl": "1.875rem"
    },
    "fontWeight": {
      "normal": 400,
      "medium": 500,
      "semibold": 600,
      "bold": 700
    },
    "lineHeight": {
      "tight": 1.25,
      "normal": 1.5,
      "relaxed": 1.75
    }
  },
  "spacing": {
    "0": "0",
    "1": "0.25rem",
    "2": "0.5rem",
    "3": "0.75rem",
    "4": "1rem",
    "5": "1.25rem",
    "6": "1.5rem",
    "8": "2rem",
    "10": "2.5rem",
    "12": "3rem",
    "16": "4rem",
    "20": "5rem",
    "24": "6rem"
  },
  "radii": {
    "none": "0",
    "sm": "0.125rem",
    "base": "0.25rem",
    "md": "0.375rem",
    "lg": "0.5rem",
    "xl": "0.75rem",
    "full": "9999px"
  },
  "shadows": {
    "sm": "0 1px 2px 0 rgb(0 0 0 / 0.05)",
    "base": "0 1px 3px 0 rgb(0 0 0 / 0.1)",
    "md": "0 4px 6px -1px rgb(0 0 0 / 0.1)",
    "lg": "0 10px 15px -3px rgb(0 0 0 / 0.1)",
    "xl": "0 20px 25px -5px rgb(0 0 0 / 0.1)"
  },
  "animation": {
    "duration": {
      "fast": "150ms",
      "normal": "300ms",
      "slow": "500ms"
    },
    "easing": {
      "default": "cubic-bezier(0.4, 0, 0.2, 1)",
      "in": "cubic-bezier(0.4, 0, 1, 1)",
      "out": "cubic-bezier(0, 0, 0.2, 1)",
      "inOut": "cubic-bezier(0.4, 0, 0.2, 1)"
    }
  }
}
```

---

## 三、与 Brand DNA 的映射

| Brand DNA 维度 | tokens.json 字段 |
|---|---|
| **Gravity** (重/轻) | `shadows.*`、`spacing.*` 的量级 |
| **Lighting** (暗/亮) | `colors.background`、`colors.surface`、`colors.text.*` |
| **Material** (纸/玻璃/钢) | `shadows.*`、`radii.*`、`colors.surface` 透明度 |
| **Tempo** (紧张/舒缓) | `animation.duration.*`、`spacing.*` 密度 |

---

## 四、PRD 引用方式

在 PRD 中引用 tokens：

```markdown
### 5.1 设计与一致性约束
*   **Design Tokens 引用：** `Source/TaskFlow_Pro/tokens.json`
*   **视觉基调：** 清晰、高效、可信赖（对应 primary=#2563EB, 信息密度中）
*   **反例约束：** 遵循 `kb_design_bad_patterns_common.md`
```

---

## 五、生成时机

| 时机 | 方式 |
|---|---|
| 项目初始化 | 不生成（使用默认值或手动提供） |
| Brand DNA 生成后 | 可选择生成 tokens.json（基于 DNA 维度推断） |
| 设计资产阶段 | 作为 style/specs 的输入 |
| 代码实现阶段 | 转换为 Tailwind 配置或 CSS 变量 |
