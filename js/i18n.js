import { ko } from './i18n-ko.js';
import { en } from './i18n-en.js';

const translations = { ko, en };

export function initI18n() {
    const savedLang = localStorage.getItem('lang') || 'ko';
    applyLang(savedLang);
    document.querySelectorAll('.lang-btn').forEach(btn => {
        btn.addEventListener('click', e => {
            e.preventDefault();
            applyLang(btn.dataset.lang);
        });
    });
}

function applyLang(lang) {
    localStorage.setItem('lang', lang);
    document.documentElement.lang = lang;
    const t = translations[lang] ?? translations.ko;

    document.querySelectorAll('[data-i18n]').forEach(el => {
        const val = t[el.dataset.i18n];
        if (val !== undefined) el.textContent = val;
    });

    document.querySelectorAll('[data-i18n-html]').forEach(el => {
        const val = t[el.dataset.i18nHtml];
        if (val !== undefined) el.innerHTML = val;
    });

    document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
        const val = t[el.dataset.i18nPlaceholder];
        if (val !== undefined) el.placeholder = val;
    });

    document.querySelectorAll('.lang-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.lang === lang);
    });
}
