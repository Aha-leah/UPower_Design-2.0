# Reviewer 接入生成链路

> **用途**：定义 Reviewer 如何接入 UPower 生成流程，确保每次产出都有质量保障。
> **版本**：v3.2 — 新增创意评分双通道（[STRUCTURE] 验证 + [CREATIVE] 评分并行）

---

## 一、接入点定义

| 生成阶段 | 触发时机 | Reviewer 类型 | 产出 |
|---|---|---|---|
| **define 阶段** | PRD 生成后 | PRD Completeness Validator | 完备性报告 |
| **assemble 阶段** | system_prompt 生成后 | Asset Completeness Validator | 资产完备性报告 |
| **build 阶段** | 代码生成后 | Visual + Interaction Reviewer | 结构质量走查报告 |
| **audit 阶段** | build 完成后 | Project Auditor (Judge) | 双通道报告（结构 Verdict + 创意评分） |

---

## 二、链路流程

### 2.1 define 阶段

```
generate_experience_prd
       │
       ▼
generate_brand_dna
       │
       ▼
┌─────────────────────────────┐
│ PRD Completeness Validator  │
│ (调用 validate_prd_completeness)│
└─────────────────────────────┘
       │
       ├─ passed: true ──→ 继续下一阶段
       │
       └─ passed: false ──→ 返回缺失字段，追问用户
```

### 2.2 assemble 阶段

```
assemble_system_prompt
       │
       ▼
┌─────────────────────────────┐
│ Asset Completeness Validator│
│ (检查 5 个设计资产是否齐全)  │
└─────────────────────────────┘
       │
       ├─ passed: true ──→ 继续下一阶段
       │
       └─ passed: false ──→ 返回缺失资产列表
```

### 2.3 build 阶段

```
代码生成完成
       │
       ▼
┌─────────────────────────────┐
│ Visual Reviewer             │
│ (kb_reviewer_checklist_visual)│
└─────────────────────────────┘
       │
       ▼
┌─────────────────────────────┐
│ Interaction Reviewer        │
│ (kb_reviewer_checklist_interaction)│
└─────────────────────────────┘
       │
       ▼
┌─────────────────────────────┐
│ 汇总 Reviewer 报告          │
│ 输出 JSON 结构化结果        │
└─────────────────────────────┘
       │
       ├─ overall_passed: true ──→ 进入 audit 阶段
       │
       └─ overall_passed: false ──→ 标记需修复，列出问题（阻塞 audit）
```

### 2.4 audit 阶段（v3.2 新增双通道）

```
build 阶段 overall_passed: true
       │
       ▼
┌─────────────────────────────────────────┐
│ Project Auditor (Judge)                 │
│ 读取：prd.md + brand_dna.md             │
│       system_prompt.md + web_content.js │
└─────────────────────────────────────────┘
       │
       ├── [STRUCTURE 通道]（阻塞性）
       │        │
       │        ├─ Score ≥ 80 且 CRITICAL = 0 → Verdict: PASS
       │        ├─ Score 60-79 或 CRITICAL 1-2 → Verdict: WARN
       │        └─ Score < 60 或 CRITICAL ≥ 3  → Verdict: FAIL → 阻塞交付
       │
       └── [CREATIVE 通道]（非阻塞性）
                │
                ├─ 总分 ≥ 15/20 → 标记 ✨ 高质量
                ├─ 总分 10-14  → 标记 ✓ 合格
                └─ 总分 < 10   → 标记 ⚠️ 建议人工润色（不阻塞交付）
```

**关键规则**：
- STRUCTURE 通道 Verdict = FAIL 时，阻塞交付，必须修复后重新 audit
- CREATIVE 通道仅标记质量等级，**不阻塞交付**
- 两个通道必须同时运行，不得跳过任一通道

---

## 三、Reviewer 报告结构

### 3.1 单次 Reviewer 输出（build 阶段，无变化）

```json
{
  "reviewer_id": "visual_20260416_001",
  "reviewer_type": "visual",
  "timestamp": "2026-04-16T12:00:00Z",
  "project_name": "TaskFlow_Pro",
  "passed": false,
  "issues": [
    {
      "rule": "V1",
      "severity": "critical",
      "location": "首页卡片标题",
      "description": "对比度 2.8:1，不达标",
      "screenshot": "review_screenshots/v1_issue_1.png"
    }
  ],
  "can_proceed": false
}
```

### 3.2 build 阶段汇总报告（无变化）

```json
{
  "report_id": "review_summary_20260416_001",
  "project_name": "TaskFlow_Pro",
  "timestamp": "2026-04-16T12:05:00Z",
  "reviewers": [
    { "type": "visual", "passed": false, "critical_issues": 1, "warnings": 2 },
    { "type": "interaction", "passed": true, "critical_issues": 0, "warnings": 1 }
  ],
  "overall_passed": false,
  "blocking_issues": [
    { "reviewer": "visual", "rule": "V1", "description": "对比度 2.8:1，不达标" }
  ],
  "recommendation": "修复 critical issues 后可交付"
}
```

### 3.3 audit 阶段双通道报告（v3.2 新增）

```json
{
  "report_id": "audit_20260416_001",
  "project_name": "TaskFlow_Pro",
  "timestamp": "2026-04-16T12:10:00Z",
  "structure_channel": {
    "score": 85,
    "verdict": "PASS",
    "critical_count": 0,
    "warning_count": 3,
    "deviations": [
      {
        "severity": "warning",
        "description": "brand_dna.md Tempo 为'舒缓'，但 animation_prompts.md 使用 duration: 100ms",
        "source_file": "animation_prompts.md",
        "source_section": "基础时长"
      }
    ]
  },
  "creative_channel": {
    "total_score": 16,
    "max_score": 20,
    "label": "✨ 高质量",
    "dimensions": [
      { "name": "隐喻一致性", "score": 4, "note": "驾驶舱隐喻在 hero 区有体现" },
      { "name": "情绪传达",   "score": 4, "note": "打开即感受到掌控感" },
      { "name": "差异化",     "score": 4, "note": "Bold Factor 液态金属标题执行到位" },
      { "name": "细节品质",   "score": 4, "note": "微交互节奏与 Tempo 一致" }
    ]
  },
  "overall_deliverable": true,
  "recommendation": "结构通过，创意高质量，可交付。建议后续迭代优化 animation 时长与 DNA 一致性。"
}
```

---

## 四、严重程度定义

| 级别 | 含义 | 处理 |
|---|---|---|
| **critical** | 阻塞交付 | 必须修复后才能继续 |
| **warning** | 质量问题 | 建议修复，不阻塞交付 |
| **info** | 优化建议 | 可忽略或后续迭代 |

---

## 五、与 Steps 的集成

在 CLI 转译层中，`build` 类型的 Steps 扩展为：

```json
{
  "type": "build",
  "steps": [
    { "step_id": "build_1", "cmd": "run_npm" },
    { "step_id": "build_2", "cmd": "generate_components" },
    { "step_id": "build_3", "cmd": "dev_server" },
    {
      "step_id": "build_4",
      "cmd": "invoke_skill",
      "args": { "skill": "visual_reviewer", "input": { "project_path": "projects/{project_name}" } }
    },
    {
      "step_id": "build_5",
      "cmd": "invoke_skill",
      "args": { "skill": "interaction_reviewer", "input": { "project_path": "projects/{project_name}" } }
    },
    {
      "step_id": "build_6",
      "cmd": "aggregate_review_reports",
      "args": { "project_path": "projects/{project_name}" }
    }
  ]
}
```

`audit` 类型独立为单独 Steps（v3.2 新增）：

```json
{
  "type": "audit",
  "steps": [
    {
      "step_id": "audit_1",
      "cmd": "invoke_skill",
      "args": {
        "skill": "project_auditor",
        "input": {
          "prd_path": "Source/{project_name}/input/prd(input).md",
          "dna_path": "Source/{project_name}/input/brand_dna.md",
          "system_prompt_path": "Source/{project_name}/system_prompt.md",
          "web_content_path": "Source/{project_name}/web_content.js"
        }
      }
    },
    {
      "step_id": "audit_2",
      "cmd": "write_audit_report",
      "args": { "output_path": "Source/{project_name}/audit_report.md" }
    }
  ],
  "gate": {
    "block_on": "structure_channel.verdict == FAIL",
    "warn_on": "creative_channel.label == ⚠️ 建议人工润色"
  }
}
```

---

## 六、报告存储路径

```
projects/{project_name}/
├── src/
├── public/
└── reviews/
    ├── visual_20260416_001.json
    ├── interaction_20260416_001.json
    └── summary_20260416_001.json
```

---

## 七、人工复核流程

当 Reviewer 报告有 critical issues 时：

```
1. Reviewer 报告输出
2. 系统标记 "需修复"
3. 通知用户查看报告
4. 用户修复问题
5. 重新运行 build 阶段（或单独运行 audit 类型）
6. Reviewer 重新检查
7. 通过后标记 "可交付"
```

---

## 八、配置项

可在 `project_state.json` 中配置 Reviewer 行为：

```json
{
  "reviewer_config": {
    "auto_run": true,
    "block_on_critical": true,
    "block_on_warning": false,
    "reviewers": ["visual", "interaction"],
    "custom_checklist_path": "input/reviewer_checklist.md"
  }
}
```
