const fs   = require('fs');
const path = require('path');

const postsDir  = path.join(__dirname, '../data/posts');
const indexFile = path.join(__dirname, '../data/notices.json');

function parseFrontmatter(raw) {
    const m = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/);
    if (!m) return { data: {}, body: raw.trim() };
    const data = {};
    for (const line of m[1].split(/\r?\n/)) {
        const colon = line.indexOf(':');
        if (colon < 0) continue;
        const key = line.slice(0, colon).trim();
        let val = line.slice(colon + 1).trim();
        if (/^["']/.test(val) && val.endsWith(val[0])) {
            val = val.slice(1, -1).replace(/\\"/g, '"');
        }
        if (val === 'true')  val = true;
        if (val === 'false') val = false;
        data[key] = val;
    }
    return { data, body: m[2].trim() };
}

if (!fs.existsSync(postsDir)) fs.mkdirSync(postsDir, { recursive: true });

const files = fs.readdirSync(postsDir)
    .filter(f => f.endsWith('.md'))
    .sort()
    .reverse();

const notices = files.map(filename => {
    const raw = fs.readFileSync(path.join(postsDir, filename), 'utf8');
    const { data, body } = parseFrontmatter(raw);
    return {
        slug:    path.basename(filename, '.md'),
        title:   data.title   || '',
        summary: data.summary || '',
        body,
        author:  data.author  || '관리자',
        date:    String(data.date || ''),
        pinned:  data.pinned === true || data.pinned === 'true',
    };
});

// pinned first, then newest first
notices.sort((a, b) => {
    if (a.pinned !== b.pinned) return a.pinned ? -1 : 1;
    return b.date.localeCompare(a.date);
});

fs.writeFileSync(indexFile, JSON.stringify({ notices }, null, 2));
console.log(`Generated notices.json — ${notices.length} posts`);
