import { initAnimations } from './js/animations.js';
import { initTabs } from './js/tabs.js';
import { initNav } from './js/nav.js';
import { initSlider } from './js/slider.js';
import { initLightbox } from './js/lightbox.js';
import { initForm } from './js/form.js';

if (typeof lucide !== 'undefined') lucide.createIcons();

initAnimations();
initTabs();
initNav();
initSlider();
initLightbox();
initForm();
