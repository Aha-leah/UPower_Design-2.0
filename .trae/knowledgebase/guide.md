# Knowledgebase Guide — 增量文档管理指南

> **读者**：人类维护者 + AI Agent（本文件会被 Agent 作为上下文注入）
> **优先级**：低于 `.trae/rules`，高于项目级 `Source/[Name]/input/`
> **最后更新**：2026-04-23

---

## 一、目录结构总览

```
.trae/
├── rules/                          ← 硬约束（最高优先级）
├── skills/                         ← Agent 角色定义（v3.3，JSON 产出 + [CREATIVE] 外置）
├── scaffold/                       ← 脚手架（bin/ + prompts/）
│
├── knowledgebase/                  ← 参考资料与知识资产（本指南管辖范围）
│   ├── guide.md                        本文件：增量文档管理指南
│   ├── README.md                       目录元信息（简述定位与优先级）
│   ├── Reference_Links.md              外部趋势报告链接集
│   ├── kb_common_assets_maintenance_guide.md  通识资产维护 SOP
│   ├── kb_skill_rewrite_spec.md               Skill 双区改造规范 + skill-creator 审核流程
│   │
│   ├── file_template/                  模板库（通识 + 项目空模板 + JSON Schema）
│   │   ├── kb_prd_template.md                          PRD 结构模板（Markdown 参考版）
│   │   ├── prd_schema.json                             PRD JSON Schema（v3.3 产出格式）
│   │   ├── brand_dna_schema.json                       Brand DNA JSON Schema（v3.3）
│   │   ├── style_prompt_schema.json                    Style Prompt JSON Schema（v3.3）
│   │   ├── animation_prompts_schema.json               Animation Prompts JSON Schema（v3.3）
│   │   ├── kb_prd_gold_standard_example.md             PRD 金标准范例
│   │   ├── kb_prd_stop_conditions.md                   PRD 完备性门禁
│   │   ├── kb_engineering_prd_template.md              工程化 PRD 模板（备用）
│   │   ├── kb_design_bad_patterns_common.md            设计反例库（通识）
│   │   ├── kb_design_bad_patterns_project.md           设计反例库（项目空模板）
│   │   ├── kb_reviewer_checklist_visual_common.md      视觉走查规则（通识）
│   │   ├── kb_reviewer_checklist_interaction_common.md 交互走查规则（通识）
│   │   ├── kb_reviewer_checklist_project.md            走查规则（项目空模板）
│   │   ├── kb_tokens_schema.md                         Design Tokens JSON Schema
│   │   ├── kb_project_execution_template.md            项目执行计划模板
│   │   └── kb_project_proposal_template.md             项目提案模板
│   │
│   └── prompt_tag_database/            创意标签词库
│       ├── Prompt_Cheat_Sheet.md                       视觉风格标签库
│       └── Motion_Design.md                            动效设计标签库
│
└── governance_policy.md            ← 治理策略（v3.3）
```

> **关键边界**：版本迭代文档（计划、盘点报告、Demo 素材）不在产品包内，归档在 `Docs/versions/`。
> knowledgebase 只存「跨版本长期有效」的知识资产。

---

## 二、文件分类与职责

### 2.1 三层分类法

| 层级 | 含义 | 文件位置 | 变更频率 |
|---|---|---|---|
| **模板层** | 保证每个项目的结构化起点一致 | `file_template/kb_*_template.md` | 低（结构变更时） |
| **标准层** | 保证质量底线可量化、可机器验证 | `file_template/kb_*_common.md` + `kb_tokens_schema.md` | 中（每季度 Review） |
| **创意层** | 保证视觉 / 动效产出不泛化 | `prompt_tag_database/` + `Reference_Links.md` | 中（行业趋势更新时） |

> **注意**：版本迭代文档（计划、盘点、Demo 素材）不在产品包内，归档在项目 `Docs/versions/` 目录下。

### 2.2 每个文件的一句话用途

| 文件 | 一句话 | 主要消费者 |
|---|---|---|
| `README.md` | knowledgebase 的定位说明 | AI Agent / 新成员 |
| `guide.md` | 增量文档管理规则（本文件） | 维护者 / AI Agent |
| `Reference_Links.md` | UI/UX 趋势权威报告链接，用于审美校准 | Bob（Visual Designer） |
| `kb_common_assets_maintenance_guide.md` | 通识资产的新增/修改/移除/回滚 SOP | Atlas / 全团队 |
| `kb_skill_rewrite_spec.md` | Skill 双区改造规范 + skill-creator 审核五维度流程 | Atlas / 所有 Skill 改造者 |

**file_template/**

| 文件 | 一句话 | 主要消费者 |
|---|---|---|
| `kb_prd_template.md` | Alice 生成 PRD 的结构骨架 | Alice（Product Designer） |
| `kb_prd_gold_standard_example.md` | 填写水平的「标尺」——TaskFlow Pro 完整范例 | Alice / Judge |
| `kb_prd_stop_conditions.md` | PRD 完备性验证的 P0/P1 字段判断规则 | Alice / validate_prd_completeness |
| `kb_engineering_prd_template.md` | 工程视角的备用 PRD 模板（偏 API/数据模型） | 工程团队 |
| `kb_design_bad_patterns_common.md` | 跨项目通识设计反例（对比度/密度/间距等） | Judge / Bob |
| `kb_design_bad_patterns_project.md` | 项目特定反例空模板——新项目复制使用 | 项目 Owner |
| `kb_reviewer_checklist_visual_common.md` | 14+ 条视觉走查硬规则（量化验收标准） | Judge（audit 阶段） |
| `kb_reviewer_checklist_interaction_common.md` | 14+ 条交互走查硬规则（键盘/表单/反馈等） | Judge（audit 阶段） |
| `kb_reviewer_checklist_project.md` | 项目特定走查规则空模板——可覆盖通识规则 | 项目 Owner |
| `kb_tokens_schema.md` | Design Tokens 的 JSON Schema 契约 | Neo（System Architect）→ Ken |
| `kb_project_execution_template.md` | 项目执行计划框架（里程碑/周计划/风险） | Atlas |
| `kb_project_proposal_template.md` | 项目提案结构（偏 AI 增强文档检索场景） | Atlas / 产品负责人 |

**prompt_tag_database/**

| 文件 | 一句话 | 主要消费者 |
|---|---|---|
| `Prompt_Cheat_Sheet.md` | 6 大类视觉风格标签（Styles/Materials/Lighting/Layout/Typography） | Bob |
| `Motion_Design.md` | 5 大类动效标签 + CSS 参数值（spring/ease/choreography/micro） | Bob |

---

## 三、增量文档规则

### 3.1 命名规范

```
前缀_功能描述.md
```

| 前缀 | 含义 | 示例 |
|---|---|---|
| `kb_` | 通识知识资产（跨项目共享） | `kb_design_bad_patterns_common.md` |
| `kb_*_project.md` | 项目模板（新项目复制使用） | `kb_reviewer_checklist_project.md` |
| 无前缀（根目录） | 全局性参考文档 | `Reference_Links.md`、`guide.md` |

> **版本迭代文档**（`v{XY}_*.md`）不放产品包内，归档在项目 `Docs/versions/`。

### 3.2 放置决策树

```
新文档要放哪？

  Q1: 是否为必须遵守的硬约束？
   ├─ YES → 放 .trae/rules/（不是这里）
   └─ NO ↓

  Q2: 是否为模板/空表格结构？
   ├─ YES → 放 file_template/
   │   ├─ 跨项目通用 → 命名 kb_xxx_common.md
   │   └─ 每项目独立 → 命名 kb_xxx_project.md
   └─ NO ↓

  Q3: 是否为视觉/动效创意标签词库？
   ├─ YES → 放 prompt_tag_database/
   └─ NO ↓

  Q4: 是否与特定版本迭代绑定（计划/盘点/Demo/报告）？
   ├─ YES → 放项目 Docs/versions/，命名 v{XX}_xxx.md（不在产品包内）
   └─ NO → 放 knowledgebase 根目录，命名描述性英文名.md
```

### 3.3 通识 vs 项目特定的判断标准

| 信号 | 归属 | 动作 |
|---|---|---|
| 问题只在当前项目出现 | 项目特定 | 复制 `_project.md` 模板到 `Source/[Name]/input/` |
| 问题在 2+ 项目重复出现 | 通识候选 | 讨论后添加到 `_common.md` |
| 问题关联行业通用规范（WCAG/HIG 等） | 通识 | 直接添加到 `_common.md` |
| 问题与项目品牌强绑定 | 项目特定 | 项目文件 |

### 3.4 文件体积约束

| 类型 | 上限 | 超限处理 |
|---|---|---|
| 单个 `_common.md` | 300 行 | 按子领域拆分（如 `kb_bad_patterns_visual.md` + `kb_bad_patterns_interaction.md`） |
| 单个 `_project.md` 模板 | 50 行 | 模板只提供骨架，不填内容 |
| `prompt_tag_database/` 单文件 | 100 行 | 按大类拆分（如 Layout 独立成文件） |

---

## 四、变更流程

### 4.1 新增文档

```
1. 按 §3.2 决策树确定位置
2. 按 §3.1 命名规范命名
3. 文件头部必须包含：
   > **用途**：一句话说明
   > **Owner**：[负责人]
   > **最后更新**：[日期]
4. 文件尾部保留「变更历史」段（见下方模板）
5. 更新本文件 §二 的文件清单
```

### 4.2 修改现有文档

```
1. 确认修改必要性（行业标准更新 / 团队共识变化 / 新版本需要）
2. 在文件尾部「变更历史」追加记录
3. 如为通识资产（_common.md），需责任人审核
4. 如影响 AI Agent 行为，需验证 Agent 读取后的产出质量
```

### 4.3 归档与清理

```
1. 过时的通识规则：标记「已废弃」+ 记录原因，不直接删除
2. 每季度 Review 一次，清理不再被引用的文件
3. 版本迭代文档归档在项目 Docs/versions/，不在产品包内
```

### 4.4 变更历史模板

在每个文件尾部维护：

```markdown
---

## 变更历史

| 日期 | 变更内容 | 作者 |
|---|---|---|
| YYYY-MM-DD | 初始版本 | [Author] |
```

---

## 五、AI Agent 使用约定

以下规则确保 Agent 正确消费 knowledgebase：

| 规则 | 说明 |
|---|---|
| **优先级** | `rules` > `knowledgebase` > 项目 `Source/[Name]/input/` |
| **模板不直接引用** | `_project.md` 模板是给人类复制的，Agent 不应将空模板内容注入产出 |
| **通识资产可直接引用** | `_common.md` 中的反例、checklist、tokens schema 可直接用于 audit |
| **JSON Schema 是产出格式契约** | `*_schema.json` 定义各阶段产出的 JSON 格式，Agent 产出必须符合 schema |
| **创意词库是选词来源** | `prompt_tag_database/` 中的标签应优先选用，不要凭空编造风格词汇 |
| **本文件是路由表** | Agent 不确定某类知识在哪时，先读 `guide.md` 的 §一 目录结构定位 |

---

## 六、扩展预留

未来可能新增的文档方向（尚未创建，仅预留命名）：

| 方向 | 预留命名 | 触发条件 |
|---|---|---|
| 创意评分维度定义 | `file_template/kb_creative_scoring_rubric.md` | v3.2 C 模块启动时 |
| 多终端设计约束 | `file_template/kb_terminal_constraints.md` | 支持 Mobile/Desktop 时 |
| Wireframe 结构契约 | `file_template/kb_wireframe_contract.md` | Mia Skill 双区改造时 |

> 版本迭代相关文档归档在项目 `Docs/versions/`，不在产品包内。

---

## 变更历史

| 日期 | 变更内容 | 作者 |
|---|---|---|
| 2026-04-21 | 初始版本：目录结构总览、分类法、增量规则、变更流程 | Atlas |
| 2026-04-21 | 版本迭代文档迁至独立目录，四层→三层分类，更新决策树和引用 | Atlas |
| 2026-04-22 | 目录定名 `.trae/versions/`（changelog → demo → versions），全量引用同步 | Atlas |
| 2026-04-23 | v3.3 更新：移除 versions/JOURNAL.md 引用（已迁至 Docs/）；新增 4 个 JSON Schema 文件；更新 Agent 约定 | Atlas |
