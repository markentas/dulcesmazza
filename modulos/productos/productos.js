let productosGlobal = [];
let categoriaActual = 'todos';
let htmlCargado = false;
let paginaActual = 1;
const PRODUCTOS_POR_PAGINA = 6;

const MODULO_PATH = 'modulos/productos';

async function cargarHTMLProductos() {
    if (htmlCargado) return;
    
    const container = document.getElementById('productos-app');
    if (!container) {
        console.error('No se encontró el elemento productos-app');
        return;
    }
    
    try {
        const response = await fetch(MODULO_PATH + '/productos.html');
        const html = await response.text();
        container.innerHTML = html;
        htmlCargado = true;
    } catch (error) {
        console.error('Error cargando HTML de productos:', error);
    }
}

function parseCSVLine(linea) {
    const resultado = [];
    let campoActual = '';
    let enComillas = false;
    
    for (let i = 0; i < linea.length; i++) {
        const char = linea[i];
        
        if (char === '"') {
            enComillas = !enComillas;
        } else if (char === ',' && !enComillas) {
            resultado.push(campoActual.trim());
            campoActual = '';
        } else {
            campoActual += char;
        }
    }
    resultado.push(campoActual.trim());
    
    return resultado;
}

function renderizarFiltroCategorias(categorias) {
    const contenedor = document.getElementById('filtroCategorias');
    
    if (!contenedor) return;
    
    const categoriasUnicas = ['todos', ...categorias.filter(c => c && c.trim() !== '')];
    
    contenedor.innerHTML = `
        <div class="filtro-categorias">
            <button class="categoria-btn ${categoriaActual === 'todos' ? 'active' : ''}" data-categoria="todos">
                Ver todos
            </button>
            ${categoriasUnicas.slice(1).map(cat => `
                <button class="categoria-btn ${categoriaActual === cat ? 'active' : ''}" data-categoria="${cat}">
                    ${cat}
                </button>
            `).join('')}
        </div>
    `;
    
    contenedor.querySelectorAll('.categoria-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            categoriaActual = btn.dataset.categoria;
            document.querySelectorAll('.categoria-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            filtrarProductos();
        });
    });
}

let productosFiltrados = [];

function filtrarProductos() {
    if (categoriaActual === 'todos') {
        productosFiltrados = productosGlobal;
    } else {
        productosFiltrados = productosGlobal.filter(p => 
            p.categoria?.toLowerCase() === categoriaActual.toLowerCase()
        );
    }
    
    paginaActual = 1;
    renderizarProductos(productosFiltrados);
    renderizarPaginacion();
}

function renderizarProductos(productos) {
    const grid = document.getElementById('productosGrid');
    
    if (!grid) {
        console.error('No se encontró el elemento productosGrid');
        return;
    }
    
    const hayDisponibles = productos.some(p => p.cantidad > 0);
    
    if (!hayDisponibles) {
        grid.innerHTML = `
            <div class="disponibles-mensaje">
                <i class="fas fa-cookie-bite"></i>
                <span class="disponibles-mensaje-leyenda">Cuando haya masas disponibles a la venta, aparecerán aquí.</span>
                <p>Podes hacer tu encargo<br>desde las categorías.</p>
                <a href="#categorias" class="producto-btn">VER CATÁLOGOS</a>
            </div>
        `;
        document.getElementById('paginacion')?.remove();
        return;
    }
    
    const inicio = (paginaActual - 1) * PRODUCTOS_POR_PAGINA;
    const fin = inicio + PRODUCTOS_POR_PAGINA;
    const productosPagina = productos.slice(inicio, fin);
    
    grid.innerHTML = productosPagina.map((producto) => {
        const cantidad = parseInt(producto.cantidad) || 0;
        const esAgotado = cantidad === 0;
        const mensajeWhatsApp = `${encodeURIComponent(PRODUCTOS_CONFIG.whatsapp.mensaje)}${encodeURIComponent(producto.nombre)}`;
        
        const imagenSrc = (producto.imagen && (producto.imagen.startsWith('http') || producto.imagen.startsWith('https')))
            ? producto.imagen 
            : `${MODULO_PATH}/img/${producto.imagen}`;
        
        const precioNumero = parseInt(producto.precio) || 0;
        const precioFormateado = precioNumero > 0 ? '$' + precioNumero.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.') : producto.precio;
        
        return `
            <div class="producto-card ${esAgotado ? 'agotado' : ''}">
                <img src="${imagenSrc}" alt="${producto.nombre}" class="producto-imagen">
                <div class="producto-info">
                    <h3 class="producto-nombre">${producto.nombre}</h3>
                    <p class="producto-descripcion">${producto.descripcion || ''}</p>
                    <p class="producto-precio">${precioFormateado}</p>
                    ${esAgotado 
                        ? '<span class="producto-agotado-badge">VENDIDO</span>' 
                        : `<div class="producto-disponibles">Disponible: ${cantidad}</div>
                           <a href="https://wa.me/${PRODUCTOS_CONFIG.whatsapp.numero}?text=${mensajeWhatsApp}" target="_blank" class="producto-btn">PEDIR</a>`
                    }
                </div>
            </div>
        `;
    }).join('');
}

async function cargarProductos() {
    await cargarHTMLProductos();
    
    try {
        const response = await fetch(PRODUCTOS_CONFIG.csvUrl);
        const csvText = await response.text();
        
        const textoNormalizado = csvText.replace(/\r\n/g, '\n').replace(/\r/g, '\n');
        let lineas = textoNormalizado.trim().split('\n');
        
        const esHeader = lineas[0]?.toLowerCase().includes('nombre');
        const datos = esHeader ? lineas.slice(1) : lineas;
        
        productosGlobal = datos.map(linea => {
            const campos = parseCSVLine(linea);
            return {
                nombre: campos[0]?.trim() || '',
                descripcion: campos[1]?.trim() || '',
                precio: campos[2]?.trim() || '',
                cantidad: parseInt(campos[3]?.trim()) || 0,
                imagen: campos[4]?.trim() || '',
                categoria: campos[5]?.trim() || ''
            };
        });
        
        const categorias = [...new Set(productosGlobal.map(p => p.categoria))];
        renderizarFiltroCategorias(categorias);
        filtrarProductos();
    } catch (error) {
        console.error('Error cargando productos:', error);
        const grid = document.getElementById('productosGrid');
        if (grid) {
            grid.innerHTML = '<p style="text-align:center;color:var(--texto-gris);">Error al cargar productos</p>';
        }
    }
}

document.addEventListener('DOMContentLoaded', cargarProductos);

// ============================================
// PAGINACIÓN
// ============================================
function renderizarPaginacion() {
    const totalPaginas = Math.ceil(productosFiltrados.length / PRODUCTOS_POR_PAGINA);
    
    if (totalPaginas <= 1) {
        document.getElementById('paginacion')?.remove();
        return;
    }
    
    let paginacionExistente = document.getElementById('paginacion');
    if (!paginacionExistente) {
        const grid = document.getElementById('productosGrid');
        const paginacion = document.createElement('div');
        paginacion.id = 'paginacion';
        paginacion.className = 'paginacion';
        grid.parentNode.insertBefore(paginacion, grid.nextSibling);
    }
    
    const paginacion = document.getElementById('paginacion');
    let html = '';
    
    html += `<button class="page-btn ${paginaActual === 1 ? 'disabled' : ''}" onclick="cambiarPagina(${paginaActual - 1})" ${paginaActual === 1 ? 'disabled' : ''}>
        <i class="fas fa-chevron-left"></i>
    </button>`;
    
    for (let i = 1; i <= totalPaginas; i++) {
        if (i === 1 || i === totalPaginas || (i >= paginaActual - 1 && i <= paginaActual + 1)) {
            html += `<button class="page-btn ${i === paginaActual ? 'active' : ''}" onclick="cambiarPagina(${i})">${i}</button>`;
        } else if (i === paginaActual - 2 || i === paginaActual + 2) {
            html += `<span class="page-dots">...</span>`;
        }
    }
    
    html += `<button class="page-btn ${paginaActual === totalPaginas ? 'disabled' : ''}" onclick="cambiarPagina(${paginaActual + 1})" ${paginaActual === totalPaginas ? 'disabled' : ''}>
        <i class="fas fa-chevron-right"></i>
    </button>`;
    
    paginacion.innerHTML = html;
}

function cambiarPagina(n) {
    paginaActual = n;
    renderizarProductos(productosFiltrados);
    renderizarPaginacion();
    window.scrollTo({ top: 400, behavior: 'smooth' });
}
