import { triggerAnimations } from './animations.js';

export function switchTabInContext(context, tabId) {
    context.querySelectorAll('.page-tab').forEach(t => t.classList.remove('active'));
    context.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));

    const targetTab = context.querySelector(`.page-tab[data-target="${tabId}"]`);
    const targetContent = context.querySelector(`.tab-content[data-tab="${tabId}"]`);

    if (targetTab) targetTab.classList.add('active');
    if (targetContent) {
        targetContent.classList.add('active');
        triggerAnimations(targetContent);
    }
}

export function initTabs() {
    document.querySelectorAll('.page-tab[data-target]').forEach(btn => {
        btn.addEventListener('click', () => {
            const context = btn.closest('.view-section');
            switchTabInContext(context, btn.dataset.target);
            history.replaceState(null, null, `#${context.id}__${btn.dataset.target}`);
        });
    });

    document.querySelectorAll('.prod-cat-tab').forEach(tab => {
        tab.addEventListener('click', () => {
            const cat = tab.dataset.cat;
            const parent = tab.closest('.tab-content');
            parent.querySelectorAll('.prod-cat-tab').forEach(t => t.classList.remove('active'));
            parent.querySelectorAll('.prod-cat-content').forEach(c => c.classList.remove('active'));
            tab.classList.add('active');
            parent.querySelector(`.prod-cat-content[data-cat="${cat}"]`).classList.add('active');
        });
    });

    document.querySelectorAll('.rf-ov-card').forEach(card => {
        card.addEventListener('click', (e) => {
            e.preventDefault();
            const cat = card.dataset.switchCat;
            const rfTab = document.querySelector('.tab-content[data-tab="rf"]');
            if (!rfTab) return;
            const targetBtn = rfTab.querySelector(`.prod-cat-tab[data-cat="${cat}"]`);
            if (targetBtn) {
                targetBtn.click();
                targetBtn.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            }
        });
    });
}
