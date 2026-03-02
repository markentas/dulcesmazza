# Módulo Productos - Dulces Mazza

## Cómo invocar el módulo de productos

### 1. Agregar el CSS
En la sección `<head>` de tu HTML:

```html
<link rel="stylesheet" href="productos/productos.css">
```

### 2. Agregar el contenedor
Donde quieras que aparezcan los productos disponibles, agrega:

```html
<div id="productos-app"></div>
```

### 3. Agregar el JavaScript
Al final del `<body>`:

```html
<script src="productos/productos.js"></script>
<script>
    cargarProductos();
</script>
```

## Estructura de archivos

```
productos/
├── productos.js      - Lógica y renderizado
├── productos.css     - Estilos
├── productos.html    - Plantilla HTML
├── img/              - Imágenes de productos
└── INSTRUCCIONES.md  - Este archivo
```

## Configuración de Google Sheets

### Encabezados requeridos
La primera fila de tu hoja de Google debe tener:

```
nombre,descripcion,precio,cantidad,imagen,categoria
```

### URL del CSV
La URL del CSV se configura en `productos.js` en la constante `PRODUCTOS_CSV_URL`.

## Estructura de datos

| Columna | Descripción |
|---------|-------------|
| nombre | Nombre del producto |
| descripcion | Descripción del producto |
| precio | Precio número (sin $) |
| cantidad | Cantidad disponible |
| imagen | Nombre del archivo de imagen (en carpeta img/) o URL completa |
| categoria | Categoría para filtrar |

## Notas

- Si una celda contiene comas, envolverla en comillas: `"Chocolate, bombón y más"`
- El filtro de categorías se genera automáticamente según los valores de la columna "categoria"
- El botón "Ver todos" muestra todos los productos
