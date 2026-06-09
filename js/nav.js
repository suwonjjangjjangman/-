import { triggerAnimations } from './animations.js';
import { switchTabInContext } from './tabs.js';

export function initNav() {
    const viewSections = document.querySelectorAll('.view-section');
    const allNavLinks = document.querySelectorAll('.nav-link, .dropdown-item');
    const navLinksContainer = document.querySelector('.nav-links');
    const navOverlay = document.querySelector('.nav-overlay');
    const mobileBtn = document.querySelector('.mobile-menu-btn');

    function navigateTo(hash) {
        if (!hash || hash === '#') hash = '#home';
        const [viewId, tabId] = hash.split('__');

        let activated = false;
        viewSections.forEach(section => {
            if (`#${section.id}` === viewId) {
                section.classList.add('active');
                activated = true;
                setTimeout(() => triggerAnimations(section), 50);
            } else {
                section.classList.remove('active');
            }
        });

        allNavLinks.forEach(link => {
            const href = link.getAttribute('href');
            link.classList.toggle('active', href === hash || href === viewId);
        });

        if (tabId && activated) {
            const context = document.querySelector(viewId);
            if (context) {
                switchTabInContext(context, tabId);
                setTimeout(() => {
                    const el = context.querySelector(`.tab-content[data-tab="${tabId}"]`);
                    if (el) window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 100, behavior: 'smooth' });
                }, 100);
            }
        } else {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    }

    window.addEventListener('hashchange', () => navigateTo(window.location.hash));
    navigateTo(window.location.hash || '#home');

    function toggleMobileMenu() {
        const isActive = navLinksContainer.classList.contains('mobile-active');
        navLinksContainer.classList.toggle('mobile-active', !isActive);
        if (navOverlay) navOverlay.classList.toggle('mobile-active', !isActive);
        mobileBtn.innerHTML = isActive ? '<i data-lucide="menu"></i>' : '<i data-lucide="x"></i>';
        if (window.lucide) lucide.createIcons();
    }

    if (mobileBtn) {
        mobileBtn.addEventListener('click', toggleMobileMenu);
        if (navOverlay) navOverlay.addEventListener('click', toggleMobileMenu);
    }

    document.querySelectorAll('.dropdown-item').forEach(link => {
        link.addEventListener('click', () => { if (window.innerWidth <= 768) toggleMobileMenu(); });
    });

    document.querySelectorAll('.nav-item').forEach(item => {
        item.addEventListener('click', e => {
            if (window.innerWidth <= 768 && e.target.classList.contains('nav-link')) {
                const hasDropdown = item.querySelector('.dropdown-menu');
                if (hasDropdown) {
                    e.preventDefault();
                    item.classList.toggle('open');
                } else {
                    toggleMobileMenu();
                }
            }
        });
    });
}
