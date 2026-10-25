/**
 * Host half of the menu tree editor.
 *
 * The Client may work in the configured workspace folder
 * (`<workspace>/menu-tree/`) or in any absolute local folder the user picks.
 * Every request names its root; reads and writes stay inside it and only
 * `.json` files are listed.
 *
 * The HTTP route is registered directly on the DSH web server and guarded by
 * Connection's browser authentication, so the Client's small JSON-RPC channel
 * works even when the host-side `connection.rpc` registry is unavailable.
 */
import { promises as fsp } from 'node:fs';
import { isAbsolute, join, resolve, sep } from 'node:path';

const ROUTE = '/menu-tree-editor';
const FOLDER = 'menu-tree';
const MAX_BYTES = 2 * 1024 * 1024;

function ok(value) {
  return { ok: true, value };
}

function fail(code, message, details = {}) {
  return { ok: false, error: { code, message, details } };
}

function cleanName(value, kind) {
  if (typeof value !== 'string') return null;
  const name = value.trim();
  if (!name || name === '.' || name === '..') return null;
  if (name.length > 80) return null;
  if (name.startsWith('.')) return null;
  if (/[\\/:*?"<>|\u0000-\u001f]/.test(name)) return null;
  if (/[. ]$/.test(name)) return null;
  if (kind === 'file') {
    if (!name.toLowerCase().endsWith('.json')) return null;
    if (!name.slice(0, -5).trim()) return null;
  }
  return name;
}

function inside(base, target) {
  const root = resolve(base);
  const child = resolve(target);
  return child === root || child.startsWith(root + sep);
}

function readBody(req) {
  return new Promise((resolvePromise, reject) => {
    let size = 0;
    const chunks = [];
    req.on('data', (chunk) => {
      size += chunk.length;
      if (size > 4 * 1024 * 1024) {
        reject(new Error('request body is too large'));
        req.destroy();
        return;
      }
      chunks.push(chunk);
    });
    req.on('end', () => resolvePromise(Buffer.concat(chunks).toString('utf8')));
    req.on('error', reject);
  });
}

export const inject = ['webServer'];

export function apply(ctx) {
  ctx.inject(['webServer'], (scope) => {
    const defaultBase = () => {
      const workingDirectory = scope.get('workingDirectory');
      const directory = workingDirectory && workingDirectory.defaultDirectory;
      if (!directory) {
        throw Object.assign(new Error('no default workspace directory'), { code: 'no-workspace' });
      }
      return join(directory, FOLDER);
    };

    async function resolveBase(rootValue) {
      if (rootValue === undefined || rootValue === null || rootValue === '') {
        const base = defaultBase();
        await fsp.mkdir(base, { recursive: true });
        return base;
      }
      if (typeof rootValue !== 'string' || !rootValue.trim() || !isAbsolute(rootValue)) {
        throw Object.assign(new Error('root must be an absolute directory'), { code: 'bad-root' });
      }
      const canonical = await fsp.realpath(rootValue.trim()).catch(() => null);
      const stat = canonical ? await fsp.stat(canonical).catch(() => null) : null;
      if (!stat || !stat.isDirectory()) {
        throw Object.assign(new Error('folder does not exist'), { code: 'bad-root' });
      }
      return canonical;
    }

    async function folderPath(rootValue, folder) {
      const base = await resolveBase(rootValue);
      if (!folder) return { base, directory: base };
      const name = cleanName(folder, 'folder');
      if (!name) throw Object.assign(new Error('invalid folder'), { code: 'bad-name' });
      const target = join(base, name);
      if (!inside(base, target)) throw Object.assign(new Error('invalid folder'), { code: 'bad-name' });
      const stat = await fsp.stat(target).catch(() => null);
      if (!stat || !stat.isDirectory()) {
        throw Object.assign(new Error('folder not found'), { code: 'not-found' });
      }
      return { base, directory: target };
    }

    async function listFiles(rootValue, folder) {
      const { directory } = await folderPath(rootValue, folder);
      const entries = await fsp.readdir(directory, { withFileTypes: true });
      const names = entries
        .filter((entry) => entry.isFile() && entry.name.toLowerCase().endsWith('.json'))
        .map((entry) => entry.name)
        .sort((left, right) => left.localeCompare(right, 'zh'));
      const files = [];
      for (const name of names) {
        try {
          const stat = await fsp.stat(join(directory, name));
          files.push({ name, bytes: stat.size, mtime: stat.mtimeMs });
        } catch {
          /* A disappearing file is simply omitted from this listing. */
        }
      }
      return files;
    }

    async function listFolders(base) {
      const entries = await fsp.readdir(base, { withFileTypes: true });
      return entries
        .filter((entry) => entry.isDirectory() && !entry.name.startsWith('.'))
        .map((entry) => entry.name)
        .sort((left, right) => left.localeCompare(right, 'zh'));
    }

    async function handle(endpoint, payload) {
      try {
        const input = payload && typeof payload === 'object' ? payload : {};
        const rootValue = typeof input.root === 'string' ? input.root : '';
        if (endpoint === 'bootstrap') {
          const base = await resolveBase(rootValue);
          return ok({
            root: base,
            folder: '',
            folders: await listFolders(base),
            files: await listFiles(rootValue, ''),
          });
        }
        if (endpoint === 'list') {
          const folder = typeof input.folder === 'string' ? input.folder : '';
          const { base } = await folderPath(rootValue, folder);
          return ok({ root: base, folder, files: await listFiles(rootValue, folder) });
        }
        if (endpoint === 'createFolder') {
          const name = cleanName(input.name, 'folder');
          if (!name) return fail('bad-name', 'invalid folder name');
          const base = await resolveBase(rootValue);
          const target = join(base, name);
          if (!inside(base, target)) return fail('bad-name', 'invalid folder name');
          try {
            await fsp.mkdir(target);
          } catch (error) {
            if (error && error.code === 'EEXIST') return fail('exists', 'folder already exists');
            throw error;
          }
          return ok({ name, root: base, folders: await listFolders(base) });
        }
        if (endpoint === 'save') {
          const folder = typeof input.folder === 'string' ? input.folder : '';
          const name = cleanName(input.name, 'file');
          if (!name) return fail('bad-name', 'invalid file name');
          const { base, directory } = await folderPath(rootValue, folder);
          const target = join(directory, name);
          if (!inside(directory, target)) return fail('bad-name', 'invalid file name');
          const text = JSON.stringify(input.doc === undefined ? {} : input.doc, null, 2);
          const bytes = Buffer.byteLength(text, 'utf8');
          if (bytes > MAX_BYTES) return fail('too-large', 'file is too large');
          if (input.create === true) {
            const exists = await fsp.stat(target).then(
              () => true,
              () => false,
            );
            if (exists) return fail('exists', 'file already exists');
          }
          await fsp.writeFile(target, text, 'utf8');
          return ok({ name, root: base, bytes });
        }
        if (endpoint === 'load') {
          const folder = typeof input.folder === 'string' ? input.folder : '';
          const name = cleanName(input.name, 'file');
          if (!name) return fail('bad-name', 'invalid file name');
          const { base, directory } = await folderPath(rootValue, folder);
          const target = join(directory, name);
          if (!inside(directory, target)) return fail('bad-name', 'invalid file name');
          const stat = await fsp.stat(target).catch(() => null);
          if (!stat || !stat.isFile()) return fail('not-found', 'file not found');
          if (stat.size > MAX_BYTES) return fail('too-large', 'file is too large');
          const text = await fsp.readFile(target, 'utf8');
          let doc;
          try {
            doc = JSON.parse(text);
          } catch {
            return fail('invalid-json', 'file is not valid JSON');
          }
          return ok({ name, root: base, doc });
        }
        return fail('unknown-endpoint', 'unknown endpoint');
      } catch (error) {
        return fail(
          (error && error.code) || 'io-error',
          (error && error.message) || String(error),
        );
      }
    }

    async function routeHandler(req, res) {
      try {
        const connection = scope.get('connection');
        if (!connection) {
          res.writeHead(503);
          res.end('file API unavailable');
          return;
        }
        const rejection = connection.requestRejection({ headers: req.headers });
        if (rejection) {
          res.writeHead(rejection);
          res.end(rejection === 401 ? 'unauthorized' : 'forbidden');
          return;
        }
        if (req.method !== 'POST') {
          res.writeHead(405);
          res.end();
          return;
        }
        const url = new URL(req.url || '/', 'http://dsh.internal');
        const prefix = ROUTE + '/';
        if (!url.pathname.startsWith(prefix)) {
          res.writeHead(404);
          res.end();
          return;
        }
        const endpoint = decodeURIComponent(url.pathname.slice(prefix.length));
        if (!/^[A-Za-z0-9_$.-]+$/.test(endpoint)) {
          res.writeHead(400);
          res.end('bad endpoint');
          return;
        }
        let message;
        try {
          message = JSON.parse(await readBody(req));
        } catch {
          res.writeHead(400);
          res.end('bad request body');
          return;
        }
        if (
          !message ||
          message.type !== 'client-request' ||
          typeof message.rpcId !== 'string' ||
          typeof message.method !== 'string'
        ) {
          res.writeHead(400);
          res.end('bad request envelope');
          return;
        }
        const result =
          message.method === endpoint
            ? await handle(endpoint, message.payload)
            : fail('bad-request', 'method does not match endpoint');
        res.writeHead(200, { 'content-type': 'application/json; charset=utf-8' });
        res.end(JSON.stringify({ type: 'server-response', rpcId: message.rpcId, result }));
      } catch (error) {
        console.error('[menu-tree-editor] route error', error);
        try {
          res.writeHead(500);
          res.end('internal error');
        } catch {
          /* response already started */
        }
      }
    }

    try {
      scope.effect(() =>
        scope.webServer.register({ kind: 'prefix', path: ROUTE, handler: routeHandler }),
      );
    } catch (error) {
      console.error('[menu-tree-editor] route registration failed', error);
    }
  });
}
