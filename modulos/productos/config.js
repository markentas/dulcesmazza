const CONFIG_INPUT = {
    // Puedes pegar la URL completa de edición, visualización o publicación
    googleSheetUrl: 'https://docs.google.com/spreadsheets/d/1GPvfX7NQ-RSYNJcnv0tDH8mfR-o1nNLFzXcSW2uhHeQ/edit?gid=0#gid=0',
    whatsapp: {
        numero: '5493873237712',
        mensaje: 'Hola, quiero pedir '
    },
    mostrarAgotados: false
};

// Función de seguridad con Regex para obtener el ID y generar el endpoint CSV
function generarCsvUrl(url) {
    // Regex para capturar el ID entre /d/ y /edit (o el final)
    const match = url.match(/\/d\/([a-zA-Z0-9-_]{25,})/);
    
    if (match && match[1]) {
        return `https://docs.google.com/spreadsheets/d/${match[1]}/export?format=csv`;
    }
    
    // Si ya es una URL de publicación directa, la dejamos pasar
    if (url.includes('pub?output=csv')) return url;
    
    console.error("No se pudo extraer un ID de Google Sheets válido.");
    return null;
}

const PRODUCTOS_CONFIG = {
    ...CONFIG_INPUT,
    csvUrl: generarCsvUrl(CONFIG_INPUT.googleSheetUrl)
};