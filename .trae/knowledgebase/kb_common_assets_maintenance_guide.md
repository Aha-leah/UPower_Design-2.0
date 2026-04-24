# v3.1 团队指南：通识维护

> **用途**：说明如何维护 UPower v3.1 的通识资产（设计反例、Reviewer Checklist、Tokens Schema 等）。

---

## 一、通识资产清单

| 资产 | 路径 | 用途 | 更新频率 |
|---|---|---|---|
| **设计反例（通识）** | `.trae/knowledgebase/file_template/kb_design_bad_patterns_common.md` | 通用设计坏例库 | 每季度或重大复盘后 |
| **设计反例（项目模板）** | `.trae/knowledgebase/file_template/kb_design_bad_patterns_project.md` | 项目特定坏例模板 | 项目启动时复制 |
| **Visual Reviewer Checklist** | `.trae/knowledgebase/file_template/kb_reviewer_checklist_visual_common.md` | 视觉走查通识规则 | 每季度或规范更新时 |
| **Interaction Reviewer Checklist** | `.trae/knowledgebase/file_template/kb_reviewer_checklist_interaction_common.md` | 交互走查通识规则 | 每季度或规范更新时 |
| **Reviewer Checklist（项目模板）** | `.trae/knowledgebase/file_template/kb_reviewer_checklist_project.md` | 项目特定走查规则模板 | 项目启动时复制 |
| **Tokens Schema** | `.trae/knowledgebase/file_template/kb_tokens_schema.md` | Design Tokens 结构定义 | 结构变更时 |

---

## 二、维护流程

### 2.1 新增通识规则/反例

```
1. 发现问题（项目复盘中 / 团队讨论中）
2. 判断是否为通识问题（适用于多个项目）
3. 如果是通识：
   a. 找到对应的通识文件
   b. 按格式添加新条目
   c. 提交 PR，说明添加原因
4. 如果是项目特定：
   a. 在项目目录下创建/更新项目版本文件
   b. 不影响通识库
```

### 2.2 修改通识规则/反例

```
1. 确认修改必要性（行业标准更新 / 团队共识变化）
2. 提出修改建议（在 Issue 或 PR 中说明）
3. 团队讨论通过
4. 更新文档，记录修改历史
5. 通知所有成员
```

### 2.3 移除过时规则/反例

```
1. 确认规则已过时（不再适用当前设计规范）
2. 在文档底部「历史」段落记录移除原因
3. 保留移除记录，方便回溯
4. 不直接删除，而是标记为「已废弃」
```

---

## 三、格式规范

### 3.1 反例格式

```markdown
| 反例 | 问题 | 改法 |
|---|---|---|
| [描述具体场景] | [解释为什么是问题] | [提供正确做法] |
```

**要求**：
- 反例需具体（可附截图）
- 问题需解释根因
- 改法需可执行

### 3.2 Reviewer 规则格式

```markdown
| # | 规则 | 验收标准 | 检查方式 |
|---|---|---|---|
| [编号] | [规则描述] | [可量化的标准] | [如何检查] |
```

**要求**：
- 编号连续（V1, V2... 或 I1, I2...）
- 验收标准可量化（数值、布尔值）
- 检查方式可执行（工具名、操作步骤）

---

## 四、版本管理

### 4.1 变更记录

每个通识文件底部应有「变更历史」段落：

```markdown
## 变更历史

| 日期 | 版本 | 变更内容 | 作者 |
|---|---|---|---|
| 2026-04-16 | v1.0 | 初始版本 | Atlas |
| 2026-05-15 | v1.1 | 新增 V15 移动端规则 | Alice |
```

### 4.2 快照机制

重大变更前，创建快照：

```bash
# 创建快照
cp kb_design_bad_patterns_common.md .trae/snapshots/v1.0_bad_patterns/

# 在 `.trae/snapshots/` 目录下按版本管理
```

### 4.3 回滚流程

如果变更导致问题：

```bash
# 回滚到上一个版本
cp .trae/snapshots/v1.0_bad_patterns/kb_design_bad_patterns_common.md .trae/knowledgebase/file_template/

# 记录回滚原因
```

---

## 五、团队协作

### 5.1 责任人

| 资产 | 默认责任人 | 说明 |
|---|---|---|
| 设计反例 | Alice (Product) + Bob (Visual) | 设计相关 |
| Visual Checklist | Bob (Visual) | 视觉标准 |
| Interaction Checklist | Mia (UX) + Ken (Frontend) | 交互标准 |
| Tokens Schema | Neo (System Architect) | 技术标准 |

### 5.2 审核流程

通识变更需经以下流程：

```
1. 提出变更（任何人）
2. 责任人初审
3. 相关角色会签（如视觉规则需 Bob 确认）
4. 合并到主分支
5. 通知全体成员
```

### 5.3 定期 Review

- **频率**：每季度一次
- **参与者**：Atlas + 相关责任人
- **内容**：
  - 检查是否有新增反例需要纳入通识
  - 检查是否有规则过时
  - 检查验收标准是否仍然合理

---

## 六、项目特定 vs 通识判断标准

| 场景 | 判断 | 处理 |
|---|---|---|
| 问题只在当前项目出现 | 项目特定 | 项目文件 |
| 问题在 2+ 项目出现 | 通识候选 | 讨论后决定 |
| 问题与行业通用规范相关 | 通识 | 通识文件 |
| 问题与项目品牌强相关 | 项目特定 | 项目文件 |

---

## 七、检查清单

每次更新通识资产后，确认：

- [ ] 格式符合规范
- [ ] 验收标准可量化
- [ ] 变更历史已更新
- [ ] 责任人已审核
- [ ] 团队已通知

---

## 八、参考

- 设计规范：WCAG 2.1、Material Design、Apple HIG
- 团队复盘记录：`.trae/JOURNAL.md`
- 项目特定资产：`Source/[ProjectName]/input/`
