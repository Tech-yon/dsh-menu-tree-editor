# 多级菜单树编辑器（DSH 插件）

一个用于 DSH Web UI 的树状菜单/多级结构可视化编辑器。模块内可以直接填写文字，从任意模块继续添加子模块，拖动调整布局，并把画布保存到任意本地文件夹。

![menu-tree](https://img.shields.io/badge/DSH-plugin-2f6fed) ![version](https://img.shields.io/badge/version-1.0.0-16a34a)

## 功能

- 双击模块编辑多行文字；`Ctrl+Enter` 或点击空白保存，`Esc` 取消
- 模块右上角 `+` 或工具栏「添加子模块」，逐级向下扩展
- 拖动模块移动位置，子模块跟随整棵子树移动
- 一键「整理布局」，自动排成整齐的树
- 撤销/重做：`Ctrl+Z` / `Ctrl+Y`（也支持 `Ctrl+Shift+Z`）
- 复制/粘贴：`Ctrl+C` 复制所选模块及子树，`Ctrl+V` 粘贴到所选模块下
- 删除：`Delete`；编辑：`Enter` / `F2`
- 本地文件：选择任意本地文件夹，读取/保存 `.json` 菜单文件，支持新建文件、新建子文件夹、自动保存
- 导入/导出 JSON；导出 Markdown 大纲、Mermaid 结构图、PNG 图片、SVG 矢量图
- 滚轮缩放，拖动空白处平移画布
- 自动保存到浏览器本地缓存，刷新不丢

## 安装

DSH 的插件是「Bundle」包。把这个目录安装到你的 DSH profile：

1. 打开 DSH 的插件管理器（或在让 Agent 使用 Plugin Manager 的 `install_bundle`），选择本目录作为本地 bundle 安装。
2. 启用插件。
3. **重启 DSH**（Host 端的本地文件接口在启动时注册），然后刷新页面。

安装后左侧边栏会出现一个树形图标「菜单树」。

> 这个仓库本身是插件包，不是 npm 发布的公共包；安装时用**目录**作为 target。

## 使用

1. 点击侧边栏「菜单树」。
2. 在文件栏点「选择文件夹」，选择任意本地目录（例如 `D:\菜单文件`）。
3. 选中的目录会显示在文件栏；可以在里面切换已有 `.json`，或点「新建文件」「新建文件夹」。
4. 修改后约 1 秒自动写回当前文件；`Ctrl+S` 立即保存。

如果没有选择本地文件夹，插件默认使用 DSH 工作区下的 `menu-tree/` 目录作为回退位置。

## 文件格式

```json
{
  "app": "dsh-menu-tree-editor",
  "version": 1,
  "nodes": [
    {
      "id": "m...",
      "text": "用户中心",
      "parentId": null,
      "x": 0,
      "y": 0
    }
  ]
}
```

`parentId` 为空表示根模块；`x`/`y` 是画布坐标。导入时会自动修复无效的父级引用和环。

## 快捷键

| 操作 | 快捷键 |
|---|---|
| 编辑选中模块 | `Enter` / `F2` |
| 保存 | `Ctrl+S` |
| 撤销 | `Ctrl+Z` |
| 重做 | `Ctrl+Y` / `Ctrl+Shift+Z` |
| 复制 / 粘贴 | `Ctrl+C` / `Ctrl+V` |
| 删除选中模块 | `Delete` |
| 缩放 / 平移 | 滚轮 / 拖动空白处 |

## 结构

- `index.js` — Host 半：注册受 DSH 认证保护的本地文件 HTTP 接口，处理目录列表、读取、保存、新建文件夹
- `client.js` — Client 半：在 `sidebar.panellist` 注册入口图标，在 `main` 注册编辑器页面
- `cordis.patch.yml` — Bundle patch，插入 Host 行
- `locale/*.json` — 插件显示名称/描述
- `icon.svg` — 插件图标

## 开发

```bash
node --check index.js
node --check client.js
```

本地修改后需要让 DSH 重新加载插件（Host 端修改需重启 DSH，Client 端刷新页面）。安装目录与仓库目录是链接关系时，修改会直接反映到 profile。

## License

AGPL-3.0. See [LICENSE](LICENSE).

