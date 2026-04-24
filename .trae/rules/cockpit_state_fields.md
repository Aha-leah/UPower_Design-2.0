# GUI Cockpit 状态字段定义

> **用途**：定义 Cockpit 界面需要展示的核心字段，把"黑盒"变成"可观测"。

---

## 一、字段总览

| 分类 | 字段名 | 类型 | 说明 |
|---|---|---|---|
| **阶段** | current_phase | enum | 当前执行阶段 |
| **阶段** | current_type | enum | 当前功能类型（init/define/design/assemble/build/audit） |
| **阶段** | progress_percentage | number | 阶段内进度百分比 |
| **模型** | model_mode | enum | 模型模式：`creative` / `standard` / `unknown`（v3.2） |
| **模型** | model_mode_reason | string | 判定原因简述（v3.2） |
| **产物** | generated_files | array | 已生成的文件列表 |
| **产物** | pending_files | array | 待生成的文件列表 |
| **证据** | reviewer_reports | array | Reviewer 报告列表 |
| **证据** | validation_results | array | 验证结果列表 |
| **证据** | tokens_used | number | 已消耗 token 数 |
| **风险** | stop_conditions_triggered | array | 触发的停止条件 |
| **风险** | errors | array | 错误列表 |
| **风险** | warnings | array | 警告列表 |

---

## 二、阶段字段详细定义

### 2.1 current_phase

| 值 | 含义 | 显示文本 |
|---|---|---|
| `idle` | 空闲 | 等待指令 |
| `planning` | 规划中 | 正在生成执行计划... |
| `executing` | 执行中 | 正在执行 [current_type]... |
| `reviewing` | 审核中 | 正在进行质量检查... |
| `waiting_user` | 等待用户 | 需要您的确认 |
| `completed` | 已完成 | 执行完成 |
| `failed` | 失败 | 执行失败 |

### 2.2 current_type

| 值 | 显示文本 | 图标建议 |
|---|---|---|
| `init` | 项目初始化 | 📁 |
| `define` | 需求定义 | 📝 |
| `design` | 设计资产生成 | 🎨 |
| `assemble` | 系统提示词组装 | 🔧 |
| `build` | 代码构建 | ⚙️ |
| `audit` | 质量审核 | 🔍 |

### 2.3 progress_percentage

- 范围：0-100
- 计算方式：`已完成 steps 数 / 总 steps 数 * 100`
- 显示：进度条 + 百分比数字

---

## 三、产物字段详细定义

### 3.1 generated_files

```json
{
  "generated_files": [
    {
      "path": "Source/TaskFlow_Pro/input/prd(input).md",
      "type": "prd",
      "size_kb": 12,
      "generated_at": "2026-04-16T10:30:00Z",
      "status": "complete"
    },
    {
      "path": "Source/TaskFlow_Pro/input/brand_dna.md",
      "type": "brand_dna",
      "size_kb": 8,
      "generated_at": "2026-04-16T10:32:00Z",
      "status": "complete"
    }
  ]
}
```

**显示方式**：
- 文件列表，带图标区分类型
- 可点击跳转到文件位置
- 显示生成时间和大小

### 3.2 pending_files

```json
{
  "pending_files": [
    {
      "path": "Source/TaskFlow_Pro/style_prompt.md",
      "type": "style",
      "status": "pending"
    },
    {
      "path": "Source/TaskFlow_Pro/design_system_specs.md",
      "type": "specs",
      "status": "pending"
    }
  ]
}
```

**显示方式**：
- 灰色列表，带"待生成"标记
- 按执行顺序排列

---

## 四、证据字段详细定义

### 4.1 reviewer_reports

```json
{
  "reviewer_reports": [
    {
      "reviewer_id": "visual_20260416_001",
      "reviewer_type": "visual",
      "passed": false,
      "critical_issues": 1,
      "warnings": 2,
      "report_path": "projects/TaskFlow_Pro/reviews/visual_20260416_001.json",
      "timestamp": "2026-04-16T12:00:00Z"
    }
  ]
}
```

**显示方式**：
- 通过/未通过标签（绿色/红色）
- 问题数量统计
- 可展开查看详情

### 4.2 validation_results

```json
{
  "validation_results": [
    {
      "type": "prd_completeness",
      "passed": true,
      "checked_at": "2026-04-16T10:35:00Z",
      "missing_fields": []
    },
    {
      "type": "asset_completeness",
      "passed": false,
      "checked_at": "2026-04-16T11:00:00Z",
      "missing_fields": ["style_prompt.md", "skeleton_template.json"]
    }
  ]
}
```

**显示方式**：
- 检查项列表，通过/未通过状态
- 缺失字段高亮显示

### 4.3 tokens_used

- 类型：number
- 显示：`已消耗 15,234 tokens`
- 可选：显示预估剩余

---

## 五、风险字段详细定义

### 5.1 stop_conditions_triggered

```json
{
  "stop_conditions_triggered": [
    {
      "condition": "情绪目标缺失",
      "triggered_at": "2026-04-16T10:28:00Z",
      "action_required": "追问：你希望用户在使用后感觉到什么？",
      "resolved": false
    }
  ]
}
```

**显示方式**：
- 红色警告卡片
- 需要用户响应时高亮
- 解决后标记为已处理

### 5.2 errors

```json
{
  "errors": [
    {
      "error_code": "E010",
      "message": "输入不足，无法生成 PRD",
      "timestamp": "2026-04-16T10:25:00Z",
      "step_id": "define_2",
      "recoverable": true
    }
  ]
}
```

**显示方式**：
- 红色错误列表
- 错误码 + 描述
- 可恢复错误显示重试按钮

### 5.3 warnings

```json
{
  "warnings": [
    {
      "code": "W001",
      "message": "PRD 缺少成功瞬间描述",
      "severity": "low",
      "timestamp": "2026-04-16T10:36:00Z"
    }
  ]
}
```

**显示方式**：
- 黄色警告列表
- 不阻塞执行，仅提示

---

## 六、完整状态对象示例

```json
{
  "project_name": "TaskFlow_Pro",
  "current_phase": "executing",
  "current_type": "build",
  "progress_percentage": 65,
  "generated_files": [
    {
      "path": "Source/TaskFlow_Pro/input/prd(input).md",
      "type": "prd",
      "size_kb": 12,
      "generated_at": "2026-04-16T10:30:00Z",
      "status": "complete"
    },
    {
      "path": "Source/TaskFlow_Pro/input/brand_dna.md",
      "type": "brand_dna",
      "size_kb": 8,
      "generated_at": "2026-04-16T10:32:00Z",
      "status": "complete"
    }
  ],
  "pending_files": [
    {
      "path": "projects/TaskFlow_Pro/src/App.tsx",
      "type": "code",
      "status": "generating"
    }
  ],
  "reviewer_reports": [],
  "validation_results": [
    {
      "type": "prd_completeness",
      "passed": true,
      "checked_at": "2026-04-16T10:35:00Z",
      "missing_fields": []
    }
  ],
  "tokens_used": 15234,
  "stop_conditions_triggered": [],
  "errors": [],
  "warnings": [
    {
      "code": "W001",
      "message": "PRD 缺少成功瞬间描述",
      "severity": "low",
      "timestamp": "2026-04-16T10:36:00Z"
    }
  ]
}
```

---

## 七、与 project_state.json 的关系

Cockpit 状态是 `project_state.json` 的视图层投影：

```
project_state.json (数据层)
        │
        ▼
  状态计算逻辑
        │
        ▼
cockpit_state.json (视图层)
```

**计算规则**：
- `current_phase` = 根据 Steps 执行状态推断
- `progress_percentage` = 已完成 steps / 总 steps
- `generated_files` = 扫描 `Source/[Name]/` 目录
- `reviewer_reports` = 读取 `projects/[Name]/reviews/` 目录
