// Variables para el menú desplegable
let menuTimeout;

// Función para mostrar menú desplegable
function showDropdownMenu() {
    clearTimeout(menuTimeout);
    const dropdown = document.querySelector('.dropdown-menu');
    dropdown.style.opacity = '1';
    dropdown.style.visibility = 'visible';
    dropdown.style.transform = 'translateY(0)';
}

// Función para ocultar menú desplegable
function hideDropdownMenu() {
    menuTimeout = setTimeout(() => {
        const dropdown = document.querySelector('.dropdown-menu');
        dropdown.style.opacity = '0';
        dropdown.style.visibility = 'hidden';
        dropdown.style.transform = 'translateY(-20px)';
    }, 150); // Delay de 150ms
}

// Event listeners para el menú desplegable
const navContainer = document.querySelector('.nav-item-container');
if (navContainer) {
    navContainer.addEventListener('mouseenter', showDropdownMenu);
    navContainer.addEventListener('mouseleave', hideDropdownMenu);
}
let currentSlide = 0;
let autoplayInterval;
const slides = document.querySelectorAll('.slide');
const indicators = document.querySelectorAll('.indicator');
const menuItems = document.querySelectorAll('.menu-item');
const totalSlides = slides.length;

// Función para hacer scroll a slide específico
function showSlide(index) {
    console.log('Haciendo scroll al slide:', index + 1);
    
    // Actualizar indicadores y menú
    indicators.forEach(indicator => indicator.classList.remove('active'));
    menuItems.forEach(item => item.classList.remove('active'));
    
    indicators[index].classList.add('active');
    menuItems[index].classList.add('active');
    
    // Hacer scroll al slide
    const targetSlide = slides[index];
    targetSlide.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'start' 
    });
    
    currentSlide = index;
}

// Función para ir al siguiente slide
function nextSlide() {
    currentSlide = (currentSlide + 1) % totalSlides;
    showSlide(currentSlide);
}

// Función para ir al slide anterior
function prevSlide() {
    currentSlide = (currentSlide - 1 + totalSlides) % totalSlides;
    showSlide(currentSlide);
}

// Función para ir a slide específico
function goToSlide(index) {
    showSlide(index);
    resetAutoplay();
}

// Función para detectar qué slide está visible
function updateActiveSlide() {
    const scrollTop = window.pageYOffset;
    const windowHeight = window.innerHeight;
    
    slides.forEach((slide, index) => {
        const slideTop = slide.offsetTop - 140; // Restar altura del header
        const slideBottom = slideTop + slide.offsetHeight;
        
        // Si el slide está en el viewport
        if (scrollTop >= slideTop - windowHeight/2 && scrollTop < slideBottom - windowHeight/2) {
            if (currentSlide !== index) {
                currentSlide = index;
                
                // Actualizar indicadores y menú
                indicators.forEach(indicator => indicator.classList.remove('active'));
                menuItems.forEach(item => item.classList.remove('active'));
                
                indicators[index].classList.add('active');
                menuItems[index].classList.add('active');
            }
        }
    });
}

// Función para iniciar autoplay
function startAutoplay() {
    autoplayInterval = setInterval(nextSlide, 6000); // Cambia cada 6 segundos
}

// Función para parar autoplay
function stopAutoplay() {
    if (autoplayInterval) {
        clearInterval(autoplayInterval);
    }
}

// Función para reiniciar autoplay
function resetAutoplay() {
    stopAutoplay();
    startAutoplay();
}

// Event listeners para scroll
window.addEventListener('scroll', updateActiveSlide);

// Event listeners para navegación con teclado
document.addEventListener('keydown', function(e) {
    switch(e.key) {
        case 'ArrowUp':
            e.preventDefault();
            prevSlide();
            resetAutoplay();
            break;
        case 'ArrowDown':
            e.preventDefault();
            nextSlide();
            resetAutoplay();
            break;
        case ' ': // Barra espaciadora para pausar/reanudar
            e.preventDefault();
            if (autoplayInterval) {
                stopAutoplay();
                console.log('Autoplay pausado');
            } else {
                startAutoplay();
                console.log('Autoplay reanudado');
            }
            break;
    }
});

// Pausar autoplay cuando el mouse está sobre el carousel
const carousel = document.querySelector('.carousel-main');
if (carousel) {
    carousel.addEventListener('mouseenter', stopAutoplay);
    carousel.addEventListener('mouseleave', startAutoplay);
}

// Event listeners para los botones de navegación
document.querySelector('.prev-btn').addEventListener('click', function() {
    prevSlide();
    resetAutoplay();
});

document.querySelector('.next-btn').addEventListener('click', function() {
    nextSlide();
    resetAutoplay();
});

// Event listeners para indicadores
indicators.forEach((indicator, index) => {
    indicator.addEventListener('click', () => goToSlide(index));
});

// Event listeners para menú flotante
menuItems.forEach((item, index) => {
    item.addEventListener('click', () => goToSlide(index));
});

// Inicialización cuando se carga la página
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 Carousel vertical de empresas iniciado');
    console.log('Total de slides:', totalSlides);
    
    // Actualizar slide activo basado en scroll inicial
    updateActiveSlide();
    
    // Iniciar autoplay
    startAutoplay();
    
    console.log('✅ Carousel vertical funcionando correctamente');
});

// Manejo de visibilidad de la página
document.addEventListener('visibilitychange', function() {
    if (document.hidden) {
        stopAutoplay();
    } else {
        startAutoplay();
    }
});

// Log para debugging
setInterval(() => {
    console.log('Slide actual:', currentSlide + 1, '/', totalSlides);
}, 10000);