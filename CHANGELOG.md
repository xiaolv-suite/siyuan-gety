# Changelog

All notable changes to this project are documented in this file.

## [0.5.3] - 2026-11-18

### Fixed

- **沙箱拒网提示从未生效** — `describeKernelError()` 原只匹配
  `permission denied` / `EPERM` / `getaddrinfo`，但 Deno 沙箱实际抛出的是
  `Requires net access to "localhost:6806", run again with the --allow-net flag`，
  上述关键词一个都不含。用户在 `permissions.net` 未覆盖其思源地址时，只会看到
  笼统的「无法连接思源内核」，无法定位到「授权」这一真正原因。现已补齐真实文案
  的匹配，并新增针对该原文的回归测试锁定行为。

## [0.5.2] - 2026-11-18

对齐 Gety 官方连接器规范
（[build-a-connector](https://docs.gety.ai/zh-Hans/build-a-connector) 与
[connector reference](https://docs.gety.ai/connector-reference)），以便登记进
精选连接器 → 社区列表。

### Added

- **沙箱权限声明 (`permissions`)** — 声明 `net: [{ "config_field": "api_url" }]`
  动态授权，Gety 按用户填写的思源地址自动授予网络访问。此前未声明 `permissions`
  会以完全权限运行并触发红色高危警告；现在仅在授权范围内运行，
  且用户修改地址后授权自动更新、无需二次审阅。
- **`sync_version: 2`** — 0.5.1 重写了 Markdown 清洗管线（层级标签、嵌套超级块、
  代码围栏）与文档内容语义，老用户升级若复用旧 state 会保留旧内容。提升
  `sync_version` 让 Gety 在升级时清空本连接器文档并全量重同步。
- **npm 打包支持 (`package.json` + `scripts/sync-package.ts`)** — Gety 从 npm
  安装时只读取 `package.json` 的 `gety` 字段，**忽略包内的 `manifest.json`**。
  新增同步脚本把 `manifest.json` 单向投射为 `package.json` 的 `version`、
  `description`、`files` 与完整 `gety`；`deno task sync:check` 在 `verify` 与
  `prepublishOnly` 双重把关，杜绝两份元数据漂移。
- **图标纳入 npm 包** — 精选列表图标取自登记版本 tarball 中 manifest `icon`
  指向的文件。`icon.svg`（568 B）为列表图标，`icon.png`（512×512，5.4 KiB）
  作位图备用，均满足 24 KiB 与 2048 px 上限。
- **10 分钟活动窗口心跳** — Gety 会取消连续 10 分钟既无产出又无日志的 poll。
  新增低频 `console.info` 进度行（poll 开始、待索引统计、每 20 批的索引进度），
  满足长库首同步的心跳要求，同时避免高频日志刷屏。
- **可操作的错误提示** — 新增 `describeKernelError()`，把沙箱拒网
  （`permission denied` / `EPERM` / `getaddrinfo`）、令牌被拒、内核不可达三类
  故障分别翻译成带修复指引的中文提示，替换原先笼统的
  `Could not reach SiYuan kernel`。
- **配置字段说明** — `api_url` 增加 `placeholder` 与 `description`（说明该字段
  同时是网络授权依据）；`api_token` 补充获取路径。安装表单即可自助排错。

### Changed

- `min_gety_app_version` 由 `0.5.1` 提升至 `0.7.0`：沙箱与 `sync_version`
  均要求该版本；更低版本会拒绝安装，而不是静默以完全权限运行。
- `deno task verify` 顺序改为「先 build 再 sync:check」，使 CI 在干净检出时也能
  通过校验。`dist/main.js` 与 `dist/main.js.map` 一并入库，local 与 CI
  复现一致。

### Fixed

- `.gitignore` 原先忽略 `dist/main.js.map`，导致 `sync:check` 在 CI 干净检出时报
  `dist/main.js.map is missing`，Release 工作流连续失败。现在 sourcemap 入库，
  改为忽略 `release/` 产物目录。

## [0.5.1] - 2026-11-16

### Added

- **小驴生态配套定位 (XiaoLv Suite Companion)**: 迁移至小驴开源组织
  (`xiaolv-suite/siyuan-gety`)，作为思源笔记生态全域桌面检索官方配套连接器。
- **思源层级标签完整支持**: 原生支持多级/层级标签（如
  `#科技/AI#`、`#工作/待办/P1#`），从 Markdown 正文、YAML frontmatter 与 SQL
  `blocks.tag` 全链路统一提取，保留完整层级路径。
- **嵌套超级块迭代解析**: 引入循环内向展开引擎，完美转换嵌套超级块（如 row
  内嵌多列 col 布局）为多层引用块，彻底杜绝 `{{{col` 与孤立 `}}}` 语法残留。
- **CommonMark 多反引号与波浪线代码围栏**:
  扩展代码块保护管线，支持标准波浪线代码块（`~~~`）及 4+
  反引号外层围栏嵌套，防止 Markdown 教程与 AI Prompt
  模板内的子代码块与行内标记被破坏。
- **彻底的 HTML 包装标签清洗**: 将硬编码标签白名单升级为全量标签清洗器，深度过滤
  `<details>`、`<summary>`、`<ruby>`、`<rt>`、`<svg>`
  等内联或块级标签，仅保留安全跳转超链接 (`siyuan://`, `https://`, `http://`,
  `mailto:`)。
- **动态日记图标友好映射**: 识别思源日记原生动态图标路径
  (`api/icon/getDynamicIcon`) 并智能回退为 `📅`
  表情符与笔记本图标，补齐日记文档的搜索图标展示。
- **标题图标去重与智能 H1 清除**: 当文档标题已自带对应 Emoji（如
  `📅 小驴事项簿`）时自动避免重复拼接，并增强 `stripDuplicateH1`
  对带图标/带笔记本后缀标题的识别容错。
- **单次轻量全库文档 ID 查询**: 新增 `listAllDocIds()`，将原先按笔记本逐一发起的
  N 次 HTTP 串行轮询优化为单次 SQL
  查询，大幅降低删除检测的轮询网络开销与思源内核通信延迟。
- **大库边界防截断保护**: 全量 SQL 文档与元数据查询显式追加
  `LIMIT 999999`，防止单笔记本或工作区超出思源内核默认 5,000
  条上限时的静默截断。

## [0.5.0] - 2026-09-05

### Added

- Search metadata now includes the complete `source_path`, native document
  `name`, `alias`, `memo`, and optional block hierarchy IDs.
- Search previews show native document icons and a compact tag line; native
  SiYuan tags are merged with frontmatter and inline Markdown tags.
- SQL document queries include the native fields used by SiYuan's own search
  result renderer.

### Fixed

- Title truncation now counts Unicode code points, so emoji and other
  surrogate-pair characters are never split in search result titles.

## [0.4.2] - 2026-09-05

### Fixed

- Sync checkpoints now advance per notebook and per completed export batch,
  preventing interrupted polls from skipping documents.
- Delete-only polls persist their checkpoint, and failed exports stay pending
  for retry instead of indexing an error placeholder.
- Closed notebook metadata remains available for retrying documents.
- HTML cleanup removes executable blocks while preserving ordinary links; local
  media classification handles query parameters without rewriting remote URLs.

### Changed

- Verification is read-only with `fmt --check`; release packaging checks that
  the tag version matches `manifest.json`.

## [0.4.1] - 2026-08-31

### Fixed

- **Release zip was missing `dist/`** — the packaging step copied `dist/main.js`
  into the zip root, but the manifest `entry` points to `dist/main.js`, so the
  packaged connector could not be loaded. The zip now preserves the `dist/`
  directory structure.
- **Failed exports were never retried** — a document whose `exportMdContent`
  call failed was still recorded in the sync state, so the incremental query
  (keyed on `updated`) would skip it forever. Failed docs are now tracked in a
  `pendingRetry` state field and re-fetched by ID on the next poll.
- **Closing a notebook dropped its documents permanently** — deletion detection
  only looked at open notebooks, so closing (not deleting) a notebook marked
  every document as removed; reopening could not restore them because the
  incremental query had advanced past their timestamps. Live-ID detection now
  covers all notebooks including closed ones.

### Added

- **`listDocsByIds`** — new client method to re-fetch document metadata by ID,
  powering the failed-export retry.
- **`siyuan-client.test.ts`** — unit tests for `listDocsByIds` SQL construction,
  escaping, and empty-input handling (3 tests).

## [0.4.0] - 2026-08-31

### Added

- **Concurrent Markdown export** — up to 6 `exportMdContent` requests run in
  parallel during a poll, cutting first-time index time by roughly 3-5x
- **Incremental SQL query** (`listDocBlocksSince`) — steady-state polls fetch
  only documents whose `updated` timestamp advanced since the last sync, instead
  of scanning every notebook
- **Lightweight ID query** (`listDocIds`) — deletion detection now pulls only
  document IDs, avoiding a full metadata scan
- **Frontmatter tag extraction** — tags declared in the YAML frontmatter
  (`tags: [a, b]`) are now indexed; previously they were discarded with the
  frontmatter
- **Code-block protection** — fenced code, inline code, and math spans are
  shielded from all regex transforms so `==`, `(( ))`, HTML tags, and blank
  lines inside code are preserved verbatim
- **Unified block-ID pattern** — block references and links now match both
  legacy `YYYYMMDDHHmmss-hash` IDs and newer 20+ character pure-alphanumeric IDs
- **Local asset classification** — workspace files are marked by type: images 🖼,
  audio 🎵, video 🎬, other attachments 📎
- **Compact content header** — the blockquote header now shows only path and
  date by default, leaving more preview room for the document body
- **Buffered debug logging** — log lines accumulate in memory and flush in
  batches, eliminating per-line file IO

### Fixed

- **Code blocks were corrupted by cleaning passes** — `==` inside code became
  `**`, `((id))` was rewritten, HTML tags stripped, blank lines collapsed
- **Frontmatter tags were silently dropped** — `stripFrontmatter` removed the
  YAML block before tags could be read
- **`extractTags` matched code comments** — `#include`, Python `# comment`, and
  shell comments were indexed as tags
- **Block references with new-style IDs were left as raw markup**

### Changed

- Dynamic batch size (20–100) scales with the number of changed documents
- Content header uses compact mode (path + date only); word count, read time,
  and tags remain available via `metadata`
- `convertLocalImages` is now a thin alias for `convertLocalAssets`

### Removed

- Dead code: `buildBlockTitle`, `blockTypeEmoji`, `extractParentDocId`,
  `clampPositiveNumber`, `parseExcludeNotebooks`, `listContentBlocks` (leftovers
  from the removed block-level indexing mode)

### Tests

- Expanded from 37 to 56 unit tests, covering code-block protection, frontmatter
  tags, new ID formats, asset classification, compact headers, and end-to-end
  pipeline cleanliness

## [0.3.3] - 2026-08-31

### Fixed

- **No more duplicated context in search results** — the content header no
  longer repeats the notebook name and icon that the title already shows (this
  affected 100% of indexed documents)
- Breadcrumbs drop a leading segment equal to the notebook name and a trailing
  segment equal to the document title, since both appear in the title
- Bare block references `((id))` with no anchor text now convert to a link
  instead of printing the raw block ID
- Embed blocks with `col` layout, `id="..."` attributes, or empty bodies are now
  cleaned up; previously `{{{row id="..."}}}` leaked into previews
- `<div>` and `<br>` tags are stripped alongside `<span>`; `<br>` becomes a real
  line break instead of disappearing
- SiYuan highlight syntax `==text==` no longer renders as literal equals signs
- Workspace-local images (`![](assets/x.png)`) become a `🖼` text marker instead
  of rendering as broken images
- Empty documents no longer echo their own title back as the body
- `original_file_size` reports byte length instead of UTF-16 code units, which
  under-reported CJK-heavy documents by up to 3x

### Changed

- Reading time scores CJK (~400 chars/min) and Latin (~200 words/min) separately
  rather than applying a single rate to both
- Overlong titles truncate to 60 characters with an ellipsis so they cannot blow
  out the result row layout
- Thousands separators use a fixed locale for deterministic output
- **Debug logging is now opt-in** via `SIYUAN_CONNECTOR_DEBUG_LOG`

### Security

- Removed real company names and SiYuan block IDs that a previous revision had
  committed to `src/index.test.ts`
- Debug logging no longer writes to a hardcoded `C:\Users\<account>\...` path,
  which leaked a Windows account name and failed on other machines

## [0.3.2] - 2026-08-24

### Fixed

- Block references with single quotes (`((id 'text'))`) now convert correctly
  (previous regex only matched double quotes)
- Inline block references no longer break sentence flow — converted to
  `「text」[↗](siyuan://blocks/id)` instead of blockquote markup in mid-sentence
- Strip SiYuan-embedded inline HTML tags (`<span data-type="text">`) from
  content

### Changed

- Removed leftover `page_size` / `exclude_notebooks` config references after
  manifest simplification

## [0.3.1] - 2026-08-24

### Added

- SiYuan Note logo as connector icon (`icon.svg` / `icon.png`)

### Changed

- Config simplified to 2 fields: `api_url` and `api_token`
- Connector display name changed to "Siyuan Note"

## [0.3.0] - 2026-08-24

### Changed

- **Document-level indexing only** — removed `include_block_content` option; the
  minimum index unit is now the SiYuan document, not individual blocks
- Build size reduced from 20KB to 15.1KB

## [0.2.0] - 2026-08-24

### Added

- Bilingual (Chinese/English) config field labels and descriptions
- Relative date display (`刚刚` / `N小时前` / `N天前`)
- Word count and estimated reading time in content header
- Tag strip (`🏷️ #tag1 #tag2`) in content header
- `links` metadata field (outgoing siyuan:// block references)

### Changed

- Poll interval reduced from 3600s to 1800s (30 min)
- `api_token` now required at install time

## [0.1.0] - 2026-08-24

### Added

- Initial release: index SiYuan documents via local HTTP API
- Incremental sync via `knownDocs` state map
- Deletion detection for removed documents
- Content cleaning: YAML frontmatter, zero-width chars, duplicate H1
- Notebook icon/name in titles, path breadcrumbs in content header
- Block reference and embed block conversion to standard Markdown
