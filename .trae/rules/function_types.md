# 功能类型列表（Function Types）

> **用途**：Supervisor 识别用户意图后，生成结构化 Plan 的类型定义。每个 type 对应一套标准化的执行流程。

---

## 一、功能类型总览

| Type | 中文名 | 触发场景 | 主要产出 |
|---|---|---|---|
| `init` | 初始化 | "新建项目"、"Start new project" | 项目骨架目录 |
| `define` | 定义 | "写 PRD"、"生成 Brand DNA"、"帮我定位" | PRD + Brand DNA |
| `design` | 设计 | "生成设计资产"、"创建 style/specs/motion" | 设计资产包 |
| `assemble` | 组装 | "组装 system prompt"、"Build brain" | system_prompt.md |
| `build` | 构建 | "开始编码"、"Build interface" | 可预览代码 |
| `audit` | 审计 | "Review 代码"、"检查质量"、"验证交付" | Reviewer 报告 |

---

## 二、类型详细定义

### 2.1 `init` - 初始化

**触发场景**：
- "新建项目 XXX"
- "Start new project"
- "/new XXX"
- "初始化一个落地页"

**执行流程**：
1. 从模板复制项目骨架到 `Source/[Name]/`
2. 创建 `input/for_prd/` 目录
3. 初始化 `project_state.json`

**Expected Output**：
```json
{
  "project_path": "Source/[Name]/",
  "created_files": [
    "input/for_prd/.gitkeep",
    "input/prd(input).md",
    "input/brand_dna.md",
    "project_state.json"
  ],
  "status": "initialized"
}
```

**Stop Conditions**：
- 项目名已存在 → 追问"项目已存在，要覆盖还是换个名字？"
- 项目名为空 → 追问"项目叫什么名字？"

---

### 2.2 `define` - 定义

**触发场景**：
- "帮我写 PRD"
- "生成 Brand DNA"
- "定位这个产品"
- "分析用户需求"

**子阶段**：

```
define-prd → define-wireframe → 用户确认 → define 完成
```

#### 子阶段 A：define-prd

**执行流程**：
1. 调用 `load_context` 检查现有资产
2. 调用 `generate_experience_prd`（如需要）
3. 调用 `generate_brand_dna`（如需要）
4. 调用 `validate_prd_completeness` 检查完整性

**产出**：
- `input/prd(input).md`
- `input/brand_dna.md`

#### 子阶段 B：define-wireframe

**触发条件**：PRD + Brand DNA 通过完备性验证后自动进入

**协作模式**：Mia（UX Architect）+ Bob（Visual Designer）

| 角色 | 职责 |
|---|---|
| **Mia** | 基于 PRD 定义信息架构、页面层级、用户流程 → 输出结构线框 |
| **Bob** | 基于 Brand DNA 为线框注入视觉方向（布局风格、留白策略、视觉重心）→ 输出风格化线框 |

**执行流程**：
1. Mia 读取 PRD（需求清单 + 核心流程）→ 输出 `wireframe_structure.md`（信息架构 + 页面骨架）
2. Bob 读取 Brand DNA + wireframe_structure → 输出 `wireframe_styled.md`（风格化线框 + 视觉方向标注）
3. 合并为 `input/wireframe.md`

**产出**：
- `input/wireframe.md`

**wireframe.md 结构**：
```markdown
# Wireframe: [Project Name]

## 页面列表
| 页面 | 信息密度 | 主要动作 | 视觉重心 |
|---|---|---|---|

## 页面详情

### [页面名]
#### 信息架构（Mia）
- 区域划分
- 信息层级
- 用户流程

#### 视觉方向（Bob）
- 布局风格
- 留白策略
- 视觉重心位置
- Brand DNA 映射

#### 线框图（ASCII / 描述）
```

#### 子阶段 C：用户确认（Stop Gate）

**触发条件**：wireframe 生成完成后**强制暂停**

**行为**：
1. 向用户展示 wireframe 概要
2. 等待用户确认（approve / revise / reject）
3. **approve** → 标记 define 完成，进入 design 阶段
4. **revise** → 返回 define-wireframe，根据反馈修改
5. **reject** → 返回 define-prd，重新定义需求

**Stop Condition**：
```json
{
  "condition": "wireframe 未经用户确认",
  "action": "展示 wireframe 概要，等待用户 approve/revise/reject",
  "blocking": true
}
```

**Expected Output（define 整体）**：
```json
{
  "prd_path": "Source/[Name]/input/prd(input).md",
  "brand_dna_path": "Source/[Name]/input/brand_dna.md",
  "wireframe_path": "Source/[Name]/input/wireframe.md",
  "user_approval": "approved",
  "completeness": {
    "passed": true,
    "missing_fields": []
  }
}
```

**Stop Conditions（define 整体）**：
- 输入不足 → 追问用户提供更多上下文
- PRD 不完备 → 返回缺失字段列表
- **wireframe 未确认 → 强制等待用户 approve（blocking）**

---

### 2.3 `design` - 设计

**触发场景**：
- "生成设计资产"
- "创建 style/specs/motion"
- "我要视觉方向"
- "生成 skeleton"

**执行流程**：
1. 检查 PRD + Brand DNA 是否就绪
2. 按需调用 asset 生成脚本：
   - `style` → `style_prompt.md`
   - `specs` → `design_system_specs.md`
   - `motion` → `animation_prompts.md`
   - `skeleton` → `skeleton_template.json`
   - `payload` → `web_content.js`

**Expected Output**：
```json
{
  "assets": [
    "style_prompt.md",
    "design_system_specs.md",
    "animation_prompts.md",
    "skeleton_template.json",
    "web_content.js"
  ],
  "status": "assets_generated"
}
```

**Stop Conditions**：
- PRD 或 Brand DNA 缺失 → 追问"先运行 define 类型生成 PRD 和 Brand DNA"

---

### 2.4 `assemble` - 组装

**触发场景**：
- "组装 system prompt"
- "Build brain"
- "编译系统提示词"

**执行流程**：
1. 检查所有设计资产是否就绪
2. 运行 `assemble_system_prompt.js`
3. 输出 `system_prompt.md`

**Expected Output**：
```json
{
  "system_prompt_path": "Source/[Name]/system_prompt.md",
  "included_assets": [
    "brand_dna.md",
    "style_prompt.md",
    "design_system_specs.md",
    "animation_prompts.md",
    "skeleton_template.json",
    "web_content.js"
  ],
  "status": "assembled"
}
```

**Stop Conditions**：
- 资产缺失 → 返回缺失资产列表

---

### 2.5 `build` - 构建

**触发场景**：
- "开始编码"
- "Build interface"
- "生成代码"
- "/build"

**执行流程**：
1. 检查 `system_prompt.md` 是否就绪
2. 创建 `projects/[Name]/` 目录
3. 初始化 Vite + React + Tailwind 项目
4. 根据 system_prompt 生成组件代码
5. 运行 dev server 预览

**Expected Output**：
```json
{
  "project_path": "projects/[Name]/",
  "entry_file": "projects/[Name]/src/App.tsx",
  "dev_server": "http://localhost:5173",
  "status": "build_complete"
}
```

**Stop Conditions**：
- system_prompt.md 缺失 → 追问"先运行 assemble 类型生成 system_prompt"
- 技术栈不明确 → 追问"用什么技术栈？React/Vue/原生？"

---

### 2.6 `audit` - 审计

**触发场景**：
- "Review 代码"
- "检查质量"
- "验证交付"
- "这个做得怎么样"

**执行流程**：
1. 运行 Visual Reviewer 检查设计一致性
2. 运行 Interaction Reviewer 检查交互规范
3. 运行 Code Reviewer 检查代码质量
4. 汇总 Reviewer 报告

**Expected Output**：
```json
{
  "reviewers": {
    "visual": { "passed": true, "issues": [] },
    "interaction": { "passed": true, "issues": [] },
    "code": { "passed": false, "issues": ["缺少错误边界处理"] }
  },
  "overall_passed": false,
  "blocking_issues": ["缺少错误边界处理"],
  "status": "audit_complete"
}
```

**Stop Conditions**：
- 无可审计内容 → 追问"还没有构建内容，先运行 build 类型"

---

## 三、类型依赖关系

```
init → define ──────────────────→ design → assemble → build → audit
         │                           │
         ├── define-prd              │
         ├── define-wireframe        │
         └── 用户确认 (blocking)      │
                                     │
                    └── 可独立调用 ───┘
```

**依赖规则**：
- `define` 依赖 `init`（项目必须存在）
- `define-wireframe` 依赖 `define-prd`（需要 PRD + Brand DNA）
- **`design` 依赖 `define` 用户确认通过**（wireframe 必须 approved）
- `assemble` 依赖 `design`（需要设计资产）
- `build` 依赖 `assemble`（需要 system_prompt）
- `audit` 依赖 `build`（需要可审计内容）

**例外**：
- 用户可直接调用任意类型，系统自动检查前置条件
- 缺失前置 → 返回缺失列表 + 追问是否自动补充

---

## 四、Type → Expected Output 表

| Type | 必须产出 | 可选产出 |
|---|---|---|
| `init` | 项目骨架目录 | - |
| `define` | `prd(input).md`, `brand_dna.md`, **`wireframe.md`** | `user_journey_map.md` |
| `design` | 5 个设计资产文件 | `tokens.json` |
| `assemble` | `system_prompt.md` | - |
| `build` | `projects/[Name]/` 目录 | dev server URL |
| `audit` | Reviewer 报告（JSON） | 修复建议文档 |

---

## 五、与 Plan Schema 的映射

Plan 中的 `type` 字段必须为以上 6 种之一：

```json
{
  "plan": {
    "type": "define",  // 必须是 init/define/design/assemble/build/audit
    "constraints": { ... },
    "steps": [ ... ],
    "expected_output": { ... },
    "stop_conditions": [ ... ]
  }
}
```

**校验规则**：
- `type` 不在列表中 → 返回错误码 `E_INVALID_TYPE`
- 缺少 `type` → 返回错误码 `E_MISSING_TYPE`
