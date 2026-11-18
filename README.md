# 🐴 小驴思源生态配套 · Gety 全域检索连接器 (siyuan-gety)

> **XiaoLv Suite Companion · SiYuan Note Connector for
> [Gety](https://gety.ai)**\
> 专为 [思源笔记 (SiYuan Note)](https://b3log.org/siyuan/) 打造的 Gety
> 全文检索连接器，通过本地 HTTP API 毫秒级增量索引思源文档，在 Gety
> 桌面端与本地文件、代码仓及外部知识库统一检索，一键通过 `siyuan://`
> 协议秒级定位跳转编辑。

---

## 🌟 核心特性 (Features)

- **文档级高质量索引** —
  最小索引单位为完整思源文档，规避细碎块碎片噪音，保留完整上下文。
- **并发导出与极速冷启动** — 最多 6 协程并发导出
  Markdown，千篇大型知识库冷启动仅需 30~60 秒。
- **毫秒级增量同步** — 基于 SQL `updated`
  时间戳增量拉取，稳态下仅同步真实变更文档，零无效资源消耗。
- **全库单次轻量检测** — 删除检测采用单次 SQL 扫描，彻底消除多笔记本循环 HTTP
  往返通信延迟。
- **思源层级标签原生支持** — 完整提取 `#科技/AI#`、`#工作/项目/2026#`
  等层级标签并存入元数据供精确筛选。
- **CommonMark 代码块无损保护** — 支持 3+ 反引号（含 4 反引号内嵌子代码块）与
  `~~~` 波浪线围栏，语法保护坚如磐石。
- **嵌套超级块迭代解析** — 递归将多层 `row` / `col`
  嵌套超级块转换为清晰引用块，彻底杜绝语法标记泄漏。
- **深度 HTML 标签过滤** — 彻底净化 `<details>`、`<summary>`、`<ruby>`
  等冗余标签，安全保留 `siyuan://` 等超链接。
- **动态日记图标与去重** — 智能映射日记动态图标为 `📅` 表情符，避免标题重复拼贴
  Emoji 图标。
- **一键双向跳转编辑** — 搜索结果直连 `siyuan://blocks/<id>`
  原生协议，点击即刻唤出思源并聚焦定位。

## 📦 安装指南 (Install in Gety)

### 方式一：从 npm 安装（推荐，精选列表同源）

```bash
# 在 Gety 的 Connectors 设置中选 Install from remote，填入：
siyuan-gety
```

或命令行：`gety connector install --npm siyuan-gety`

> Gety 从 npm 安装时读取 `package.json` 的 `gety` 字段（由 `manifest.json`
> 单向同步生成），包内 `manifest.json` 不参与解析。

### 方式二：从 Release 下载预打包

1. 前往 [Releases](https://github.com/xiaolv-suite/siyuan-gety/releases)
   下载最新的 `siyuan-gety-<version>.zip`（或兼容包
   `gety-siyuan-connector-<version>.zip`）
2. 解压到任意目录
3. 打开 **Gety → Settings → Connectors**
4. 点击 **Install connector**，选择解压后的文件夹（包含 `manifest.json`）
5. 填写思源 API 地址与 Token，点击 **Update now** 即可瞬间建立索引

### 方式三：从源码安装

1. Clone
   本仓库到本地：`git clone https://github.com/xiaolv-suite/siyuan-gety.git`
2. （可选）执行 `deno task build` 重新构建 `dist/main.js`
3. 在 Gety 中选择仓库根目录安装

安装后在 Gety → Settings → Connectors 中点击 **Update now** 触发首次索引
（视文档数量而定，并发模式下通常 30 秒-1 分钟）。之后默认每 30
分钟增量同步一次。

## 🔐 权限说明 (Permissions)

本连接器以**沙箱模式**运行，需要 Gety **0.7.0 或更新版本**：

```json
"permissions": {
  "net": [{ "config_field": "api_url" }]
}
```

- **动态网络授权**：网络访问范围由您填写的「思源 API 地址」决定，Gety 在安装
  时按该值授予权限。修改地址后授权自动跟随，无需重新审阅。
- **不声明 `permissions`** 的连接器会以完全权限运行并触发红色高危警告；本连接器
  刻意声明了最小授权，避免该风险。
- 若安装后报 `permission denied: net access to "…" is not granted`，说明 API
  地址填写与实际思源地址不一致，改正即可。

## Configuration / 配置

| Field 字段              | Type     | Required | Description                                                 |
| ----------------------- | -------- | -------- | ----------------------------------------------------------- |
| `api_url` 思源 API 地址 | text     | yes      | SiYuan kernel API base URL, default `http://localhost:6806` |
| `api_token` API 令牌    | password | yes      | SiYuan API token from **Settings → About → API token**      |

### 获取 API Token

1. 打开思源笔记
2. 进入 **设置 → 关于 → API token**
3. 复制 token 填入连接器配置

## Usage / 使用

1. 在 Gety 搜索框中输入关键词，即可检索所有思源笔记文档。
2. 点击搜索结果（链接图标），Gety 调用 `siyuan://blocks/<doc-id>` 协议，
   自动打开思源并定位到该文档，可直接编辑。
3. 可用元数据字段辅助筛选搜索：
   - `notebook_name` — 笔记本名（如 `工作笔记`、`个人日记`）
   - `doc_path` — 文档路径（如 `项目A / 子目录 / 文档`）
   - `source_path` — 包含笔记本和文档名的完整来源路径
   - `name` — 思源原生块名称
   - `alias` — 文档别名
   - `memo` — 文档备注
   - `tags` — 思源标签（含 frontmatter 中的 `tags:` 和正文 `#标签`）
   - `links` — 文档内双链指向的块 ID

## Local development / 本地开发

### Rebuild / 重新构建

```bash
deno task build
```

### Verify / 验证

```bash
deno task verify
```

包含格式化检查、lint、单元测试（73 个）和构建。

### Exercise the lifecycle locally / 本地试跑

```bash
cp .env.example .env
# 编辑 .env 填入 GETY_CONFIG_API_URL 和 GETY_CONFIG_API_TOKEN
deno task runner -- --reset-state
```

输出快照在 `dev/runs/<timestamp>/`，可用 `--polls 2` 验证增量同步。

### Debug logging / 调试日志

连接器内部的 `console` 输出会被 Gety 重定向到
IPC，在应用日志里看不到。需要排查时，用环境变量指定日志文件路径即可开启：

```bash
# Windows
set SIYUAN_CONNECTOR_DEBUG_LOG=C:\Users\you\siyuan-connector-debug.log
# macOS / Linux
export SIYUAN_CONNECTOR_DEBUG_LOG=/tmp/siyuan-connector-debug.log
```

**默认关闭**：不设置该变量时不会写入任何文件。日志采用缓冲写入（每 50 条 或 poll
结束时 flush），减少文件 IO。日志会记录 `onLoad` 与每次 `poll`
的文档数、批次信息，可能包含笔记本名称，请按需开启并自行保管。

### Diagnose display issues / 显示诊断

用一组覆盖思源各类导出语法的样本跑一遍渲染管线，报告残留语法与显示缺陷：

```bash
deno run -A dev/display-diagnose.ts
```

配置好 `.env` 后，可以对真实笔记做只读诊断 —— 只输出缺陷统计，**不会打印
笔记正文**：

```bash
deno run -A --env-file=.env dev/display-diagnose.ts --live 40
```

## Troubleshooting / 排错

### `Could not reach SiYuan kernel at http://localhost:6806`

- 确认思源正在运行
- 确认 API 地址正确（思源默认 6806 端口）
- 如果思源配置了其他端口，修改 `api_url`

### `HTTP 401` / `Auth failed`

- API 令牌为空或错误
- 在思源 **设置 → 关于** 重新获取 token 并填入
- 如果思源关闭了鉴权，仍建议填入 token（思源会忽略无效 token）

### 搜索结果中没有思源内容

- 确认连接器已 **Enable**，配置字段已填写
- 点击 **Update now** 手动触发索引
- 检查 `dev/runs/<timestamp>/summary.json` 查看索引统计

### 点击搜索结果无法跳转思源

- 确认思源正在运行
- 确认 Windows 上 `siyuan://` 协议已注册（安装思源时会自动注册）
- 若协议缺失，重装思源即可恢复

### 代码块内容显示异常

v0.4.0 已加入代码块保护机制。如果仍有异常，请运行显示诊断工具
（`deno run -A dev/display-diagnose.ts`）并提交 Issue。

## Repository structure / 项目结构

```text
manifest.json          # Connector manifest (id/name/config/icon/schedule)
src/index.ts           # Connector implementation (poll lifecycle, concurrent export)
src/siyuan-client.ts   # SiYuan kernel HTTP API client (incremental SQL queries)
src/utils.ts           # Pure content-cleaning helpers (code protection, tag extraction)
src/index.test.ts      # Unit tests (63)
dist/main.js           # Built bundle loaded by Gety
icon.svg / icon.png    # SiYuan logo icons
scripts/               # Build tooling (esbuild bundler)
dev/                   # SDK + local runner + test harness
```

## Version history / 版本历史

- **v0.5.0** — 搜索结果使用文档原生图标并显示紧凑标签；新增完整来源路径、
  文档名称、别名与备注索引；合并思源原生标签；修复 emoji 标题截断
- **v0.4.2** — 修复按笔记本和批次推进同步游标、纯删除轮次状态持久化、
  导出失败重试及关闭笔记本元数据保留；强化 HTML 与本地资源清理
- **v0.4.1** — 修复 Release 打包缺失 `dist/` 目录、导出失败永不重试 （新增
  `pendingRetry` 机制）、关闭笔记本导致文档被误删；新增 `listDocsByIds`
  与对应单元测试
- **v0.4.0** — 并发导出（6 并发）、增量 SQL 查询、代码块/公式保护、 frontmatter
  标签提取、本地资源分类（音视频附件）、compact 内容头部、 debug 日志缓冲、统一
  ID 正则（支持新版 20+ 字符 ID）、移除死代码、 测试增至 56 个
- **v0.3.3** — 修复搜索结果重复上下文、裸块引用、嵌入块、HTML 标签、
  高亮语法、本地图片、空文档回退、文件大小计算
- **v0.3.2** — 修复单引号块引用转换、内联块引用破坏文本流、HTML span 清理
- **v0.3.1** — 更换思源 logo 图标；配置精简为 2 字段
- **v0.3.0** — 最小单位改为文档级索引（移除块级索引）
- **v0.2.0** — 中英双语配置、相对日期、字数统计、阅读时间、标签条
- **v0.1.0** — 初始版本：基础索引 + 增量同步 + 删除检测

## License / 许可证

[MIT](LICENSE) © 2026 WorkBuddy User
