
const sidebar = document.getElementById('sidebar');
const overlay = document.getElementById('sidebar-overlay');
const openBtn = document.querySelector('.menu-toggle');
const closeBtn = document.getElementById('closeSidebar');

// Abrir sidebar
openBtn.addEventListener('click', () => {
    sidebar.classList.add('open');
    overlay.style.display = 'block';
});

// Cerrar sidebar con la X
closeBtn.addEventListener('click', () => {
    sidebar.classList.remove('open');
    overlay.style.display = 'none';
});

// Cerrar sidebar haciendo click fuera
overlay.addEventListener('click', () => {
    sidebar.classList.remove('open');
    overlay.style.display = 'none';
});

// Carrusel automático para ofertas-barra
const ofertasBarra = document.getElementById('ofertasBarra');
let scrollAmount = 0;
let scrollStep = 1; // velocidad del scroll (px por frame)
let maxScroll = ofertasBarra.scrollWidth - ofertasBarra.clientWidth;

function autoScrollOfertas() {
    if (ofertasBarra.scrollLeft >= maxScroll) {
        ofertasBarra.scrollLeft = 0; // Reinicia al inicio
    } else {
        ofertasBarra.scrollLeft += scrollStep;
    }
    requestAnimationFrame(autoScrollOfertas);
}

// Espera a que las imágenes carguen para calcular bien el ancho
window.addEventListener('load', () => {
    maxScroll = ofertasBarra.scrollWidth - ofertasBarra.clientWidth;
    autoScrollOfertas();
});
