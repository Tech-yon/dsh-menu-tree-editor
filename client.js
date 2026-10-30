window.__ModuleLoader__.load({
  id: '@local/dsh-menu-tree-editor',
  factory(require) {
    const React = require('react');
    const h = React.createElement;
    const { useEffect, useMemo, useRef, useState } = React;

    const NS = 'menu-tree-editor';
    const NODE_W = 224;
    const NODE_H = 84;
    const H_GAP = 32;
    const V_GAP = 82;
    const MAX_HISTORY = 80;
    const DOC_KEY = 'dsh:menu-tree-editor:doc:v1';
    const WORKSPACE_KEY = 'dsh:menu-tree-editor:workspace:v1';
    const WORKSPACE_CHANNEL = '/menu-tree-editor';
    const NOTES_KEY = 'dsh:menu-tree-editor:notes:v1';
    const APP_VIEW_KEY = 'dsh:menu-tree-editor:app-view:v1';
    const NOTE_UNDO_LIMIT = 20;
    let clipboardStore = null;

    /* ------------------------------------------------------------------ */
    /* Localized copy                                                      */
    /* ------------------------------------------------------------------ */

    const STRINGS = {
      zh: {
        panelLabel: '记事',
        title: '多级菜单树',
        subtitle: '双击模块填写文字，拖动调整位置，从任意模块继续向下新建子模块。',
        newRoot: '新建根模块',
        newRootName: '新模块',
        newChild: '新子模块',
        addChild: '添加子模块',
        deleteNode: '删除模块',
        tidy: '整理布局',
        undo: '撤销',
        redo: '重做',
        copy: '复制',
        paste: '粘贴',
        importDoc: '导入',
        exportDoc: '导出',
        zoomIn: '放大',
        zoomOut: '缩小',
        fit: '适应画布',
        autosaved: '已自动保存',
        moduleCount: '个模块',
        workspace: '工作区',
        localFolder: '本地文件夹',
        chooseFolder: '选择文件夹',
        useWorkspace: '使用工作区文件夹',
        folderAdopted: '已切换到本地文件夹',
        rootDialogTitle: '选择本地文件夹',
        rootDialogHint: '选择任意本地文件夹，插件会读取并保存其中的 .json 菜单文件。',
        folderPathPlaceholder: '例如：D:\\菜单文件',
        invalidRoot: '请选择或输入一个存在的本地文件夹路径',
        folderPickFailed: '无法打开系统文件夹选择器，请直接输入文件夹路径',
        folderLabel: '文件夹',
        fileLabel: '文件',
        rootFolder: '根目录',
        newFile: '新建文件',
        newFolder: '新建文件夹',
        saveFile: '保存',
        refreshFiles: '刷新',
        savedToWorkspace: '已保存',
        saving: '保存中…',
        saveFailed: '保存失败',
        localOnly: '仅浏览器保存',
        fileSaved: '已保存到工作区',
        fileCreated: '已创建工作区文件',
        folderCreated: '已创建工作区文件夹',
        filesRefreshed: '文件列表已刷新',
        fileNotSelected: '请先选择或新建一个文件',
        fileLoadFailed: '读取工作区文件失败',
        workspaceUnavailable: '无法访问工作区文件夹，当前仅保存在浏览器。重启 DSH 后再试。',
        noFiles: '当前文件夹还没有文件',
        createFileTitle: '新建文件',
        createFolderTitle: '新建文件夹',
        createFileHint: '文件会保存在工作区的 menu-tree 文件夹中。',
        createFolderHint: '文件夹会创建在工作区的 menu-tree 目录下。',
        fileNamePlaceholder: '例如：主菜单',
        folderNamePlaceholder: '例如：产品A',
        create: '创建',
        cancel: '取消',
        invalidName: '名称不能包含 \\ / : * ? " < > |，也不能以点或空格结尾',
        nameTaken: '名称已存在，请换一个',
        fileTooLarge: '文件过大，无法读取',
        untitledFile: '未命名',
        emptyTitle: '画布还是空的',
        emptyHint: '创建第一个模块，开始绘制你的多级菜单示意图。',
        emptyAction: '创建根模块',
        editPlaceholder: '双击填写模块文字',
        editHint: '按住拖动 · 双击编辑',
        childrenShort: '个子模块',
        addChildTitle: '添加子模块',
        deleteTitle: '删除模块',
        deleted: '已删除模块',
        copied: '已复制所选模块',
        pasted: '已粘贴到所选模块',
        clipboardEmpty: '剪贴板里还没有模块',
        selectFirst: '请先选择一个模块',
        imported: '已导入菜单数据',
        importFailed: '导入失败：JSON 中缺少有效的模块数据',
        exported: '已导出 JSON 文件',
        copyOutline: '复制大纲',
        copyOutlineHint: '复制 Markdown 大纲，可直接粘贴到其它对话',
        copiedOutline: '已复制 Markdown 大纲，可粘贴到任意对话',
        copyFailed: '复制失败，请改用“导出 Markdown”',
        exportMarkdown: '导出 Markdown',
        exportedMarkdown: '已导出 Markdown 文件',
        exportPng: '导出图片',
        exportPngHint: '把整棵树导出为高清 PNG 图片',
        exportedPng: '已导出 PNG 图片',
        exportSvg: '导出 SVG',
        exportSvgHint: '把整棵树导出为可缩放的 SVG 矢量图',
        exportedSvg: '已导出 SVG 矢量图',
        imageFailed: '图片导出失败，请重试',
        exportEmpty: '画布为空，没有可导出的内容',
        outlineHeading: '菜单结构',
        unnamed: '未命名模块',
        moved: '已移动模块',
        shortcuts: '按住模块拖动 · 双击编辑 · Ctrl+S 保存 · Ctrl+Z 撤销 · Ctrl+Y 重做 · Ctrl+C/V 复制粘贴',
        canvasHint: '滚轮缩放 · 拖动空白处平移画布',
        appTitle: '记事',
        appSubtitle: '菜单树与笔记本',
        advancedMenu: '高级菜单',
        tools: '工具',
        notebook: '笔记本',
        menuTree: '多级菜单树',
        nbAll: '全部记事',
        nbUngrouped: '未分组',
        nbGroups: '文件组',
        nbArchive: '归档',
        nbNewGroup: '新建文件组',
        nbNewNote: '新建记事',
        nbSearch: '搜索标题 / 内容 / 历史…',
        nbDragTip: '拖动卡片可分组',
        nbEmpty: '这里还没有记事',
        nbEmptyHint: '点击右上角「＋」开始记录',
        nbNoNote: '选择一篇记事，或新建一篇开始记录',
        nbNoNoteHint: '自动保存 · 更新历史 · 可关联本地文件',
        nbUntitled: '无标题记事',
        nbContent: '在这里记录内容…',
        nbSave: '保存',
        nbSaveAs: '另存为',
        nbLink: '关联文件',
        nbUnlink: '解除关联',
        nbLinked: '已关联',
        nbLinkedHint: 'Ctrl+S 同步写回',
        nbRelink: '重新关联',
        nbLinkLost: '上次关联，需重新授权',
        nbArchiveNote: '归档',
        nbRestore: '恢复',
        nbDelete: '删除',
        nbRename: '重命名',
        nbArchiveGroup: '归档文件组',
        nbDeleteGroup: '删除文件组',
        nbRestoreGroup: '恢复',
        nbPurgeGroup: '彻底删除',
        nbArchivedBanner: '归档记事 · 正文可直接编辑',
        nbArchivedTag: '已归档',
        nbCreated: '创建于',
        nbUpdated: '最近更新',
        nbUpdates: '次更新',
        nbHistory: '更新历史',
        nbUpdateNote: '本次更新说明（可选）',
        nbDirty: '未保存',
        nbSaved: '已保存',
        nbSaveFailed: '保存失败',
        nbUndoEmpty: '删除后按 Ctrl+Z 可恢复（焦点不在编辑区时）',
        nbUndo: '撤销',
        nbDeleted: '已删除',
        nbRestored: '已恢复',
        nbExport: '导出备份',
        nbImport: '导入',
        nbGroupPrompt: '文件组名称',
        nbGroupRename: '重命名文件组',
        nbGroupCreated: '已创建文件组',
        nbGroupArchived: '文件组已归档',
        nbGroupDeleted: '文件组已删除',
        nbGroupRestored: '文件组已恢复',
        nbMoved: '已移动',
        nbNoGroup: '未分组',
        nbGroupLabel: '文件组',
        nbImportFailed: '导入失败：文件格式不正确',
        nbImported: '导入完成',
        nbExported: '已导出备份',
        nbLinkUnsupported: '当前环境不支持直接关联本地文件，请使用导出/导入',
        nbLinkedToast: '已关联本地文件',
        nbLinkSaved: '已保存到记事本与本地文件',
        nbLinkSaveFail: '已保存到记事本（本地文件写入失败）',
        nbUnlinked: '已解除关联',
        nbConfirmArchiveGroup: '归档文件组及其记事？',
        nbConfirmDeleteGroup: '删除文件组？组内记事会移至未分组。',
        nbConfirmPurgeGroup: '彻底删除文件组及其记事？此操作不可恢复。',
        nbDropHint: '松开即可导入为记事',
        nbFileImported: '已导入文件',
        nbConfirm: '确定',
        nbCancel: '取消',
        nbNameEmpty: '名称不能为空',
        nbSearchPrefix: '搜索',
        nbBlank: '（空白记事）',
        nbHistoryCreated: '创建',
        nbHistoryFile: '文件',
        nbNoUndo: '没有可撤销的删除',
        nbNoteArchived: '记事已归档',
        nbNoteRestored: '记事已恢复',
      },
      en: {
        panelLabel: 'Notes',
        title: 'Multi-level menu tree',
        subtitle: 'Double-click a module to edit its text, drag to arrange it, and add children from any module.',
        newRoot: 'New root module',
        newRootName: 'New module',
        newChild: 'New child',
        addChild: 'Add child',
        deleteNode: 'Delete module',
        tidy: 'Tidy layout',
        undo: 'Undo',
        redo: 'Redo',
        copy: 'Copy',
        paste: 'Paste',
        importDoc: 'Import',
        exportDoc: 'Export',
        zoomIn: 'Zoom in',
        zoomOut: 'Zoom out',
        fit: 'Fit view',
        autosaved: 'Auto-saved',
        moduleCount: 'modules',
        workspace: 'Workspace',
        localFolder: 'Local folder',
        chooseFolder: 'Choose folder',
        useWorkspace: 'Use workspace folder',
        folderAdopted: 'Switched to the local folder',
        rootDialogTitle: 'Choose a local folder',
        rootDialogHint: 'Pick any local folder; the plugin reads and saves .json menu files there.',
        folderPathPlaceholder: 'e.g. D:\\menus',
        invalidRoot: 'Choose or enter an existing local folder path',
        folderPickFailed: 'The system folder picker is unavailable; enter the folder path instead',
        folderLabel: 'Folder',
        fileLabel: 'File',
        rootFolder: 'Root',
        newFile: 'New file',
        newFolder: 'New folder',
        saveFile: 'Save',
        refreshFiles: 'Refresh',
        savedToWorkspace: 'Saved',
        saving: 'Saving…',
        saveFailed: 'Save failed',
        localOnly: 'Browser only',
        fileSaved: 'Saved to workspace',
        fileCreated: 'Workspace file created',
        folderCreated: 'Workspace folder created',
        filesRefreshed: 'File list refreshed',
        fileNotSelected: 'Select or create a file first',
        fileLoadFailed: 'Could not read the workspace file',
        workspaceUnavailable: 'The workspace folder is unavailable; changes are kept in the browser only. Restart DSH and try again.',
        noFiles: 'No files in this folder yet',
        createFileTitle: 'New file',
        createFolderTitle: 'New folder',
        createFileHint: 'The file is stored in the workspace menu-tree folder.',
        createFolderHint: 'The folder is created under the workspace menu-tree directory.',
        fileNamePlaceholder: 'e.g. Main menu',
        folderNamePlaceholder: 'e.g. Product A',
        create: 'Create',
        cancel: 'Cancel',
        invalidName: 'Names cannot contain \\ / : * ? " < > | or end with a dot or space',
        nameTaken: 'That name already exists',
        fileTooLarge: 'The file is too large to read',
        untitledFile: 'Untitled',
        emptyTitle: 'The canvas is empty',
        emptyHint: 'Create the first module to start your multi-level menu diagram.',
        emptyAction: 'Create first module',
        editPlaceholder: 'Double-click to add text',
        editHint: 'Drag to move · double-click to edit',
        childrenShort: 'children',
        addChildTitle: 'Add child module',
        deleteTitle: 'Delete module',
        deleted: 'Module deleted',
        copied: 'Copied the selected module',
        pasted: 'Pasted under the selected module',
        clipboardEmpty: 'Nothing has been copied yet',
        selectFirst: 'Select a module first',
        imported: 'Menu data imported',
        importFailed: 'Import failed: no valid modules in this JSON file',
        exported: 'JSON file exported',
        copyOutline: 'Copy outline',
        copyOutlineHint: 'Copy a Markdown outline that can be pasted into another conversation',
        copiedOutline: 'Markdown outline copied — paste it into any conversation',
        copyFailed: 'Copy failed; use Export Markdown instead',
        exportMarkdown: 'Export Markdown',
        exportedMarkdown: 'Markdown file exported',
        exportPng: 'Export image',
        exportPngHint: 'Export the whole tree as a high-resolution PNG image',
        exportedPng: 'PNG image exported',
        exportSvg: 'Export SVG',
        exportSvgHint: 'Export the whole tree as a scalable SVG vector image',
        exportedSvg: 'SVG image exported',
        imageFailed: 'Image export failed; please try again',
        exportEmpty: 'The canvas is empty; there is nothing to export',
        outlineHeading: 'Menu structure',
        unnamed: 'Untitled module',
        moved: 'Module moved',
        shortcuts: 'Hold a module to drag · Double-click edit · Ctrl+S save · Ctrl+Z undo · Ctrl+Y redo · Ctrl+C/V copy & paste',
        canvasHint: 'Wheel to zoom · drag empty space to pan',
        appTitle: 'Notes',
        appSubtitle: 'Menu tree & notebook',
        advancedMenu: 'Advanced menu',
        tools: 'Tools',
        notebook: 'Notebook',
        menuTree: 'Menu tree',
        nbAll: 'All notes',
        nbUngrouped: 'Ungrouped',
        nbGroups: 'Groups',
        nbArchive: 'Archive',
        nbNewGroup: 'New group',
        nbNewNote: 'New note',
        nbSearch: 'Search title / content / history…',
        nbDragTip: 'Drag cards into groups',
        nbEmpty: 'No notes here yet',
        nbEmptyHint: 'Click + above to start writing',
        nbNoNote: 'Select a note, or create one to start writing',
        nbNoNoteHint: 'Auto-save · history · optional local file link',
        nbUntitled: 'Untitled note',
        nbContent: 'Write here…',
        nbSave: 'Save',
        nbSaveAs: 'Save as',
        nbLink: 'Link file',
        nbUnlink: 'Unlink',
        nbLinked: 'Linked',
        nbLinkedHint: 'Ctrl+S writes back',
        nbRelink: 'Relink',
        nbLinkLost: 'Previously linked — reauthorize',
        nbArchiveNote: 'Archive',
        nbRestore: 'Restore',
        nbDelete: 'Delete',
        nbRename: 'Rename',
        nbArchiveGroup: 'Archive group',
        nbDeleteGroup: 'Delete group',
        nbRestoreGroup: 'Restore',
        nbPurgeGroup: 'Delete permanently',
        nbArchivedBanner: 'Archived note · the body stays editable',
        nbArchivedTag: 'Archived',
        nbCreated: 'Created',
        nbUpdated: 'Updated',
        nbUpdates: 'updates',
        nbHistory: 'Update history',
        nbUpdateNote: 'Update note (optional)',
        nbDirty: 'Unsaved',
        nbSaved: 'Saved',
        nbSaveFailed: 'Save failed',
        nbUndoEmpty: 'Press Ctrl+Z outside the editor to restore a deletion',
        nbUndo: 'Undo',
        nbDeleted: 'Deleted',
        nbRestored: 'Restored',
        nbExport: 'Export backup',
        nbImport: 'Import',
        nbGroupPrompt: 'Group name',
        nbGroupRename: 'Rename group',
        nbGroupCreated: 'Group created',
        nbGroupArchived: 'Group archived',
        nbGroupDeleted: 'Group deleted',
        nbGroupRestored: 'Group restored',
        nbMoved: 'Moved',
        nbNoGroup: 'Ungrouped',
        nbGroupLabel: 'Group',
        nbImportFailed: 'Import failed: invalid backup file',
        nbImported: 'Import complete',
        nbExported: 'Backup exported',
        nbLinkUnsupported: 'This environment cannot link local files directly; use export and import instead',
        nbLinkedToast: 'Local file linked',
        nbLinkSaved: 'Saved to notebook and local file',
        nbLinkSaveFail: 'Saved to notebook (local file write failed)',
        nbUnlinked: 'Local file unlinked',
        nbConfirmArchiveGroup: 'Archive this group and its notes?',
        nbConfirmDeleteGroup: 'Delete this group? Its notes move to Ungrouped.',
        nbConfirmPurgeGroup: 'Permanently delete this group and its notes? This cannot be undone.',
        nbDropHint: 'Drop to import as notes',
        nbFileImported: 'File imported',
        nbConfirm: 'Confirm',
        nbCancel: 'Cancel',
        nbNameEmpty: 'Name cannot be empty',
        nbSearchPrefix: 'Search',
        nbBlank: '(Empty note)',
        nbHistoryCreated: 'Created',
        nbHistoryFile: 'File',
        nbNoUndo: 'Nothing to undo',
        nbNoteArchived: 'Note archived',
        nbNoteRestored: 'Note restored',
      },
    };

    /* ------------------------------------------------------------------ */
    /* Document model                                                      */
    /* ------------------------------------------------------------------ */

    const clamp = (value, min, max) => Math.min(max, Math.max(min, value));
    let sequence = 0;

    function uid() {
      sequence += 1;
      return 'm' + Date.now().toString(36) + sequence.toString(36) + Math.random().toString(36).slice(2, 5);
    }

    function cloneNodes(nodes) {
      return nodes.map((node) => ({ ...node }));
    }

    function findNode(nodes, id) {
      for (const node of nodes) if (node.id === id) return node;
      return null;
    }

    function groupChildren(nodes) {
      const map = new Map();
      for (const node of nodes) {
        const parent = node.parentId || null;
        if (!map.has(parent)) map.set(parent, []);
        map.get(parent).push(node);
      }
      return map;
    }

    function collectSubtree(nodes, rootId) {
      const ids = new Set();
      const root = findNode(nodes, rootId);
      if (!root) return ids;
      const children = groupChildren(nodes);
      const stack = [rootId];
      while (stack.length) {
        const id = stack.pop();
        if (ids.has(id)) continue;
        ids.add(id);
        for (const child of children.get(id) || []) stack.push(child.id);
      }
      return ids;
    }

    function depthMap(nodes) {
      const byId = new Map(nodes.map((node) => [node.id, node]));
      const depths = new Map();
      const resolve = (node, seen) => {
        if (!node) return 0;
        if (depths.has(node.id)) return depths.get(node.id);
        if (seen.has(node.id)) return 0;
        seen.add(node.id);
        const value = node.parentId && byId.has(node.parentId) ? resolve(byId.get(node.parentId), seen) + 1 : 0;
        depths.set(node.id, value);
        return value;
      };
      for (const node of nodes) resolve(node, new Set());
      return depths;
    }

    function tidyNodes(input) {
      const nodes = input.map((node) => ({
        id: node.id,
        text: node.text || '',
        parentId: node.parentId || null,
        x: Number.isFinite(node.x) ? node.x : 0,
        y: Number.isFinite(node.y) ? node.y : 0,
      }));
      const byId = new Map(nodes.map((node) => [node.id, node]));
      const children = new Map();
      for (const node of nodes) {
        if (node.parentId && !byId.has(node.parentId)) node.parentId = null;
        const parent = node.parentId || null;
        if (!children.has(parent)) children.set(parent, []);
        children.get(parent).push(node);
      }
      const widths = new Map();
      const measure = (id) => {
        if (widths.has(id)) return widths.get(id);
        const kids = children.get(id) || [];
        let width = NODE_W;
        if (kids.length) {
          const total = kids.reduce((sum, child) => sum + measure(child.id), 0) + H_GAP * (kids.length - 1);
          width = Math.max(NODE_W, total);
        }
        widths.set(id, width);
        return width;
      };
      const roots = children.get(null) || [];
      for (const root of roots) measure(root.id);
      const place = (id, left, depth) => {
        const node = byId.get(id);
        if (!node) return;
        const width = widths.get(id) || NODE_W;
        node.x = Math.round(left + (width - NODE_W) / 2);
        node.y = Math.round(depth * (NODE_H + V_GAP));
        let cursor = left;
        for (const child of children.get(id) || []) {
          place(child.id, cursor, depth + 1);
          cursor += (widths.get(child.id) || NODE_W) + H_GAP;
        }
      };
      let cursor = 0;
      for (const root of roots) {
        place(root.id, cursor, 0);
        cursor += (widths.get(root.id) || NODE_W) + H_GAP * 2;
      }
      return nodes;
    }

    function makeSample() {
      const root = uid();
      const user = uid();
      const content = uid();
      const system = uid();
      return tidyNodes([
        { id: root, text: '多级菜单', parentId: null },
        { id: user, text: '用户中心', parentId: root },
        { id: content, text: '内容管理', parentId: root },
        { id: system, text: '系统设置', parentId: root },
        { id: uid(), text: '个人资料', parentId: user },
        { id: uid(), text: '安全设置', parentId: user },
        { id: uid(), text: '文章列表', parentId: content },
        { id: uid(), text: '分类管理', parentId: content },
        { id: uid(), text: '权限管理', parentId: system },
        { id: uid(), text: '操作日志', parentId: system },
      ]);
    }

    function sanitizeNodes(input) {
      if (!Array.isArray(input)) return null;
      const nodes = [];
      const used = new Set();
      for (const raw of input) {
        if (!raw || typeof raw !== 'object') continue;
        const id = typeof raw.id === 'string' && raw.id && !used.has(raw.id) ? raw.id : uid();
        if (used.has(id)) continue;
        used.add(id);
        const text = typeof raw.text === 'string' ? raw.text : typeof raw.title === 'string' ? raw.title : '';
        nodes.push({
          id,
          text,
          parentId: typeof raw.parentId === 'string' && raw.parentId ? raw.parentId : null,
          x: Number.isFinite(raw.x) ? Number(raw.x) : 0,
          y: Number.isFinite(raw.y) ? Number(raw.y) : 0,
        });
      }
      if (!nodes.length) return null;
      const byId = new Map(nodes.map((node) => [node.id, node]));
      for (const node of nodes) {
        if (node.parentId && !byId.has(node.parentId)) node.parentId = null;
      }
      for (const node of nodes) {
        const seen = new Set([node.id]);
        let parentId = node.parentId;
        while (parentId) {
          if (seen.has(parentId)) {
            node.parentId = null;
            break;
          }
          seen.add(parentId);
          parentId = byId.get(parentId) ? byId.get(parentId).parentId : null;
        }
      }
      return nodes;
    }

    function loadDoc() {
      try {
        const raw = localStorage.getItem(DOC_KEY);
        if (raw) {
          const parsed = JSON.parse(raw);
          const nodes = sanitizeNodes(parsed && Array.isArray(parsed.nodes) ? parsed.nodes : parsed);
          if (nodes && nodes.length) return nodes;
        }
      } catch {
        /* A fresh sample is the safe fallback. */
      }
      return makeSample();
    }

    function stamp() {
      const now = new Date();
      const pad = (value) => String(value).padStart(2, '0');
      return `${now.getFullYear()}${pad(now.getMonth() + 1)}${pad(now.getDate())}-${pad(now.getHours())}${pad(now.getMinutes())}`;
    }

    function loadWorkspacePref() {
      try {
        const raw = localStorage.getItem(WORKSPACE_KEY);
        const value = raw ? JSON.parse(raw) : null;
        return value && typeof value === 'object' ? value : null;
      } catch {
        return null;
      }
    }

    function saveWorkspacePref(root, folder, file) {
      try {
        localStorage.setItem(
          WORKSPACE_KEY,
          JSON.stringify({ root: root || '', folder: folder || '', file: file || null }),
        );
      } catch {
        /* storage may be unavailable */
      }
    }

    function nextName(items, prefix, suffix) {
      const used = new Set(
        (items || []).map((item) => (typeof item === 'string' ? item : item && item.name)).filter(Boolean),
      );
      for (let index = 1; index < 1000; index += 1) {
        const name = prefix + index + suffix;
        if (!used.has(name)) return name;
      }
      return prefix + Date.now() + suffix;
    }

    function parseStoredDoc(doc) {
      const raw = doc && typeof doc === 'object' && Array.isArray(doc.nodes) ? doc.nodes : doc;
      if (!Array.isArray(raw)) return null;
      if (raw.length === 0) return [];
      return sanitizeNodes(raw);
    }

    function createWorkspaceRpc(connection) {
      if (!connection || !connection.rpc || typeof connection.rpc.call !== 'function') return null;
      return async (endpoint, payload) => {
        try {
          const result = await connection.rpc.call(
            WORKSPACE_CHANNEL,
            endpoint,
            payload === undefined ? null : payload,
          );
          if (!result || result.ok !== true) {
            return {
              ok: false,
              error: (result && result.error) || { code: 'rpc-error', message: 'Workspace request failed' },
            };
          }
          return { ok: true, value: result.value };
        } catch (error) {
          return {
            ok: false,
            error: { code: 'rpc-error', message: error && error.message ? error.message : String(error) },
          };
        }
      };
    }

    function workspaceErrorText(error, t) {
      const code = error && error.code;
      if (code === 'exists') return t('nameTaken');
      if (code === 'bad-name') return t('invalidName');
      if (code === 'bad-root') return t('invalidRoot');
      if (code === 'too-large') return t('fileTooLarge');
      return (error && error.message) || t('fileLoadFailed');
    }

    /* ------------------------------------------------------------------ */
    /* Notebook model                                                      */
    /* ------------------------------------------------------------------ */

    function notebookUid() {
      return 'n' + Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
    }

    function seedNotebook() {
      const now = Date.now();
      const groupId = notebookUid();
      return {
        version: 1,
        meta: { seeded: true },
        groups: [{ id: groupId, name: '使用说明', createdAt: now, archived: false }],
        notes: [
          {
            id: notebookUid(),
            groupId,
            title: '欢迎使用记事',
            content:
              '欢迎使用记事 👋\n\n' +
              '【视图】\n' +
              '· 左侧切换全部记事、未分组、文件组和归档\n' +
              '· 中间搜索标题、正文和更新历史；拖动卡片到左侧文件组即可归类\n\n' +
              '【编辑】\n' +
              '· 右侧编辑标题和正文，停止输入约 1.5 秒自动保存\n' +
              '· 保存前可填写「本次更新说明」，底部可展开更新历史\n' +
              '· Ctrl+S 立即保存\n\n' +
              '【撤销删除】\n' +
              '· 删除记事会弹出带「撤销」的提示\n' +
              '· 焦点不在正文或标题时，按 Ctrl+Z 可恢复最近删除的记事\n\n' +
              '【本地文件】\n' +
              '· 「关联文件」可以绑定本地 txt/md 等文本文件，Ctrl+S 同步写回\n' +
              '· 「另存为」把当前记事写成新的本地文件\n' +
              '· 也可以把本地文本文件直接拖进列表导入\n\n' +
              '【备份】\n' +
              '· 「导出备份」保存全部记事和文件组，随时可以「导入」恢复',
            createdAt: now,
            updatedAt: now,
            archived: false,
            linkedFileName: null,
            history: [{ t: now, text: '', created: true }],
          },
        ],
      };
    }

    function loadNotebook() {
      try {
        const raw = localStorage.getItem(NOTES_KEY);
        if (raw) {
          const parsed = JSON.parse(raw);
          if (parsed && Array.isArray(parsed.notes) && Array.isArray(parsed.groups)) {
            parsed.meta = parsed.meta && typeof parsed.meta === 'object' ? parsed.meta : { seeded: true };
            parsed.notes = parsed.notes.filter((note) => note && typeof note === 'object').map((note) => ({
              ...note,
              title: typeof note.title === 'string' ? note.title : '',
              content: typeof note.content === 'string' ? note.content : '',
              history: Array.isArray(note.history) ? note.history : [],
              archived: Boolean(note.archived),
              linkedFileName: typeof note.linkedFileName === 'string' ? note.linkedFileName : null,
            }));
            parsed.groups = parsed.groups
              .filter((group) => group && typeof group === 'object' && group.id)
              .map((group) => ({
                ...group,
                name: typeof group.name === 'string' ? group.name : '未命名',
                archived: Boolean(group.archived),
              }));
            return parsed;
          }
        }
      } catch {
        /* fall through to a fresh notebook */
      }
      const seeded = seedNotebook();
      try {
        localStorage.setItem(NOTES_KEY, JSON.stringify(seeded));
      } catch {
        /* storage may be unavailable */
      }
      return seeded;
    }

    function persistNotebook(db) {
      try {
        localStorage.setItem(NOTES_KEY, JSON.stringify(db));
        return true;
      } catch {
        return false;
      }
    }

    function noteDateFull(timestamp) {
      const date = new Date(timestamp);
      const pad = (value) => String(value).padStart(2, '0');
      return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}`;
    }

    function noteDateShort(timestamp) {
      const date = new Date(timestamp);
      const now = new Date();
      const pad = (value) => String(value).padStart(2, '0');
      if (date.getFullYear() === now.getFullYear()) {
        return `${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}`;
      }
      return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
    }

    function noteText(value) {
      return String(value == null ? '' : value);
    }

    function supportsNotebookFiles() {
      return (
        typeof window !== 'undefined' &&
        typeof window.showOpenFilePicker === 'function' &&
        typeof window.showSaveFilePicker === 'function'
      );
    }

    function notebookFileName(title) {
      const safe = String(title || '未命名').replace(/[\\/:*?"<>|]/g, '_').slice(0, 60);
      return safe + '.txt';
    }

    function cloneNote(note) {
      return JSON.parse(JSON.stringify(note));
    }

    function buildMarkdown(nodes, t) {
      if (!nodes.length) return '# ' + t('outlineHeading') + '\n\n(' + t('unnamed') + ')\n';
      const children = groupChildren(nodes);
      const roots = children.get(null) || [];
      const ordered = [];
      const outline = [];
      const walk = (node, depth) => {
        ordered.push(node);
        const label = String(node.text || t('unnamed')).replace(/\s*\n+\s*/g, ' / ');
        outline.push('  '.repeat(depth) + '- ' + label);
        for (const child of children.get(node.id) || []) walk(child, depth + 1);
      };
      for (const root of roots) walk(root, 0);
      const ids = new Map(ordered.map((node, index) => [node.id, 'n' + (index + 1)]));
      const escape = (value) =>
        String(value || t('unnamed'))
          .replace(/&/g, '&amp;')
          .replace(/</g, '&lt;')
          .replace(/>/g, '&gt;')
          .replace(/"/g, "'")
          .replace(/\s*\n+\s*/g, '<br/>');
      const graph = ['```mermaid', 'graph TD'];
      for (const node of ordered) graph.push('  ' + ids.get(node.id) + '["' + escape(node.text) + '"]');
      for (const node of ordered) {
        if (node.parentId && ids.has(node.parentId)) {
          graph.push('  ' + ids.get(node.parentId) + ' --> ' + ids.get(node.id));
        }
      }
      graph.push('```');
      return (
        '# ' +
        t('outlineHeading') +
        '\n\n' +
        outline.join('\n') +
        '\n\n' +
        graph.join('\n') +
        '\n'
      );
    }

    /* ------------------------------------------------------------------ */
    /* Diagram image export                                                */
    /* ------------------------------------------------------------------ */

    const IMAGE_NODE_WIDTH = 224;
    const IMAGE_FONT_SIZE = 13;
    const IMAGE_LINE_HEIGHT = 20;
    const IMAGE_TEXT_WIDTH = IMAGE_NODE_WIDTH - 24;

    function escapeXml(value) {
      return String(value)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;');
    }

    function glyphUnits(ch) {
      const code = ch.codePointAt(0);
      if (code >= 0x2e80) return 1;
      if (ch === ' ') return 0.32;
      if (/[iIl1.,:;'!|]/.test(ch)) return 0.32;
      if (/[mwMW]/.test(ch)) return 0.9;
      return 0.56;
    }

    function wrapForImage(raw, t) {
      let lines = [];
      const paragraphs = String(raw || t('unnamed')).split(/\r?\n/);
      for (const paragraph of paragraphs) {
        if (!paragraph) {
          lines.push('');
          continue;
        }
        let line = '';
        let width = 0;
        for (const ch of Array.from(paragraph)) {
          const unit = glyphUnits(ch) * IMAGE_FONT_SIZE;
          if (line && width + unit > IMAGE_TEXT_WIDTH) {
            lines.push(line);
            line = ch;
            width = unit;
          } else {
            line += ch;
            width += unit;
          }
        }
        lines.push(line);
      }
      if (lines.length > 11) {
        lines = lines.slice(0, 11);
        lines[10] = lines[10] + '…';
      }
      return lines.length ? lines : [''];
    }

    function buildTreeSvg(nodes, t) {
      if (!nodes.length) return null;
      const info = new Map();
      const depths = depthMap(nodes);
      let minX = Infinity;
      let minY = Infinity;
      let maxX = -Infinity;
      let maxY = -Infinity;
      for (const node of nodes) {
        const lines = wrapForImage(node.text, t);
        const height = 71 + lines.length * IMAGE_LINE_HEIGHT;
        info.set(node.id, { lines, height });
        minX = Math.min(minX, node.x);
        minY = Math.min(minY, node.y);
        maxX = Math.max(maxX, node.x + IMAGE_NODE_WIDTH);
        maxY = Math.max(maxY, node.y + height);
      }
      const pad = 56;
      const titleHeight = 46;
      const originX = minX - pad;
      const originY = minY - pad - titleHeight;
      const width = maxX - minX + pad * 2;
      const height = maxY - minY + pad * 2 + titleHeight;
      const accents = ['#2563eb', '#16a34a', '#d97706', '#94a3b8'];
      const parts = [];
      parts.push(
        `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="${originX} ${originY} ${width} ${height}" font-family="Inter, 'Segoe UI', 'Microsoft YaHei', system-ui, sans-serif">`,
      );
      parts.push(`<rect x="${originX}" y="${originY}" width="${width}" height="${height}" fill="#ffffff"/>`);
      parts.push(
        `<defs><pattern id="mte-grid" width="22" height="22" patternUnits="userSpaceOnUse"><circle cx="1" cy="1" r="1" fill="#e8edf5"/></pattern></defs>`,
      );
      parts.push(`<rect x="${originX}" y="${originY}" width="${width}" height="${height}" fill="url(#mte-grid)"/>`);
      parts.push(
        `<text x="${originX + pad}" y="${originY + pad + 8}" font-size="18" font-weight="600" fill="#0f172a">${escapeXml(t('title'))}</text>`,
      );
      parts.push(
        `<text x="${originX + pad}" y="${originY + pad + 27}" font-size="11.5" fill="#64748b">${nodes.length} ${escapeXml(t('moduleCount'))} · ${new Date().toISOString().slice(0, 10)}</text>`,
      );
      const byId = new Map(nodes.map((node) => [node.id, node]));
      const childrenMap = groupChildren(nodes);
      for (const node of nodes) {
        const parent = node.parentId ? byId.get(node.parentId) : null;
        if (!parent) continue;
        const parentInfo = info.get(parent.id);
        const sx = parent.x + IMAGE_NODE_WIDTH / 2;
        const sy = parent.y + parentInfo.height;
        const ex = node.x + IMAGE_NODE_WIDTH / 2;
        const ey = node.y - 2;
        const curve = Math.max(22, (ey - sy) * 0.55);
        parts.push(
          `<path d="M ${sx} ${sy} C ${sx} ${sy + curve}, ${ex} ${ey - curve}, ${ex} ${ey}" fill="none" stroke="#cbd5e1" stroke-width="1.5" stroke-linecap="round"/>`,
        );
        parts.push(`<circle cx="${ex}" cy="${ey}" r="2.6" fill="#cbd5e1"/>`);
      }
      for (const node of nodes) {
        const item = info.get(node.id);
        const depth = depths.get(node.id) || 0;
        const childCount = (childrenMap.get(node.id) || []).length;
        const border = depth === 0 ? '#9db9f0' : '#dbe2ec';
        const textY = 47;
        const lineSpans = item.lines
          .map(
            (line, index) =>
              `<tspan x="12" dy="${index === 0 ? 0 : IMAGE_LINE_HEIGHT}">${escapeXml(line || '\u200b')}</tspan>`,
          )
          .join('');
        parts.push(`<g transform="translate(${node.x} ${node.y})">`);
        parts.push(
          `<rect width="${IMAGE_NODE_WIDTH}" height="${item.height}" rx="12" fill="#ffffff" stroke="${border}" stroke-width="1"/>`,
        );
        parts.push(`<circle cx="18" cy="20" r="4" fill="${accents[depth % 4]}"/>`);
        parts.push(
          `<text x="28" y="24" font-size="9.5" font-weight="600" letter-spacing="0.8" fill="#64748b">L${depth + 1}</text>`,
        );
        parts.push(
          `<text x="12" y="${textY}" font-size="${IMAGE_FONT_SIZE}" fill="#0f172a">${lineSpans}</text>`,
        );
        parts.push(
          `<line x1="12" y1="${item.height - 27}" x2="${IMAGE_NODE_WIDTH - 12}" y2="${item.height - 27}" stroke="#e6ebf2" stroke-dasharray="3 3"/>`,
        );
        parts.push(
          `<text x="12" y="${item.height - 10}" font-size="10.5" fill="#64748b">${childCount} ${escapeXml(t('childrenShort'))}</text>`,
        );
        parts.push('</g>');
      }
      parts.push('</svg>');
      return { svg: parts.join('\n'), width, height };
    }

    function downloadBlob(blob, filename) {
      const url = URL.createObjectURL(blob);
      const anchor = document.createElement('a');
      anchor.href = url;
      anchor.download = filename;
      anchor.click();
      setTimeout(() => URL.revokeObjectURL(url), 1500);
    }

    /* ------------------------------------------------------------------ */
    /* Small visual helpers                                                */
    /* ------------------------------------------------------------------ */

    const ICON_PATHS = {
      plus: 'M12 5v14M5 12h14',
      branch: 'M6 4v9a3 3 0 0 0 3 3h9M15 13l3 3-3 3',
      trash: 'M4 7h16M9 7V5h6v2M6 7l1 13h10l1-13M10 11v5M14 11v5',
      layout: 'M4 5h6v5H4zM14 5h6v5h-6zM4 14h6v5H4zM14 14h6v5h-6z',
      undo: 'M9 7H5V3M5 7h9a6 6 0 0 1 0 12H9',
      redo: 'M15 7h4V3M19 7h-9a6 6 0 0 0 0 12h5',
      copy: 'M9 9h10v10H9zM5 15V5h10',
      paste: 'M9 5h6v3H9zM8 5H6v15h12V5h-2M9 12h6M9 16h4',
      upload: 'M12 16V4M7 9l5-5 5 5M4 16v4h16v-4',
      download: 'M12 4v12M7 11l5 5 5-5M4 16v4h16v-4',
      zoomIn: 'M11 4a7 7 0 1 1 0 14 7 7 0 0 1 0-14zM16 16l4 4M11 8v6M8 11h6',
      zoomOut: 'M11 4a7 7 0 1 1 0 14 7 7 0 0 1 0-14zM16 16l4 4M8 11h6',
      fit: 'M4 9V4h5M15 4h5v5M20 15v5h-5M9 20H4v-5',
      text: 'M4 6h16M4 12h11M4 18h14',
      doc: 'M6 3h8l4 4v14H6zM14 3v5h5M9 12h6M9 16h5',
      image: 'M4 5h16v14H4zM8.5 10a1.5 1.5 0 1 0 0-.01M4 16l5-5 4 4 3-3 4 4',
      vector: 'M5 5h5v5H5zM14 14h5v5h-5zM10 7.5h4a2.5 2.5 0 0 1 2.5 2.5v4',
      folder: 'M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z',
      home: 'M4 11l8-7 8 7v9h-5v-6H9v6H4z',
      folderPlus: 'M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2zM12 11v6M9 14h6',
      filePlus: 'M6 3h8l4 4v14H6zM14 3v5h5M12 12v6M9 15h6',
      save: 'M5 4h12l2 2v14H5zM8 4v6h8V4M8 20v-6h8v6',
      refresh: 'M4 12a8 8 0 0 1 14-5M20 4v5h-5M20 12a8 8 0 0 1-14 5M4 20v-5h5',
      notebook: 'M5 4h11a2 2 0 0 1 2 2v14H7a2 2 0 0 1-2-2zM5 4v16M9 8h6M9 12h5',
      menu: 'M4 7h16M4 12h16M4 17h16',
      chevron: 'M8 10l4 4 4-4',
      check: 'M5 12l4 4 9-9',
      search: 'M11 4a7 7 0 1 1 0 14 7 7 0 0 1 0-14zM16 16l4 4',
      note: 'M6 3h9l5 5v13H6zM15 3v5h5M9 13h7M9 17h5',
      link: 'M9 15l6-6M8 11l-2 2a3 3 0 0 0 4 4l2-2M16 13l2-2a3 3 0 0 0-4-4l-2 2',
      close: 'M6 6l12 12M18 6L6 18',
      archive: 'M4 7h16v4H4zM6 11v9h12v-9M9 15h6',
    };

    function Glyph({ name }) {
      return h(
        'svg',
        { viewBox: '0 0 24 24', width: 16, height: 16, fill: 'none', 'aria-hidden': true },
        h('path', {
          d: ICON_PATHS[name] || ICON_PATHS.plus,
          stroke: 'currentColor',
          strokeWidth: 1.7,
          strokeLinecap: 'round',
          strokeLinejoin: 'round',
        }),
      );
    }

    function Btn({ label, icon, onClick, disabled, kind, danger, iconOnly, title }) {
      return h(
        'button',
        {
          type: 'button',
          className:
            'mte-btn' +
            (kind ? ' mte-btn-' + kind : '') +
            (danger ? ' is-danger' : '') +
            (iconOnly ? ' mte-btn-icon' : ''),
          onClick,
          disabled: Boolean(disabled),
          title: title || label,
          'aria-label': label,
        },
        icon ? h(Glyph, { name: icon }) : null,
        iconOnly ? null : h('span', null, label),
      );
    }

    function PanelIcon({ size }) {
      const edge = size || 20;
      return h(
        'svg',
        {
          width: edge,
          height: edge,
          viewBox: '0 0 24 24',
          fill: 'none',
          'aria-hidden': true,
          style: { display: 'block' },
        },
        h('path', {
          d: 'M6 4h10a2 2 0 0 1 2 2v14H8a2 2 0 0 1-2-2zM6 4v16M10 8h5M10 12h4',
          stroke: 'currentColor',
          strokeWidth: 1.6,
          strokeLinecap: 'round',
          strokeLinejoin: 'round',
        }),
        h('path', {
          d: 'M15 4v5l-1.5-1L12 9V4',
          stroke: 'currentColor',
          strokeWidth: 1.6,
          strokeLinejoin: 'round',
        }),
      );
    }

    /* ------------------------------------------------------------------ */
    /* Inline text editor                                                  */
    /* ------------------------------------------------------------------ */

    function NodeEditor({ value, onChange, onCommit, onCancel }) {
      const ref = useRef(null);
      const cancelledRef = useRef(false);

      useEffect(() => {
        const el = ref.current;
        if (!el) return;
        el.focus();
        el.select();
      }, []);

      useEffect(() => {
        const el = ref.current;
        if (!el) return;
        el.style.height = 'auto';
        el.style.height = Math.max(54, el.scrollHeight) + 'px';
      }, [value]);

      return h('textarea', {
        ref,
        className: 'mte-node-editor',
        value,
        spellCheck: false,
        onChange: (event) => onChange(event.target.value),
        onDoubleClick: (event) => event.stopPropagation(),
        onBlur: () => {
          if (cancelledRef.current) {
            cancelledRef.current = false;
            return;
          }
          onCommit(value);
        },
        onKeyDown: (event) => {
          event.stopPropagation();
          if (event.key === 'Escape') {
            event.preventDefault();
            cancelledRef.current = true;
            onCancel();
          } else if (event.key === 'Enter' && (event.ctrlKey || event.metaKey)) {
            event.preventDefault();
            event.currentTarget.blur();
          }
        },
      });
    }

    /* ------------------------------------------------------------------ */
    /* Module card                                                         */
    /* ------------------------------------------------------------------ */

    function NodeCard(props) {
      const { node, depth, selected, dragging, editing, draft, childCount, t, setEl } = props;
      const className =
        'mte-node' + (selected ? ' is-selected' : '') + (dragging ? ' is-dragging' : '');

      return h(
        'div',
        {
          ref: (el) => setEl(node.id, el),
          className,
          'data-node-id': node.id,
          'data-depth': depth,
          style: {
            left: node.x,
            top: node.y,
            zIndex: dragging ? 4 : selected ? 3 : 1,
          },
          onPointerDown: (event) => props.onPointerDown(event, node),
          onPointerMove: props.onPointerMove,
          onPointerUp: props.onPointerUp,
          onPointerCancel: props.onPointerUp,
          onDoubleClick: () => props.onEdit(node),
        },
        h(
          'div',
          { className: 'mte-node-head' },
          h('span', { className: 'mte-node-dot mte-tone-' + (depth % 4) }),
          h('span', { className: 'mte-node-level' }, 'L' + (depth + 1)),
          h(
            'div',
            { className: 'mte-node-actions' },
            h(
              'button',
              {
                type: 'button',
                className: 'mte-node-btn',
                title: t('addChildTitle'),
                'aria-label': t('addChildTitle'),
                onPointerDown: (event) => event.stopPropagation(),
                onDoubleClick: (event) => event.stopPropagation(),
                onClick: (event) => {
                  event.stopPropagation();
                  props.onAdd(node.id);
                },
              },
              h(Glyph, { name: 'plus' }),
            ),
            h(
              'button',
              {
                type: 'button',
                className: 'mte-node-btn is-danger',
                title: t('deleteTitle'),
                'aria-label': t('deleteTitle'),
                onPointerDown: (event) => event.stopPropagation(),
                onDoubleClick: (event) => event.stopPropagation(),
                onClick: (event) => {
                  event.stopPropagation();
                  props.onDelete(node.id);
                },
              },
              h(Glyph, { name: 'trash' }),
            ),
          ),
        ),
        editing
          ? h(NodeEditor, {
              value: draft,
              onChange: props.onDraft,
              onCommit: (text) => props.onCommit(node.id, text),
              onCancel: props.onCancel,
            })
          : h(
              'div',
              { className: 'mte-node-text' + (node.text ? '' : ' is-placeholder') },
              node.text || t('editPlaceholder'),
            ),
        !editing
          ? h(
              'div',
              { className: 'mte-node-foot' },
              h('span', null, childCount + ' ' + t('childrenShort')),
              h('span', { className: 'mte-node-tip' }, t('editHint')),
            )
          : null,
      );
    }

    /* ------------------------------------------------------------------ */
    /* Editor page                                                         */
    /* ------------------------------------------------------------------ */

    function NotebookPage({ t }) {
      const [db, setDb] = useState(() => loadNotebook());
      const [view, setView] = useState('all');
      const [noteId, setNoteId] = useState(null);
      const [title, setTitle] = useState('');
      const [content, setContent] = useState('');
      const [updateNote, setUpdateNote] = useState('');
      const [dirty, setDirty] = useState(false);
      const [historyOpen, setHistoryOpen] = useState(false);
      const [dialog, setDialog] = useState(null);
      const [notice, setNotice] = useState(null);
      const [draggingId, setDraggingId] = useState(null);
      const [dropTarget, setDropTarget] = useState(null);
      const [fileDrag, setFileDrag] = useState(false);
      const [search, setSearch] = useState('');

      const dbRef = useRef(db);
      dbRef.current = db;
      const titleRef = useRef(null);
      const contentRef = useRef(null);
      const importRef = useRef(null);
      const handlesRef = useRef(new Map());
      const undoRef = useRef([]);
      const latestRef = useRef(null);
      latestRef.current = { noteId, title, content, updateNote, dirty };

      function notify(text, tone, options) {
        const settings = options || {};
        setNotice({
          text,
          tone: tone || 'ok',
          key: Date.now(),
          actionText: settings.actionText || '',
          onAction: typeof settings.onAction === 'function' ? settings.onAction : null,
          duration: settings.duration || 2600,
        });
      }

      function applyDB(next) {
        dbRef.current = next;
        setDb(next);
        if (!persistNotebook(next)) notify(t('nbSaveFailed'), 'error');
      }

      function noteById(id) {
        return dbRef.current.notes.find((note) => note.id === id) || null;
      }

      function groupById(id) {
        return dbRef.current.groups.find((group) => group.id === id) || null;
      }

      async function writeNoteFile(id, text) {
        const handle = handlesRef.current.get(id);
        if (!handle) return true;
        try {
          const writable = await handle.createWritable();
          await writable.write(text);
          await writable.close();
          return true;
        } catch (error) {
          console.error('[notebook] write failed', error);
          if (error && error.name === 'NotAllowedError') handlesRef.current.delete(id);
          return false;
        }
      }

      function commitNote(manual) {
        const note = noteById(noteId);
        if (!note) {
          if (manual) notify(t('nbNoNote'), 'error');
          return;
        }
        const nextTitle = title.trim();
        const nextContent = content;
        const noteText = updateNote.trim();
        const changed = nextTitle !== note.title || nextContent !== note.content;
        if (!changed && !noteText && !manual) {
          setDirty(false);
          return;
        }
        const now = Date.now();
        const history = note.history.slice();
        if (noteText) {
          history.push({ t: now, text: noteText });
        } else {
          const last = history[history.length - 1];
          if (last && !last.created && !last.text && now - last.t < 60000) last.t = now;
          else history.push({ t: now, text: '' });
        }
        const nextNote = {
          ...note,
          title: nextTitle,
          content: nextContent,
          updatedAt: now,
          history,
        };
        applyDB({
          ...dbRef.current,
          notes: dbRef.current.notes.map((item) => (item.id === noteId ? nextNote : item)),
        });
        setUpdateNote('');
        setDirty(false);
        if (handlesRef.current.has(noteId)) {
          void writeNoteFile(noteId, nextContent).then((written) => {
            if (!written) notify(t('nbLinkSaveFail'), 'error');
            else if (manual) notify(t('nbLinkSaved'));
          });
        } else if (manual) {
          notify(t('nbSaved'));
        }
      }

      function focusEditor(note) {
        setTimeout(() => {
          const element = note && note.content ? contentRef.current : titleRef.current;
          if (element) element.focus();
        }, 0);
      }

      function selectNote(id) {
        if (id === noteId) return;
        commitNote(false);
        const note = noteById(id);
        if (!note) return;
        setNoteId(id);
        setTitle(note.title || '');
        setContent(note.content || '');
        setUpdateNote('');
        setDirty(false);
        setHistoryOpen(false);
        focusEditor(note);
      }

      function selectView(nextView) {
        commitNote(false);
        setView(nextView);
        setNoteId(null);
        setTitle('');
        setContent('');
        setUpdateNote('');
        setDirty(false);
        setHistoryOpen(false);
        setSearch('');
      }

      function newNote() {
        commitNote(false);
        const groupId = activeGroups.some((group) => group.id === view) ? view : null;
        if (view === 'archive') setView('all');
        setSearch('');
        const now = Date.now();
        const note = {
          id: notebookUid(),
          groupId,
          title: '',
          content: '',
          createdAt: now,
          updatedAt: now,
          archived: false,
          linkedFileName: null,
          history: [{ t: now, text: '', created: true }],
        };
        applyDB({ ...dbRef.current, notes: [...dbRef.current.notes, note] });
        setNoteId(note.id);
        setTitle('');
        setContent('');
        setUpdateNote('');
        setDirty(false);
        setHistoryOpen(false);
        focusEditor(note);
      }

      function deleteNote(id) {
        commitNote(false);
        const note = noteById(id);
        if (!note) return;
        const index = dbRef.current.notes.indexOf(note);
        const handle = handlesRef.current.get(id) || null;
        undoRef.current.push({ note: cloneNote(note), index, handle });
        if (undoRef.current.length > NOTE_UNDO_LIMIT) undoRef.current.shift();
        handlesRef.current.delete(id);
        applyDB({
          ...dbRef.current,
          notes: dbRef.current.notes.filter((item) => item.id !== id),
        });
        if (noteId === id) {
          setNoteId(null);
          setTitle('');
          setContent('');
          setUpdateNote('');
          setDirty(false);
        }
        notify(t('nbDeleted'), 'ok', {
          actionText: t('nbUndo'),
          onAction: () => undoDelete(),
          duration: 5200,
        });
      }

      function undoDelete() {
        const item = undoRef.current.pop();
        if (!item) {
          notify(t('nbNoUndo'), 'error');
          return;
        }
        const note = item.note;
        if (dbRef.current.notes.some((existing) => existing.id === note.id)) {
          note.id = notebookUid();
        }
        if (note.groupId && !dbRef.current.groups.some((group) => group.id === note.groupId && !group.archived)) {
          note.groupId = null;
        }
        const notes = dbRef.current.notes.slice();
        notes.splice(Math.min(Math.max(0, item.index), notes.length), 0, note);
        applyDB({ ...dbRef.current, notes });
        if (item.handle) handlesRef.current.set(note.id, item.handle);
        setView(note.archived ? 'archive' : note.groupId || 'all');
        setSearch('');
        setNoteId(note.id);
        setTitle(note.title || '');
        setContent(note.content || '');
        setUpdateNote('');
        setDirty(false);
        setHistoryOpen(false);
        notify(t('nbRestored'));
      }

      function toggleArchiveNote(id) {
        commitNote(false);
        const note = noteById(id);
        if (!note) return;
        const archived = !note.archived;
        let groupId = note.groupId;
        if (!archived && groupId) {
          const group = groupById(groupId);
          if (!group || group.archived) groupId = null;
        }
        const now = Date.now();
        applyDB({
          ...dbRef.current,
          notes: dbRef.current.notes.map((item) =>
            item.id === id
              ? {
                  ...item,
                  archived,
                  groupId,
                  updatedAt: now,
                  history: [
                    ...item.history,
                    { t: now, text: archived ? t('nbNoteArchived') : t('nbNoteRestored') },
                  ],
                }
              : item,
          ),
        });
        notify(archived ? t('nbNoteArchived') : t('nbNoteRestored'));
      }

      function canDropTo(targetView) {
        return (
          targetView === 'ungrouped' ||
          (targetView !== 'all' &&
            targetView !== 'archive' &&
            activeGroups.some((group) => group.id === targetView))
        );
      }

      function moveNote(id, groupId) {
        commitNote(false);
        const note = noteById(id);
        if (!note) return;
        if ((note.groupId || null) === (groupId || null) && !note.archived) {
          notify(t('nbMoved'));
          return;
        }
        const now = Date.now();
        const group = groupId ? groupById(groupId) : null;
        applyDB({
          ...dbRef.current,
          notes: dbRef.current.notes.map((item) =>
            item.id === id
              ? {
                  ...item,
                  groupId: group ? group.id : null,
                  archived: false,
                  updatedAt: now,
                  history: [
                    ...item.history,
                    {
                      t: now,
                      text: (t('nbMoved') + ' · ' + (group ? group.name : t('nbNoGroup'))),
                    },
                  ],
                }
              : item,
          ),
        });
        notify(group ? `${t('nbMoved')} · ${group.name}` : t('nbMoved'));
      }

      function openGroupDialog(mode, targetId) {
        commitNote(false);
        const group = targetId ? groupById(targetId) : null;
        setDialog({
          kind: 'group',
          mode,
          target: targetId || null,
          value: mode === 'rename' && group ? group.name : '',
          error: null,
        });
      }

      function openGroupConfirm(action, targetId) {
        commitNote(false);
        const group = targetId ? groupById(targetId) : null;
        const titles = {
          'archive-group': t('nbArchiveGroup'),
          'delete-group': t('nbDeleteGroup'),
          'purge-group': t('nbPurgeGroup'),
        };
        const messages = {
          'archive-group': t('nbConfirmArchiveGroup'),
          'delete-group': t('nbConfirmDeleteGroup'),
          'purge-group': t('nbConfirmPurgeGroup'),
        };
        setDialog({
          kind: 'confirm',
          action,
          target: targetId,
          title: titles[action] || t('nbConfirm'),
          message: messages[action] || '',
          groupName: group ? group.name : '',
        });
      }

      function restoreGroup(id) {
        commitNote(false);
        const now = Date.now();
        applyDB({
          ...dbRef.current,
          groups: dbRef.current.groups.map((group) =>
            group.id === id ? { ...group, archived: false } : group,
          ),
          notes: dbRef.current.notes.map((note) =>
            note.groupId === id
              ? {
                  ...note,
                  archived: false,
                  updatedAt: now,
                  history: [...note.history, { t: now, text: t('nbGroupRestored') }],
                }
              : note,
          ),
        });
        setView(id);
        setNoteId(null);
        setTitle('');
        setContent('');
        setDirty(false);
        notify(t('nbGroupRestored'));
      }

      function closeDialog() {
        setDialog(null);
      }

      function confirmDialogAction() {
        if (!dialog) return;
        if (dialog.kind === 'group') {
          const value = String(dialog.value || '').trim();
          if (!value) {
            setDialog((current) => (current ? { ...current, error: t('nbNameEmpty') } : current));
            return;
          }
          if (dialog.mode === 'create') {
            const group = {
              id: notebookUid(),
              name: value,
              createdAt: Date.now(),
              archived: false,
            };
            applyDB({ ...dbRef.current, groups: [...dbRef.current.groups, group] });
            setView(group.id);
            setNoteId(null);
            setTitle('');
            setContent('');
            setDirty(false);
            notify(t('nbGroupCreated'));
          } else {
            applyDB({
              ...dbRef.current,
              groups: dbRef.current.groups.map((group) =>
                group.id === dialog.target ? { ...group, name: value } : group,
              ),
            });
            notify(t('nbRename'));
          }
          setDialog(null);
          return;
        }
        const action = dialog.action;
        const target = dialog.target;
        setDialog(null);
        if (action === 'archive-group') {
          const now = Date.now();
          applyDB({
            ...dbRef.current,
            groups: dbRef.current.groups.map((group) =>
              group.id === target ? { ...group, archived: true } : group,
            ),
            notes: dbRef.current.notes.map((note) =>
              note.groupId === target
                ? {
                    ...note,
                    archived: true,
                    updatedAt: now,
                    history: [...note.history, { t: now, text: t('nbGroupArchived') }],
                  }
                : note,
            ),
          });
          if (view === target) setView('all');
          notify(t('nbGroupArchived'));
        } else if (action === 'delete-group') {
          applyDB({
            ...dbRef.current,
            groups: dbRef.current.groups.filter((group) => group.id !== target),
            notes: dbRef.current.notes.map((note) =>
              note.groupId === target ? { ...note, groupId: null } : note,
            ),
          });
          if (view === target) setView('all');
          notify(t('nbGroupDeleted'));
        } else if (action === 'purge-group') {
          const removedIds = new Set(
            dbRef.current.notes
              .filter((note) => note.groupId === target)
              .map((note) => note.id),
          );
          applyDB({
            ...dbRef.current,
            groups: dbRef.current.groups.filter((group) => group.id !== target),
            notes: dbRef.current.notes.filter((note) => !removedIds.has(note.id)),
          });
          if (noteId && removedIds.has(noteId)) {
            setNoteId(null);
            setTitle('');
            setContent('');
            setDirty(false);
          }
          setView('all');
          notify(t('nbGroupDeleted'));
        }
      }

      function exportBackup() {
        commitNote(false);
        const data = {
          version: 1,
          exportedAt: Date.now(),
          groups: dbRef.current.groups,
          notes: dbRef.current.notes,
        };
        const blob = new Blob([JSON.stringify(data, null, 2)], {
          type: 'application/json;charset=utf-8',
        });
        const url = URL.createObjectURL(blob);
        const anchor = document.createElement('a');
        anchor.href = url;
        anchor.download = `notes-backup-${noteDateFull(Date.now()).replace(/[: ]/g, '-')}.json`;
        anchor.click();
        setTimeout(() => URL.revokeObjectURL(url), 1500);
        notify(t('nbExported'));
      }

      async function importBackup(file) {
        commitNote(false);
        try {
          const text = await file.text();
          const parsed = JSON.parse(text);
          if (!parsed || !Array.isArray(parsed.notes)) throw new Error('invalid');
          const groups = dbRef.current.groups.slice();
          const groupIds = new Set(groups.map((group) => group.id));
          (Array.isArray(parsed.groups) ? parsed.groups : []).forEach((group) => {
            if (group && group.id && !groupIds.has(group.id)) {
              groups.push({ ...group, archived: Boolean(group.archived) });
              groupIds.add(group.id);
            }
          });
          const notes = dbRef.current.notes.slice();
          const noteIds = new Set(notes.map((note) => note.id));
          parsed.notes.forEach((note) => {
            if (note && note.id && !noteIds.has(note.id)) {
              notes.push({
                ...note,
                title: typeof note.title === 'string' ? note.title : '',
                content: typeof note.content === 'string' ? note.content : '',
                archived: Boolean(note.archived),
                linkedFileName: null,
                history: Array.isArray(note.history) ? note.history : [],
              });
              noteIds.add(note.id);
            }
          });
          applyDB({ ...dbRef.current, groups, notes });
          setView('all');
          notify(t('nbImported'));
        } catch {
          notify(t('nbImportFailed'), 'error');
        }
      }

      async function linkNoteFile() {
        if (!noteId) return;
        commitNote(false);
        if (!supportsNotebookFiles()) {
          notify(t('nbLinkUnsupported'), 'error');
          return;
        }
        try {
          const [handle] = await window.showOpenFilePicker({
            multiple: false,
            excludeAcceptAllOption: false,
            types: [
              {
                description: 'Text',
                accept: {
                  'text/plain': ['.txt', '.md', '.markdown', '.log', '.ini', '.cfg', '.json', '.csv', '.yml', '.yaml'],
                  'text/html': ['.html', '.htm'],
                },
              },
            ],
          });
          const file = await handle.getFile();
          const note = noteById(noteId);
          if (!note) return;
          let text = '';
          if (file.size <= 8 * 1024 * 1024) {
            text = await file.text();
          }
          const now = Date.now();
          const baseTitle = file.name.replace(/\.[^.]+$/, '');
          const nextTitle = note.title || baseTitle;
          const nextContent = !note.content.trim() && text ? text : note.content;
          handlesRef.current.set(noteId, handle);
          applyDB({
            ...dbRef.current,
            notes: dbRef.current.notes.map((item) =>
              item.id === noteId
                ? {
                    ...item,
                    title: nextTitle,
                    content: nextContent,
                    linkedFileName: file.name,
                    updatedAt: now,
                    history: [...item.history, { t: now, text: `${t('nbLinkedToast')} · ${file.name}` }],
                  }
                : item,
            ),
          });
          setTitle(nextTitle);
          if (nextContent !== content) setContent(nextContent);
          setDirty(false);
          notify(`${t('nbLinkedToast')} · ${file.name}`);
        } catch (error) {
          if (error && error.name !== 'AbortError') {
            notify((error && error.message) || t('nbSaveFailed'), 'error');
          }
        }
      }

      async function unlinkNote() {
        if (!noteId) return;
        commitNote(false);
        handlesRef.current.delete(noteId);
        const now = Date.now();
        applyDB({
          ...dbRef.current,
          notes: dbRef.current.notes.map((note) =>
            note.id === noteId
              ? {
                  ...note,
                  linkedFileName: null,
                  updatedAt: now,
                  history: [...note.history, { t: now, text: t('nbUnlinked') }],
                }
              : note,
          ),
        });
        notify(t('nbUnlinked'));
      }

      async function saveNoteAsFile() {
        if (!noteId) return;
        commitNote(false);
        if (!supportsNotebookFiles()) {
          notify(t('nbLinkUnsupported'), 'error');
          return;
        }
        try {
          const handle = await window.showSaveFilePicker({
            suggestedName: notebookFileName(title),
            types: [{ description: 'Text', accept: { 'text/plain': ['.txt', '.md'] } }],
          });
          const writable = await handle.createWritable();
          await writable.write(content);
          await writable.close();
          handlesRef.current.set(noteId, handle);
          const now = Date.now();
          applyDB({
            ...dbRef.current,
            notes: dbRef.current.notes.map((note) =>
              note.id === noteId
                ? {
                    ...note,
                    linkedFileName: handle.name,
                    updatedAt: now,
                    history: [...note.history, { t: now, text: `${t('nbSaveAs')} · ${handle.name}` }],
                  }
                : note,
            ),
          });
          notify(`${t('nbSaveAs')} · ${handle.name}`);
        } catch (error) {
          if (error && error.name !== 'AbortError') {
            notify((error && error.message) || t('nbSaveFailed'), 'error');
          }
        }
      }

      async function importFiles(files, groupId) {
        commitNote(false);
        const textExts = [
          '.txt', '.md', '.markdown', '.log', '.ini', '.cfg', '.conf', '.json',
          '.csv', '.yaml', '.yml', '.xml', '.html', '.htm', '.js', '.ts',
          '.py', '.css', '.rst', '.tex', '.sql', '.bat', '.sh', '.toml',
        ];
        const created = [];
        for (const file of files) {
          const name = file.name || 'file';
          const dot = name.lastIndexOf('.');
          const ext = dot > 0 ? name.slice(dot).toLowerCase() : '';
          let body = '';
          if (file.size > 5 * 1024 * 1024) {
            body = `【文件过大，仅记录文件信息】\n\n原始文件名：${name}\n大小：${(file.size / 1024 / 1024).toFixed(2)} MB`;
          } else if (textExts.includes(ext) || (file.type && file.type.startsWith('text/'))) {
            try {
              body = await file.text();
            } catch {
              body = `【无法读取文件内容】\n\n原始文件名：${name}`;
            }
          } else {
            body = `【已记录文件信息，未读取内容】\n\n原始文件名：${name}\n大小：${(file.size / 1024).toFixed(1)} KB\n类型：${file.type || ext || '未知'}`;
          }
          const now = Date.now();
          created.push({
            id: notebookUid(),
            groupId: groupId || null,
            title: dot > 0 ? name.slice(0, dot) : name,
            content: body,
            createdAt: now,
            updatedAt: now,
            archived: false,
            linkedFileName: null,
            history: [{ t: now, text: `${t('nbFileImported')} · ${name}`, created: true }],
          });
        }
        if (!created.length) return;
        applyDB({ ...dbRef.current, notes: [...dbRef.current.notes, ...created] });
        const last = created[created.length - 1];
        setView(groupId || 'all');
        setSearch('');
        setNoteId(last.id);
        setTitle(last.title);
        setContent(last.content);
        setUpdateNote('');
        setDirty(false);
        setHistoryOpen(false);
        notify(`${t('nbFileImported')} · ${created.length}`);
      }

      function handleRootDrop(event) {
        if (!event.dataTransfer || !event.dataTransfer.files || !event.dataTransfer.files.length) return;
        event.preventDefault();
        setFileDrag(false);
        let groupId = activeGroups.some((group) => group.id === view) ? view : null;
        const navTarget = event.target.closest && event.target.closest('.nt-nav-item');
        if (navTarget) {
          const targetView = navTarget.getAttribute('data-view');
          if (targetView === 'ungrouped') groupId = null;
          else if (targetView === 'all' || targetView === 'archive') groupId = null;
          else if (targetView && activeGroups.some((group) => group.id === targetView)) groupId = targetView;
        }
        void importFiles(Array.from(event.dataTransfer.files), groupId);
      }

      function handleRootDragOver(event) {
        const types = event.dataTransfer && event.dataTransfer.types;
        if (!types || Array.prototype.indexOf.call(types, 'Files') === -1) return;
        event.preventDefault();
        event.dataTransfer.dropEffect = 'copy';
        if (!fileDrag) setFileDrag(true);
      }

      function handleRootDragLeave(event) {
        if (event.currentTarget.contains(event.relatedTarget)) return;
        setFileDrag(false);
      }

      function handleDialogKeyDown(event) {
        event.stopPropagation();
        if (event.isComposing) return;
        if (event.key === 'Escape') {
          event.preventDefault();
          closeDialog();
        } else if (event.key === 'Enter') {
          event.preventDefault();
          confirmDialogAction();
        }
      }

      const activeGroups = useMemo(() => db.groups.filter((group) => !group.archived), [db]);
      const archivedGroups = useMemo(() => db.groups.filter((group) => group.archived), [db]);

      const visibleNotes = useMemo(() => {
        const query = search.trim().toLowerCase();
        let notes = db.notes.slice();
        if (query) {
          notes = notes.filter((note) => !note.archived).filter(
            (note) =>
              (note.title || '').toLowerCase().includes(query) ||
              (note.content || '').toLowerCase().includes(query) ||
              note.history.some((entry) => (entry.text || '').toLowerCase().includes(query)) ||
              noteDateFull(note.createdAt).includes(query) ||
              noteDateFull(note.updatedAt).includes(query),
          );
        } else if (view === 'archive') {
          notes = notes.filter((note) => note.archived);
        } else {
          notes = notes.filter((note) => !note.archived);
          if (view === 'ungrouped') {
            notes = notes.filter(
              (note) =>
                !note.groupId ||
                !db.groups.some((group) => group.id === note.groupId && !group.archived),
            );
          } else if (view !== 'all') notes = notes.filter((note) => note.groupId === view);
        }
        return notes.sort((left, right) => right.updatedAt - left.updatedAt);
      }, [db, search, view]);

      const selectedNote = noteId ? db.notes.find((note) => note.id === noteId) || null : null;
      const selectedGroup = selectedNote && selectedNote.groupId ? groupById(selectedNote.groupId) : null;
      const linkedHandle = noteId ? handlesRef.current.get(noteId) : null;

      const viewLabel = useMemo(() => {
        const query = search.trim();
        if (query) return `${t('nbSearchPrefix')}「${query}」`;
        if (view === 'all') return t('nbAll');
        if (view === 'ungrouped') return t('nbUngrouped');
        if (view === 'archive') return t('nbArchive');
        const group = db.groups.find((item) => item.id === view);
        return group ? group.name : t('nbAll');
      }, [db.groups, search, t, view]);

      useEffect(() => {
        if (!notice) return;
        const timer = setTimeout(() => setNotice(null), notice.duration || 2600);
        return () => clearTimeout(timer);
      }, [notice]);

      useEffect(() => {
        if (!dirty || !noteId) return;
        const timer = setTimeout(() => commitNote(false), 1500);
        return () => clearTimeout(timer);
      }, [title, content, updateNote, dirty, noteId]);

      useEffect(() => {
        const onKeyDown = (event) => {
          const modifier = event.ctrlKey || event.metaKey;
          if (!modifier) return;
          const key = String(event.key || '').toLowerCase();
          if (key === 's') {
            event.preventDefault();
            if (noteId) commitNote(true);
            return;
          }
          if (key === 'z' && !event.shiftKey) {
            const target = event.target;
            const editing =
              target &&
              (target.tagName === 'INPUT' ||
                target.tagName === 'TEXTAREA' ||
                target.isContentEditable);
            if (editing) return;
            if (undoRef.current.length) {
              event.preventDefault();
              undoDelete();
            }
          }
        };
        window.addEventListener('keydown', onKeyDown);
        return () => window.removeEventListener('keydown', onKeyDown);
      }, [noteId, title, content, updateNote, dirty]);

      useEffect(
        () => () => {
          const latest = latestRef.current;
          if (!latest || !latest.noteId || !latest.dirty) return;
          const note = dbRef.current.notes.find((item) => item.id === latest.noteId);
          if (!note) return;
          const now = Date.now();
          const history = note.history.slice();
          const noteText = latest.updateNote.trim();
          if (noteText) history.push({ t: now, text: noteText });
          else {
            const last = history[history.length - 1];
            if (last && !last.created && !last.text && now - last.t < 60000) last.t = now;
            else history.push({ t: now, text: '' });
          }
          const next = {
            ...dbRef.current,
            notes: dbRef.current.notes.map((item) =>
              item.id === latest.noteId
                ? {
                    ...item,
                    title: latest.title.trim(),
                    content: latest.content,
                    updatedAt: now,
                    history,
                  }
                : item,
            ),
          };
          persistNotebook(next);
          if (handlesRef.current.has(latest.noteId)) {
            void writeNoteFile(latest.noteId, latest.content);
          }
        },
        [],
      );

      const navItem = (key, icon, label, count, extra, dropKey) =>
        h(
          'div',
          {
            key,
            role: 'button',
            tabIndex: 0,
            'data-view': key,
            className:
              'nt-nav-item' +
              (view === key ? ' is-active' : '') +
              (dropKey && dropTarget === dropKey ? ' is-drop' : ''),
            onClick: () => selectView(key),
            onKeyDown: (event) => {
              if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault();
                selectView(key);
              }
            },
            onDragOver: dropKey
              ? (event) => {
                  if (!draggingId || !canDropTo(dropKey)) return;
                  event.preventDefault();
                  event.dataTransfer.dropEffect = 'move';
                  setDropTarget(dropKey);
                }
              : undefined,
            onDragLeave: dropKey
              ? () => {
                  if (dropTarget === dropKey) setDropTarget(null);
                }
              : undefined,
            onDrop: dropKey
              ? (event) => {
                  if (!draggingId || !canDropTo(dropKey)) return;
                  event.preventDefault();
                  event.stopPropagation();
                  const id = draggingId;
                  setDraggingId(null);
                  setDropTarget(null);
                  moveNote(id, dropKey === 'ungrouped' ? null : dropKey);
                }
              : undefined,
          },
          h(Glyph, { name: icon }),
          h('span', { className: 'nt-nav-label' }, label),
          h('span', { className: 'nt-nav-count' }, count),
          extra || null,
        );

      const noteCard = (note) => {
        const group = note.groupId ? groupById(note.groupId) : null;
        const preview = (note.content || '').replace(/\s+/g, ' ').trim().slice(0, 80);
        return h(
          'div',
          {
            key: note.id,
            className:
              'nt-card' +
              (noteId === note.id ? ' is-active' : '') +
              (draggingId === note.id ? ' is-dragging' : ''),
            draggable: true,
            onClick: () => selectNote(note.id),
            onDragStart: (event) => {
              setDraggingId(note.id);
              event.dataTransfer.effectAllowed = 'move';
              try {
                event.dataTransfer.setData('text/plain', 'note:' + note.id);
              } catch {
                /* ignore */
              }
            },
            onDragEnd: () => {
              setDraggingId(null);
              setDropTarget(null);
            },
          },
          h(
            'div',
            { className: 'nt-card-tools' },
            h(
              'button',
              {
                type: 'button',
                className: 'nt-mini',
                title: note.archived ? t('nbRestore') : t('nbArchiveNote'),
                draggable: false,
                onPointerDown: (event) => event.stopPropagation(),
                onClick: (event) => {
                  event.stopPropagation();
                  toggleArchiveNote(note.id);
                },
              },
              h(Glyph, { name: 'archive' }),
            ),
            h(
              'button',
              {
                type: 'button',
                className: 'nt-mini nt-danger',
                title: t('nbDelete'),
                draggable: false,
                onPointerDown: (event) => event.stopPropagation(),
                onClick: (event) => {
                  event.stopPropagation();
                  deleteNote(note.id);
                },
              },
              h(Glyph, { name: 'trash' }),
            ),
          ),
          h('h3', null, note.title || t('nbUntitled')),
          h('p', { className: 'nt-card-preview' }, preview || t('nbBlank')),
          h(
            'div',
            { className: 'nt-card-meta' },
            h('span', null, '✎ ' + noteDateShort(note.updatedAt)),
            group ? h('span', { className: 'nt-tag' }, group.name) : null,
            note.archived ? h('span', { className: 'nt-tag nt-tag-arch' }, t('nbArchivedTag')) : null,
            note.linkedFileName
              ? h('span', { className: 'nt-tag nt-tag-link' }, '🔗 ' + note.linkedFileName)
              : null,
          ),
        );
      };

      const archivedGroupRows = archivedGroups.length
        ? h(
            'div',
            { className: 'nt-arch-groups' },
            h('div', { className: 'nt-arch-title' }, t('nbGroups') + ' · ' + t('nbArchive')),
            archivedGroups.map((group) => {
              const count = db.notes.filter((note) => note.groupId === group.id).length;
              return h(
                'div',
                { className: 'nt-arch-item', key: group.id },
                h(Glyph, { name: 'folder' }),
                h('span', { className: 'nt-arch-name' }, group.name),
                h('span', { className: 'nt-nav-count' }, count),
                h(
                  'button',
                  {
                    type: 'button',
                    className: 'nt-mini',
                    title: t('nbRestoreGroup'),
                    onClick: () => restoreGroup(group.id),
                  },
                  h(Glyph, { name: 'refresh' }),
                ),
                h(
                  'button',
                  {
                    type: 'button',
                    className: 'nt-mini nt-danger',
                    title: t('nbPurgeGroup'),
                    onClick: () => openGroupConfirm('purge-group', group.id),
                  },
                  h(Glyph, { name: 'trash' }),
                ),
              );
            }),
          )
        : null;

      const editor = selectedNote
        ? (() => {
            const history = selectedNote.history.slice().reverse();
            const linked = Boolean(linkedHandle);
            return h(
              'main',
              { className: 'nt-editor' },
              selectedNote.archived
                ? h(
                    'div',
                    { className: 'nt-banner nt-banner-arch' },
                    h('span', null, t('nbArchivedBanner')),
                    h(
                      'button',
                      {
                        type: 'button',
                        className: 'nt-btn nt-btn-sm',
                        onClick: () => toggleArchiveNote(selectedNote.id),
                      },
                      t('nbRestore'),
                    ),
                  )
                : null,
              selectedNote.linkedFileName
                ? h(
                    'div',
                    {
                      className:
                        'nt-banner ' + (linked ? 'nt-banner-link' : 'nt-banner-warn'),
                    },
                    h(
                      'span',
                      { className: 'nt-banner-text' },
                      linked
                        ? `${t('nbLinked')} · ${selectedNote.linkedFileName}`
                        : `${t('nbLinkLost')} · ${selectedNote.linkedFileName}`,
                    ),
                    linked
                      ? h('span', { className: 'nt-banner-hint' }, t('nbLinkedHint'))
                      : null,
                    h(
                      'button',
                      {
                        type: 'button',
                        className: 'nt-btn nt-btn-sm',
                        onClick: linked ? unlinkNote : linkNoteFile,
                      },
                      linked ? t('nbUnlink') : t('nbRelink'),
                    ),
                  )
                : null,
              h(
                'div',
                { className: 'nt-editor-head' },
                h('input', {
                  ref: titleRef,
                  className: 'nt-title-input',
                  value: title,
                  placeholder: t('nbUntitled'),
                  onChange: (event) => {
                    setTitle(event.target.value);
                    setDirty(true);
                  },
                }),
                h(
                  'div',
                  { className: 'nt-editor-actions' },
                  h(
                    'button',
                    {
                      type: 'button',
                      className: 'nt-btn nt-btn-sm',
                      onClick: () => toggleArchiveNote(selectedNote.id),
                    },
                    h(Glyph, { name: 'archive' }),
                    selectedNote.archived ? t('nbRestore') : t('nbArchiveNote'),
                  ),
                  h(
                    'button',
                    {
                      type: 'button',
                      className: 'nt-btn nt-btn-sm nt-danger',
                      onClick: () => deleteNote(selectedNote.id),
                    },
                    h(Glyph, { name: 'trash' }),
                    t('nbDelete'),
                  ),
                ),
              ),
              h(
                'div',
                { className: 'nt-editor-meta' },
                h('span', null, t('nbCreated') + ' · ' + noteDateFull(selectedNote.createdAt)),
                h('span', null, t('nbUpdated') + ' · ' + noteDateFull(selectedNote.updatedAt)),
                h('span', null, Math.max(0, selectedNote.history.length - 1) + ' ' + t('nbUpdates')),
                h('span', null, selectedGroup ? selectedGroup.name : t('nbNoGroup')),
                h('span', { className: 'nt-dirty' + (dirty ? '' : ' is-clean') }, dirty ? t('nbDirty') : t('nbSaved')),
              ),
              h('textarea', {
                ref: contentRef,
                className: 'nt-content',
                value: content,
                placeholder: t('nbContent'),
                spellCheck: false,
                onChange: (event) => {
                  setContent(event.target.value);
                  setDirty(true);
                },
              }),
              h(
                'div',
                { className: 'nt-editor-foot' },
                h(
                  'div',
                  { className: 'nt-file-actions' },
                  h(
                    'button',
                    {
                      type: 'button',
                      className: 'nt-btn nt-btn-sm' + (linked ? ' nt-btn-linked' : ''),
                      onClick: linked ? unlinkNote : linkNoteFile,
                      title: linked ? t('nbUnlink') : t('nbLink'),
                    },
                    h(Glyph, { name: 'link' }),
                    linked ? selectedNote.linkedFileName : t('nbLink'),
                  ),
                  h(
                    'button',
                    {
                      type: 'button',
                      className: 'nt-btn nt-btn-sm',
                      onClick: saveNoteAsFile,
                    },
                    h(Glyph, { name: 'save' }),
                    t('nbSaveAs'),
                  ),
                ),
                h('input', {
                  className: 'nt-update-input',
                  value: updateNote,
                  placeholder: t('nbUpdateNote'),
                  onChange: (event) => {
                    setUpdateNote(event.target.value);
                    setDirty(true);
                  },
                }),
                h(
                  'button',
                  {
                    type: 'button',
                    className: 'nt-btn nt-btn-primary',
                    onClick: () => commitNote(true),
                  },
                  t('nbSave'),
                ),
              ),
              h(
                'div',
                { className: 'nt-history' },
                h(
                  'button',
                  {
                    type: 'button',
                    className: 'nt-history-toggle' + (historyOpen ? ' is-open' : ''),
                    onClick: () => setHistoryOpen((open) => !open),
                  },
                  h(Glyph, { name: 'chevron' }),
                  t('nbHistory'),
                  h('span', { className: 'nt-count' }, selectedNote.history.length),
                ),
                historyOpen
                  ? h(
                      'div',
                      { className: 'nt-history-body' },
                      history.map((entry, index) => {
                        const isFile = /文件|另存为|关联/.test(entry.text || '');
                        return h(
                          'div',
                          { className: 'nt-history-item', key: String(entry.t) + '-' + index },
                          h('span', { className: 'nt-history-dot' }),
                          h(
                            'div',
                            { className: 'nt-history-content' },
                            h(
                              'div',
                              { className: 'nt-history-time' },
                              noteDateFull(entry.t),
                              entry.created
                                ? h('span', { className: 'nt-history-badge' }, t('nbHistoryCreated'))
                                : null,
                              isFile
                                ? h('span', { className: 'nt-history-badge is-file' }, t('nbHistoryFile'))
                                : null,
                            ),
                            entry.text
                              ? h('div', { className: 'nt-history-text' }, entry.text)
                              : null,
                          ),
                        );
                      }),
                    )
                  : null,
              ),
            );
          })()
        : h(
            'main',
            { className: 'nt-editor nt-editor-empty' },
            h('div', { className: 'nt-empty-icon' }, h(Glyph, { name: 'notebook' })),
            h('p', null, t('nbNoNote')),
            h('p', { className: 'nt-empty-hint' }, t('nbNoNoteHint')),
          );

      return h(
        'div',
        {
          className: 'nt-root',
          onDragOver: handleRootDragOver,
          onDragEnter: handleRootDragOver,
          onDragLeave: handleRootDragLeave,
          onDrop: handleRootDrop,
        },
        h(
          'aside',
          { className: 'nt-nav' },
          h(
            'div',
            { className: 'nt-nav-head' },
            h('span', { className: 'nt-nav-mark' }, h(Glyph, { name: 'notebook' })),
            h('div', null, h('strong', null, t('notebook')), h('span', { className: 'nt-nav-subtitle' }, t('appSubtitle'))),
          ),
          h(
            'div',
            { className: 'nt-nav-list' },
            navItem('all', 'note', t('nbAll'), db.notes.filter((note) => !note.archived).length, null, null),
            navItem(
              'ungrouped',
              'doc',
              t('nbUngrouped'),
              db.notes.filter((note) => !note.archived && (!note.groupId || !activeGroups.some((group) => group.id === note.groupId))).length,
              null,
              'ungrouped',
            ),
            h('div', { className: 'nt-nav-sep' }, t('nbGroups')),
            activeGroups.length
              ? activeGroups.map((group) =>
                  navItem(
                    group.id,
                    'folder',
                    group.name,
                    db.notes.filter((note) => !note.archived && note.groupId === group.id).length,
                    h(
                      'span',
                      { className: 'nt-nav-tools' },
                      h(
                        'button',
                        {
                          type: 'button',
                          className: 'nt-mini',
                          title: t('nbRename'),
                          onPointerDown: (event) => event.stopPropagation(),
                          onClick: (event) => {
                            event.stopPropagation();
                            openGroupDialog('rename', group.id);
                          },
                        },
                        h(Glyph, { name: 'text' }),
                      ),
                      h(
                        'button',
                        {
                          type: 'button',
                          className: 'nt-mini',
                          title: t('nbArchiveGroup'),
                          onPointerDown: (event) => event.stopPropagation(),
                          onClick: (event) => {
                            event.stopPropagation();
                            openGroupConfirm('archive-group', group.id);
                          },
                        },
                        h(Glyph, { name: 'archive' }),
                      ),
                      h(
                        'button',
                        {
                          type: 'button',
                          className: 'nt-mini nt-danger',
                          title: t('nbDeleteGroup'),
                          onPointerDown: (event) => event.stopPropagation(),
                          onClick: (event) => {
                            event.stopPropagation();
                            openGroupConfirm('delete-group', group.id);
                          },
                        },
                        h(Glyph, { name: 'trash' }),
                      ),
                    ),
                    group.id,
                  ),
                )
              : h('div', { className: 'nt-nav-empty' }, t('nbEmpty')),
            h('div', { className: 'nt-nav-sep' }, ''),
            navItem('archive', 'archive', t('nbArchive'), db.notes.filter((note) => note.archived).length, null, null),
          ),
          h(
            'div',
            { className: 'nt-nav-foot' },
            h(
              'button',
              {
                type: 'button',
                className: 'nt-btn nt-btn-block',
                onClick: () => openGroupDialog('create', null),
              },
              '＋ ' + t('nbNewGroup'),
            ),
            h(
              'div',
              { className: 'nt-foot-row' },
              h(
                'button',
                { type: 'button', className: 'nt-btn nt-btn-sm', onClick: exportBackup },
                t('nbExport'),
              ),
              h(
                'button',
                {
                  type: 'button',
                  className: 'nt-btn nt-btn-sm',
                  onClick: () => importRef.current && importRef.current.click(),
                },
                t('nbImport'),
              ),
            ),
            h(
              'div',
              { className: 'nt-undo-hint' },
              undoRef.current.length
                ? `${t('nbUndo')} · ${undoRef.current.length} · Ctrl+Z`
                : t('nbUndoEmpty'),
            ),
            h('input', {
              ref: importRef,
              type: 'file',
              accept: 'application/json,.json',
              hidden: true,
              onChange: (event) => {
                const file = event.target.files && event.target.files[0];
                event.target.value = '';
                if (file) void importBackup(file);
              },
            }),
          ),
        ),
        h(
          'section',
          { className: 'nt-list' },
          h(
            'div',
            { className: 'nt-list-head' },
            h('input', {
              className: 'nt-search',
              value: search,
              placeholder: t('nbSearch'),
              onChange: (event) => setSearch(event.target.value),
            }),
            h(
              'button',
              {
                type: 'button',
                className: 'nt-add',
                title: t('nbNewNote'),
                onClick: newNote,
              },
              h(Glyph, { name: 'plus' }),
            ),
          ),
          h(
            'div',
            { className: 'nt-list-title' },
            h('span', null, viewLabel + ' · ' + visibleNotes.length),
            h('span', { className: 'nt-list-tip' }, t('nbDragTip')),
          ),
          h(
            'div',
            { className: 'nt-note-list' },
            view === 'archive' && !search.trim() ? archivedGroupRows : null,
            visibleNotes.length
              ? visibleNotes.map(noteCard)
              : h(
                  'div',
                  { className: 'nt-empty-list' },
                  h('div', null, t('nbEmpty')),
                  h('span', null, t('nbEmptyHint')),
                ),
          ),
        ),
        editor,
        notice
          ? h(
              'div',
              {
                className: 'nt-toast' + (notice.tone === 'error' ? ' is-error' : ''),
                key: notice.key,
                role: 'status',
              },
              h('span', { className: 'nt-toast-text' }, notice.text),
              notice.actionText
                ? h(
                    'button',
                    {
                      type: 'button',
                      className: 'nt-toast-action',
                      onClick: () => {
                        const action = notice.onAction;
                        setNotice(null);
                        if (action) action();
                      },
                    },
                    notice.actionText,
                  )
                : null,
            )
          : null,
        dialog
          ? h(
              'div',
              {
                className: 'nt-modal-backdrop',
                onPointerDown: (event) => {
                  if (event.target === event.currentTarget) closeDialog();
                },
              },
              h(
                'div',
                {
                  className: 'nt-modal',
                  role: 'dialog',
                  'aria-modal': 'true',
                  'aria-labelledby': 'nt-dialog-title',
                },
                h(
                  'h3',
                  { className: 'nt-modal-title', id: 'nt-dialog-title' },
                  dialog.kind === 'group'
                    ? dialog.mode === 'create'
                      ? t('nbNewGroup')
                      : t('nbGroupRename')
                    : dialog.title,
                ),
                dialog.kind === 'group'
                  ? h('input', {
                      className: 'nt-modal-input',
                      value: dialog.value,
                      autoFocus: true,
                      spellCheck: false,
                      placeholder: t('nbGroupPrompt'),
                      onChange: (event) =>
                        setDialog((current) =>
                          current
                            ? { ...current, value: event.target.value, error: null }
                            : current,
                        ),
                      onKeyDown: handleDialogKeyDown,
                    })
                  : h('p', { className: 'nt-modal-message' }, dialog.message),
                dialog.error ? h('div', { className: 'nt-modal-error' }, dialog.error) : null,
                h(
                  'div',
                  { className: 'nt-modal-actions' },
                  h(
                    'button',
                    { type: 'button', className: 'nt-btn', onClick: closeDialog },
                    t('nbCancel'),
                  ),
                  h(
                    'button',
                    {
                      type: 'button',
                      className: 'nt-btn nt-btn-primary',
                      onClick: confirmDialogAction,
                    },
                    t('nbConfirm'),
                  ),
                ),
              ),
            )
          : null,
        fileDrag
          ? h(
              'div',
              { className: 'nt-drop-overlay' },
              h('div', { className: 'nt-drop-card' }, t('nbDropHint')),
            )
          : null,
      );
    }

    function EditorPage({ t, rpc, pickDirectory, embedded }) {
      const [nodes, setNodes] = useState(() => loadDoc());
      const [past, setPast] = useState([]);
      const [future, setFuture] = useState([]);
      const [selectedId, setSelectedId] = useState(null);
      const [editing, setEditing] = useState(null);
      const [draggingId, setDraggingId] = useState(null);
      const [heights, setHeights] = useState({});
      const [viewport, setViewport] = useState({ x: 44, y: 44, zoom: 1 });
      const [notice, setNotice] = useState(null);
      const [panning, setPanning] = useState(false);
      const [workspace, setWorkspace] = useState({
        ready: false,
        error: null,
        root: '',
        folders: [],
        files: [],
        folder: '',
        file: null,
      });
      const [saveState, setSaveState] = useState('idle');
      const [dialog, setDialog] = useState(null);

      const rootRef = useRef(null);
      const canvasRef = useRef(null);
      const nodeEls = useRef(new Map());
      const dragRef = useRef(null);
      const panRef = useRef(null);
      const fileRef = useRef(null);
      const nodesRef = useRef(nodes);
      const latestRef = useRef({ nodes, editing });
      const workspaceRef = useRef(workspace);
      const hydratedRef = useRef(false);
      const initStartedRef = useRef(false);
      const saveSeqRef = useRef(0);
      nodesRef.current = nodes;
      latestRef.current = { nodes, editing };
      workspaceRef.current = workspace;

      const depths = useMemo(() => depthMap(nodes), [nodes]);
      const children = useMemo(() => groupChildren(nodes), [nodes]);
      const nodeKey = nodes.map((node) => node.id).join('|');

      const geometry = useMemo(() => {
        if (!nodes.length) return null;
        let minX = Infinity;
        let minY = Infinity;
        let maxX = -Infinity;
        let maxY = -Infinity;
        const paths = [];
        const byId = new Map(nodes.map((node) => [node.id, node]));
        for (const node of nodes) {
          const height = heights[node.id] || NODE_H;
          minX = Math.min(minX, node.x);
          minY = Math.min(minY, node.y);
          maxX = Math.max(maxX, node.x + NODE_W);
          maxY = Math.max(maxY, node.y + height);
          const parent = node.parentId ? byId.get(node.parentId) : null;
          if (parent) {
            const parentHeight = heights[parent.id] || NODE_H;
            const sx = parent.x + NODE_W / 2;
            const sy = parent.y + parentHeight;
            const ex = node.x + NODE_W / 2;
            const ey = node.y - 2;
            const curve = Math.max(22, (ey - sy) * 0.55);
            paths.push({
              key: node.id,
              d: `M ${sx} ${sy} C ${sx} ${sy + curve}, ${ex} ${ey - curve}, ${ex} ${ey}`,
              ex,
              ey,
            });
          }
        }
        const pad = 72;
        return {
          minX: minX - pad,
          minY: minY - pad,
          width: maxX - minX + pad * 2,
          height: maxY - minY + pad * 2,
          paths,
        };
      }, [nodes, heights]);

      /* -------------------------- helpers ------------------------------- */

      function notify(text, tone) {
        setNotice({ text, tone: tone || 'ok', key: Date.now() });
      }

      /* ----------------------- workspace files ------------------------- */

      function workspaceDoc() {
        return { app: 'dsh-menu-tree-editor', version: 1, nodes: nodesRef.current };
      }

      function applyLoadedNodes(next) {
        hydratedRef.current = false;
        nodesRef.current = next;
        setNodes(next);
        setPast([]);
        setFuture([]);
        setSelectedId(null);
        setEditing(null);
        requestAnimationFrame(() => fitView(next));
        setTimeout(() => {
          hydratedRef.current = true;
        }, 0);
      }

      async function initWorkspace() {
        if (!rpc) {
          setWorkspace((current) => ({ ...current, ready: true, error: 'unavailable' }));
          return;
        }
        const pref = loadWorkspacePref();
        const preferredRoot =
          pref && typeof pref.root === 'string' && pref.root.trim() ? pref.root.trim() : '';
        let boot = await rpc('bootstrap', preferredRoot ? { root: preferredRoot } : {});
        if (!boot.ok && preferredRoot) {
          boot = await rpc('bootstrap', {});
        }
        if (!boot.ok) {
          setWorkspace((current) => ({
            ...current,
            ready: true,
            error: (boot.error && boot.error.code) || 'error',
          }));
          return;
        }
        const root = boot.value.root;
        const folders = boot.value.folders || [];
        let files = boot.value.files || [];
        let folder = pref && typeof pref.folder === 'string' && folders.includes(pref.folder) ? pref.folder : '';
        if (folder) {
          const listed = await rpc('list', { root, folder });
          if (listed.ok) files = listed.value.files || [];
          else folder = '';
        }
        let file =
          pref && pref.folder === folder && files.some((item) => item.name === pref.file)
            ? pref.file
            : files[0]
              ? files[0].name
              : null;
        if (!files.length) {
          const name = nextName(files, 'menu-', '.json');
          const saved = await rpc('save', { root, folder, name, doc: workspaceDoc() });
          if (saved.ok) {
            files = [{ name }];
            file = name;
          }
        }
        if (file) {
          const loaded = await rpc('load', { root, folder, name: file });
          if (loaded.ok) {
            const parsed = parseStoredDoc(loaded.value.doc);
            if (parsed) {
              applyLoadedNodes(parsed);
              saveWorkspacePref(root, folder, file);
            } else {
              file = null;
              notify(t('fileLoadFailed'), 'error');
            }
          } else {
            file = null;
            notify(workspaceErrorText(loaded.error, t), 'error');
          }
        }
        setWorkspace({ ready: true, error: null, root, folders, files, folder, file });
        saveWorkspacePref(root, folder, file);
        setSaveState(file ? 'saved' : 'idle');
        hydratedRef.current = true;
      }

      async function saveWorkspace(manual) {
        const current = workspaceRef.current;
        if (!rpc || !current.ready || !current.file) {
          if (manual) notify(t('fileNotSelected'), 'error');
          return false;
        }
        const sequence = ++saveSeqRef.current;
        setSaveState('saving');
        const result = await rpc('save', {
          root: current.root,
          folder: current.folder,
          name: current.file,
          doc: workspaceDoc(),
        });
        if (sequence !== saveSeqRef.current) return Boolean(result.ok);
        if (!result.ok) {
          setSaveState('error');
          if (manual) notify(workspaceErrorText(result.error, t), 'error');
          return false;
        }
        setSaveState('saved');
        if (manual) notify(t('fileSaved'));
        return true;
      }

      async function loadWorkspaceFile(folder, name) {
        if (!rpc) return false;
        const root = workspaceRef.current.root;
        const loaded = await rpc('load', { root, folder, name });
        if (!loaded.ok) {
          notify(workspaceErrorText(loaded.error, t), 'error');
          return false;
        }
        const parsed = parseStoredDoc(loaded.value.doc);
        if (!parsed) {
          notify(t('fileLoadFailed'), 'error');
          return false;
        }
        applyLoadedNodes(parsed);
        setWorkspace((current) => ({ ...current, root, folder, file: name }));
        saveWorkspacePref(root, folder, name);
        setSaveState('saved');
        return true;
      }

      async function switchFile(name) {
        const current = workspaceRef.current;
        if (!rpc || !name || name === current.file) return;
        flushEditing();
        await saveWorkspace(false);
        await loadWorkspaceFile(current.folder, name);
      }

      async function switchFolder(folder) {
        const current = workspaceRef.current;
        if (!rpc || folder === current.folder) return;
        flushEditing();
        await saveWorkspace(false);
        const listed = await rpc('list', { root: current.root, folder });
        if (!listed.ok) {
          notify(workspaceErrorText(listed.error, t), 'error');
          return;
        }
        const files = listed.value.files || [];
        setWorkspace((value) => ({ ...value, folder, files, file: null }));
        saveWorkspacePref(current.root, folder, null);
        if (files.length) {
          await loadWorkspaceFile(folder, files[0].name);
        } else {
          applyLoadedNodes([]);
          setSaveState('idle');
        }
      }

      async function refreshWorkspace() {
        if (!rpc) return;
        const current = workspaceRef.current;
        const boot = await rpc('bootstrap', current.root ? { root: current.root } : {});
        if (!boot.ok) {
          notify(workspaceErrorText(boot.error, t), 'error');
          return;
        }
        const folders = boot.value.folders || [];
        const folder = folders.includes(current.folder) ? current.folder : '';
        let files = boot.value.files || [];
        if (folder) {
          const listed = await rpc('list', { root: boot.value.root, folder });
          if (listed.ok) files = listed.value.files || [];
        }
        const file = current.file && files.some((item) => item.name === current.file) ? current.file : null;
        setWorkspace((value) => ({
          ...value,
          ready: true,
          error: null,
          root: boot.value.root,
          folders,
          folder,
          files,
          file,
        }));
        notify(t('filesRefreshed'));
      }

      async function adoptRoot(path) {
        flushEditing();
        await saveWorkspace(false);
        const boot = await rpc('bootstrap', path ? { root: path } : {});
        if (!boot.ok) return { ok: false, error: boot.error };
        const root = boot.value.root;
        const folders = boot.value.folders || [];
        let files = boot.value.files || [];
        let file = files[0] ? files[0].name : null;
        if (!files.length) {
          const name = nextName(files, 'menu-', '.json');
          const saved = await rpc('save', { root, folder: '', name, doc: workspaceDoc() });
          if (saved.ok) {
            files = [{ name }];
            file = name;
          }
        }
        if (file) {
          const loaded = await rpc('load', { root, folder: '', name: file });
          if (loaded.ok) {
            const parsed = parseStoredDoc(loaded.value.doc);
            if (parsed) {
              applyLoadedNodes(parsed);
            } else {
              file = null;
              notify(t('fileLoadFailed'), 'error');
            }
          } else {
            file = null;
            notify(workspaceErrorText(loaded.error, t), 'error');
          }
        }
        setWorkspace({
          ready: true,
          error: null,
          root,
          folders,
          files,
          folder: '',
          file,
        });
        saveWorkspacePref(root, '', file);
        setSaveState(file ? 'saved' : 'idle');
        notify(t('folderAdopted'));
        return { ok: true };
      }

      async function chooseLocalFolder() {
        if (typeof pickDirectory !== 'function') {
          setDialog({ kind: 'root', value: workspaceRef.current.root || '', error: null });
          return;
        }
        let path = null;
        try {
          path = await pickDirectory();
        } catch {
          setDialog({
            kind: 'root',
            value: workspaceRef.current.root || '',
            error: t('folderPickFailed'),
          });
          return;
        }
        if (!path) return;
        const adopted = await adoptRoot(path);
        if (!adopted.ok) notify(workspaceErrorText(adopted.error, t), 'error');
      }

      async function useWorkspaceFolder() {
        const adopted = await adoptRoot('');
        if (!adopted.ok) notify(workspaceErrorText(adopted.error, t), 'error');
      }

      function openCreateDialog(kind) {
        const current = workspaceRef.current;
        const value =
          kind === 'file'
            ? nextName(current.files, 'menu-', '.json').replace(/\.json$/i, '')
            : nextName(current.folders, 'folder-', '');
        setDialog({ kind, value, error: null });
      }

      function closeDialog() {
        setDialog(null);
      }

      async function confirmDialog() {
        if (!dialog || !rpc) return;
        if (dialog.kind === 'root') {
          const path = String(dialog.value || '').trim();
          if (!path) {
            setDialog((current) => (current ? { ...current, error: t('invalidRoot') } : current));
            return;
          }
          const adopted = await adoptRoot(path);
          if (!adopted.ok) {
            setDialog((opened) =>
              opened ? { ...opened, error: workspaceErrorText(adopted.error, t) } : opened,
            );
            return;
          }
          setDialog(null);
          return;
        }
        flushEditing();
        const value = String(dialog.value || '').trim();
        if (!value || /[\\/:*?"<>|]/.test(value) || /[. ]$/.test(value)) {
          setDialog((current) => (current ? { ...current, error: t('invalidName') } : current));
          return;
        }
        const current = workspaceRef.current;
        if (dialog.kind === 'file') {
          const name = value.toLowerCase().endsWith('.json') ? value : value + '.json';
          const saved = await rpc('save', {
            root: current.root,
            folder: current.folder,
            name,
            doc: workspaceDoc(),
            create: true,
          });
          if (!saved.ok) {
            setDialog((opened) =>
              opened ? { ...opened, error: workspaceErrorText(saved.error, t) } : opened,
            );
            return;
          }
          const listed = await rpc('list', { root: current.root, folder: current.folder });
          const files = listed.ok ? listed.value.files || [] : [...current.files, { name }];
          setDialog(null);
          setWorkspace((opened) => ({ ...opened, files, file: name }));
          saveWorkspacePref(current.root, current.folder, name);
          setSaveState('saved');
          notify(t('fileCreated'));
          return;
        }
        const created = await rpc('createFolder', { root: current.root, name: value });
        if (!created.ok) {
          setDialog((opened) =>
            opened ? { ...opened, error: workspaceErrorText(created.error, t) } : opened,
          );
          return;
        }
        const fileName = 'menu-1.json';
        const saved = await rpc('save', {
          root: current.root,
          folder: value,
          name: fileName,
          doc: workspaceDoc(),
        });
        const listed = await rpc('list', { root: current.root, folder: value });
        setDialog(null);
        setWorkspace((opened) => ({
          ...opened,
          folders: created.value.folders || opened.folders,
          folder: value,
          files: listed.ok ? listed.value.files || [] : [],
          file: saved.ok ? fileName : null,
        }));
        saveWorkspacePref(current.root, value, saved.ok ? fileName : null);
        setSaveState(saved.ok ? 'saved' : 'idle');
        notify(t('folderCreated'));
      }

      function onDialogKeyDown(event) {
        event.stopPropagation();
        if (event.isComposing) return;
        if (event.key === 'Escape') {
          event.preventDefault();
          closeDialog();
        } else if (event.key === 'Enter') {
          event.preventDefault();
          void confirmDialog();
        }
      }

      function pushHistory(before) {
        setPast((stack) => [...stack.slice(-(MAX_HISTORY - 1)), cloneNodes(before)]);
        setFuture([]);
      }

      function applyDoc(next) {
        setNodes(next);
        setEditing(null);
        setSelectedId((id) => (next.some((node) => node.id === id) ? id : null));
      }

      function undo() {
        if (!past.length) return;
        const previous = past[past.length - 1];
        setPast(past.slice(0, -1));
        setFuture((stack) => [cloneNodes(nodesRef.current), ...stack].slice(0, MAX_HISTORY));
        applyDoc(previous);
      }

      function redo() {
        if (!future.length) return;
        const next = future[0];
        setFuture(future.slice(1));
        setPast((stack) => [...stack.slice(-(MAX_HISTORY - 1)), cloneNodes(nodesRef.current)]);
        applyDoc(next);
      }

      function commitDraft(id, draft) {
        const current = nodesRef.current;
        const node = findNode(current, id);
        setEditing(null);
        if (!node) return;
        const text = draft.replace(/^\s+|\s+$/g, '');
        if (!text || text === node.text) return;
        const next = current.map((item) => (item.id === id ? { ...item, text } : item));
        nodesRef.current = next;
        setPast((stack) => [...stack.slice(-(MAX_HISTORY - 1)), cloneNodes(current)]);
        setFuture([]);
        setNodes(next);
      }

      function beginEdit(node) {
        if (!node) return;
        setSelectedId(node.id);
        setEditing({ id: node.id, draft: node.text });
      }

      function flushEditing() {
        if (editing) commitDraft(editing.id, editing.draft);
      }

      function updateDraft(draft) {
        setEditing((current) => (current ? { ...current, draft } : current));
      }

      function ensureVisible(node) {
        const canvas = canvasRef.current;
        if (!canvas || !node) return;
        const rect = canvas.getBoundingClientRect();
        if (!rect.width || !rect.height) return;
        setViewport((view) => {
          const left = node.x * view.zoom + view.x;
          const top = node.y * view.zoom + view.y;
          const right = left + NODE_W * view.zoom;
          const bottom = top + NODE_H * view.zoom;
          let x = view.x;
          let y = view.y;
          if (left < 40) x += 40 - left;
          else if (right > rect.width - 40) x -= right - (rect.width - 40);
          if (top < 40) y += 40 - top;
          else if (bottom > rect.height - 40) y -= bottom - (rect.height - 40);
          return x === view.x && y === view.y ? view : { ...view, x, y };
        });
      }

      function addNode(parentId) {
        const current = nodesRef.current;
        const parent = parentId ? findNode(current, parentId) : null;
        let x = 44;
        let y = 44;
        if (parent) {
          const kids = current.filter((node) => node.parentId === parent.id);
          const parentHeight = heights[parent.id] || NODE_H;
          if (kids.length) {
            const rightmost = kids.reduce((best, child) => (child.x > best.x ? child : best), kids[0]);
            x = rightmost.x + NODE_W + H_GAP;
            y = rightmost.y;
          } else {
            x = parent.x;
            y = parent.y + parentHeight + V_GAP;
          }
        } else {
          const roots = current.filter((node) => !node.parentId);
          if (roots.length) {
            const rightmost = roots.reduce((best, root) => (root.x > best.x ? root : best), roots[0]);
            x = rightmost.x + NODE_W + H_GAP * 2;
            y = rightmost.y;
          }
        }
        const id = uid();
        const text = parent ? t('newChild') : t('newRootName');
        const node = { id, text, parentId: parent ? parent.id : null, x, y };
        pushHistory(current);
        setNodes([...current, node]);
        setSelectedId(id);
        setEditing({ id, draft: text });
        ensureVisible(node);
      }

      function removeNode(id) {
        if (!id) return;
        const current = nodesRef.current;
        const ids = collectSubtree(current, id);
        pushHistory(current);
        setNodes(current.filter((node) => !ids.has(node.id)));
        setSelectedId(null);
        setEditing(null);
        notify(t('deleted'));
      }

      function deleteSelected() {
        removeNode(selectedId);
      }

      function copySelected() {
        if (!selectedId) {
          notify(t('selectFirst'), 'error');
          return;
        }
        const current = nodesRef.current;
        const ids = collectSubtree(current, selectedId);
        clipboardStore = current.filter((node) => ids.has(node.id)).map((node) => ({ ...node }));
        notify(t('copied') + ' · ' + ids.size);
      }

      function paste() {
        const clip = clipboardStore;
        if (!clip || !clip.length) {
          notify(t('clipboardEmpty'), 'error');
          return;
        }
        const current = nodesRef.current;
        const clipIds = new Set(clip.map((node) => node.id));
        const clipRoot = clip.find((node) => !node.parentId || !clipIds.has(node.parentId)) || clip[0];
        const anchor = selectedId ? findNode(current, selectedId) : null;
        let baseX;
        let baseY;
        if (anchor) {
          baseX = anchor.x + 36;
          baseY = anchor.y + (heights[anchor.id] || NODE_H) + 44;
        } else {
          const canvas = canvasRef.current;
          if (canvas) {
            const rect = canvas.getBoundingClientRect();
            baseX = (rect.width / 2 - viewport.x) / viewport.zoom - NODE_W / 2;
            baseY = (rect.height / 2 - viewport.y) / viewport.zoom - NODE_H / 2;
          } else {
            baseX = 60;
            baseY = 60;
          }
        }
        const idMap = new Map();
        for (const node of clip) idMap.set(node.id, uid());
        const pasted = clip.map((node) => ({
          id: idMap.get(node.id),
          text: node.text,
          parentId: node.id === clipRoot.id ? (anchor ? anchor.id : null) : idMap.get(node.parentId) || null,
          x: Math.round(node.x - clipRoot.x + baseX),
          y: Math.round(node.y - clipRoot.y + baseY),
        }));
        pushHistory(current);
        setNodes([...current, ...pasted]);
        setSelectedId(idMap.get(clipRoot.id));
        setEditing(null);
        notify(t('pasted') + ' · ' + pasted.length);
        const root = findNode(pasted, idMap.get(clipRoot.id));
        if (root) ensureVisible(root);
      }

      function tidy() {
        const current = nodesRef.current;
        if (!current.length) return;
        const next = tidyNodes(current);
        pushHistory(current);
        setNodes(next);
        setSelectedId((id) => (id && next.some((node) => node.id === id) ? id : null));
        setEditing(null);
        requestAnimationFrame(() => fitView(next));
      }

      function zoomAt(px, py, factor) {
        setViewport((view) => {
          const zoom = clamp(view.zoom * factor, 0.25, 2.5);
          if (zoom === view.zoom) return view;
          const ratio = zoom / view.zoom;
          return {
            zoom,
            x: px - ratio * (px - view.x),
            y: py - ratio * (py - view.y),
          };
        });
      }

      function zoomBy(factor) {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const rect = canvas.getBoundingClientRect();
        zoomAt(rect.width / 2, rect.height / 2, factor);
      }

      function fitView(list) {
        const items = list || nodesRef.current;
        const canvas = canvasRef.current;
        if (!canvas || !items.length) return;
        const rect = canvas.getBoundingClientRect();
        if (!rect.width || !rect.height) return;
        let minX = Infinity;
        let minY = Infinity;
        let maxX = -Infinity;
        let maxY = -Infinity;
        for (const node of items) {
          const height = heights[node.id] || NODE_H;
          minX = Math.min(minX, node.x);
          minY = Math.min(minY, node.y);
          maxX = Math.max(maxX, node.x + NODE_W);
          maxY = Math.max(maxY, node.y + height);
        }
        const pad = 54;
        const boxWidth = Math.max(NODE_W, maxX - minX);
        const boxHeight = Math.max(NODE_H, maxY - minY);
        const zoom = clamp(
          Math.min((rect.width - pad * 2) / boxWidth, (rect.height - pad * 2) / boxHeight, 1),
          0.25,
          1.5,
        );
        setViewport({
          zoom,
          x: (rect.width - boxWidth * zoom) / 2 - minX * zoom,
          y: (rect.height - boxHeight * zoom) / 2 - minY * zoom,
        });
      }

      function exportDoc() {
        const payload = {
          app: 'dsh-menu-tree-editor',
          version: 1,
          exportedAt: new Date().toISOString(),
          nodes: nodesRef.current,
        };
        const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const anchor = document.createElement('a');
        anchor.href = url;
        anchor.download = `menu-tree-${stamp()}.json`;
        anchor.click();
        setTimeout(() => URL.revokeObjectURL(url), 1500);
        notify(t('exported'));
      }

      async function copyOutline() {
        const markdown = buildMarkdown(nodesRef.current, t);
        try {
          if (!navigator.clipboard || typeof navigator.clipboard.writeText !== 'function') {
            throw new Error('clipboard unavailable');
          }
          await navigator.clipboard.writeText(markdown);
          notify(t('copiedOutline'));
        } catch {
          notify(t('copyFailed'), 'error');
        }
      }

      function exportMarkdown() {
        const markdown = buildMarkdown(nodesRef.current, t);
        const blob = new Blob([markdown], { type: 'text/markdown;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const anchor = document.createElement('a');
        anchor.href = url;
        anchor.download = `menu-tree-${stamp()}.md`;
        anchor.click();
        setTimeout(() => URL.revokeObjectURL(url), 1500);
        notify(t('exportedMarkdown'));
      }

      function exportSvg() {
        const built = buildTreeSvg(nodesRef.current, t);
        if (!built) {
          notify(t('exportEmpty'), 'error');
          return;
        }
        downloadBlob(
          new Blob([built.svg], { type: 'image/svg+xml;charset=utf-8' }),
          `menu-tree-${stamp()}.svg`,
        );
        notify(t('exportedSvg'));
      }

      function exportPng() {
        const built = buildTreeSvg(nodesRef.current, t);
        if (!built) {
          notify(t('exportEmpty'), 'error');
          return;
        }
        const svgUrl = URL.createObjectURL(
          new Blob([built.svg], { type: 'image/svg+xml;charset=utf-8' }),
        );
        const image = new Image();
        image.onload = () => {
          try {
            const maxSide = 6000;
            const scale = Math.max(
              0.2,
              Math.min(2, maxSide / Math.max(built.width, built.height)),
            );
            const canvas = document.createElement('canvas');
            canvas.width = Math.max(1, Math.ceil(built.width * scale));
            canvas.height = Math.max(1, Math.ceil(built.height * scale));
            const context = canvas.getContext('2d');
            if (!context) throw new Error('canvas unavailable');
            context.setTransform(scale, 0, 0, scale, 0, 0);
            context.fillStyle = '#ffffff';
            context.fillRect(0, 0, built.width, built.height);
            context.drawImage(image, 0, 0, built.width, built.height);
            canvas.toBlob((blob) => {
              URL.revokeObjectURL(svgUrl);
              if (!blob) {
                notify(t('imageFailed'), 'error');
                return;
              }
              downloadBlob(blob, `menu-tree-${stamp()}.png`);
              notify(t('exportedPng'));
            }, 'image/png');
          } catch {
            URL.revokeObjectURL(svgUrl);
            notify(t('imageFailed'), 'error');
          }
        };
        image.onerror = () => {
          URL.revokeObjectURL(svgUrl);
          notify(t('imageFailed'), 'error');
        };
        image.src = svgUrl;
      }

      function onImportFile(event) {
        const input = event.currentTarget;
        const file = input.files && input.files[0];
        input.value = '';
        if (!file) return;
        const reader = new FileReader();
        reader.onload = () => {
          try {
            const parsed = JSON.parse(String(reader.result));
            const imported = sanitizeNodes(parsed && Array.isArray(parsed.nodes) ? parsed.nodes : parsed);
            if (!imported) throw new Error('invalid');
            pushHistory(nodesRef.current);
            setNodes(imported);
            setSelectedId(null);
            setEditing(null);
            requestAnimationFrame(() => fitView(imported));
            notify(t('imported'));
          } catch {
            notify(t('importFailed'), 'error');
          }
        };
        reader.onerror = () => notify(t('importFailed'), 'error');
        reader.readAsText(file);
      }

      /* ------------------------ node gestures -------------------------- */

      function onNodePointerDown(event, node) {
        if (event.button !== 0) return;
        if (event.target.closest && event.target.closest('button, textarea, input')) return;
        event.stopPropagation();
        if (editing && document.activeElement && document.activeElement.blur) document.activeElement.blur();
        setSelectedId(node.id);
        const current = nodesRef.current;
        const origin = cloneNodes(current);
        dragRef.current = {
          pointerId: event.pointerId,
          nodeId: node.id,
          startX: event.clientX,
          startY: event.clientY,
          zoom: viewport.zoom,
          origin,
          ids: collectSubtree(current, node.id),
          moved: false,
        };
        try {
          event.currentTarget.setPointerCapture(event.pointerId);
        } catch {
          /* pointer capture is a convenience */
        }
        setDraggingId(node.id);
      }

      function onNodePointerMove(event) {
        const drag = dragRef.current;
        if (!drag || drag.pointerId !== event.pointerId) return;
        const dx = (event.clientX - drag.startX) / drag.zoom;
        const dy = (event.clientY - drag.startY) / drag.zoom;
        if (!drag.moved && Math.hypot(dx * drag.zoom, dy * drag.zoom) < 3) return;
        drag.moved = true;
        const nx = Math.round(dx);
        const ny = Math.round(dy);
        setNodes(
          drag.origin.map((item) =>
            drag.ids.has(item.id) ? { ...item, x: item.x + nx, y: item.y + ny } : item,
          ),
        );
      }

      function onNodePointerUp(event) {
        const drag = dragRef.current;
        if (!drag) return;
        dragRef.current = null;
        setDraggingId(null);
        try {
          event.currentTarget.releasePointerCapture(drag.pointerId);
        } catch {
          /* ignore */
        }
        if (drag.moved) {
          setPast((stack) => [...stack.slice(-(MAX_HISTORY - 1)), drag.origin]);
          setFuture([]);
        }
      }

      /* ------------------------ canvas gestures ------------------------ */

      function onCanvasPointerDown(event) {
        if (event.button !== 0 && event.button !== 1) return;
        if (event.target.closest && event.target.closest('.mte-node, button, input, textarea, a')) return;
        if (editing && document.activeElement && document.activeElement.blur) document.activeElement.blur();
        setSelectedId(null);
        panRef.current = {
          pointerId: event.pointerId,
          startX: event.clientX,
          startY: event.clientY,
          vx: viewport.x,
          vy: viewport.y,
        };
        try {
          event.currentTarget.setPointerCapture(event.pointerId);
        } catch {
          /* ignore */
        }
        setPanning(true);
      }

      function onCanvasPointerMove(event) {
        const pan = panRef.current;
        if (!pan || pan.pointerId !== event.pointerId) return;
        const dx = event.clientX - pan.startX;
        const dy = event.clientY - pan.startY;
        setViewport((view) => ({ ...view, x: pan.vx + dx, y: pan.vy + dy }));
      }

      function onCanvasPointerUp(event) {
        const pan = panRef.current;
        if (!pan) return;
        panRef.current = null;
        setPanning(false);
        try {
          event.currentTarget.releasePointerCapture(pan.pointerId);
        } catch {
          /* ignore */
        }
      }

      /* --------------------------- effects ----------------------------- */

      useEffect(() => {
        if (initStartedRef.current) return;
        initStartedRef.current = true;
        void initWorkspace();
      }, [rpc]);

      useEffect(() => {
        if (!notice) return;
        const timer = setTimeout(() => setNotice(null), 2600);
        return () => clearTimeout(timer);
      }, [notice]);

      useEffect(() => {
        const timer = setTimeout(() => {
          try {
            localStorage.setItem(
              DOC_KEY,
              JSON.stringify({ app: 'dsh-menu-tree-editor', version: 1, nodes }),
            );
          } catch {
            /* storage may be unavailable */
          }
        }, 300);
        return () => clearTimeout(timer);
      }, [nodes]);

      useEffect(() => {
        if (!hydratedRef.current) return;
        const current = workspaceRef.current;
        if (!rpc || !current.ready || !current.file) return;
        const timer = setTimeout(() => {
          void saveWorkspace(false);
        }, 900);
        return () => clearTimeout(timer);
      }, [nodes, rpc]);

      useEffect(
        () => () => {
          const latest = latestRef.current;
          let finalNodes = latest.nodes;
          if (latest.editing) {
            const text = latest.editing.draft.trim();
            if (text) {
              finalNodes = latest.nodes.map((node) =>
                node.id === latest.editing.id ? { ...node, text } : node,
              );
            }
          }
          try {
            localStorage.setItem(
              DOC_KEY,
              JSON.stringify({ app: 'dsh-menu-tree-editor', version: 1, nodes: finalNodes }),
            );
          } catch {
            /* storage may be unavailable */
          }
          const current = workspaceRef.current;
          if (rpc && current.ready && current.file) {
            void rpc('save', {
              root: current.root,
              folder: current.folder,
              name: current.file,
              doc: { app: 'dsh-menu-tree-editor', version: 1, nodes: finalNodes },
            });
          }
        },
        [],
      );

      useEffect(() => {
        if (typeof ResizeObserver === 'undefined') return;
        const observer = new ResizeObserver((entries) => {
          setHeights((previous) => {
            let changed = false;
            const next = { ...previous };
            for (const entry of entries) {
              const id = entry.target.getAttribute('data-node-id');
              if (!id) continue;
              const box = entry.borderBoxSize && entry.borderBoxSize[0];
              const height = Math.round(box ? box.blockSize : entry.contentRect.height + 22);
              if (height > 0 && next[id] !== height) {
                next[id] = height;
                changed = true;
              }
            }
            return changed ? next : previous;
          });
        });
        nodeEls.current.forEach((el) => observer.observe(el));
        return () => observer.disconnect();
      }, [nodeKey]);

      useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const onWheel = (event) => {
          const rect = canvas.getBoundingClientRect();
          event.preventDefault();
          zoomAt(event.clientX - rect.left, event.clientY - rect.top, Math.exp(-event.deltaY * 0.0015));
        };
        canvas.addEventListener('wheel', onWheel, { passive: false });
        return () => canvas.removeEventListener('wheel', onWheel);
      }, []);

      useEffect(() => {
        let attempts = 0;
        let timer = null;
        const tryFit = () => {
          const canvas = canvasRef.current;
          if (canvas && canvas.getBoundingClientRect().width > 0) {
            fitView();
            return;
          }
          attempts += 1;
          if (attempts < 12) timer = setTimeout(tryFit, 80);
        };
        timer = setTimeout(tryFit, 120);
        return () => {
          if (timer) clearTimeout(timer);
        };
      }, []);

      useEffect(() => {
        const onKeyDown = (event) => {
          const root = rootRef.current;
          if (!root || root.offsetParent === null) return;
          const target = event.target;
          if (
            target &&
            (target.tagName === 'TEXTAREA' || target.tagName === 'INPUT' || target.isContentEditable)
          ) {
            return;
          }
          const mod = event.ctrlKey || event.metaKey;
          const key = String(event.key || '').toLowerCase();
          if (mod && key === 'z') {
            event.preventDefault();
            if (event.shiftKey) redo();
            else undo();
            return;
          }
          if (mod && key === 'y') {
            event.preventDefault();
            redo();
            return;
          }
          if (mod && key === 'c') {
            event.preventDefault();
            copySelected();
            return;
          }
          if (mod && key === 'v') {
            event.preventDefault();
            paste();
            return;
          }
          if (mod && key === 's') {
            event.preventDefault();
            if (workspaceRef.current.file) void saveWorkspace(true);
            else exportDoc();
            return;
          }
          if (event.key === 'Delete' || event.key === 'Backspace') {
            if (selectedId) {
              event.preventDefault();
              deleteSelected();
            }
            return;
          }
          if (event.key === 'Enter' || event.key === 'F2') {
            if (selectedId && !editing) {
              event.preventDefault();
              beginEdit(findNode(nodesRef.current, selectedId));
            }
            return;
          }
          if (event.key === 'Escape') {
            if (editing) setEditing(null);
            else setSelectedId(null);
          }
        };
        window.addEventListener('keydown', onKeyDown);
        return () => window.removeEventListener('keydown', onKeyDown);
      }, [selectedId, editing, past, future, nodes, heights]);

      /* ---------------------------- render ----------------------------- */

      const nodeCards = nodes.map((node) =>
        h(NodeCard, {
          key: node.id,
          node,
          depth: depths.get(node.id) || 0,
          selected: selectedId === node.id,
          dragging: draggingId === node.id,
          editing: Boolean(editing && editing.id === node.id),
          draft: editing && editing.id === node.id ? editing.draft : '',
          childCount: (children.get(node.id) || []).length,
          t,
          onDraft: updateDraft,
          setEl: (id, el) => {
            if (el) nodeEls.current.set(id, el);
            else nodeEls.current.delete(id);
          },
          onPointerDown: onNodePointerDown,
          onPointerMove: onNodePointerMove,
          onPointerUp: onNodePointerUp,
          onEdit: beginEdit,
          onAdd: addNode,
          onDelete: removeNode,
          onCommit: commitDraft,
          onCancel: () => setEditing(null),
        }),
      );

      const workspaceReady = Boolean(rpc && workspace.ready && !workspace.error);
      const fileNames = workspace.files || [];
      const saveLabel = workspace.error
        ? t('localOnly')
        : saveState === 'saving'
          ? t('saving')
          : saveState === 'error'
            ? t('saveFailed')
            : workspace.file
              ? t('savedToWorkspace')
              : t('localOnly');
      const workspaceLabel = workspace.error
        ? t('localOnly')
        : workspace.root || t('localOnly');
      const workspaceTitle = workspace.root
        ? workspace.root + (workspace.folder ? ' / ' + workspace.folder : '')
        : t('workspaceUnavailable');

      return h(
        'div',
        { className: 'mte-root' + (embedded ? ' mte-embedded' : ''), ref: rootRef },
        h('style', null, CSS),
        h(
          'header',
          { className: 'mte-header' },
          h(
            'div',
            { className: 'mte-heading' },
            h('h1', { className: 'mte-title' }, t('title')),
            h('p', { className: 'mte-subtitle' }, t('subtitle')),
          ),
          h(
            'div',
            { className: 'mte-meta' },
            h('span', { className: 'mte-pill' }, nodes.length + ' ' + t('moduleCount')),
            h('span', { className: 'mte-save' }, t('autosaved')),
          ),
        ),
        h(
          'div',
          { className: 'mte-filebar' },
          h(
            'div',
            { className: 'mte-filebar-info' },
            h('span', { className: 'mte-filebar-icon' }, h(Glyph, { name: 'folder' })),
            h(
              'div',
              { className: 'mte-filebar-text' },
              h('span', { className: 'mte-filebar-title' }, t('workspace')),
              h(
                'span',
                { className: 'mte-filebar-path', title: workspaceTitle },
                workspaceLabel,
              ),
            ),
          ),
          h(
            'div',
            { className: 'mte-filebar-controls' },
            h(
              'label',
              { className: 'mte-field' },
              h('span', { className: 'mte-field-label' }, t('folderLabel')),
              h(
                'select',
                {
                  className: 'mte-select',
                  value: workspace.folder,
                  disabled: !workspaceReady,
                  onChange: (event) => {
                    void switchFolder(event.target.value);
                  },
                },
                h('option', { value: '' }, t('rootFolder')),
                (workspace.folders || []).map((name) =>
                  h('option', { key: name, value: name }, name),
                ),
              ),
            ),
            h(
              'label',
              { className: 'mte-field' },
              h('span', { className: 'mte-field-label' }, t('fileLabel')),
              h(
                'select',
                {
                  className: 'mte-select mte-select-file',
                  value: workspace.file || '',
                  disabled: !workspaceReady || !fileNames.length,
                  onChange: (event) => {
                    void switchFile(event.target.value);
                  },
                },
                fileNames.length
                  ? fileNames.map((item) => h('option', { key: item.name, value: item.name }, item.name))
                  : h('option', { value: '' }, t('noFiles')),
              ),
            ),
            h(Btn, {
              label: t('chooseFolder'),
              icon: 'folder',
              title: t('chooseFolder'),
              onClick: () => {
                void chooseLocalFolder();
              },
              disabled: !workspace.ready,
            }),
            h(Btn, {
              label: t('useWorkspace'),
              icon: 'home',
              iconOnly: true,
              title: t('useWorkspace'),
              onClick: () => {
                void useWorkspaceFolder();
              },
              disabled: !workspace.ready,
            }),
            h(Btn, {
              label: t('newFile'),
              icon: 'filePlus',
              iconOnly: true,
              title: t('newFile'),
              onClick: () => openCreateDialog('file'),
              disabled: !workspaceReady,
            }),
            h(Btn, {
              label: t('newFolder'),
              icon: 'folderPlus',
              iconOnly: true,
              title: t('newFolder'),
              onClick: () => openCreateDialog('folder'),
              disabled: !workspaceReady,
            }),
            h(Btn, {
              label: t('saveFile'),
              icon: 'save',
              iconOnly: true,
              title: t('saveFile'),
              onClick: () => {
                void saveWorkspace(true);
              },
              disabled: !workspaceReady || !workspace.file,
            }),
            h(Btn, {
              label: t('refreshFiles'),
              icon: 'refresh',
              iconOnly: true,
              title: t('refreshFiles'),
              onClick: () => {
                void refreshWorkspace();
              },
              disabled: !rpc,
            }),
            h(
              'span',
              {
                className:
                  'mte-save-state' +
                  (workspace.error || saveState === 'error' ? ' is-error' : '') +
                  (saveState === 'saving' ? ' is-saving' : ''),
                title: workspace.error ? t('workspaceUnavailable') : workspaceTitle,
              },
              saveLabel,
            ),
          ),
        ),
        h(
          'div',
          { className: 'mte-toolbar' },
          h(
            'div',
            { className: 'mte-group' },
            h(Btn, {
              label: t('newRoot'),
              icon: 'plus',
              kind: 'primary',
              onClick: () => addNode(null),
            }),
            h(Btn, {
              label: t('addChild'),
              icon: 'branch',
              onClick: () => addNode(selectedId),
              disabled: !selectedId,
            }),
            h(Btn, {
              label: t('deleteNode'),
              icon: 'trash',
              danger: true,
              onClick: deleteSelected,
              disabled: !selectedId,
            }),
            h(Btn, { label: t('tidy'), icon: 'layout', onClick: tidy }),
          ),
          h('span', { className: 'mte-sep' }),
          h(
            'div',
            { className: 'mte-group' },
            h(Btn, {
              label: t('undo'),
              icon: 'undo',
              iconOnly: true,
              title: t('undo') + ' (Ctrl+Z)',
              onClick: undo,
              disabled: !past.length,
            }),
            h(Btn, {
              label: t('redo'),
              icon: 'redo',
              iconOnly: true,
              title: t('redo') + ' (Ctrl+Y)',
              onClick: redo,
              disabled: !future.length,
            }),
          ),
          h('span', { className: 'mte-sep' }),
          h(
            'div',
            { className: 'mte-group' },
            h(Btn, {
              label: t('copy'),
              icon: 'copy',
              iconOnly: true,
              title: t('copy') + ' (Ctrl+C)',
              onClick: copySelected,
            }),
            h(Btn, {
              label: t('paste'),
              icon: 'paste',
              iconOnly: true,
              title: t('paste') + ' (Ctrl+V)',
              onClick: paste,
            }),
          ),
          h('span', { className: 'mte-sep' }),
          h(
            'div',
            { className: 'mte-group' },
            h(Btn, {
              label: t('importDoc'),
              icon: 'upload',
              iconOnly: true,
              title: t('importDoc'),
              onClick: () => fileRef.current && fileRef.current.click(),
            }),
            h(Btn, {
              label: t('exportDoc'),
              icon: 'download',
              iconOnly: true,
              title: t('exportDoc'),
              onClick: exportDoc,
            }),
            h(Btn, {
              label: t('copyOutline'),
              icon: 'text',
              iconOnly: true,
              title: t('copyOutlineHint'),
              onClick: copyOutline,
            }),
            h(Btn, {
              label: t('exportMarkdown'),
              icon: 'doc',
              iconOnly: true,
              title: t('exportMarkdown'),
              onClick: exportMarkdown,
            }),
            h(Btn, {
              label: t('exportPng'),
              icon: 'image',
              iconOnly: true,
              title: t('exportPngHint'),
              onClick: exportPng,
            }),
            h(Btn, {
              label: t('exportSvg'),
              icon: 'vector',
              iconOnly: true,
              title: t('exportSvgHint'),
              onClick: exportSvg,
            }),
          ),
          h('span', { className: 'mte-spacer' }),
          h(
            'div',
            { className: 'mte-group mte-zoom' },
            h(Btn, {
              label: t('zoomOut'),
              icon: 'zoomOut',
              iconOnly: true,
              title: t('zoomOut'),
              onClick: () => zoomBy(0.85),
            }),
            h(
              'span',
              { className: 'mte-zoom-value' },
              Math.round(viewport.zoom * 100) + '%',
            ),
            h(Btn, {
              label: t('zoomIn'),
              icon: 'zoomIn',
              iconOnly: true,
              title: t('zoomIn'),
              onClick: () => zoomBy(1.18),
            }),
            h(Btn, {
              label: t('fit'),
              icon: 'fit',
              onClick: () => fitView(),
            }),
          ),
          h('input', {
            ref: fileRef,
            type: 'file',
            accept: 'application/json,.json',
            style: { display: 'none' },
            onChange: onImportFile,
          }),
        ),
        h(
          'div',
          {
            className: 'mte-canvas' + (panning ? ' is-panning' : ''),
            ref: canvasRef,
            style: {
              backgroundSize: 22 * viewport.zoom + 'px ' + 22 * viewport.zoom + 'px',
              backgroundPosition: viewport.x + 'px ' + viewport.y + 'px',
            },
            onPointerDown: onCanvasPointerDown,
            onPointerMove: onCanvasPointerMove,
            onPointerUp: onCanvasPointerUp,
            onPointerCancel: onCanvasPointerUp,
          },
          h(
            'div',
            {
              className: 'mte-world',
              style: {
                transform: `translate(${viewport.x}px, ${viewport.y}px) scale(${viewport.zoom})`,
              },
            },
            geometry
              ? h(
                  'svg',
                  {
                    className: 'mte-edges',
                    'aria-hidden': true,
                    style: {
                      left: geometry.minX,
                      top: geometry.minY,
                      width: geometry.width,
                      height: geometry.height,
                    },
                    viewBox: `${geometry.minX} ${geometry.minY} ${geometry.width} ${geometry.height}`,
                  },
                  geometry.paths.map((edge) =>
                    h(
                      'g',
                      { key: edge.key },
                      h('path', { className: 'mte-edge', d: edge.d }),
                      h('circle', { className: 'mte-edge-dot', cx: edge.ex, cy: edge.ey, r: 2.6 }),
                    ),
                  ),
                )
              : null,
            nodeCards,
          ),
          nodes.length === 0
            ? h(
                'div',
                { className: 'mte-empty' },
                h('div', { className: 'mte-empty-mark' }, h(Glyph, { name: 'branch' })),
                h('h2', { className: 'mte-empty-title' }, t('emptyTitle')),
                h('p', { className: 'mte-empty-hint' }, t('emptyHint')),
                h(Btn, {
                  label: t('emptyAction'),
                  icon: 'plus',
                  kind: 'primary',
                  onClick: () => addNode(null),
                }),
              )
            : null,
          h('div', { className: 'mte-canvas-hint' }, t('canvasHint')),
          notice
            ? h(
                'div',
                {
                  className: 'mte-notice' + (notice.tone === 'error' ? ' is-error' : ''),
                  role: 'status',
                },
                notice.text,
              )
            : null,
        ),
        h(
          'footer',
          { className: 'mte-footer' },
          h('span', { className: 'mte-footer-hint' }, t('shortcuts')),
          h('span', { className: 'mte-footer-count' }, nodes.length + ' ' + t('moduleCount')),
        ),
        dialog
          ? h(
              'div',
              {
                className: 'mte-modal-backdrop',
                onPointerDown: (event) => {
                  if (event.target === event.currentTarget) closeDialog();
                },
              },
              h(
                'div',
                {
                  className: 'mte-modal',
                  role: 'dialog',
                  'aria-modal': 'true',
                  'aria-labelledby': 'mte-dialog-title',
                },
                h(
                  'h3',
                  { id: 'mte-dialog-title', className: 'mte-modal-title' },
                  dialog.kind === 'file'
                    ? t('createFileTitle')
                    : dialog.kind === 'root'
                      ? t('rootDialogTitle')
                      : t('createFolderTitle'),
                ),
                h(
                  'p',
                  { className: 'mte-modal-hint' },
                  dialog.kind === 'file'
                    ? t('createFileHint')
                    : dialog.kind === 'root'
                      ? t('rootDialogHint')
                      : t('createFolderHint'),
                ),
                h('input', {
                  className: 'mte-modal-input',
                  value: dialog.value,
                  autoFocus: true,
                  spellCheck: false,
                  placeholder:
                    dialog.kind === 'file'
                      ? t('fileNamePlaceholder')
                      : dialog.kind === 'root'
                        ? t('folderPathPlaceholder')
                        : t('folderNamePlaceholder'),
                  onChange: (event) =>
                    setDialog((current) =>
                      current ? { ...current, value: event.target.value, error: null } : current,
                    ),
                  onKeyDown: onDialogKeyDown,
                }),
                dialog.error ? h('div', { className: 'mte-modal-error' }, dialog.error) : null,
                h(
                  'div',
                  { className: 'mte-modal-actions' },
                  h(
                    'button',
                    { type: 'button', className: 'mte-btn', onClick: closeDialog },
                    t('cancel'),
                  ),
                  h(
                    'button',
                    {
                      type: 'button',
                      className: 'mte-btn mte-btn-primary',
                      onClick: () => {
                        void confirmDialog();
                      },
                    },
                    t('create'),
                  ),
                ),
              ),
            )
          : null,
      );
    }

    function AppPage({ t, rpc, pickDirectory }) {
      const [view, setView] = useState(() => {
        try {
          return localStorage.getItem(APP_VIEW_KEY) === 'tree' ? 'tree' : 'notes';
        } catch {
          return 'notes';
        }
      });
      const [menuOpen, setMenuOpen] = useState(false);
      const [toolsOpen, setToolsOpen] = useState(false);
      const menuRef = useRef(null);

      useEffect(() => {
        try {
          localStorage.setItem(APP_VIEW_KEY, view);
        } catch {
          /* storage may be unavailable */
        }
      }, [view]);

      useEffect(() => {
        if (!menuOpen) return;
        const onPointerDown = (event) => {
          if (menuRef.current && !menuRef.current.contains(event.target)) setMenuOpen(false);
        };
        const onKeyDown = (event) => {
          if (event.key === 'Escape') setMenuOpen(false);
        };
        document.addEventListener('pointerdown', onPointerDown);
        document.addEventListener('keydown', onKeyDown);
        return () => {
          document.removeEventListener('pointerdown', onPointerDown);
          document.removeEventListener('keydown', onKeyDown);
        };
      }, [menuOpen]);

      const chooseView = (next) => {
        setView(next);
        setMenuOpen(false);
      };

      return h(
        'div',
        { className: 'nt-app' },
        h('style', null, APP_CSS),
        h(
          'header',
          { className: 'nt-app-head' },
          h(
            'div',
            { className: 'nt-app-brand' },
            h('div', { className: 'nt-app-mark' }, h(Glyph, { name: 'notebook' })),
            h(
              'div',
              { className: 'nt-app-brand-text' },
              h('h1', null, t('appTitle')),
              h('p', null, t('appSubtitle')),
            ),
          ),
          h(
            'div',
            { className: 'nt-app-actions', ref: menuRef },
            h(
              'span',
              { className: 'nt-app-current' },
              view === 'tree' ? t('tools') + ' / ' + t('menuTree') : t('notebook'),
            ),
            h(
              'button',
              {
                type: 'button',
                className: 'nt-menu-btn' + (menuOpen ? ' is-open' : ''),
                onClick: () => {
                  setMenuOpen((open) => !open);
                  if (!menuOpen) setToolsOpen(false);
                },
              },
              h(Glyph, { name: 'menu' }),
              h('span', null, t('advancedMenu')),
              h(Glyph, { name: 'chevron' }),
            ),
            menuOpen
              ? h(
                  'div',
                  { className: 'nt-menu-pop' },
                  h('div', { className: 'nt-menu-title' }, t('advancedMenu')),
                  h(
                    'button',
                    {
                      type: 'button',
                      className: 'nt-menu-entry' + (view === 'notes' ? ' is-active' : ''),
                      onClick: () => chooseView('notes'),
                    },
                    h(Glyph, { name: 'notebook' }),
                    h('span', null, t('notebook')),
                    view === 'notes' ? h(Glyph, { name: 'check' }) : null,
                  ),
                  h(
                    'button',
                    {
                      type: 'button',
                      className: 'nt-menu-group' + (toolsOpen ? ' is-open' : ''),
                      onClick: () => setToolsOpen((open) => !open),
                    },
                    h(Glyph, { name: 'layout' }),
                    h('span', null, t('tools')),
                    h(Glyph, { name: 'chevron' }),
                  ),
                  toolsOpen
                    ? h(
                        'button',
                        {
                          type: 'button',
                          className: 'nt-menu-entry nt-menu-sub' + (view === 'tree' ? ' is-active' : ''),
                          onClick: () => chooseView('tree'),
                        },
                        h(Glyph, { name: 'branch' }),
                        h('span', null, t('menuTree')),
                        view === 'tree' ? h(Glyph, { name: 'check' }) : null,
                      )
                    : null,
                )
              : null,
          ),
        ),
        h(
          'div',
          { className: 'nt-app-body' + (view === 'tree' ? ' is-tree' : '') },
          view === 'tree'
            ? h(EditorPage, { t, rpc, pickDirectory, embedded: true })
            : h(NotebookPage, { t }),
        ),
      );
    }

    /* ------------------------------------------------------------------ */
    /* Styles                                                              */
    /* ------------------------------------------------------------------ */

    const CSS = `
.mte-root {
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 22px 26px 14px;
  color: var(--dsw-alias-label-primary);
  font-size: 13px;
  line-height: 1.5;
  min-width: 0;
}
.mte-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
}
.mte-heading { min-width: 0; }
.mte-title {
  margin: 0;
  font-size: 19px;
  line-height: 1.3;
  font-weight: 650;
  letter-spacing: 0.01em;
}
.mte-subtitle {
  margin: 6px 0 0;
  font-size: 12.5px;
  color: var(--dsw-alias-label-secondary);
  max-width: 720px;
}
.mte-meta {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
  padding-top: 3px;
  font-size: 11.5px;
  color: var(--dsw-alias-label-secondary);
  white-space: nowrap;
}
.mte-pill {
  padding: 3px 9px;
  border: 1px solid var(--dsw-alias-border-l1);
  border-radius: 999px;
  background: var(--dsw-alias-bg-layer-2);
  color: var(--dsw-alias-label-secondary);
}
.mte-save { display: inline-flex; align-items: center; gap: 6px; }
.mte-save::before {
  content: '';
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: var(--dsw-alias-state-success-primary);
}
.mte-filebar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  flex-wrap: wrap;
  padding: 8px 10px;
  border: 1px solid var(--dsw-alias-border-l1);
  border-radius: 12px;
  background: var(--dsw-alias-bg-layer-2);
}
.mte-filebar-info {
  display: flex;
  align-items: center;
  gap: 8px;
  min-width: 0;
}
.mte-filebar-icon {
  display: grid;
  place-items: center;
  flex: none;
  width: 30px;
  height: 30px;
  border: 1px solid var(--dsw-alias-border-l1);
  border-radius: 8px;
  background: var(--dsw-alias-bg-layer-1);
  color: var(--dsw-alias-brand-primary);
}
.mte-filebar-text {
  display: flex;
  flex-direction: column;
  min-width: 0;
  line-height: 1.35;
}
.mte-filebar-title {
  font-size: 9.5px;
  font-weight: 650;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--dsw-alias-label-secondary);
}
.mte-filebar-path {
  max-width: 280px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-size: 11.5px;
  color: var(--dsw-alias-label-primary);
}
.mte-filebar-controls {
  display: flex;
  align-items: center;
  gap: 6px;
  flex-wrap: wrap;
}
.mte-field {
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 11px;
  color: var(--dsw-alias-label-secondary);
}
.mte-field-label { white-space: nowrap; }
.mte-select {
  height: 30px;
  max-width: 200px;
  padding: 0 8px;
  border: 1px solid var(--dsw-alias-border-l1);
  border-radius: 8px;
  background: var(--dsw-alias-bg-layer-1);
  color: var(--dsw-alias-label-primary);
  font: inherit;
  font-size: 12px;
  cursor: pointer;
}
.mte-select:disabled { opacity: 0.5; cursor: not-allowed; }
.mte-select-file { max-width: 180px; }
.mte-save-state {
  padding: 0 4px;
  font-size: 11px;
  color: var(--dsw-alias-label-secondary);
  white-space: nowrap;
}
.mte-save-state.is-saving { color: var(--dsw-alias-state-warn-primary); }
.mte-save-state.is-error { color: var(--dsw-alias-state-error-primary); }
.mte-modal-backdrop {
  position: fixed;
  inset: 0;
  z-index: 60;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
  background: rgba(15, 23, 42, 0.38);
  backdrop-filter: blur(2px);
}
.mte-modal {
  width: min(420px, 100%);
  padding: 20px;
  border: 1px solid var(--dsw-alias-border-l1);
  border-radius: 16px;
  background: var(--dsw-alias-bg-overlay);
  box-shadow: 0 24px 60px -24px rgba(15, 23, 42, 0.55);
  color: var(--dsw-alias-label-primary);
}
.mte-modal-title { margin: 0; font-size: 16px; font-weight: 600; }
.mte-modal-hint {
  margin: 8px 0 14px;
  font-size: 12px;
  line-height: 1.55;
  color: var(--dsw-alias-label-secondary);
}
.mte-modal-input {
  width: 100%;
  height: 36px;
  padding: 0 10px;
  border: 1px solid var(--dsw-alias-border-l2);
  border-radius: 9px;
  background: var(--dsw-alias-bg-base);
  color: var(--dsw-alias-label-primary);
  font: inherit;
  font-size: 13px;
  outline: none;
}
.mte-modal-input:focus {
  border-color: var(--dsw-alias-brand-primary);
  box-shadow: 0 0 0 3px color-mix(in srgb, var(--dsw-alias-brand-primary) 18%, transparent);
}
.mte-modal-error {
  margin-top: 8px;
  font-size: 11.5px;
  color: var(--dsw-alias-state-error-primary);
}
.mte-modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  margin-top: 18px;
}
.mte-toolbar {
  display: flex;
  align-items: center;
  gap: 6px;
  flex-wrap: wrap;
  padding: 7px 8px;
  border: 1px solid var(--dsw-alias-border-l1);
  border-radius: 12px;
  background: var(--dsw-alias-bg-layer-2);
}
.mte-group { display: flex; align-items: center; gap: 4px; }
.mte-spacer { flex: 1 1 24px; }
.mte-sep {
  width: 1px;
  height: 20px;
  margin: 0 3px;
  background: var(--dsw-alias-border-l1);
}
.mte-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  height: 30px;
  padding: 0 10px;
  border: 1px solid transparent;
  border-radius: 8px;
  background: transparent;
  color: var(--dsw-alias-label-primary);
  font: inherit;
  font-size: 12.5px;
  line-height: 1;
  cursor: pointer;
  transition: background 0.12s ease, border-color 0.12s ease, color 0.12s ease;
}
.mte-btn:hover:not(:disabled) {
  background: var(--dsw-alias-bg-layer-1);
  border-color: var(--dsw-alias-border-l1);
}
.mte-btn:disabled { opacity: 0.38; cursor: not-allowed; }
.mte-btn:focus-visible {
  outline: 2px solid var(--dsw-alias-brand-primary);
  outline-offset: 1px;
}
.mte-btn svg { flex: none; }
.mte-btn-primary {
  background: var(--dsw-alias-brand-primary);
  border-color: transparent;
  color: var(--dsw-alias-bg-base);
  font-weight: 550;
}
.mte-btn-primary:hover:not(:disabled) {
  background: var(--dsw-alias-brand-primary);
  filter: brightness(1.06);
}
.mte-btn-icon { width: 30px; padding: 0; }
.mte-btn.is-danger:hover:not(:disabled) {
  color: var(--dsw-alias-state-error-primary);
  border-color: color-mix(in srgb, var(--dsw-alias-state-error-primary) 32%, transparent);
  background: color-mix(in srgb, var(--dsw-alias-state-error-primary) 10%, transparent);
}
.mte-zoom-value {
  min-width: 42px;
  text-align: center;
  font-size: 11.5px;
  font-variant-numeric: tabular-nums;
  color: var(--dsw-alias-label-secondary);
}
.mte-canvas {
  position: relative;
  height: clamp(420px, calc(100vh - 360px), 1400px);
  overflow: hidden;
  border: 1px solid var(--dsw-alias-border-l1);
  border-radius: 14px;
  background-color: var(--dsw-alias-bg-base);
  background-image: radial-gradient(
    circle,
    color-mix(in srgb, var(--dsw-alias-label-secondary) 18%, transparent) 1px,
    transparent 1px
  );
  cursor: grab;
  touch-action: none;
  isolation: isolate;
}
.mte-canvas.is-panning { cursor: grabbing; }
.mte-world {
  position: absolute;
  left: 0;
  top: 0;
  transform-origin: 0 0;
  will-change: transform;
}
.mte-edges {
  position: absolute;
  overflow: visible;
  pointer-events: none;
}
.mte-edge {
  fill: none;
  stroke: var(--dsw-alias-border-l2);
  stroke-width: 1.5;
  stroke-linecap: round;
}
.mte-edge-dot { fill: var(--dsw-alias-border-l2); }
.mte-node {
  position: absolute;
  width: 224px;
  box-sizing: border-box;
  padding: 10px 12px 10px;
  border: 1px solid var(--dsw-alias-border-l1);
  border-radius: 12px;
  background: var(--dsw-alias-bg-layer-1);
  box-shadow: 0 1px 2px rgba(15, 23, 42, 0.05), 0 10px 22px -18px rgba(15, 23, 42, 0.35);
  cursor: grab;
  user-select: none;
  transition: border-color 0.12s ease, box-shadow 0.12s ease;
}
.mte-node:hover {
  border-color: var(--dsw-alias-border-l2);
  box-shadow: 0 2px 4px rgba(15, 23, 42, 0.06), 0 14px 26px -18px rgba(15, 23, 42, 0.4);
}
.mte-node[data-depth='0'] {
  border-color: color-mix(in srgb, var(--dsw-alias-brand-primary) 42%, var(--dsw-alias-border-l1));
}
.mte-node.is-selected {
  border-color: var(--dsw-alias-brand-primary);
  box-shadow:
    0 0 0 3px color-mix(in srgb, var(--dsw-alias-brand-primary) 18%, transparent),
    0 12px 26px -18px rgba(15, 23, 42, 0.45);
}
.mte-node.is-dragging {
  cursor: grabbing;
  transition: none;
  box-shadow: 0 18px 36px -16px rgba(15, 23, 42, 0.5);
}
.mte-node-head {
  display: flex;
  align-items: center;
  gap: 6px;
  min-height: 18px;
  margin-bottom: 5px;
}
.mte-node-dot {
  width: 8px;
  height: 8px;
  flex: none;
  border-radius: 3px;
  background: var(--dsw-alias-brand-primary);
}
.mte-tone-1 { background: var(--dsw-alias-state-success-primary); }
.mte-tone-2 { background: var(--dsw-alias-state-warn-primary); }
.mte-tone-3 { background: var(--dsw-alias-state-idle-primary); }
.mte-node-level {
  font-size: 9.5px;
  font-weight: 650;
  letter-spacing: 0.09em;
  color: var(--dsw-alias-label-secondary);
}
.mte-node-actions {
  display: flex;
  gap: 1px;
  margin-left: auto;
  opacity: 0;
  transition: opacity 0.12s ease;
}
.mte-node:hover .mte-node-actions,
.mte-node.is-selected .mte-node-actions { opacity: 1; }
.mte-node-btn {
  display: grid;
  place-items: center;
  width: 22px;
  height: 22px;
  padding: 0;
  border: none;
  border-radius: 6px;
  background: transparent;
  color: var(--dsw-alias-label-secondary);
  cursor: pointer;
}
.mte-node-btn:hover {
  background: var(--dsw-alias-bg-layer-2);
  color: var(--dsw-alias-label-primary);
}
.mte-node-btn.is-danger:hover {
  color: var(--dsw-alias-state-error-primary);
  background: color-mix(in srgb, var(--dsw-alias-state-error-primary) 12%, transparent);
}
.mte-node-text {
  font-size: 13px;
  line-height: 1.55;
  white-space: pre-wrap;
  word-break: break-word;
  color: var(--dsw-alias-label-primary);
  min-height: 20px;
}
.mte-node-text.is-placeholder {
  color: var(--dsw-alias-label-secondary);
  opacity: 0.65;
}
.mte-node-editor {
  display: block;
  width: 100%;
  min-height: 54px;
  padding: 0;
  border: none;
  outline: none;
  background: transparent;
  color: var(--dsw-alias-label-primary);
  font: inherit;
  font-size: 13px;
  line-height: 1.55;
  resize: none;
  overflow: hidden;
  user-select: text;
  cursor: text;
}
.mte-node-foot {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  margin-top: 7px;
  padding-top: 6px;
  border-top: 1px dashed var(--dsw-alias-border-l1);
  font-size: 10.5px;
  color: var(--dsw-alias-label-secondary);
}
.mte-node-tip {
  opacity: 0;
  transition: opacity 0.12s ease;
  white-space: nowrap;
}
.mte-node:hover .mte-node-tip { opacity: 0.85; }
.mte-empty {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 24px;
  text-align: center;
  pointer-events: none;
}
.mte-empty-mark {
  display: grid;
  place-items: center;
  width: 46px;
  height: 46px;
  margin-bottom: 4px;
  border-radius: 14px;
  border: 1px solid var(--dsw-alias-border-l1);
  background: var(--dsw-alias-bg-layer-2);
  color: var(--dsw-alias-brand-primary);
}
.mte-empty-mark svg { width: 22px; height: 22px; }
.mte-empty-title {
  margin: 0;
  font-size: 15px;
  font-weight: 600;
  color: var(--dsw-alias-label-primary);
}
.mte-empty-hint {
  margin: 0;
  max-width: 340px;
  font-size: 12.5px;
  color: var(--dsw-alias-label-secondary);
}
.mte-empty .mte-btn { margin-top: 6px; pointer-events: auto; }
.mte-canvas-hint {
  position: absolute;
  left: 12px;
  bottom: 10px;
  padding: 4px 8px;
  border-radius: 6px;
  background: color-mix(in srgb, var(--dsw-alias-bg-base) 76%, transparent);
  color: var(--dsw-alias-label-secondary);
  font-size: 10.5px;
  pointer-events: none;
}
.mte-notice {
  position: absolute;
  top: 14px;
  left: 50%;
  transform: translateX(-50%);
  max-width: min(420px, calc(100% - 32px));
  padding: 7px 13px;
  border-radius: 999px;
  border: 1px solid var(--dsw-alias-border-l1);
  background: var(--dsw-alias-bg-overlay);
  box-shadow: 0 8px 22px -12px rgba(15, 23, 42, 0.45);
  color: var(--dsw-alias-label-primary);
  font-size: 11.5px;
  z-index: 8;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.mte-notice.is-error {
  border-color: color-mix(in srgb, var(--dsw-alias-state-error-primary) 40%, transparent);
  color: var(--dsw-alias-state-error-primary);
}
.mte-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 0 2px;
  font-size: 11px;
  color: var(--dsw-alias-label-secondary);
}
.mte-footer-hint { min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.mte-footer-count { font-variant-numeric: tabular-nums; white-space: nowrap; }
@media (max-width: 760px) {
  .mte-root { padding: 16px 14px 12px; }
  .mte-subtitle { display: none; }
  .mte-footer-hint { display: none; }
  .mte-canvas { height: clamp(420px, calc(100vh - 320px), 1000px); }
}
`;

    /* ------------------------------------------------------------------ */
    /* App and notebook styles                                             */
    /* ------------------------------------------------------------------ */

    const APP_CSS = `
.nt-app {
  display: flex;
  flex-direction: column;
  height: clamp(620px, calc(100vh - 120px), 1600px);
  min-height: 0;
  padding: 16px 20px 14px;
  box-sizing: border-box;
  color: var(--dsw-alias-label-primary);
  font-size: 13px;
}
.nt-app-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  padding: 0 2px 12px;
  flex: none;
}
.nt-app-brand { display: flex; align-items: center; gap: 10px; min-width: 0; }
.nt-app-mark {
  display: grid;
  place-items: center;
  width: 38px;
  height: 38px;
  flex: none;
  border: 1px solid color-mix(in srgb, var(--dsw-alias-brand-primary) 30%, var(--dsw-alias-border-l1));
  border-radius: 12px;
  background: color-mix(in srgb, var(--dsw-alias-brand-primary) 14%, var(--dsw-alias-bg-layer-2));
  color: var(--dsw-alias-brand-primary);
}
.nt-app-mark svg { width: 20px; height: 20px; }
.nt-app-brand-text { min-width: 0; }
.nt-app-brand-text h1 {
  margin: 0;
  font-size: 17px;
  line-height: 1.25;
  font-weight: 650;
  letter-spacing: 0.01em;
}
.nt-app-brand-text p {
  margin: 2px 0 0;
  font-size: 10.5px;
  color: var(--dsw-alias-label-secondary);
}
.nt-app-actions { position: relative; display: flex; align-items: center; gap: 9px; }
.nt-app-current {
  padding: 3px 9px;
  border: 1px solid var(--dsw-alias-border-l1);
  border-radius: 999px;
  background: var(--dsw-alias-bg-layer-2);
  color: var(--dsw-alias-label-secondary);
  font-size: 10.5px;
  white-space: nowrap;
}
.nt-menu-btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  height: 32px;
  padding: 0 11px;
  border: 1px solid var(--dsw-alias-border-l1);
  border-radius: 9px;
  background: var(--dsw-alias-bg-layer-2);
  color: var(--dsw-alias-label-primary);
  font: inherit;
  font-size: 12px;
  cursor: pointer;
  white-space: nowrap;
}
.nt-menu-btn:hover, .nt-menu-btn.is-open {
  border-color: color-mix(in srgb, var(--dsw-alias-brand-primary) 35%, var(--dsw-alias-border-l1));
  background: var(--dsw-alias-bg-layer-1);
}
.nt-menu-btn svg:last-child { transition: transform 0.12s ease; }
.nt-menu-btn.is-open svg:last-child { transform: rotate(180deg); }
.nt-menu-pop {
  position: absolute;
  right: 0;
  top: calc(100% + 8px);
  z-index: 40;
  width: 240px;
  padding: 7px;
  border: 1px solid var(--dsw-alias-border-l1);
  border-radius: 12px;
  background: var(--dsw-alias-bg-overlay);
  box-shadow: 0 20px 50px -24px rgba(15, 23, 42, 0.55);
}
.nt-menu-title {
  padding: 4px 8px 6px;
  font-size: 9.5px;
  font-weight: 650;
  letter-spacing: 0.09em;
  text-transform: uppercase;
  color: var(--dsw-alias-label-secondary);
}
.nt-menu-entry, .nt-menu-group {
  display: flex;
  align-items: center;
  gap: 7px;
  width: 100%;
  height: 34px;
  padding: 0 9px;
  border: 0;
  border-radius: 8px;
  background: transparent;
  color: var(--dsw-alias-label-primary);
  font: inherit;
  font-size: 12.5px;
  text-align: left;
  cursor: pointer;
}
.nt-menu-entry:hover, .nt-menu-group:hover { background: var(--dsw-alias-bg-layer-2); }
.nt-menu-entry.is-active {
  background: color-mix(in srgb, var(--dsw-alias-brand-primary) 12%, transparent);
  color: var(--dsw-alias-brand-primary);
}
.nt-menu-entry svg:last-child, .nt-menu-group svg:last-child { margin-left: auto; }
.nt-menu-group svg:last-child { transition: transform 0.12s ease; }
.nt-menu-group.is-open svg:last-child { transform: rotate(180deg); }
.nt-menu-entry.nt-menu-sub {
  padding-left: 28px;
  color: var(--dsw-alias-label-secondary);
}
.nt-menu-entry.nt-menu-sub.is-active { color: var(--dsw-alias-brand-primary); }
.nt-app-body {
  flex: 1;
  min-height: 0;
  overflow: hidden;
  padding-top: 11px;
  border-top: 1px solid var(--dsw-alias-border-l1);
}
.nt-app-body.is-tree { overflow-y: auto; }
.mte-root.mte-embedded { padding: 12px 16px 8px; gap: 9px; }
.mte-embedded .mte-title { font-size: 16px; }
.mte-embedded .mte-subtitle { display: none; }
.mte-embedded .mte-canvas { height: clamp(360px, calc(100vh - 430px), 1200px); }

.nt-root {
  position: relative;
  display: flex;
  height: 100%;
  min-height: 0;
  overflow: hidden;
  border: 1px solid var(--dsw-alias-border-l1);
  border-radius: 14px;
  background: var(--dsw-alias-bg-base);
}
.nt-nav {
  display: flex;
  flex-direction: column;
  width: 216px;
  flex: 0 0 216px;
  min-height: 0;
  border-right: 1px solid var(--dsw-alias-border-l1);
  background: var(--dsw-alias-bg-layer-2);
}
.nt-nav-head {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 13px 12px 10px;
  border-bottom: 1px solid var(--dsw-alias-border-l1);
  min-width: 0;
}
.nt-nav-mark {
  display: grid;
  place-items: center;
  width: 27px;
  height: 27px;
  flex: none;
  border: 1px solid var(--dsw-alias-border-l1);
  border-radius: 8px;
  background: var(--dsw-alias-bg-layer-1);
  color: var(--dsw-alias-brand-primary);
}
.nt-nav-mark svg { width: 15px; height: 15px; }
.nt-nav-head strong {
  display: block;
  font-size: 13px;
  font-weight: 600;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.nt-nav-subtitle {
  display: block;
  font-size: 9.5px;
  color: var(--dsw-alias-label-secondary);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.nt-nav-list { flex: 1; min-height: 0; overflow-y: auto; padding: 7px; }
.nt-nav-item {
  display: flex;
  align-items: center;
  gap: 7px;
  min-height: 32px;
  padding: 0 8px;
  border-radius: 8px;
  color: var(--dsw-alias-label-secondary);
  font-size: 12px;
  cursor: pointer;
  user-select: none;
  position: relative;
}
.nt-nav-item:hover { background: var(--dsw-alias-bg-layer-1); color: var(--dsw-alias-label-primary); }
.nt-nav-item.is-active {
  background: color-mix(in srgb, var(--dsw-alias-brand-primary) 12%, transparent);
  color: var(--dsw-alias-brand-primary);
}
.nt-nav-item.is-drop {
  background: color-mix(in srgb, var(--dsw-alias-brand-primary) 16%, transparent);
  box-shadow: inset 0 0 0 1.5px var(--dsw-alias-brand-primary);
  color: var(--dsw-alias-brand-primary);
}
.nt-nav-label {
  flex: 1;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.nt-nav-count {
  padding: 0 6px;
  border: 1px solid var(--dsw-alias-border-l1);
  border-radius: 999px;
  background: var(--dsw-alias-bg-layer-1);
  color: var(--dsw-alias-label-secondary);
  font-size: 9.5px;
  line-height: 17px;
  flex: none;
}
.nt-nav-tools { display: none; gap: 1px; margin-left: 1px; }
.nt-nav-item:hover .nt-nav-tools { display: flex; }
.nt-nav-item:hover .nt-nav-count { display: none; }
.nt-nav-sep {
  padding: 11px 8px 4px;
  font-size: 9.5px;
  font-weight: 600;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--dsw-alias-label-secondary);
  opacity: 0.85;
}
.nt-nav-empty { padding: 4px 9px; font-size: 10.5px; color: var(--dsw-alias-label-secondary); opacity: 0.7; }
.nt-mini {
  display: grid;
  place-items: center;
  width: 22px;
  height: 22px;
  padding: 0;
  border: 0;
  border-radius: 5px;
  background: transparent;
  color: var(--dsw-alias-label-secondary);
  cursor: pointer;
}
.nt-mini:hover { background: var(--dsw-alias-bg-layer-2); color: var(--dsw-alias-label-primary); }
.nt-mini.nt-danger:hover {
  color: var(--dsw-alias-state-error-primary);
  background: color-mix(in srgb, var(--dsw-alias-state-error-primary) 12%, transparent);
}
.nt-nav-foot {
  display: flex;
  flex-direction: column;
  gap: 6px;
  padding: 9px;
  border-top: 1px solid var(--dsw-alias-border-l1);
}
.nt-foot-row { display: flex; gap: 6px; }
.nt-foot-row .nt-btn { flex: 1; min-width: 0; }
.nt-undo-hint {
  padding: 6px 8px;
  border: 1px dashed var(--dsw-alias-border-l1);
  border-radius: 7px;
  background: color-mix(in srgb, var(--dsw-alias-brand-primary) 5%, transparent);
  color: var(--dsw-alias-label-secondary);
  font-size: 9.5px;
  line-height: 1.5;
}

.nt-list {
  display: flex;
  flex-direction: column;
  width: 292px;
  flex: 0 0 292px;
  min-height: 0;
  border-right: 1px solid var(--dsw-alias-border-l1);
  background: var(--dsw-alias-bg-base);
}
.nt-list-head {
  display: flex;
  align-items: center;
  gap: 7px;
  padding: 9px;
  border-bottom: 1px solid var(--dsw-alias-border-l1);
}
.nt-search {
  flex: 1;
  min-width: 0;
  height: 33px;
  padding: 0 9px;
  border: 1px solid var(--dsw-alias-border-l1);
  border-radius: 8px;
  background: var(--dsw-alias-bg-layer-2);
  color: var(--dsw-alias-label-primary);
  font: inherit;
  font-size: 11.5px;
  outline: none;
}
.nt-search:focus { border-color: var(--dsw-alias-brand-primary); }
.nt-add {
  display: grid;
  place-items: center;
  width: 33px;
  height: 33px;
  flex: none;
  border: 0;
  border-radius: 8px;
  background: var(--dsw-alias-brand-primary);
  color: var(--dsw-alias-bg-base);
  cursor: pointer;
}
.nt-add:hover { filter: brightness(1.08); }
.nt-list-title {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  padding: 8px 12px;
  border-bottom: 1px solid var(--dsw-alias-border-l1);
  color: var(--dsw-alias-label-secondary);
  font-size: 10px;
}
.nt-list-tip { opacity: 0.7; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.nt-note-list { flex: 1; min-height: 0; overflow-y: auto; }
.nt-card {
  position: relative;
  padding: 10px 12px;
  border-bottom: 1px solid var(--dsw-alias-border-l1);
  cursor: pointer;
  user-select: none;
}
.nt-card:hover { background: var(--dsw-alias-bg-layer-2); }
.nt-card.is-active {
  background: var(--dsw-alias-bg-layer-2);
  box-shadow: inset 2px 0 0 var(--dsw-alias-brand-primary);
}
.nt-card.is-dragging { opacity: 0.4; }
.nt-card h3 {
  margin: 0 0 5px;
  padding-right: 48px;
  font-size: 12px;
  font-weight: 600;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.nt-card-preview {
  margin: 0 0 6px;
  min-height: 15px;
  color: var(--dsw-alias-label-secondary);
  font-size: 11px;
  line-height: 1.5;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
.nt-card-meta {
  display: flex;
  align-items: center;
  gap: 5px;
  flex-wrap: wrap;
  color: var(--dsw-alias-label-secondary);
  font-size: 9.5px;
}
.nt-tag {
  max-width: 120px;
  padding: 0 5px;
  border: 1px solid var(--dsw-alias-border-l1);
  border-radius: 4px;
  background: var(--dsw-alias-bg-layer-1);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.nt-tag.nt-tag-arch {
  color: var(--dsw-alias-state-warn-primary);
  border-color: color-mix(in srgb, var(--dsw-alias-state-warn-primary) 30%, transparent);
}
.nt-tag.nt-tag-link {
  color: var(--dsw-alias-state-success-primary);
  border-color: color-mix(in srgb, var(--dsw-alias-state-success-primary) 30%, transparent);
}
.nt-card-tools {
  position: absolute;
  right: 7px;
  top: 7px;
  display: none;
  gap: 1px;
  padding: 1px;
  border-radius: 6px;
  background: var(--dsw-alias-bg-layer-2);
}
.nt-card:hover .nt-card-tools { display: flex; }
.nt-empty-list {
  padding: 54px 18px;
  text-align: center;
  color: var(--dsw-alias-label-secondary);
  font-size: 12px;
  line-height: 2;
}
.nt-empty-list span { font-size: 10.5px; opacity: 0.75; }
.nt-arch-groups {
  margin: 8px;
  padding: 8px;
  border: 1px dashed var(--dsw-alias-border-l1);
  border-radius: 9px;
}
.nt-arch-title {
  padding: 1px 2px 5px;
  color: var(--dsw-alias-label-secondary);
  font-size: 9.5px;
  letter-spacing: 0.03em;
}
.nt-arch-item {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 3px 4px;
  border-radius: 6px;
  font-size: 11px;
}
.nt-arch-item:hover { background: var(--dsw-alias-bg-layer-1); }
.nt-arch-name { flex: 1; min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }

.nt-editor {
  display: flex;
  flex: 1;
  min-width: 0;
  min-height: 0;
  flex-direction: column;
  background: var(--dsw-alias-bg-base);
}
.nt-editor-empty {
  align-items: center;
  justify-content: center;
  gap: 5px;
  padding: 24px;
  text-align: center;
  color: var(--dsw-alias-label-secondary);
}
.nt-empty-icon {
  display: grid;
  place-items: center;
  width: 52px;
  height: 52px;
  margin-bottom: 5px;
  border: 1px solid var(--dsw-alias-border-l1);
  border-radius: 15px;
  background: var(--dsw-alias-bg-layer-2);
  color: var(--dsw-alias-brand-primary);
}
.nt-empty-icon svg { width: 23px; height: 23px; }
.nt-editor-empty p { margin: 0; color: var(--dsw-alias-label-primary); font-size: 13px; }
.nt-editor-empty .nt-empty-hint {
  max-width: 360px;
  color: var(--dsw-alias-label-secondary);
  font-size: 11px;
  line-height: 1.6;
}
.nt-banner {
  display: flex;
  align-items: center;
  gap: 7px;
  margin: 9px 16px 0;
  padding: 6px 9px;
  border: 1px solid var(--dsw-alias-border-l1);
  border-radius: 7px;
  font-size: 10.5px;
  min-width: 0;
}
.nt-banner-arch {
  color: var(--dsw-alias-state-warn-primary);
  border-color: color-mix(in srgb, var(--dsw-alias-state-warn-primary) 28%, transparent);
  background: color-mix(in srgb, var(--dsw-alias-state-warn-primary) 8%, transparent);
}
.nt-banner-link {
  color: var(--dsw-alias-state-success-primary);
  border-color: color-mix(in srgb, var(--dsw-alias-state-success-primary) 28%, transparent);
  background: color-mix(in srgb, var(--dsw-alias-state-success-primary) 8%, transparent);
}
.nt-banner-warn {
  color: var(--dsw-alias-state-warn-primary);
  border-color: color-mix(in srgb, var(--dsw-alias-state-warn-primary) 28%, transparent);
  background: color-mix(in srgb, var(--dsw-alias-state-warn-primary) 7%, transparent);
}
.nt-banner-text { flex: 1; min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.nt-banner-hint { flex: none; font-size: 9.5px; opacity: 0.8; }
.nt-editor-head {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  padding: 11px 17px 3px;
  flex: none;
}
.nt-title-input {
  flex: 1;
  min-width: 0;
  padding: 2px 0;
  border: 0;
  background: transparent;
  color: var(--dsw-alias-label-primary);
  font: inherit;
  font-size: 18px;
  font-weight: 650;
  outline: none;
}
.nt-title-input::placeholder { color: var(--dsw-alias-label-secondary); opacity: 0.6; }
.nt-editor-actions { display: flex; gap: 4px; flex: none; }
.nt-editor-meta {
  display: flex;
  align-items: center;
  gap: 11px;
  flex-wrap: wrap;
  padding: 0 17px 7px;
  color: var(--dsw-alias-label-secondary);
  font-size: 9.5px;
  flex: none;
}
.nt-dirty { color: var(--dsw-alias-state-warn-primary); }
.nt-dirty.is-clean { color: var(--dsw-alias-state-success-primary); }
.nt-content {
  flex: 1;
  min-height: 100px;
  margin: 0 17px;
  padding: 11px 13px;
  border: 1px solid var(--dsw-alias-border-l1);
  border-radius: 9px;
  background: var(--dsw-alias-bg-layer-2);
  color: var(--dsw-alias-label-primary);
  font: inherit;
  font-size: 12.5px;
  line-height: 1.8;
  resize: none;
  outline: none;
}
.nt-content:focus { border-color: color-mix(in srgb, var(--dsw-alias-brand-primary) 45%, var(--dsw-alias-border-l1)); }
.nt-content::placeholder { color: var(--dsw-alias-label-secondary); opacity: 0.6; }
.nt-editor-foot {
  display: flex;
  align-items: center;
  gap: 6px;
  flex-wrap: wrap;
  padding: 9px 17px;
  flex: none;
}
.nt-file-actions { display: flex; gap: 4px; flex: none; }
.nt-update-input {
  flex: 1;
  min-width: 120px;
  height: 30px;
  padding: 0 8px;
  border: 1px solid var(--dsw-alias-border-l1);
  border-radius: 7px;
  background: var(--dsw-alias-bg-layer-2);
  color: var(--dsw-alias-label-primary);
  font: inherit;
  font-size: 11px;
  outline: none;
}
.nt-update-input:focus { border-color: var(--dsw-alias-brand-primary); }
.nt-history {
  display: flex;
  flex-direction: column;
  flex: none;
  max-height: 30%;
  padding: 0 17px;
  border-top: 1px solid var(--dsw-alias-border-l1);
}
.nt-history-toggle {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 0;
  border: 0;
  background: transparent;
  color: var(--dsw-alias-label-secondary);
  font: inherit;
  font-size: 11px;
  text-align: left;
  cursor: pointer;
}
.nt-history-toggle svg:first-child { transition: transform 0.12s ease; }
.nt-history-toggle.is-open svg:first-child { transform: rotate(180deg); }
.nt-count {
  padding: 0 6px;
  border: 1px solid var(--dsw-alias-border-l1);
  border-radius: 999px;
  background: var(--dsw-alias-bg-layer-2);
  font-size: 9px;
  line-height: 16px;
}
.nt-history-body { overflow-y: auto; padding: 0 0 10px; }
.nt-history-item {
  display: flex;
  gap: 7px;
  position: relative;
  margin-left: 4px;
  padding: 0 0 9px 15px;
  border-left: 1px solid var(--dsw-alias-border-l1);
}
.nt-history-item:last-child { border-left-color: transparent; }
.nt-history-dot {
  position: absolute;
  left: -3px;
  top: 4px;
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: var(--dsw-alias-brand-primary);
}
.nt-history-content { min-width: 0; }
.nt-history-time {
  display: flex;
  align-items: center;
  gap: 5px;
  flex-wrap: wrap;
  color: var(--dsw-alias-label-primary);
  font-size: 9.5px;
}
.nt-history-badge {
  padding: 0 4px;
  border-radius: 3px;
  background: color-mix(in srgb, var(--dsw-alias-brand-primary) 12%, transparent);
  color: var(--dsw-alias-brand-primary);
  font-size: 8.5px;
}
.nt-history-badge.is-file {
  background: color-mix(in srgb, var(--dsw-alias-state-success-primary) 12%, transparent);
  color: var(--dsw-alias-state-success-primary);
}
.nt-history-text {
  margin-top: 2px;
  color: var(--dsw-alias-label-secondary);
  font-size: 9.5px;
  font-style: italic;
  line-height: 1.5;
}

.nt-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
  height: 30px;
  padding: 0 9px;
  border: 1px solid var(--dsw-alias-border-l1);
  border-radius: 7px;
  background: var(--dsw-alias-bg-layer-2);
  color: var(--dsw-alias-label-primary);
  font: inherit;
  font-size: 11.5px;
  cursor: pointer;
  white-space: nowrap;
}
.nt-btn:hover { background: var(--dsw-alias-bg-layer-1); border-color: var(--dsw-alias-border-l2); }
.nt-btn svg { width: 13px; height: 13px; flex: none; }
.nt-btn-sm { height: 28px; padding: 0 7px; font-size: 11px; }
.nt-btn-block { width: 100%; }
.nt-btn-primary {
  border-color: transparent;
  background: var(--dsw-alias-brand-primary);
  color: var(--dsw-alias-bg-base);
  font-weight: 550;
}
.nt-btn-primary:hover { filter: brightness(1.06); }
.nt-btn-linked {
  max-width: 190px;
  overflow: hidden;
  text-overflow: ellipsis;
  border-color: color-mix(in srgb, var(--dsw-alias-state-success-primary) 30%, transparent);
  background: color-mix(in srgb, var(--dsw-alias-state-success-primary) 9%, transparent);
  color: var(--dsw-alias-state-success-primary);
}
.nt-btn.nt-danger:hover {
  color: var(--dsw-alias-state-error-primary);
  border-color: color-mix(in srgb, var(--dsw-alias-state-error-primary) 35%, transparent);
  background: color-mix(in srgb, var(--dsw-alias-state-error-primary) 8%, transparent);
}

.nt-toast {
  position: fixed;
  left: 50%;
  bottom: 26px;
  z-index: 80;
  display: flex;
  align-items: center;
  gap: 10px;
  max-width: min(560px, calc(100vw - 40px));
  padding: 8px 11px 8px 15px;
  transform: translateX(-50%);
  border: 1px solid var(--dsw-alias-border-l1);
  border-radius: 999px;
  background: var(--dsw-alias-bg-overlay);
  box-shadow: 0 12px 32px -18px rgba(15, 23, 42, 0.55);
  color: var(--dsw-alias-label-primary);
  font-size: 11.5px;
}
.nt-toast.is-error {
  border-color: color-mix(in srgb, var(--dsw-alias-state-error-primary) 42%, transparent);
  color: var(--dsw-alias-state-error-primary);
}
.nt-toast-text { min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.nt-toast-action {
  flex: none;
  padding: 3px 10px;
  border: 0;
  border-radius: 14px;
  background: var(--dsw-alias-brand-primary);
  color: var(--dsw-alias-bg-base);
  font: inherit;
  font-size: 11px;
  cursor: pointer;
}
.nt-modal-backdrop {
  position: fixed;
  inset: 0;
  z-index: 90;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
  background: rgba(15, 23, 42, 0.38);
  backdrop-filter: blur(2px);
}
.nt-modal {
  width: min(420px, 100%);
  padding: 18px;
  border: 1px solid var(--dsw-alias-border-l1);
  border-radius: 14px;
  background: var(--dsw-alias-bg-overlay);
  box-shadow: 0 24px 60px -24px rgba(15, 23, 42, 0.55);
  color: var(--dsw-alias-label-primary);
}
.nt-modal-title { margin: 0 0 8px; font-size: 15px; font-weight: 600; }
.nt-modal-message { margin: 0; color: var(--dsw-alias-label-secondary); font-size: 12px; line-height: 1.65; }
.nt-modal-input {
  width: 100%;
  height: 34px;
  padding: 0 9px;
  border: 1px solid var(--dsw-alias-border-l1);
  border-radius: 8px;
  background: var(--dsw-alias-bg-base);
  color: var(--dsw-alias-label-primary);
  font: inherit;
  font-size: 12.5px;
  outline: none;
}
.nt-modal-input:focus {
  border-color: var(--dsw-alias-brand-primary);
  box-shadow: 0 0 0 3px color-mix(in srgb, var(--dsw-alias-brand-primary) 16%, transparent);
}
.nt-modal-error { margin-top: 7px; color: var(--dsw-alias-state-error-primary); font-size: 10.5px; }
.nt-modal-actions { display: flex; justify-content: flex-end; gap: 7px; margin-top: 14px; }
.nt-drop-overlay {
  position: absolute;
  inset: 0;
  z-index: 70;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px dashed var(--dsw-alias-brand-primary);
  border-radius: 14px;
  background: color-mix(in srgb, var(--dsw-alias-brand-primary) 8%, transparent);
  pointer-events: none;
}
.nt-drop-card {
  padding: 13px 20px;
  border: 1px solid var(--dsw-alias-brand-primary);
  border-radius: 12px;
  background: var(--dsw-alias-bg-overlay);
  box-shadow: 0 12px 32px -18px rgba(15, 23, 42, 0.55);
  color: var(--dsw-alias-brand-primary);
  font-size: 12px;
}
@media (max-width: 1100px) {
  .nt-nav { width: 190px; flex-basis: 190px; }
  .nt-list { width: 260px; flex-basis: 260px; }
}
@media (max-width: 860px) {
  .nt-app { padding: 12px 12px 10px; }
  .nt-app-current { display: none; }
  .nt-nav { width: 170px; flex-basis: 170px; }
  .nt-list { width: 228px; flex-basis: 228px; }
  .nt-nav-subtitle { display: none; }
}
`;

    /* ------------------------------------------------------------------ */
    /* Registration                                                        */
    /* ------------------------------------------------------------------ */

    return {
      inject: ['slots'],
      apply(ctx) {
        const locale = ctx.get('locale');
        let t = (key) => (STRINGS.zh && STRINGS.zh[key]) || key;
        if (locale) {
          try {
            const disposeZh = locale.register(NS, 'zh', STRINGS.zh);
            const disposeEn = locale.register(NS, 'en', STRINGS.en);
            ctx.effect(() => () => {
              disposeZh();
              disposeEn();
            });
            t = locale.bind(NS);
          } catch {
            /* Keep the Chinese fallback if the locale namespace is unavailable. */
          }
        }

        let rpcCall = null;
        const rpc = (endpoint, payload) => {
          if (!rpcCall) rpcCall = createWorkspaceRpc(ctx.get('connection'));
          if (!rpcCall) {
            return Promise.resolve({
              ok: false,
              error: { code: 'unavailable', message: 'workspace connection is unavailable' },
            });
          }
          return rpcCall(endpoint, payload);
        };
        const pickDirectory = async () => {
          const uiWorkspace = ctx.get('uiWorkspace');
          if (!uiWorkspace || typeof uiWorkspace.pickDirectory !== 'function') {
            throw new Error('folder picker unavailable');
          }
          return uiWorkspace.pickDirectory();
        };
        const Page = () => h(AppPage, { t, rpc, pickDirectory });

        ctx.slots.inject('sidebar.panellist', () =>
          ctx.slots.register(
            {
              name: 'sidebar.panellist',
              id: 'menu-tree-editor',
              order: 20,
              label: () => t('panelLabel'),
            },
            PanelIcon,
          ),
        );

        ctx.slots.inject('main', () =>
          ctx.slots.register(
            {
              name: 'main',
              key: 'menu-tree-editor',
            },
            Page,
          ),
        );
      },
    };
  },
});
