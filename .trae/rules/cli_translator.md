# CLI 转译层规范

> **用途**：将 Plan(JSON) 转译为可执行的 Steps(JSON)。只编译，不决策。

---

## 一、Steps JSON Schema

```json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "title": "Steps",
  "description": "CLI 可执行的步骤列表",
  "type": "object",
  "required": ["plan_id", "steps"],
  "properties": {
    "plan_id": {
      "type": "string",
      "description": "关联的 Plan ID"
    },
    "steps": {
      "type": "array",
      "items": {
        "type": "object",
        "required": ["step_id", "cmd", "args"],
        "properties": {
          "step_id": {
            "type": "string",
            "description": "步骤唯一标识"
          },
          "cmd": {
            "type": "string",
            "description": "命令名称"
          },
          "args": {
            "type": "object",
            "description": "命令参数"
          },
          "cwd": {
            "type": "string",
            "description": "执行目录（可选）"
          },
          "expects": {
            "type": "object",
            "description": "预期输出（可选）"
          },
          "cache_key": {
            "type": "string",
            "description": "缓存键（可选，用于去重）"
          },
          "on_failure": {
            "type": "string",
            "enum": ["abort", "continue", "ask_user"],
            "description": "失败处理策略"
          }
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

## 二、命令清单（CMD List）

### 2.1 文件操作类

| cmd | 用途 | args | 示例 |
|---|---|---|---|
| `mkdir` | 创建目录 | `{ path: string }` | `mkdir { "path": "Source/TaskFlow_Pro" }` |
| `copy_template` | 复制模板 | `{ src: string, dest: string }` | `copy_template { "src": "templates/prd", "dest": "Source/XXX/input" }` |
| `read_file` | 读取文件 | `{ path: string }` | `read_file { "path": "Source/XXX/input/prd(input).md" }` |
| `write_file` | 写入文件 | `{ path: string, content: string }` | `write_file { "path": "xxx.md", "content": "..." }` |
| `delete_file` | 删除文件 | `{ path: string }` | `delete_file { "path": "xxx.md" }` |

### 2.2 Skill 调用类

| cmd | 用途 | args | 示例 |
|---|---|---|---|
| `invoke_skill` | 调用功能性 skill | `{ skill: string, input: object }` | `invoke_skill { "skill": "generate_experience_prd", "input": {...} }` |
| `validate` | 验证产物 | `{ type: string, path: string }` | `validate { "type": "prd_completeness", "path": "xxx/prd(input).md" }` |
| `check_model_mode` | 检查产出物判定模型模式（v3.2） | `{ prd_path: string, output_path: string }` | `check_model_mode { "prd_path": "Source/XXX/input/prd(input).md", "output_path": "Source/XXX/project_state.json" }` |

### 2.3 脚本执行类

| cmd | 用途 | args | 示例 |
|---|---|---|---|
| `run_script` | 执行 Node 脚本 | `{ script: string, args: string[] }` | `run_script { "script": "ask_ai.js", "args": ["style", "Source/XXX"] }` |
| `run_npm` | 执行 npm 命令 | `{ command: string, args: string[] }` | `run_npm { "command": "create vite", "args": ["projects/XXX"] }` |

### 2.4 开发环境类

| cmd | 用途 | args | 示例 |
|---|---|---|---|
| `dev_server` | 启动开发服务器 | `{ port: number, cwd: string }` | `dev_server { "port": 5173, "cwd": "projects/XXX" }` |
| `build_project` | 构建项目 | `{ cwd: string }` | `build_project { "cwd": "projects/XXX" }` |

---

## 三、Plan → Steps 映射表

### 3.1 `init` 类型

```json
{
  "type": "init",
  "steps": [
    {
      "step_id": "init_1",
      "cmd": "mkdir",
      "args": { "path": "Source/{project_name}" }
    },
    {
      "step_id": "init_2",
      "cmd": "mkdir",
      "args": { "path": "Source/{project_name}/input" }
    },
    {
      "step_id": "init_3",
      "cmd": "mkdir",
      "args": { "path": "Source/{project_name}/input/for_prd" }
    },
    {
      "step_id": "init_4",
      "cmd": "write_file",
      "args": { "path": "Source/{project_name}/input/for_prd/.gitkeep", "content": "" }
    },
    {
      "step_id": "init_5",
      "cmd": "write_file",
      "args": { "path": "Source/{project_name}/project_state.json", "content": "{\"status\":\"initialized\"}" }
    }
  ]
}
```

### 3.2 `define` 类型

```json
{
  "type": "define",
  "steps": [
    {
      "step_id": "define_1_load",
      "cmd": "invoke_skill",
      "args": { "skill": "load_context", "input": { "project_path": "Source/{project_name}" } },
      "on_failure": "ask_user",
      "sub_phase": "define-prd"
    },
    {
      "step_id": "define_2_prd",
      "cmd": "invoke_skill",
      "args": { "skill": "generate_experience_prd", "input": { "project_path": "Source/{project_name}" } },
      "on_failure": "ask_user",
      "sub_phase": "define-prd"
    },
    {
      "step_id": "define_3_dna",
      "cmd": "invoke_skill",
      "args": { "skill": "generate_brand_dna", "input": { "project_path": "Source/{project_name}" } },
      "on_failure": "ask_user",
      "sub_phase": "define-prd"
    },
    {
      "step_id": "define_4_validate",
      "cmd": "validate",
      "args": { "type": "prd_completeness", "path": "Source/{project_name}/input/prd(input).json" },
      "on_failure": "ask_user",
      "sub_phase": "define-prd"
    },
    {
      "step_id": "define_5_wireframe_structure",
      "cmd": "invoke_skill",
      "args": {
        "skill": "generate_wireframe_structure",
        "input": {
        "prd_path": "Source/{project_name}/input/prd(input).json",
          "project_path": "Source/{project_name}"
        }
      },
      "on_failure": "ask_user",
      "sub_phase": "define-wireframe",
      "agent": "mia"
    },
    {
      "step_id": "define_6_wireframe_style",
      "cmd": "invoke_skill",
      "args": {
        "skill": "style_wireframe",
        "input": {
          "wireframe_structure_path": "Source/{project_name}/input/wireframe_structure.md",
          "brand_dna_path": "Source/{project_name}/input/brand_dna.md"
        }
      },
      "on_failure": "ask_user",
      "sub_phase": "define-wireframe",
      "agent": "bob"
    },
    {
      "step_id": "define_7_wireframe_merge",
      "cmd": "merge_files",
      "args": {
        "sources": [
          "Source/{project_name}/input/wireframe_structure.md",
          "Source/{project_name}/input/wireframe_styled.md"
        ],
        "output": "Source/{project_name}/input/wireframe.md"
      },
      "sub_phase": "define-wireframe"
    },
    {
      "step_id": "define_8_user_confirm",
      "cmd": "wait_user_approval",
      "args": {
        "artifact": "Source/{project_name}/input/wireframe.md",
        "prompt": "Wireframe 已生成，请确认是否符合预期：",
        "options": ["approve", "revise", "reject"]
      },
      "on_failure": "abort",
      "sub_phase": "user-confirm",
      "blocking": true
    },
    {
      "step_id": "define_9_model_mode",
      "cmd": "check_model_mode",
      "args": {
        "prd_path": "Source/{project_name}/input/prd(input).json",
        "output_path": "Source/{project_name}/project_state.json"
      },
      "on_failure": "continue",
      "sub_phase": "define-model-check",
      "description": "检查情绪目标字段，判定 model_mode 并写入 project_state.json"
    }
  ]
}
```

### 3.3 `design` 类型

```json
{
  "type": "design",
  "steps": [
    {
      "step_id": "design_1",
      "cmd": "run_script",
      "args": { "script": "ask_ai.js", "args": ["style", "Source/{project_name}"] },
      "cache_key": "style_{project_name}"
    },
    {
      "step_id": "design_2",
      "cmd": "run_script",
      "args": { "script": "ask_ai.js", "args": ["specs", "Source/{project_name}"] },
      "cache_key": "specs_{project_name}"
    },
    {
      "step_id": "design_3",
      "cmd": "run_script",
      "args": { "script": "ask_ai.js", "args": ["motion", "Source/{project_name}"] },
      "cache_key": "motion_{project_name}"
    },
    {
      "step_id": "design_4",
      "cmd": "run_script",
      "args": { "script": "ask_ai.js", "args": ["skeleton", "Source/{project_name}"] },
      "cache_key": "skeleton_{project_name}"
    },
    {
      "step_id": "design_5",
      "cmd": "run_script",
      "args": { "script": "ask_ai.js", "args": ["payload", "Source/{project_name}"] },
      "cache_key": "payload_{project_name}"
    }
  ]
}
```

### 3.4 `assemble` 类型

```json
{
  "type": "assemble",
  "steps": [
    {
      "step_id": "assemble_1",
      "cmd": "run_script",
      "args": { "script": "assemble_system_prompt.js", "args": ["Source/{project_name}"] },
      "cache_key": "assemble_{project_name}"
    }
  ]
}
```

### 3.5 `build` 类型

```json
{
  "type": "build",
  "steps": [
    {
      "step_id": "build_1",
      "cmd": "run_npm",
      "args": { "command": "create vite", "args": ["projects/{project_name}", "--template", "react-ts"] }
    },
    {
      "step_id": "build_2",
      "cmd": "run_script",
      "args": { "script": "generate_components.js", "args": ["Source/{project_name}", "projects/{project_name}"] }
    },
    {
      "step_id": "build_3",
      "cmd": "dev_server",
      "args": { "port": 5173, "cwd": "projects/{project_name}" }
    }
  ]
}
```

### 3.6 `audit` 类型

```json
{
  "type": "audit",
  "steps": [
    {
      "step_id": "audit_1",
      "cmd": "invoke_skill",
      "args": { "skill": "visual_reviewer", "input": { "project_path": "projects/{project_name}" } }
    },
    {
      "step_id": "audit_2",
      "cmd": "invoke_skill",
      "args": { "skill": "interaction_reviewer", "input": { "project_path": "projects/{project_name}" } }
    },
    {
      "step_id": "audit_3",
      "cmd": "invoke_skill",
      "args": { "skill": "code_reviewer", "input": { "project_path": "projects/{project_name}" } }
    }
  ]
}
```

---

## 四、缓存机制

### 4.1 cache_key 规则

| 命令类型 | cache_key 格式 | 说明 |
|---|---|---|
| `run_script` | `{script_name}_{project_name}` | 同项目同脚本不重复执行 |
| `invoke_skill` | `{skill_name}_{input_hash}` | 输入相同则缓存 |

### 4.2 缓存命中流程

```
1. 计算 cache_key
2. 检查缓存库
3. 命中 → 返回缓存结果，跳过执行
4. 未命中 → 执行命令，缓存结果
```

---

## 五、错误处理

| on_failure | 行为 |
|---|---|
| `abort` | 终止整个 Steps 执行，返回错误 |
| `continue` | 记录错误，继续执行下一步 |
| `ask_user` | 暂停执行，追问用户如何处理 |

---

## 六、示例输出

### 6.1 `define` 类型的 Steps

```json
{
  "plan_id": "plan_20260416_def456",
  "steps": [
    {
      "step_id": "define_1",
      "cmd": "invoke_skill",
      "args": {
        "skill": "load_context",
        "input": { "project_path": "Source/TaskFlow_Pro" }
      },
      "on_failure": "ask_user"
    },
    {
      "step_id": "define_2",
      "cmd": "invoke_skill",
      "args": {
        "skill": "generate_experience_prd",
        "input": { "project_path": "Source/TaskFlow_Pro" }
      },
      "on_failure": "ask_user"
    },
    {
      "step_id": "define_3",
      "cmd": "invoke_skill",
      "args": {
        "skill": "generate_brand_dna",
        "input": { "project_path": "Source/TaskFlow_Pro" }
      },
      "on_failure": "ask_user"
    },
    {
      "step_id": "define_4",
      "cmd": "validate",
      "args": {
        "type": "prd_completeness",
        "path": "Source/TaskFlow_Pro/input/prd(input).md"
      },
      "on_failure": "ask_user"
    }
  ],
  "created_at": "2026-04-16T10:35:00Z"
}
```
