# 📋 Guía de CSS Global para Expendio

## 🎯 Objetivo
Este archivo explica cómo usar el nuevo sistema de CSS global para mantener consistencia visual en todo el proyecto Expendio.

## 📁 Estructura de Archivos

```
Expendio/
├── global-styles.css    # CSS global con todos los estilos
├── menu.html           # Menú principal (actualizado)
├── Almacen.html        # Sistema de almacén (actualizado)
├── login.html          # Página de login (nueva)
└── CSS_GLOBAL_README.md # Este archivo
```

## ✨ Características del CSS Global

### 🎨 Variables CSS
El archivo utiliza variables CSS para fácil personalización:

```css
:root {
  --primary-color: #0D3B66;      /* Azul principal */
  --secondary-color: #ffd700;    /* Amarillo dorado */
  --accent-color: #22304a;       /* Azul oscuro */
  --success-color: #27ae60;      /* Verde éxito */
  --warning-color: #f39c12;      /* Naranja advertencia */
  --danger-color: #e74c3c;       /* Rojo peligro */
}
```

### 🔧 Componentes Reutilizables

#### Botones
```html
<button class="btn btn-primary">Primario</button>
<button class="btn btn-secondary">Secundario</button>
<button class="btn btn-success">Éxito</button>
<button class="btn btn-warning">Advertencia</button>
<button class="btn btn-danger">Peligro</button>
```

#### Tarjetas
```html
<div class="card">
  <h3>Título</h3>
  <p>Contenido de la tarjeta</p>
</div>
```

#### Formularios
```html
<div class="form-group">
  <label for="input">Etiqueta</label>
  <input type="text" id="input" class="form-control">
</div>
```

#### Tablas
```html
<table class="table">
  <thead>
    <tr>
      <th>Encabezado 1</th>
      <th>Encabezado 2</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>Dato 1</td>
      <td>Dato 2</td>
    </tr>
  </tbody>
</table>
```

## 🚀 Cómo Usar el CSS Global

### 1. Incluir el CSS en tu HTML
Agrega esta línea en el `<head>` de tu archivo HTML:

```html
<link rel="stylesheet" href="global-styles.css">
```

### 2. Usar las Clases Predefinidas
Utiliza las clases del CSS global en lugar de crear estilos propios:

```html
<!-- Header para páginas internas -->
<div class="almacen-header">
  <div class="almacen-title">
    <i class="fas fa-icon"></i> Título
  </div>
  <div class="almacen-actions">
    <button class="btn btn-primary">Acción</button>
  </div>
</div>
```

### 3. Contenedores Específicos

#### Página de Almacén
```html
<div class="almacen-container">
  <!-- Contenido del almacén -->
</div>
```

#### Página de Login
```html
<div class="login-page">
  <div class="login-container">
    <!-- Formulario de login -->
  </div>
</div>
```

## 📱 Responsive Design
El CSS global incluye media queries para dispositivos móviles:

- **Tablets**: `@media (max-width: 768px)`
- **Móviles**: `@media (max-width: 480px)`

## 🎨 Personalización

### Cambiar Colores Principales
Edita las variables CSS en `:root` para cambiar los colores de todo el sitio:

```css
:root {
  --primary-color: #tu-color-principal;
  --secondary-color: #tu-color-secundario;
  /* ... más variables ... */
}
```

### Agregar Nuevos Componentes
Si necesitas componentes adicionales, agrégalos al final del archivo `global-styles.css` siguiendo la estructura existente.

## 🔍 Debugging

### Verificar Carga del CSS
1. Abre las herramientas de desarrollo del navegador (F12)
2. Ve a la pestaña "Network"
3. Recarga la página
4. Verifica que `global-styles.css` se carga sin errores

### Verificar Clases
1. Inspecciona elementos con el botón derecho
2. Verifica que las clases CSS se aplican correctamente
3. Revisa la consola por errores de CSS

## ⚠️ Mejores Prácticas

1. **No modifiques** `global-styles.css` sin entender la estructura
2. **Usa las clases** existentes antes de crear nuevas
3. **Mantén consistencia** con los colores y espaciados
4. **Prueba** en dispositivos móviles después de hacer cambios
5. **Documenta** nuevos componentes que agregues

## 🆘 Solución de Problemas

### El CSS no se carga
- Verifica la ruta del archivo: `href="global-styles.css"`
- Asegúrate de que el archivo exista en el directorio
- Limpia la caché del navegador (Ctrl+F5)

### Los estilos no se aplican
- Verifica que las clases estén escritas correctamente
- Asegúrate de que no haya estilos en línea que sobrescriban
- Comprueba la especificidad CSS

### Problemas de responsive
- Prueba en diferentes tamaños de ventana
- Verifica las media queries en el archivo CSS
- Usa las clases de utilidad responsive incluidas

## 📞 Soporte
Si tienes problemas o preguntas sobre el CSS global:

1. Revisa primero esta documentación
2. Verifica los ejemplos en `menu.html`, `Almacen.html` y `login.html`
3. Asegúrate de seguir las mejores prácticas mencionadas

---

**Nota**: Este CSS global está diseñado para ser mantenible y escalable. Si necesitas agregar funcionalidades complejas o nuevos componentes, considera crear un archivo CSS adicional específico para esas características, pero mantén los estilos base en `global-styles.css`.