const express = require('express');
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
require('dotenv').config();

const app = express();
app.use(express.json({ limit: '5mb' }));

const PORT = process.env.BRIDGE_PORT || 7883;
const TOKEN = process.env.BRIDGE_TOKEN;
const ALLOWED_PATHS = (process.env.BRIDGE_ALLOWED_PATHS || 'D:\\dev\\').split(',');
const ALLOWED_CMDS = ['python','node','npm','npx','git','dir','type','powershell'];

function auth(req, res, next) {
  if (!TOKEN) return res.status(500).json({ error: 'BRIDGE_TOKEN not set' });
  const provided = (req.headers.authorization || '').replace(/^Bearer\s+/i, '');
  if (provided !== TOKEN) return res.status(401).json({ error: 'Unauthorized' });
  next();
}

function validatePath(p) {
  if (!p) return false;
  const n = path.resolve(p);
  return ALLOWED_PATHS.some(prefix => n.toLowerCase().startsWith(prefix.toLowerCase()));
}

function validateCmd(cmd) {
  if (!cmd) return false;
  const exe = path.basename(cmd.trim().split(/\s+/)[0]).replace(/\.exe$/i, '').toLowerCase();
  return ALLOWED_CMDS.includes(exe);
}

const reqs = [];
function rateLimit(req, res, next) {
  const now = Date.now();
  while (reqs.length && reqs[0] < now - 60000) reqs.shift();
  if (reqs.length >= 60) return res.status(429).json({ error: 'Rate limited' });
  reqs.push(now);
  next();
}

app.use(auth); app.use(rateLimit);

app.get('/health', (_, res) => res.json({ status: 'ok', version: '1.0' }));

app.post('/read', (req, res) => {
  if (!validatePath(req.body.path)) return res.status(403).json({ error: 'Path not allowed' });
  try {
    const p = path.resolve(req.body.path);
    res.json({ content: fs.readFileSync(p, 'utf-8'), size: fs.statSync(p).size, path: p });
  } catch (e) { res.status(404).json({ error: e.message }); }
});

app.post('/write', (req, res) => {
  const { path: fp, content, mode } = req.body;
  if (!validatePath(fp)) return res.status(403).json({ error: 'Path not allowed' });
  try {
    const p = path.resolve(fp);
    fs.mkdirSync(path.dirname(p), { recursive: true });
    mode === 'append' ? fs.appendFileSync(p, content, 'utf-8') : fs.writeFileSync(p, content, 'utf-8');
    res.json({ ok: true, path: p, bytes: fs.statSync(p).size });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

app.post('/list', (req, res) => {
  const { path: dp, depth = 1 } = req.body;
  if (!validatePath(dp)) return res.status(403).json({ error: 'Path not allowed' });
  try {
    const p = path.resolve(dp);
    const walk = (d, dep, cur = 0) => {
      if (cur >= dep) return [];
      return fs.readdirSync(d, { withFileTypes: true })
        .filter(i => !i.name.startsWith('.') && i.name !== 'node_modules')
        .map(i => {
          const full = path.join(d, i.name);
          const entry = { name: i.name, type: i.isDirectory() ? 'dir' : 'file' };
          if (i.isFile()) try { entry.size = fs.statSync(full).size; } catch {}
          if (i.isDirectory() && cur + 1 < dep) entry.children = walk(full, dep, cur + 1);
          return entry;
        });
    };
    res.json({ entries: walk(p, depth), path: p });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

app.post('/exec', (req, res) => {
  const { command, cwd } = req.body;
  if (!validateCmd(command)) return res.status(403).json({ error: `Command not allowed. Permitted: ${ALLOWED_CMDS.join(', ')}` });
  if (cwd && !validatePath(cwd)) return res.status(403).json({ error: 'CWD not allowed' });
  try {
    const stdout = execSync(command, {
      cwd: cwd ? path.resolve(cwd) : undefined, encoding: 'utf-8',
      timeout: 120000, maxBuffer: 10 * 1024 * 1024,
      env: { ...process.env, PYTHONIOENCODING: 'utf-8' }, shell: 'cmd.exe',
    });
    res.json({ stdout, stderr: '', exitCode: 0 });
  } catch (e) { res.json({ stdout: e.stdout || '', stderr: e.stderr || e.message, exitCode: e.status || 1 }); }
});

app.post('/search', (req, res) => {
  const { path: sp, pattern, glob = '*' } = req.body;
  if (!validatePath(sp) || !pattern) return res.status(400).json({ error: 'Invalid params' });
  try {
    const p = path.resolve(sp);
    const regex = new RegExp(pattern, 'gi');
    const globRe = new RegExp('^' + glob.replace(/\*/g, '.*').replace(/\?/g, '.') + '$');
    const matches = [];
    const walk = (d) => {
      if (matches.length >= 500) return;
      for (const i of fs.readdirSync(d, { withFileTypes: true })) {
        if (i.name.startsWith('.') || i.name === 'node_modules') continue;
        const full = path.join(d, i.name);
        if (i.isDirectory()) { walk(full); continue; }
        if (!globRe.test(i.name)) continue;
        try {
          const lines = fs.readFileSync(full, 'utf-8').split('\n');
          lines.forEach((line, idx) => {
            if (regex.test(line)) matches.push({ file: path.relative(p, full), line: idx + 1, text: line.trim().substring(0, 200) });
            regex.lastIndex = 0;
          });
        } catch {}
      }
    };
    walk(p);
    res.json({ matches, total: matches.length, capped: matches.length >= 500 });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

app.listen(PORT, () => {
  console.log(`\n  Desktop Commander Bridge v1.0 — http://localhost:${PORT}`);
  console.log(`  Token: ${TOKEN ? '****' + TOKEN.slice(-4) : 'NOT SET'}`);
  console.log(`  Endpoints: /health /read /write /list /exec /search`);
  console.log(`  Start tunnel: ngrok http ${PORT}\n`);
});
