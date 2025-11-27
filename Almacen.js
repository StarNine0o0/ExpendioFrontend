
        // Datos de ejemplo para el almacén
        let products = [
            {
                code: "BAR-001",
                name: "Cerveza Barrilito 325ml 6 pack",
                category: "rubias",
                quantity: 50,
                price: 110.00
            },
            {
                code: "IND-001",
                name: "Cerveza Indio 325ml 6 pack",
                category: "obscuras",
                quantity: 30,
                price: 150.00
            },
            {
                code: "COR-001",
                name: "Cerveza Corona 355ml 6 pack",
                category: "rubias",
                quantity: 15,
                price: 120.00
            },
            {
                code: "MOD-001",
                name: "Cerveza Modelo Negra 355ml 6 pack",
                category: "obscuras",
                quantity: 8,
                price: 185.00
            },
            {
                code: "VIC-001",
                name: "Cerveza Mega Victoria 1.2L",
                category: "rubias",
                quantity: 25,
                price: 112.00
            }
        ];

        let editingProduct = null;

        // Funciones del almacén
        function loadProducts() {
            const tbody = document.getElementById('productsTableBody');
            tbody.innerHTML = '';

            products.forEach(product => {
                const row = document.createElement('tr');
                const totalValue = (product.quantity * product.price).toFixed(2);
                const stockStatus = getStockStatus(product.quantity);
                
                row.innerHTML = `
                    <td>${product.code}</td>
                    <td>${product.name}</td>
                    <td>${getCategoryName(product.category)}</td>
                    <td>${product.quantity}</td>
                    <td>$${product.price.toFixed(2)}</td>
                    <td>$${totalValue}</td>
                    <td><span class="stock-status ${stockStatus.class}">${stockStatus.text}</span></td>
                    <td>
                        <div class="action-buttons">
                            <button class="btn-action btn-edit" onclick="editProduct('${product.code}')">
                                <i class="fas fa-edit"></i>
                            </button>
                            <button class="btn-action btn-delete" onclick="deleteProduct('${product.code}')">
                                <i class="fas fa-trash"></i>
                            </button>
                        </div>
                    </td>
                `;
                tbody.appendChild(row);
            });

            updateStats();
        }

        function getStockStatus(quantity) {
            if (quantity >= 30) {
                return { class: 'stock-alto', text: 'Alto' };
            } else if (quantity >= 10) {
                return { class: 'stock-medio', text: 'Medio' };
            } else if (quantity > 0) {
                return { class: 'stock-bajo', text: 'Bajo' };
            } else {
                return { class: 'stock-agotado', text: 'Agotado' };
            }
        }

        function getCategoryName(category) {
            const categories = {
                'rubias': 'Rubias',
                'obscuras': 'Obscuras',
                'tequila': 'Tequila',
                'whisky': 'Whisky',
                'mezcal': 'Mezcal',
                'otros': 'Otros'
            };
            return categories[category] || category;
        }

        function updateStats() {
            document.getElementById('totalProducts').textContent = products.length;
            
            const lowStock = products.filter(p => p.quantity < 10).length;
            document.getElementById('lowStock').textContent = lowStock;
            
            const totalValue = products.reduce((sum, p) => sum + (p.quantity * p.price), 0);
            document.getElementById('totalValue').textContent = `$${totalValue.toFixed(2)}`;
            
            const categories = new Set(products.map(p => p.category)).size;
            document.getElementById('categories').textContent = categories;
        }

        function filterProducts() {
            const searchTerm = document.getElementById('searchProduct').value.toLowerCase();
            const categoryFilter = document.getElementById('filterCategory').value;
            const stockFilter = document.getElementById('filterStock').value;

            const filteredProducts = products.filter(product => {
                const matchesSearch = product.name.toLowerCase().includes(searchTerm) || 
                                    product.code.toLowerCase().includes(searchTerm);
                const matchesCategory = !categoryFilter || product.category === categoryFilter;
                const matchesStock = !stockFilter || getStockStatus(product.quantity).text.toLowerCase() === stockFilter;

                return matchesSearch && matchesCategory && matchesStock;
            });

            const tbody = document.getElementById('productsTableBody');
            tbody.innerHTML = '';

            filteredProducts.forEach(product => {
                const row = document.createElement('tr');
                const totalValue = (product.quantity * product.price).toFixed(2);
                const stockStatus = getStockStatus(product.quantity);
                
                row.innerHTML = `
                    <td>${product.code}</td>
                    <td>${product.name}</td>
                    <td>${getCategoryName(product.category)}</td>
                    <td>${product.quantity}</td>
                    <td>$${product.price.toFixed(2)}</td>
                    <td>$${totalValue}</td>
                    <td><span class="stock-status ${stockStatus.class}">${stockStatus.text}</span></td>
                    <td>
                        <div class="action-buttons">
                            <button class="btn-action btn-edit" onclick="editProduct('${product.code}')">
                                <i class="fas fa-edit"></i>
                            </button>
                            <button class="btn-action btn-delete" onclick="deleteProduct('${product.code}')">
                                <i class="fas fa-trash"></i>
                            </button>
                        </div>
                    </td>
                `;
                tbody.appendChild(row);
            });
        }

        function openAddModal() {
            editingProduct = null;
            document.getElementById('modalTitle').textContent = 'Agregar Producto';
            document.getElementById('productForm').reset();
            document.getElementById('productModal').style.display = 'block';
        }

        function editProduct(code) {
            editingProduct = products.find(p => p.code === code);
            if (editingProduct) {
                document.getElementById('modalTitle').textContent = 'Editar Producto';
                document.getElementById('productCode').value = editingProduct.code;
                document.getElementById('productName').value = editingProduct.name;
                document.getElementById('productCategory').value = editingProduct.category;
                document.getElementById('productQuantity').value = editingProduct.quantity;
                document.getElementById('productPrice').value = editingProduct.price;
                document.getElementById('productModal').style.display = 'block';
            }
        }

        function deleteProduct(code) {
            if (confirm('¿Estás seguro de que quieres eliminar este producto?')) {
                products = products.filter(p => p.code !== code);
                loadProducts();
            }
        }

        function closeModal() {
            document.getElementById('productModal').style.display = 'none';
            editingProduct = null;
        }

        function generateReport() {
            const totalValue = products.reduce((sum, p) => sum + (p.quantity * p.price), 0);
            const lowStockItems = products.filter(p => p.quantity < 10);
            
            let report = `REPORTE DE ALMACÉN - ${new Date().toLocaleDateString()}\n\n`;
            report += `Total de productos: ${products.length}\n`;
            report += `Valor total del inventario: $${totalValue.toFixed(2)}\n`;
            report += `Productos con stock bajo: ${lowStockItems.length}\n\n`;
            
            if (lowStockItems.length > 0) {
                report += `PRODUCTOS CON STOCK BAJO:\n`;
                lowStockItems.forEach(item => {
                    report += `- ${item.name} (Código: ${item.code}) - Stock: ${item.quantity}\n`;
                });
            }
            
            alert(report);
        }

        // Event listeners
        document.getElementById('productForm').addEventListener('submit', function(e) {
            e.preventDefault();
            
            const productData = {
                code: document.getElementById('productCode').value,
                name: document.getElementById('productName').value,
                category: document.getElementById('productCategory').value,
                quantity: parseInt(document.getElementById('productQuantity').value),
                price: parseFloat(document.getElementById('productPrice').value)
            };

            if (editingProduct) {
                // Actualizar producto existente
                const index = products.findIndex(p => p.code === editingProduct.code);
                if (index !== -1) {
                    products[index] = productData;
                }
            } else {
                // Agregar nuevo producto
                products.push(productData);
            }

            loadProducts();
            closeModal();
        });

        // Cerrar modal al hacer clic fuera de él
        window.onclick = function(event) {
            const modal = document.getElementById('productModal');
            if (event.target === modal) {
                closeModal();
            }
        }

        // Cargar productos al iniciar
        window.onload = function() {
            loadProducts();
        };
   