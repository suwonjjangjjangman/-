const translations = {
    ko: {
        // Nav
        'nav.about':    '회사소개',
        'nav.business': '사업분야',
        'nav.products': '제품소개',
        'nav.recruit':  '인재채용',
        'nav.support':  '고객지원',
        'nav.about.ceo':     'CEO인사말',
        'nav.about.history': '회사연혁',
        'nav.about.cert':    '인증서 및 특허',
        'nav.products.machining': '정밀가공 제품',
        'nav.products.rf':        'RF 제품',
        'nav.recruit.talent':  '인재상',
        'nav.recruit.welfare': '복리후생',
        'nav.recruit.guide':   '채용안내',
        'nav.support.location': '찾아오시는길',
        'nav.support.inquiry':  '견적 및 문의',
        'nav.support.notices':  '공지사항',
        // Hero
        'hero.btn.business': '사업분야 보기',
        'hero.btn.brochure': '회사소개서 다운로드',
        // About
        'about.title': '회사소개',
        'about.tab.ceo':     'CEO 인사말',
        'about.tab.history': '회사연혁',
        'about.tab.cert':    '인증서 및 특허',
        // Business
        'business.title': '사업분야',
        'business.card.machining': '정밀 가공',
        'business.card.rf':        'RF 제품',
        // Products
        'products.title': '제품소개',
        'products.tab.machining': '정밀가공 제품',
        'products.tab.rf':        'RF 제품',
        // Recruit
        'recruit.title': '인재채용',
        // Support
        'support.title': '고객지원',
        'support.inquiry.btn': '견적 문의하기',
        // Footer
        'footer.copy': '© 2026 SHINHWA TECHNOLOGY CO., LTD. ALL RIGHTS RESERVED.',
    },
    en: {
        // Nav
        'nav.about':    'COMPANY',
        'nav.business': 'BUSINESS',
        'nav.products': 'PRODUCTS',
        'nav.recruit':  'CAREERS',
        'nav.support':  'SUPPORT',
        'nav.about.ceo':     'CEO Message',
        'nav.about.history': 'History',
        'nav.about.cert':    'Certifications & Patents',
        'nav.products.machining': 'Precision Machining',
        'nav.products.rf':        'RF Products',
        'nav.recruit.talent':  'Talent',
        'nav.recruit.welfare': 'Benefits',
        'nav.recruit.guide':   'Recruitment',
        'nav.support.location': 'Location',
        'nav.support.inquiry':  'Inquiry',
        'nav.support.notices':  'Notices',
        // Hero
        'hero.btn.business': 'View Business',
        'hero.btn.brochure': 'Download Brochure',
        // About
        'about.title': 'Company',
        'about.tab.ceo':     'CEO Message',
        'about.tab.history': 'History',
        'about.tab.cert':    'Certifications',
        // Business
        'business.title': 'Business Areas',
        'business.card.machining': 'Precision Machining',
        'business.card.rf':        'RF Products',
        // Products
        'products.title': 'Products',
        'products.tab.machining': 'Precision Machining',
        'products.tab.rf':        'RF Products',
        // Recruit
        'recruit.title': 'Careers',
        // Support
        'support.title': 'Support',
        'support.inquiry.btn': 'Send Inquiry',
        // Footer
        'footer.copy': '© 2026 SHINHWA TECHNOLOGY CO., LTD. ALL RIGHTS RESERVED.',
    }
};

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

    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.dataset.i18n;
        if (translations[lang]?.[key]) el.textContent = translations[lang][key];
    });

    // Update active state on lang buttons
    document.querySelectorAll('.lang-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.lang === lang);
    });
}
