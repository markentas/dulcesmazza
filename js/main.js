/* ============================================
   DULCES MAZZA - JAVASCRIPT PRINCIPAL
   ============================================ */

// Slider automático con imágenes numeradas
let currentSlide = 0;
let slideImages = [];
let maxImages = 100;

// Función para mezclar array (Fisher-Yates)
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

// Cargar imágenes automáticamente
async function loadSliderImages() {
    const wrapper = document.getElementById('sliderWrapper');
    const nav = document.getElementById('sliderNav');
    
    if (!wrapper || !nav) return;
    
    // Detectar imágenes existentes (1.jpg, 2.jpg, etc.)
    for (let i = 1; i <= maxImages; i++) {
        const img = new Image();
        img.src = `img/slider/${i}.jpg`;
        
        try {
            await new Promise((resolve, reject) => {
                img.onload = () => resolve(true);
                img.onerror = () => reject(false);
            });
            slideImages.push(i);
        } catch (e) {
            // Cuando no encuentra más imágenes, termina
            if (slideImages.length > 0) break;
        }
    }

    // Si no hay imágenes, mostrar mensaje
    if (slideImages.length === 0) {
        const loader = document.getElementById('sliderLoader');
        if (loader) loader.style.display = 'none';
        wrapper.innerHTML = '<p style="text-align:center;color:var(--texto-gris);">No hay imágenes en la galería</p>';
        return;
    }

    // Mezclar aleatoriamente
    slideImages = shuffleArray(slideImages);

    // Generar slides
    slideImages.forEach((imgNum, index) => {
        const slide = document.createElement('div');
        slide.className = 'slider-slide';
        slide.innerHTML = `<img src="img/slider/${imgNum}.jpg" alt="Dulces Mazza" onclick="openImageModal('img/slider/${imgNum}.jpg')">`;
        wrapper.appendChild(slide);
    });

    // Ocultar loader
    const loader = document.getElementById('sliderLoader');
    if (loader) loader.style.display = 'none';

    // Generar dots
    slideImages.forEach((_, index) => {
        const dot = document.createElement('span');
        dot.className = 'slider-dot' + (index === 0 ? ' active' : '');
        dot.onclick = () => goToSlide(index);
        nav.appendChild(dot);
    });

    // Iniciar slider
    initSlider();
}

// Inicializar slider después de cargar imágenes
function initSlider() {
    const slides = document.querySelectorAll('.slider-slide');
    const dots = document.querySelectorAll('.slider-dot');
    const wrapper = document.getElementById('sliderWrapper');
    const container = document.querySelector('.slider-container');
    let autoSlideInterval;

    function updateSlider() {
        wrapper.style.transform = `translateX(-${currentSlide * 100}%)`;
        dots.forEach((dot, index) => {
            dot.classList.toggle('active', index === currentSlide);
        });
    }

    window.changeSlide = function(direction) {
        currentSlide += direction;
        if (currentSlide < 0) currentSlide = slides.length - 1;
        if (currentSlide >= slides.length) currentSlide = 0;
        updateSlider();
    };

    window.goToSlide = function(index) {
        currentSlide = index;
        updateSlider();
    };

    // Pausar en hover
    function startAutoSlide() {
        autoSlideInterval = setInterval(() => {
            changeSlide(1);
        }, 5000);
    }

    function stopAutoSlide() {
        clearInterval(autoSlideInterval);
    }

    // Eventos hover para pausar
    container.addEventListener('mouseenter', stopAutoSlide);
    container.addEventListener('mouseleave', startAutoSlide);

    // Iniciar auto slide
    startAutoSlide();
}

// Modal functions
window.openImageModal = function(src) {
    const modal = document.getElementById('imageModal');
    const img = document.getElementById('modalImageSrc');
    img.src = src;
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
};

window.closeImageModal = function(event) {
    if (event.target.id === 'imageModal') {
        const modal = document.getElementById('imageModal');
        modal.classList.remove('active');
        document.body.style.overflow = 'auto';
    }
};

window.closeImageModalBtn = function() {
    const modal = document.getElementById('imageModal');
    modal.classList.remove('active');
    document.body.style.overflow = 'auto';
};

// Back to Top - Show when reaching location section
document.addEventListener('DOMContentLoaded', function() {
    loadSliderImages();
    
    const backToTopBtn = document.getElementById('backToTop');
    const whatsappFloat = document.getElementById('whatsappFloat');
    const locationSection = document.querySelector('.location-section');

    if (!backToTopBtn || !whatsappFloat || !locationSection) return;

    function checkButtons() {
        const locationPosition = locationSection.getBoundingClientRect().top;
        const screenHeight = window.innerHeight;
        
        // Back to top y WhatsApp float - muestran cuando llegás a ubicación
        if (locationPosition < screenHeight - 100) {
            backToTopBtn.classList.add('visible');
            whatsappFloat.classList.add('visible');
        } else {
            backToTopBtn.classList.remove('visible');
            whatsappFloat.classList.remove('visible');
        }
    }

    checkButtons();
    window.addEventListener('scroll', checkButtons);
});
