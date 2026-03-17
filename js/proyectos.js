/**
 * HTS Chile - Galería con Auto-Play (3 segundos)
 */

let proyectosData = [];
let currentIndex = 0;
let slideshowTimer;

const mainViewer = document.getElementById('main-viewer');
const thumbTrack = document.getElementById('thumbnails-track');
const counter = document.getElementById('media-counter');
const prevBtn = document.getElementById('prev-btn');
const nextBtn = document.getElementById('next-btn');
const folderPath = 'images/proyectos/';

/**
 * Rastra la carpeta y carga los archivos
 */
async function autoDiscoverMedia() {
    try {
        const response = await fetch(folderPath);
        const htmlText = await response.text();
        
        const parser = new DOMParser();
        const doc = parser.parseFromString(htmlText, 'text/html');
        const links = doc.querySelectorAll('a');

        proyectosData = []; 

        links.forEach(link => {
            let fileName = link.getAttribute('href');
            if (fileName.includes('?') || fileName.startsWith('..')) return;

            const ext = fileName.split('.').pop().toLowerCase();
            const allowedExts = ['jpg', 'jpeg', 'png', 'mp4', 'webm'];
            
            if (allowedExts.includes(ext)) {
                const type = (ext === 'mp4' || ext === 'webm') ? 'video' : 'image';
                
                let finalUrl = fileName;
                if (!fileName.includes(folderPath) && !fileName.startsWith('http')) {
                    finalUrl = folderPath + fileName;
                }

                proyectosData.push({ type: type, url: finalUrl });
            }
        });

        if (proyectosData.length > 0) {
            renderThumbnails();
            loadMedia(0);
            startSlideshow();
        } else {
            mainViewer.innerHTML = '<div class="viewer-placeholder">No hay archivos en /images/proyectos/</div>';
        }
    } catch (error) {
        console.error("Error en el rastreo:", error);
    }
}

/**
 * Funciones del Carrusel Automático
 */
function startSlideshow() {
    clearInterval(slideshowTimer);
    
    slideshowTimer = setInterval(() => {
        let nextIndex = (currentIndex + 1) % proyectosData.length;
        loadMedia(nextIndex);
    }, 3000);
}

function resetSlideshow() {
    startSlideshow();
}

/**
 * Cambia el recurso en el visualizador
 */
function loadMedia(index) {
    currentIndex = index;
    const item = proyectosData[index];
    mainViewer.innerHTML = '';

    if (item.type === 'image') {
        mainViewer.innerHTML = `<img src="${item.url}" style="width:100%; height:100%; object-fit:contain;">`;
    } else if (item.type === 'video') {
        mainViewer.innerHTML = `
            <video controls autoplay style="width:100%; height:100%;">
                <source src="${item.url}" type="video/mp4">
            </video>`;
    }

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
        thumb.innerHTML = `<img src="${item.url}" alt="thumb" style="width:100%; height:100%; object-fit:cover;">`;
        thumb.onclick = () => {
            loadMedia(index);
            resetSlideshow(); // Reinicia el tiempo si el usuario hace clic
        };
        thumbTrack.appendChild(thumb);
    });
}

/**
 * LÓGICA DE BOTONES
 */
nextBtn.addEventListener('click', () => {
    if (proyectosData.length === 0) return;
    let nextIndex = (currentIndex + 1) % proyectosData.length;
    loadMedia(nextIndex);
    resetSlideshow(); // Reinicia el tiempo al usar el botón
});

prevBtn.addEventListener('click', () => {
    if (proyectosData.length === 0) return;
    let prevIndex = (currentIndex - 1 + proyectosData.length) % proyectosData.length;
    loadMedia(prevIndex);
    resetSlideshow();
});

document.addEventListener('DOMContentLoaded', autoDiscoverMedia);