import { marked } from 'https://cdn.jsdelivr.net/npm/marked@9/lib/marked.esm.js';

export async function initNotices() {
    const container = document.getElementById('notices-table-wrap');
    if (!container) return;

    let data;
    try {
        const res = await fetch('./data/notices.json');
        data = await res.json();
    } catch { return; }

    const lang = localStorage.getItem('lang') || 'ko';
    const isEn = lang === 'en';
    const labels = {
        num:    isEn ? 'No.'        : '번호',
        title:  isEn ? 'Title'      : '제목',
        author: isEn ? 'Author'     : '작성자',
        date:   isEn ? 'Date'       : '작성일',
        pin:    isEn ? 'Notice'     : '공지',
        write:  isEn ? 'Write Post' : '글쓰기',
    };

    const pinned  = data.notices.filter(n => n.pinned);
    const regular = data.notices.filter(n => !n.pinned);
    const sorted  = [...pinned, ...regular];

    renderTable(container, sorted, labels);
    buildModal();

    container.querySelectorAll('.notice-row').forEach((row, i) => {
        row.addEventListener('click', () => openModal(sorted[i]));
    });
}

function renderTable(container, notices, labels) {
    let regIdx = notices.filter(n => !n.pinned).length;
    const rows = notices.map((n, i) => {
        const numCell = n.pinned
            ? `<td class="nt-num nt-pin">${labels.pin}</td>`
            : `<td class="nt-num">${regIdx--}</td>`;
        return `<tr class="notice-row" data-idx="${i}">
            ${numCell}
            <td class="nt-title">${n.title}${n.summary ? `<br><small>${n.summary}</small>` : ''}</td>
            <td class="nt-auth">${n.author}</td>
            <td class="nt-date">${n.date}</td>
        </tr>`;
    }).join('');

    container.innerHTML = `
        <table class="notice-table">
            <thead><tr>
                <th class="nt-num">${labels.num}</th>
                <th>${labels.title}</th>
                <th class="nt-auth">${labels.author}</th>
                <th class="nt-date">${labels.date}</th>
            </tr></thead>
            <tbody>${rows}</tbody>
        </table>
        <div class="notices-footer">
            <a href="/admin/" class="btn btn-primary btn-sm">${labels.write}</a>
        </div>`;
}

function buildModal() {
    if (document.getElementById('notice-modal')) return;
    const el = document.createElement('div');
    el.id = 'notice-modal';
    el.className = 'notice-modal';
    el.innerHTML = `
        <div class="notice-modal-backdrop"></div>
        <article class="notice-modal-box">
            <button class="notice-modal-close" aria-label="닫기">&times;</button>
            <header class="notice-modal-header">
                <h3 class="notice-modal-title"></h3>
                <p class="notice-modal-meta"></p>
            </header>
            <div class="notice-modal-body"></div>
        </article>`;
    document.body.appendChild(el);
    el.querySelector('.notice-modal-backdrop').addEventListener('click', closeModal);
    el.querySelector('.notice-modal-close').addEventListener('click', closeModal);
    document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });
}

function openModal(notice) {
    const modal = document.getElementById('notice-modal');
    modal.querySelector('.notice-modal-title').textContent = notice.title;
    modal.querySelector('.notice-modal-meta').textContent = `${notice.author} · ${notice.date}`;
    const bodyEl = modal.querySelector('.notice-modal-body');
    bodyEl.innerHTML = notice.body ? marked.parse(notice.body) : `<p>${notice.summary || ''}</p>`;
    modal.classList.add('is-open');
    document.body.classList.add('modal-open');
}

function closeModal() {
    const modal = document.getElementById('notice-modal');
    if (modal) modal.classList.remove('is-open');
    document.body.classList.remove('modal-open');
}
