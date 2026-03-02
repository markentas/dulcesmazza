// Verificar mantenimiento lo más temprano posible
(function() {
    if (MANTENIMIENTO_CONFIG && MANTENIMIENTO_CONFIG.activo) {
        // Reemplazar todo el body con el overlay de mantenimiento
        document.body.innerHTML = `
            <style>
                body { margin: 0; padding: 0; }
                .mantenimiento-overlay {
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100vh;
                    background: linear-gradient(180deg, #f5f0e8 0%, #e8e0d5 100%);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-family: 'Open Sans', system-ui, sans-serif;
                }
                .mantenimiento-contenido {
                    text-align: center;
                    padding: 40px;
                    max-width: 500px;
                }
                .mantenimiento-icono {
                    font-size: 4rem;
                    color: #d4898f;
                    margin-bottom: 30px;
                }
                .mantenimiento-titulo {
                    font-family: 'Cinzel', serif;
                    font-size: 2.5rem;
                    color: #3d3d3d;
                    letter-spacing: 6px;
                    margin-bottom: 20px;
                }
                .mantenimiento-mensaje {
                    font-size: 1.2rem;
                    color: #555555;
                    margin-bottom: 15px;
                    line-height: 1.8;
                }
                .mantenimiento-sub {
                    font-size: 0.95rem;
                    color: #777777;
                    letter-spacing: 2px;
                    text-transform: uppercase;
                }
                @media (max-width: 768px) {
                    .mantenimiento-titulo { font-size: 1.8rem; letter-spacing: 4px; }
                    .mantenimiento-mensaje { font-size: 1rem; }
                    .mantenimiento-icono { font-size: 3rem; }
                }
            </style>
            <div class="mantenimiento-overlay">
                <div class="mantenimiento-contenido">
                    <div class="mantenimiento-icono">
                        <i class="fas fa-tools"></i>
                    </div>
                    <h2 class="mantenimiento-titulo">MANTENIMIENTO</h2>
                    <p class="mantenimiento-mensaje">${MANTENIMIENTO_CONFIG.mensaje}</p>
                    <p class="mantenimiento-sub">Pronto volveremos con más dulzura</p>
                </div>
            </div>
        `;
        
        // Detener cualquier otra ejecución
        return;
    }
})();

// Si no está en mantenimiento, inicializar normalmente
let mantenimientoInicializado = false;

function initMantenimiento() {
    if (mantenimientoInicializado) return;
    mantenimientoInicializado = true;

    const container = document.body;
    
    const overlayHTML = `
        <div id="mantenimiento-overlay" class="mantenimiento-overlay">
            <div class="mantenimiento-contenido">
                <div class="mantenimiento-icono">
                    <i class="fas fa-tools"></i>
                </div>
                <h2 class="mantenimiento-titulo">MANTENIMIENTO</h2>
                <p class="mantenimiento-mensaje">${MANTENIMIENTO_CONFIG.mensaje}</p>
                <p class="mantenimiento-sub">Pronto volveremos con más dulzura</p>
            </div>
        </div>
    `;
    
    container.insertAdjacentHTML('afterbegin', overlayHTML);
    
    if (MANTENIMIENTO_CONFIG.activo) {
        activarMantenimiento();
    }
}

function activarMantenimiento() {
    const overlay = document.getElementById('mantenimiento-overlay');
    if (overlay) {
        overlay.classList.add('activo');
        document.body.style.overflow = 'hidden';
    }
}

function desactivarMantenimiento() {
    const overlay = document.getElementById('mantenimiento-overlay');
    if (overlay) {
        overlay.classList.remove('activo');
        document.body.style.overflow = '';
    }
}

document.addEventListener('DOMContentLoaded', initMantenimiento);
