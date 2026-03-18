/**
 * HTS Chile - Galería con Auto-Play (Versión Estable GitHub)
 */

// 1. CONFIGURACIÓN: Indica cuántas fotos tienes en la carpeta images/proyectos/
const TOTAL_IMAGENES_HTS = 23; // Ajusta este número según la cantidad real de archivos
const folderPath = 'images/proyectos/';

let proyectosData = [];
let currentIndex = 0;
let slideshowTimer;

const mainViewer = document.getElementById('main-viewer');
const thumbTrack = document.getElementById('thumbnails-track');
const counter = document.getElementById('media-counter');
const prevBtn = document.getElementById('prev-btn');
const nextBtn = document.getElementById('next-btn');

/**
 * Carga la lista de archivos de forma estática para evitar errores 404
 */
function loadHTSGallery() {
    proyectosData = [];
    
    // Generamos las rutas para las imágenes que sí existen
    for (let i = 1; i <= TOTAL_IMAGENES_HTS; i++) {
        proyectosData.push({
            type: 'image',
            url: `${folderPath}${i}.jpg`
        });
    }

    if (proyectosData.length > 0) {
        renderThumbnails();
        loadMedia(0);
        startSlideshow();
    } else {
        mainViewer.innerHTML = '<div class="viewer-placeholder">No hay archivos en la galería</div>';
    }
}

/**
 * Funciones del Carrusel
 */
function loadMedia(index) {
    currentIndex = index;
    const item = proyectosData[index];
    
    // Renderizado limpio del visor
    mainViewer.innerHTML = `<img src="${item.url}" style="width:100%; height:100%; object-fit:contain; border-radius: 8px;">`;

    // Actualizar contador y estado de miniaturas
    counter.innerText = `${index + 1} / ${proyectosData.length}`;
    
    const thumbs = document.querySelectorAll('.thumb-item');
    thumbs.forEach((t, i) => {
        t.classList.toggle('active', i === index);
    });

    if (thumbs[index]) {
        thumbs[index].scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
    }
}

function renderThumbnails() {
    thumbTrack.innerHTML = '';
    proyectosData.forEach((item, index) => {
        const thumb = document.createElement('div');
        thumb.className = 'thumb-item';
        thumb.innerHTML = `<img src="${item.url}" alt="thumb" style="width:100%; height:100%; object-fit:cover; border-radius: 4px;">`;
        thumb.onclick = () => {
            loadMedia(index);
            startSlideshow(); // Reinicia el contador de tiempo
        };
        thumbTrack.appendChild(thumb);
    });
}

function startSlideshow() {
    clearInterval(slideshowTimer);
    slideshowTimer = setInterval(() => {
        let nextIndex = (currentIndex + 1) % proyectosData.length;
        loadMedia(nextIndex);
    }, 3000);
}

/**
 * Eventos de botones
 */
nextBtn.addEventListener('click', () => {
    if (proyectosData.length === 0) return;
    let nextIndex = (currentIndex + 1) % proyectosData.length;
    loadMedia(nextIndex);
    startSlideshow();
});

prevBtn.addEventListener('click', () => {
    if (proyectosData.length === 0) return;
    let prevIndex = (currentIndex - 1 + proyectosData.length) % proyectosData.length;
    loadMedia(prevIndex);
    startSlideshow();
});

document.addEventListener('DOMContentLoaded', loadHTSGallery);
