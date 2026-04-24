# Plan JSON Schema v0

> **用途**：Supervisor 输出的结构化计划对象。极薄设计 — 只包含必要字段，不包含执行细节。

---

## 一、Schema 定义

```json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "title": "Plan",
  "description": "Supervisor 生成的执行计划",
  "type": "object",
  "required": ["plan_id", "type", "project_name", "expected_output", "stop_conditions"],
  "properties": {
    "plan_id": {
      "type": "string",
      "description": "计划唯一标识，格式：plan_{timestamp}_{random}"
    },
    "type": {
      "type": "string",
      "enum": ["init", "define", "design", "assemble", "build", "audit"],
      "description": "功能类型"
    },
    "project_name": {
      "type": "string",
      "description": "项目名称"
    },
    "constraints": {
      "type": "object",
      "description": "执行约束（可选）",
      "properties": {
        "terminal": {
          "type": "string",
          "enum": ["web", "mobile", "landing", "desktop"]
        },
        "tech_stack": {
          "type": "array",
          "items": { "type": "string" }
        },
        "deadline": {
          "type": "string",
          "format": "date-time"
        }
      }
    },
    "input_context": {
      "type": "object",
      "description": "输入上下文摘要（裁剪后）",
      "properties": {
        "prd_exists": { "type": "boolean" },
        "brand_dna_exists": { "type": "boolean" },
        "assets_exist": { "type": "array", "items": { "type": "string" } },
        "user_goal": { "type": "string" }
      }
    },
    "expected_output": {
      "type": "object",
      "description": "预期产出",
      "required": ["files", "status"],
      "properties": {
        "files": {
          "type": "array",
          "items": { "type": "string" },
          "description": "预期产出的文件路径列表"
        },
        "status": {
          "type": "string",
          "description": "预期状态"
        }
      }
    },
    "stop_conditions": {
      "type": "array",
      "description": "停止条件清单",
      "items": {
        "type": "object",
        "required": ["condition", "action"],
        "properties": {
          "condition": { "type": "string" },
          "action": { "type": "string" }
        }
      }
    },
    "created_at": {
      "type": "string",
      "format": "date-time"
    }
  }
}
```

---

## 二、示例

### 2.1 `init` 类型示例

```json
{
  "plan_id": "plan_20260416_abc123",
  "type": "init",
  "project_name": "TaskFlow_Pro",
  "constraints": {},
  "input_context": {
    "user_goal": "创建一个任务管理工具项目"
  },
  "expected_output": {
    "files": [
      "Source/TaskFlow_Pro/input/for_prd/.gitkeep",
      "Source/TaskFlow_Pro/input/prd(input).md",
      "Source/TaskFlow_Pro/input/brand_dna.md",
      "Source/TaskFlow_Pro/project_state.json"
    ],
    "status": "initialized"
  },
  "stop_conditions": [
    {
      "condition": "项目名已存在",
      "action": "追问：项目已存在，要覆盖还是换个名字？"
    }
  ],
  "created_at": "2026-04-16T10:30:00Z"
}
```

### 2.2 `define` 类型示例

```json
{
  "plan_id": "plan_20260416_def456",
  "type": "define",
  "project_name": "TaskFlow_Pro",
  "constraints": {},
  "input_context": {
    "prd_exists": false,
    "brand_dna_exists": false,
    "wireframe_exists": false,
    "user_goal": "帮我写 PRD 和 Brand DNA"
  },
  "expected_output": {
    "files": [
      "Source/TaskFlow_Pro/input/prd(input).md",
      "Source/TaskFlow_Pro/input/brand_dna.md",
      "Source/TaskFlow_Pro/input/wireframe.md"
    ],
    "status": "defined",
    "user_approval_required": true
  },
  "stop_conditions": [
    {
      "condition": "输入不足",
      "action": "追问：请提供更多产品背景信息"
    },
    {
      "condition": "PRD 不完备",
      "action": "返回缺失字段列表"
    },
    {
      "condition": "wireframe 未经用户确认",
      "action": "展示 wireframe 概要，等待用户 approve/revise/reject",
      "blocking": true
    }
  ],
  "created_at": "2026-04-16T10:35:00Z"
}
```
      "condition": "输入不足",
      "action": "追问：请提供更多产品背景信息"
    },
    {
      "condition": "PRD 不完备",
      "action": "返回缺失字段列表"
    }
  ],
  "created_at": "2026-04-16T10:35:00Z"
}
```

### 2.3 `build` 类型示例

```json
{
  "plan_id": "plan_20260416_ghi789",
  "type": "build",
  "project_name": "TaskFlow_Pro",
  "constraints": {
    "terminal": "web",
    "tech_stack": ["React", "TypeScript", "Tailwind"]
  },
  "input_context": {
    "prd_exists": true,
    "brand_dna_exists": true,
    "assets_exist": ["style_prompt.md", "design_system_specs.md", "skeleton_template.json", "web_content.js"],
    "system_prompt_exists": true
  },
  "expected_output": {
    "files": [
      "projects/TaskFlow_Pro/src/App.tsx",
      "projects/TaskFlow_Pro/src/components/",
      "projects/TaskFlow_Pro/package.json"
    ],
    "status": "build_complete"
  },
  "stop_conditions": [
    {
      "condition": "system_prompt.md 缺失",
      "action": "追问：先运行 assemble 类型"
    }
  ],
  "created_at": "2026-04-16T11:00:00Z"
}
```

---

## 三、字段说明

| 字段 | 必填 | 说明 |
|---|---|---|
| `plan_id` | ✅ | 唯一标识，用于追踪和日志 |
| `type` | ✅ | 功能类型，必须是 6 种之一 |
| `project_name` | ✅ | 项目名称，用于路径拼接 |
| `constraints` | ❌ | 执行约束（终端、技术栈、截止时间等） |
| `input_context` | ❌ | 输入上下文摘要（裁剪后的关键信息） |
| `expected_output` | ✅ | 预期产出（文件列表 + 状态） |
| `stop_conditions` | ✅ | 停止条件清单（可为空数组） |
| `created_at` | ❌ | 创建时间戳 |

---

## 四、设计原则

### 4.1 极薄设计

- **不包含执行步骤**：`steps` 由 CLI 转译层根据 `type` 生成
- **不包含脚本路径**：路径由 Action 层解析
- **不包含工具选择**：工具由 CLI 转译层映射

### 4.2 可回放

- 同样的 `type` + `constraints` + `input_context` 应生成相同的 `expected_output`
- `plan_id` 用于日志追踪和调试

### 4.3 可扩展

- `constraints` 和 `input_context` 是开放对象，可根据需要扩展字段
- 不影响核心字段的稳定性

---

## 五、与 CLI 转译层的关系

```
Plan (JSON) → CLI Translator → Steps (JSON)
     │                              │
     │ type = "define"              │ [
     │ project_name = "XXX"         │   { "cmd": "load_context", ... },
     │                              │   { "cmd": "generate_prd", ... },
     │                              │   { "cmd": "validate_prd", ... }
     │                              │ ]
```

**转译规则**：
1. CLI 转译层读取 `type`
2. 根据 type 查找预定义的 steps 模板
3. 将 `project_name`、`constraints` 填入模板参数
4. 输出 Steps JSON

---

## 六、错误码

| 错误码 | 含义 | 处理 |
|---|---|---|
| `E_INVALID_TYPE` | type 不在枚举列表中 | 返回有效 type 列表 |
| `E_MISSING_TYPE` | 缺少 type 字段 | 追问用户意图 |
| `E_MISSING_PROJECT_NAME` | 缺少项目名 | 追问项目名 |
| `E_EMPTY_EXPECTED_OUTPUT` | expected_output 为空 | 拒绝生成 Plan |
