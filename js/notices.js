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
}

function renderTable(container, notices, labels) {
    let regIdx = notices.filter(n => !n.pinned).length;
    const rows = notices.map(n => {
        const numCell = n.pinned
            ? `<td class="nt-num nt-pin">${labels.pin}</td>`
            : `<td class="nt-num">${regIdx--}</td>`;
        const slug = n.slug || encodeURIComponent(n.title);
        return `<tr class="notice-row" data-slug="${slug}">
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

    container.querySelectorAll('.notice-row').forEach(row => {
        row.addEventListener('click', () => {
            location.href = `notice.html?slug=${row.dataset.slug}`;
        });
    });
}
