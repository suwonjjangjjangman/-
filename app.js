document.addEventListener('DOMContentLoaded', () => {
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }

    // 1. Navigation Logic
    const viewSections = document.querySelectorAll('.view-section');
    const navLinks = document.querySelectorAll('.nav-link, .dropdown-item');

    function navigateTo(hash) {
        if (!hash || hash === '#') hash = '#home';
        
        // Parse Hash for deep linking e.g. #business__rf -> view: business, tab: rf
        const parts = hash.split('__');
        const viewId = parts[0];
        const tabId = parts[1];

        // Toggle Views
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

        // Toggle Active States on Nav
        navLinks.forEach(link => {
            if (link.getAttribute('href') === hash || link.getAttribute('href') === viewId) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });

        // Handle inner-tabs if deeply linked
        if (tabId && activated) {
            const context = document.querySelector(viewId);
            if (context) {
                switchTabInContext(context, tabId);
                
                // Slight scroll delay to header
                setTimeout(() => {
                    const el = context.querySelector(`.tab-content[data-tab="${tabId}"]`);
                    if(el) {
                        const y = el.getBoundingClientRect().top + window.scrollY - 100;
                        window.scrollTo({top: y, behavior: 'smooth'});
                    }
                }, 100);
            }
        } else {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    }

    // Hash Listeners
    window.addEventListener('hashchange', () => navigateTo(window.location.hash));
    if (window.location.hash) {
        navigateTo(window.location.hash);
    } else {
        navigateTo('#home');
    }

    // 2. Tab Navigation Logic within specific pages
    function switchTabInContext(context, tabId) {
        // Deactivate all
        const tabs = context.querySelectorAll('.page-tab');
        const contents = context.querySelectorAll('.tab-content');
        
        tabs.forEach(t => t.classList.remove('active'));
        contents.forEach(c => c.classList.remove('active'));

        // Activate matched
        const targetTab = context.querySelector(`.page-tab[data-target="${tabId}"]`);
        const targetContent = context.querySelector(`.tab-content[data-tab="${tabId}"]`);
        
        if (targetTab) targetTab.classList.add('active');
        if (targetContent) targetContent.classList.add('active');
        
        // Retrigger animations inside the newly visible tab content
        if (targetContent) {
           triggerAnimations(targetContent);
        }
    }

    const tabButtons = document.querySelectorAll('.page-tab');
    tabButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const context = btn.closest('.view-section');
            const targetId = btn.getAttribute('data-target');
            switchTabInContext(context, targetId);
            
            // Adjust hash silently if desired (optional)
            history.replaceState(null, null, `#${context.id}__${targetId}`);
        });
    });

    // 3. Scroll Fade Animations
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const animateObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);

    function triggerAnimations(context) {
        const elementsToAnimate = context.querySelectorAll('.fade-up');
        elementsToAnimate.forEach(el => {
            animateObserver.unobserve(el);
            el.classList.remove('visible'); 
            
            // Re-observe after a tiny delay so the browser registers the display:block first
            setTimeout(() => {
                animateObserver.observe(el);
                
                // Fallback: If it's already well within the viewport, force visible to prevent blank tabs
                const rect = el.getBoundingClientRect();
                if (rect.top < window.innerHeight && rect.bottom > 0) {
                    el.classList.add('visible');
                }
            }, 50);
        });
        
        if (context.id === 'home' || context.querySelector('.counter-row')) {
            animateCounters();
        }
    }

    // 4. Shrink Navbar
    const navbar = document.querySelector('.navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 30) {
            navbar.classList.add('shrink');
        } else {
            navbar.classList.remove('shrink');
        }
    });

    // 5. Counters
    let countersAnimated = false;
    function animateCounters() {
        if (countersAnimated) return;
        const counters = document.querySelectorAll('.counter-val[data-target]');
        counters.forEach(counter => {
            const target = +counter.getAttribute('data-target');
            const duration = 2500;
            const increment = target / (duration / 16);
            
            let current = 0;
            const updateCounter = () => {
                current += increment;
                if (current < target) {
                    counter.innerText = Math.ceil(current);
                    requestAnimationFrame(updateCounter);
                } else {
                    counter.innerText = target;
                    if(target > 50) counter.innerText += '+';
                }
            };
            updateCounter();
        });
        countersAnimated = true;
    }

    // 6. Mobile Menu Logic
    const mobileBtn = document.querySelector('.mobile-menu-btn');
    const navLinksContainer = document.querySelector('.nav-links');
    const navOverlay = document.querySelector('.nav-overlay');

    function toggleMobileMenu() {
        const isActive = navLinksContainer.classList.contains('mobile-active');
        if (isActive) {
            navLinksContainer.classList.remove('mobile-active');
            if (navOverlay) navOverlay.classList.remove('mobile-active');
            mobileBtn.innerHTML = '<i data-lucide="menu"></i>';
            if (window.lucide) lucide.createIcons();
        } else {
            navLinksContainer.classList.add('mobile-active');
            if (navOverlay) navOverlay.classList.add('mobile-active');
            mobileBtn.innerHTML = '<i data-lucide="x"></i>';
            if (window.lucide) lucide.createIcons();
        }
    }

    if (mobileBtn) {
        mobileBtn.addEventListener('click', toggleMobileMenu);
        if (navOverlay) navOverlay.addEventListener('click', toggleMobileMenu);
    }

    // Close mobile menu when a nav link is clicked
    const allNavLinks = document.querySelectorAll('.dropdown-item');
    allNavLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (window.innerWidth <= 768) toggleMobileMenu();
        });
    });

    // 7. Certificate Lightbox
    const lightbox = document.getElementById('certLightbox');
    const lightboxImg = document.getElementById('lightboxImg');
    const lightboxCaption = document.getElementById('lightboxCaption');
    const lightboxClose = document.getElementById('lightboxClose');

    document.querySelectorAll('.cert-doc').forEach(doc => {
        doc.addEventListener('click', () => {
            const img = doc.querySelector('.cert-img-real');
            const caption = doc.querySelector('span');
            lightboxImg.src = img.src;
            lightboxImg.alt = img.alt;
            lightboxCaption.textContent = caption ? caption.textContent : '';
            lightbox.classList.add('active');
            if (window.lucide) lucide.createIcons();
        });
    });

    lightboxClose.addEventListener('click', () => lightbox.classList.remove('active'));
    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) lightbox.classList.remove('active');
    });
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') lightbox.classList.remove('active');
    });

    // 8. Hero Slider
    const heroSlides = document.querySelectorAll('.hero-slide');
    const heroDots = document.querySelectorAll('.hero-dot[data-slide]');
    const heroEl = document.querySelector('.hero-slider');
    let currentSlide = 0;
    let sliderTimer = null;

    function goToSlide(index) {
        heroSlides[currentSlide].classList.remove('active');
        heroDots[currentSlide].classList.remove('active');
        currentSlide = (index + heroSlides.length) % heroSlides.length;
        heroSlides[currentSlide].classList.add('active');
        heroDots[currentSlide].classList.add('active');
    }

    function startSlider() {
        if (heroSlides.length < 2) return;
        sliderTimer = setInterval(() => goToSlide(currentSlide + 1), 5000);
    }

    function resetSlider(newIndex) {
        clearInterval(sliderTimer);
        goToSlide(newIndex);
        startSlider();
    }

    // 점(dot) 클릭
    heroDots.forEach(dot => {
        dot.addEventListener('click', () => resetSlider(+dot.getAttribute('data-slide')));
    });

    // 트랙패드 가로 스와이프
    if (heroEl) {
        let wheelAccum = 0;
        let wheelCooldown = false;
        heroEl.addEventListener('wheel', (e) => {
            if (Math.abs(e.deltaX) < Math.abs(e.deltaY)) return; // 세로 스크롤 무시
            e.preventDefault();
            if (wheelCooldown) return;
            wheelAccum += e.deltaX;
            if (Math.abs(wheelAccum) > 60) {
                resetSlider(wheelAccum > 0 ? currentSlide + 1 : currentSlide - 1);
                wheelAccum = 0;
                wheelCooldown = true;
                setTimeout(() => { wheelCooldown = false; }, 800);
            }
        }, { passive: false });

        // 터치 스와이프 (모바일)
        let touchStartX = 0;
        heroEl.addEventListener('touchstart', (e) => { touchStartX = e.touches[0].clientX; }, { passive: true });
        heroEl.addEventListener('touchend', (e) => {
            const diff = touchStartX - e.changedTouches[0].clientX;
            if (Math.abs(diff) > 50) resetSlider(diff > 0 ? currentSlide + 1 : currentSlide - 1);
        }, { passive: true });
    }

    startSlider();

    // 소카테고리 탭 (MCT/CNC/5축 등)
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

    // Mobile dropdown toggle
    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(item => {
        item.addEventListener('click', (e) => {
            if (window.innerWidth <= 768) {
                // If they clicked the primary nav link, just toggle the dropdown open instead of navigating
                if (e.target.classList.contains('nav-link')) {
                    e.preventDefault();
                    item.classList.toggle('open');
                }
            }
        });
    });
});
