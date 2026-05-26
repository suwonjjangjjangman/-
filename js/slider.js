export function initSlider() {
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

    heroDots.forEach(dot => {
        dot.addEventListener('click', () => resetSlider(+dot.dataset.slide));
    });

    if (heroEl) {
        let wheelAccum = 0;
        let wheelCooldown = false;
        heroEl.addEventListener('wheel', e => {
            if (Math.abs(e.deltaX) < Math.abs(e.deltaY)) return;
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

        let touchStartX = 0;
        heroEl.addEventListener('touchstart', e => { touchStartX = e.touches[0].clientX; }, { passive: true });
        heroEl.addEventListener('touchend', e => {
            const diff = touchStartX - e.changedTouches[0].clientX;
            if (Math.abs(diff) > 50) resetSlider(diff > 0 ? currentSlide + 1 : currentSlide - 1);
        }, { passive: true });
    }

    startSlider();
}
