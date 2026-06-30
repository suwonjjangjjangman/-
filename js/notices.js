export async function initNotices() {
    const container = document.getElementById('notices-table-wrap');
    if (!container) return;

    let data;
    try {
        const res = await fetch('./data/notices.json');
        data = await res.json();
    } catch {
        return;
    }

    const lang = localStorage.getItem('lang') || 'ko';
    const isEn = lang === 'en';

    const labels = {
        num:    isEn ? 'No.'     : '번호',
        title:  isEn ? 'Title'   : '제목(내용)',
        author: isEn ? 'Author'  : '작성자',
        date:   isEn ? 'Date'    : '작성일',
        views:  isEn ? 'Views'   : '조회수',
        pin:    isEn ? 'Notice'  : '공지',
        write:  isEn ? 'Write Post' : '글쓰기',
        admin:  isEn ? 'Admin'   : '관리자',
    };

    const rows = data.notices.map((n, i) => {
        const numCell = n.pinned
            ? `<td class="nt-num nt-pin">${labels.pin}</td>`
            : `<td class="nt-num">${data.notices.filter(x => !x.pinned).indexOf(n) + 1}</td>`;
        return `<tr>
            ${numCell}
            <td class="nt-title">${n.title}<br><small>${n.summary}</small></td>
            <td class="nt-auth">${n.author}</td>
            <td class="nt-date">${n.date}</td>
            <td class="nt-views">-</td>
        </tr>`;
    }).join('');

    container.innerHTML = `
        <table class="notice-table">
            <thead>
                <tr>
                    <th class="nt-num">${labels.num}</th>
                    <th>${labels.title}</th>
                    <th class="nt-auth">${labels.author}</th>
                    <th class="nt-date">${labels.date}</th>
                    <th class="nt-views">${labels.views}</th>
                </tr>
            </thead>
            <tbody>${rows}</tbody>
        </table>
        <div style="text-align: right; margin-top: 1.5rem;">
            <a href="/admin/" class="btn btn-primary" style="font-size: 0.9rem; padding: 0.6rem 1.5rem;">${labels.write}</a>
        </div>`;
}
