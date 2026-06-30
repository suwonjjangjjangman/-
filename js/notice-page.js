import { marked } from 'https://cdn.jsdelivr.net/npm/marked@9/lib/marked.esm.js';

const params = new URLSearchParams(location.search);
const slug   = params.get('slug');

fetch('./data/notices.json')
    .then(r => r.json())
    .then(data => {
        const notice = slug
            ? data.notices.find(n => n.slug === slug)
            : data.notices[0];

        if (!notice) {
            document.getElementById('notice-title').textContent = '공지를 찾을 수 없습니다.';
            return;
        }

        document.title = `${notice.title} — 신화테크놀러지`;
        document.documentElement.lang = localStorage.getItem('lang') || 'ko';

        const badge = document.getElementById('notice-badge');
        if (notice.pinned) {
            badge.textContent = '공지';
            badge.classList.add('notice-badge-pin');
        }

        document.getElementById('notice-title').textContent = notice.title;
        document.getElementById('notice-meta').textContent = `${notice.author} · ${notice.date}`;

        const bodyEl = document.getElementById('notice-body');
        bodyEl.innerHTML = notice.body
            ? marked.parse(notice.body)
            : `<p>${notice.summary || ''}</p>`;
    })
    .catch(() => {
        document.getElementById('notice-title').textContent = '불러오기 실패';
    });
