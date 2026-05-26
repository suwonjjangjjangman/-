const animateObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) entry.target.classList.add('visible');
    });
}, { root: null, rootMargin: '0px', threshold: 0.1 });

let countersAnimated = false;

export function animateCounters() {
    if (countersAnimated) return;
    document.querySelectorAll('.counter-val[data-target]').forEach(counter => {
        const target = +counter.getAttribute('data-target');
        const increment = target / (2500 / 16);
        let current = 0;
        const update = () => {
            current += increment;
            if (current < target) {
                counter.innerText = Math.ceil(current);
                requestAnimationFrame(update);
            } else {
                counter.innerText = target > 50 ? target + '+' : target;
            }
        };
        update();
    });
    countersAnimated = true;
}

export function triggerAnimations(context) {
    context.querySelectorAll('.fade-up').forEach(el => {
        animateObserver.unobserve(el);
        el.classList.remove('visible');
        setTimeout(() => {
            animateObserver.observe(el);
            const rect = el.getBoundingClientRect();
            if (rect.top < window.innerHeight && rect.bottom > 0) el.classList.add('visible');
        }, 50);
    });
    if (context.id === 'home' || context.querySelector('.counter-row')) animateCounters();
}

export function initAnimations() {
    const navbar = document.querySelector('.navbar');
    window.addEventListener('scroll', () => {
        navbar.classList.toggle('shrink', window.scrollY > 30);
    });
}
