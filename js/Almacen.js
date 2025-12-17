// CONFIGURACIÓN BASE DE LA API
const API_URL = 'http://127.0.0.1:8000/api'; 
let products = []; // Array global para almacenar los productos del API
let catalogos = {};          // Objeto para almacenar Marcas, Categorías, Sucursales
let editingProduct = null;   // ID del producto que se está editando

/** Muestra un mensaje personalizado en un modal de alerta.
 * @param {string} title - Título del mensaje.
 * @param {string} message - Cuerpo del mensaje.
 */
function showAlert(title, message) {
    document.getElementById('alertTitle').innerText = title;
    document.getElementById('alertMessage').innerText = message;
    document.getElementById('customAlert').classList.add('show');
}

/** Cierra el modal de alerta. */
function closeAlert() {
    document.getElementById('customAlert').classList.remove('show');
}

/** Calcula y devuelve el estado del stock.
 * @param {number} current - Stock actual.
 * @param {number} min - Stock mínimo.*/

/** Calcula y devuelve el estado del stock. */
function getStockStatus(current, min) {
    min = min || 10; // Valor por defecto si no viene del API
    if (current <= min / 2) {
        return { text: 'BAJO', class: 'stock-bajo' };
    } else if (current <= min) {
        return { text: 'MEDIO', class: 'stock-medio' };
    } else {
        return { text: 'ALTO', class: 'stock-alto' };
    }
}

/** Formatea un número como moneda. */
function formatCurrency(amount) {
    return new Intl.NumberFormat('es-MX', {
        style: 'currency',
        currency: 'MXN',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    }).format(amount);
}

/** Funciones de Modal */

function openAddModal() {
    editingProduct = null;
    document.getElementById('modalTitle').innerHTML = '<i class="fas fa-plus-circle" style="color:#4f46e5;"></i> Agregar Nuevo Producto';//bsca el titulo del modal o bloque de agregar producto
    document.getElementById('productForm').reset(); //limpia el formulario
    document.getElementById('productModal').classList.add('show');
}

function closeModal() {
    document.getElementById('productModal').classList.remove('show');//
} 
//editar producto
function openEditModal(idProducto) {
    const product = products.find(p => p.id_producto === idProducto); //find busca un producto en el array global products
    if (!product) {
        showAlert("Error", "Producto no encontrado para edición.");
        return;
    }

    editingProduct = product;//establece el producto que se ha encontrado para editar
    document.getElementById('modalTitle').innerHTML = '<i class="fas fa-edit" style="color:#4f46e5;"></i> Editar Producto';
    
    // Llenar el formulario con los datos del producto
    document.getElementById('productId').value = product.id_producto;
    document.getElementById('productCode').value = product.codigo_barra;
    document.getElementById('productName').value = product.nombre;
    document.getElementById('stockInicial').value = product.stock_actual; // Usamos el stock actual para edición
    document.getElementById('productPriceCompra').value = product.costo_inventario;
    document.getElementById('productPriceVenta').value = product.precio_unitario;
    
    // Asignar IDs para los selects 
    document.getElementById('productCategory').value = product.id_categoria;
    document.getElementById('select_marca').value = product.id_marca;
    document.getElementById('select_sucursal').value = product.id_sucursal;
    document.getElementById('select_presentacion').value = product.presentacion;
    document.getElementById('select_envase').value = product.tipo_envase;

    document.getElementById('productModal').classList.add('show');
}


// Funciones de Carga Inicial
async function fetchCatalogos() {
    try {
        const resCategorias = await fetch(`${API_URL}/categorias`); //realiza las peticiones y las guarda en las variables (resCategorias, resMarcas, resSucursales)
        const categorias = await resCategorias.json();

        const resMarcas = await fetch(`${API_URL}/marcas`);
        const marcas = await resMarcas.json();

        const resSucursales = await fetch(`${API_URL}/sucursales`);
        const sucursales = await resSucursales.json();

        catalogos = {
            categorias,
            marcas,
            sucursales
        };

        fillCatalogSelects(); // Llenar los selects de mis listas desplegables
    } catch (err) {
        console.error("Error cargando catálogos", err);
    }
}

//tabla productos
async function fetchAndLoadProducts() {
    const tbody = document.getElementById('productsTableBody');
    const errorMessageDiv = document.getElementById('errorMessage');
    
    tbody.innerHTML = '<tr><td colspan="10" style="text-align:center; padding: 1rem; color: #6b7280;">Cargando productos...</td></tr>';
    
    if (errorMessageDiv) { 
        errorMessageDiv.classList.add('hidden'); // Ocultar errores anteriores
    }
    
    try {
        // respuesta de los productos
        const response = await fetch(`${API_URL}/productos`, {
            method: 'GET',
            headers: { 'Accept': 'application/json' }
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Error al cargar el inventario.');
        }

        const jsonResponse = await response.json();//convierte la respuesta a  un objeto json para que js pueda utilizarlo
        
        // ASIGNACIÓN DE PRODUCTOS
        products = jsonResponse.data.data;
        
        //construcción de catalogos
        const uniqueCategorias = new Map();
        const uniqueMarcas = new Map();
        const uniqueSucursales = new Map();

        products.forEach(product => {
            //1. Categorías
            if (product.categoria && product.categoria.id_categoria) {
                uniqueCategorias.set(product.categoria.id_categoria, product.categoria); // Usamos Map para evitar duplicados sobrecribiendo si encuentra alguana otra en el map
            }
            
            // 2. Marcas
            if (product.marca && product.marca.id_marca) {
                uniqueMarcas.set(product.marca.id_marca, product.marca);
            }

            // 3. Sucursales
            if (product.producto_almacen && product.producto_almacen.length > 0) {
                product.producto_almacen.forEach(pa => {
                    if (pa.sucursal && pa.sucursal.id_sucursal) {
                        uniqueSucursales.set(pa.sucursal.id_sucursal, pa.sucursal);
                    }
                });
            }
        });

        // Convertir Maps a arrays y asignarlos al objeto catalogos
        catalogos = {
            categorias: Array.from(uniqueCategorias.values()),
            marcas: Array.from(uniqueMarcas.values()),
            sucursales: Array.from(uniqueSucursales.values())
        };
        
        // --- FIN: Lógica de construcción de CATALOGOS ---
        
        fillCatalogSelects();
        renderProductsTable(products); // Renderiza la tabla
        updateStats(); // Actualiza el dashboard

    } catch (error) {
        console.error('Fallo grave al cargar inventario:', error);
        
        if (errorMessageDiv) { 
            errorMessageDiv.innerText = `❌ Error: ${error.message}. Verifica el servidor Laravel y la consola del navegador.`;
            errorMessageDiv.classList.remove('hidden');
        }

        tbody.innerHTML = `
            <tr><td colspan="9" style="text-align:center; color: #ef4444; padding: 1rem;">
                No se pudo cargar el inventario. Revisa la consola para más detalles.
            </td></tr>
        `;
    }
}

/**Rellena las listas desplegables (selects) de catálogo. */

function fillCatalogSelects() {
    const selectMap = {
        'productCategory': { items: catalogos.categorias, idKey: 'id_categoria', textKey: 'tipo' },
        'select_marca': { items: catalogos.marcas, idKey: 'id_marca', textKey: 'nombre' },
        'select_sucursal': { items: catalogos.sucursales, idKey: 'id_sucursal', textKey: 'nombre' }
    };

    for (const [selectId, { items, idKey, textKey }] of Object.entries(selectMap)) {
        const selectElement = document.getElementById(selectId);
        const filterElement = document.getElementById(`filter${selectId.replace('product', '')}`);
        
        if (selectElement && items) {
            selectElement.innerHTML = '<option value="">Selecciona una opción</option>'; 
            items.forEach(item => {
                const option = new Option(item[textKey], item[idKey]);
                selectElement.add(option);
            });
        }
        
        // Llenar selects de filtro si existen (Ej: filterCategory)
        if (filterElement && items) {
            filterElement.innerHTML = '<option value="">Todas las categorías</option>'; 
            items.forEach(item => {
                // El filtro usa el nombre/texto visible
                const option = new Option(item[textKey], item[textKey]); 
                filterElement.add(option);
            });
        }
    }
}

/** Renderiza la tabla de productos con los datos proporcionados. */

function renderProductsTable(productsToRender) {
    
    const tbody = document.getElementById('productsTableBody');
    tbody.innerHTML = '';
    
    // Función de ayuda para obtener el nombre a partir del ID de catálogo
    const getCatalogName = (id, type) => {
        const items = catalogos[type] || [];
        // Usamos toLowerCase para hacer la búsqueda de tipo de categoría
        const item = items.find(item => item[`id_${type.replace('s', '')}`] === id);
        return item ? (item.nombre || item.tipo) : 'N/A';
    };

    if (productsToRender.length === 0) {
        tbody.innerHTML = '<tr><td colspan="9" style="text-align:center; padding: 1rem; color: #6b7280;">No se encontraron productos.</td></tr>';
        return;
    }
    productsToRender = productsToRender.filter(p => p.estado === "activo");

    productsToRender.forEach(product => {

        const stockActual = product.stock_actual ?? 0; 
        const stockMinimo = product.stock_minimo ?? 10; 

        const { text: stockText, class: stockClass } = getStockStatus(stockActual, stockMinimo);
        const totalValue = (stockActual * product.precio_unitario); //total valor inventario
        
        const categoryName = getCatalogName(product.id_categoria, 'categorias');
        const brandName = getCatalogName(product.id_marca, 'marcas'); // Añadido para la tabla

        const row = document.createElement('tr');
        row.className = 'hover:bg-gray-50';

        row.innerHTML = `
            <td>${product.codigo_barra || 'N/A'}</td>
            <td>${product.nombre}</td>
            <td>${categoryName}</td>
            <td>${brandName}</td> <!-- Columna de Marca -->
            <td>${stockActual}</td>
            <td>${formatCurrency(product.costo_inventario)}</td>
            <td>${formatCurrency(product.precio_unitario)}</td>
            <td>${formatCurrency(totalValue)}</td>
            <td>
                <span class="${stockClass}">${stockText}</span>
            </td>
            <td>
                <div class="action-buttons">  <!-- botones de acción editar y eliminar -->
                    <button class="btn-action btn-edit" onclick="openEditModal(${product.id_producto})">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn-action btn-delete" onclick="confirmDeleteProduct(${product.id_producto}, '${product.nombre}')">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </td>
        `;
        tbody.appendChild(row);
    });
}

/** Actualiza las estadísticas del dashboard. */
//dashboard estadisticas (total productos, bajo stock, valor inventario, categorias)
function updateStats() {
    let totalCount = products.length;
    let lowStockCount = 0;
    let totalValue = 0;
    const uniqueCategories = new Set();

    products.forEach(p => {
        const stockActual = p.stock_actual || 0;
        const stockMinimo = p.stock_minimo || 10;
        
        if (getStockStatus(stockActual, stockMinimo).text === 'BAJO') {
            lowStockCount++;
        }
        totalValue += stockActual * p.precio_unitario;
        
        uniqueCategories.add(p.id_categoria); 
    });

    document.getElementById('totalProducts').innerText = totalCount;
    document.getElementById('lowStock').innerText = lowStockCount;
    document.getElementById('totalValue').innerText = formatCurrency(totalValue);
    document.getElementById('categories').innerText = uniqueCategories.size;
}

/* Filtra la lista de productos basada en los inputs del usuario. */
function filterProducts() {
    const searchTerm = document.getElementById('searchProduct').value.toLowerCase();//obtiene el valor del input de busqueda 
    const categoryNameFilter = document.getElementById('filterCategory').value;//obtiene el valor del select de categoria
    const stockFilter = document.getElementById('filterStock').value;//obtiene el valor del select de stock
    
    const getCategoryNameById = (id) => {//funcion para obtener el nombre de la categoria por id 
        const category = (catalogos.categorias || []).find(cat => cat.id_categoria === id);
        return category ? category.tipo : 'N/A';
    };


    const filtered = products.filter(product => {//usammos el metodo filter q itera sobre el array products
        const matchesSearch = product.nombre.toLowerCase().includes(searchTerm); //busca coincidencias en el nombre del producto
        
        const categoryName = getCategoryNameById(product.id_categoria);
        const matchesCategory = categoryNameFilter === "" || categoryName === categoryNameFilter; //si el filtro esta vacio osea todas la categorias o si seleciono alguna de las categorias
        
        const stockActual = product.stock_actual || 0;
        const stockMinimo = product.stock_minimo || 10;
        const matchesStock = stockFilter === "" || getStockStatus(stockActual, stockMinimo).text === stockFilter.toUpperCase();
        
        return matchesSearch && matchesCategory && matchesStock;
    });

    renderProductsTable(filtered); // Renderiza la tabla con los productos filtrados
}

//editar o agregar producto
/** Envía los datos del formulario (POST para nuevo, PUT para editar). */
async function handleFormSubmit(e) {
    e.preventDefault();
    
    const isEditing = document.getElementById('productId').value !== ''; // Determina si es edición o nuevo registro dependiendo si hay un ID presente
    const productId = document.getElementById('productId').value;
    const url = isEditing ? `${API_URL}/productos/${productId}` : `${API_URL}/productos`;
    const method = isEditing ? 'PUT' : 'POST';

    // Recolección y conversión de tipos de datos
    const productData = {
        nombre: document.getElementById('productName').value,
        codigo_barra: document.getElementById('productCode').value,
        costo_inventario: parseFloat(document.getElementById('productPriceCompra').value),
        precio_unitario: parseFloat(document.getElementById('productPriceVenta').value),

        stock_actual: parseInt(document.getElementById('stockInicial').value),
        stock_minimo: editingProduct? editingProduct.stock_minimo : 10, // Mantener el stock mínimo existente o usar 10 por defecto
        
        // Claves Foráneas (IDs)
        id_categoria: parseInt(document.getElementById('productCategory').value),
        id_marca: parseInt(document.getElementById('select_marca').value),
        id_sucursal: parseInt(document.getElementById('select_sucursal').value),
        
        // Campos Adicionales
        presentacion: document.getElementById('select_presentacion').value,
        tipo_envase: document.getElementById('select_envase').value,
        // Agregamos una descripción simple si es un nuevo registro
        descripcion: isEditing ? 'Actualización desde frontend' : 'Registro inicial desde el modal de Almacén',
    };
    
    try {
        const response = await fetch(url, {
            method: method,
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
            body: JSON.stringify(productData)
        });

        if (!response.ok) {
            const errorData = await response.json();
            let errorMessage = errorData.message || 'Error al procesar la solicitud.';
            if (response.status === 422 && errorData.errors) {
                errorMessage = Object.values(errorData.errors).flat().join('; '); // Concatenar todos los mensajes de error
            }
            throw new Error(errorMessage);
        }

        const result = await response.json();
        
        showAlert('Éxito', isEditing ? `Producto "${result.data.nombre}" actualizado correctamente.` : `Producto "${result.data.nombre}" registrado con éxito.`);
        closeModal();

        
        fetchAndLoadProducts(); // Recargar datos para actualizar la tabla
        
    } catch (error) {
        console.error('Error en el formulario:', error);
        showAlert('Error de Guardado', error.message);
    }
}

/** eliminación lógica (DELETE). */
function confirmDeleteProduct(idProducto, nombre) {
   
    document.getElementById('alertTitle').innerText = 'Confirmar Eliminación';
    document.getElementById('alertMessage').innerText = `¿Estás seguro de ELIMINAR/BLOQUEAR el producto "${nombre}"? El registro se marcará como inactivo.`;
    document.getElementById('customAlert').classList.add('show');

  
    const confirmBtn = document.createElement('button');
    confirmBtn.className = 'btn btn-save';
    confirmBtn.innerText = 'Sí, Eliminar';
    confirmBtn.style.marginRight = '10px';
    confirmBtn.onclick = () => {// si aceppta se llama a la funcion deleteProduct para el soft delete
        closeAlert();
        deleteProduct(idProducto);
    };

    const cancelBtn = document.createElement('button');
    cancelBtn.className = 'btn btn-cancel';
    cancelBtn.innerText = 'Cancelar';
    cancelBtn.onclick = closeAlert;

    const modalContent = document.querySelector('#customAlert .modal-content');
    const alertButtonsDiv = document.createElement('div');
    alertButtonsDiv.style.marginTop = '1.5rem';
    alertButtonsDiv.style.display = 'flex';
    alertButtonsDiv.style.justifyContent = 'center';
    alertButtonsDiv.appendChild(confirmBtn);
    alertButtonsDiv.appendChild(cancelBtn);

    
    const acceptButton = modalContent.querySelector('.btn-primary');
    if (acceptButton) {
        modalContent.removeChild(acceptButton);
    }
    modalContent.appendChild(alertButtonsDiv);

    // Ajustamos el cierre para que solo se cierre al confirmar o cancelar
    cancelBtn.onclick = () => {
        modalContent.removeChild(alertButtonsDiv);
        // Restauramos el botón Aceptar original para otras alertas
        const originalAccept = document.createElement('button');
        originalAccept.onclick = closeAlert;
        originalAccept.className = 'btn btn-primary';
        originalAccept.innerText = 'Aceptar';
        originalAccept.style.backgroundColor = '#4f46e5';
        modalContent.appendChild(originalAccept);
        closeAlert();
    };
    confirmBtn.onclick = () => {
        modalContent.removeChild(alertButtonsDiv);
      
        const originalAccept = document.createElement('button');
        originalAccept.onclick = closeAlert;
        originalAccept.className = 'btn btn-primary';
        originalAccept.innerText = 'Aceptar';
        originalAccept.style.backgroundColor = '#4f46e5';
        modalContent.appendChild(originalAccept);
        closeAlert();
        deleteProduct(idProducto);
    };

}

/** Envía la solicitud DELETE a la API. */
async function deleteProduct(idProducto) {
    try {
       
        const response = await fetch(`${API_URL}/productos/${idProducto}`, {
            method: 'DELETE',
            headers: { 'Accept': 'application/json' }
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Error al bloquear el producto.');
        }

        showAlert('Eliminado', 'El producto ha sido marcado como inactivo correctamente.');
        fetchAndLoadProducts(); 
        
    } catch (error) {
        console.error('Error al eliminar:', error);
        showAlert('Error de Eliminación', error.message);
    }
}



// Evento de carga inicial

document.addEventListener('DOMContentLoaded', () => {
      fetchCatalogos(); // Cargar la lista inicial
    fetchAndLoadProducts();
  
    const form = document.getElementById('productForm');
    if (form) {
        form.addEventListener('submit', handleFormSubmit);
    }
});

// Exponer funciones globales para el uso en el HTML
window.openAddModal = openAddModal;
window.openEditModal = openEditModal;
window.closeModal = closeModal;
window.filterProducts = filterProducts;
window.closeAlert = closeAlert;
window.confirmDeleteProduct = confirmDeleteProduct;