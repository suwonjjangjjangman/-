export function initLightbox() {
    const lightbox = document.getElementById('certLightbox');
    const lightboxImg = document.getElementById('lightboxImg');
    const lightboxCaption = document.getElementById('lightboxCaption');
    const lightboxClose = document.getElementById('lightboxClose');

    const close = () => lightbox.classList.remove('active');

    document.querySelectorAll('.cert-doc').forEach(doc => {
        doc.addEventListener('click', () => {
            const img = doc.querySelector('.cert-img-real');
            const caption = doc.querySelector('span');
            lightboxImg.src = img.src;
            lightboxImg.alt = img.alt;
            lightboxCaption.textContent = caption?.textContent ?? '';
            lightbox.classList.add('active');
            if (window.lucide) lucide.createIcons();
        });
    });

    lightboxClose.addEventListener('click', close);
    lightbox.addEventListener('click', e => { if (e.target === lightbox) close(); });
    document.addEventListener('keydown', e => { if (e.key === 'Escape') close(); });
}
