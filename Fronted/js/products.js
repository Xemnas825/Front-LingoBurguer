const API_URL = 'http://localhost:8080/PruebaDBConsola/Controller';

class ProductManager {
    constructor() {
        this.products = {
            hamburguesas: [],
            acompañamientos: [],
            bebidas: [],
            postres: []
        };
        this.loadProducts();
    }

    async loadProducts() {
        try {
            // Cargar productos por categoría
            const categories = ['HAMBURGUESA', 'ACOMPANAMIENTO', 'BEBIDA', 'POSTRE'];
            const categoryMappings = {
                'HAMBURGUESA': 'hamburguesas',
                'ACOMPANAMIENTO': 'acompañamientos',
                'BEBIDA': 'bebidas',
                'POSTRE': 'postres'
            };

            for (const category of categories) {
                const response = await fetch(`${API_URL}?ACTION=PRODUCT.FIND_BY_CATEGORY&CATEGORY=${category}`);
                if (!response.ok) {
                    throw new Error(`Error al cargar productos de ${category}`);
                }
                const products = await response.json();
                this.products[categoryMappings[category]] = products;
            }

            this.displayProducts();
        } catch (error) {
            console.error('Error:', error);
            this.showError('No se pudieron cargar los productos');
        }
    }

    displayProducts() {
        // Mostrar productos por categoría
        Object.entries(this.products).forEach(([category, products]) => {
            const container = document.getElementById(category);
            if (!container) return;

            container.innerHTML = ''; // Limpiar el contenedor

            // Mostrar solo los primeros 10 productos
            const productsToShow = products.slice(0, 10);
            
            productsToShow.forEach(product => {
                const menuItem = document.createElement('div');
                menuItem.className = 'menu-item';
                menuItem.innerHTML = `
                    <img src="../images/${product.m_strImage || 'default.jpg'}" alt="${product.m_strName}">
                    <div class="menu-item-content">
                        <h3>${product.m_strName}</h3>
                        <span class="price">$${product.m_dPrice.toFixed(2)}</span>
                        <button class="add-to-cart-btn" data-id="${product.m_iId}">Agregar</button>
                    </div>
                `;

                // Agregar event listener al botón
                const addButton = menuItem.querySelector('.add-to-cart-btn');
                addButton.addEventListener('click', () => {
                    this.addToCart({
                        id: product.m_iId,
                        name: product.m_strName,
                        price: product.m_dPrice,
                        image: product.m_strImage
                    });
                });

                container.appendChild(menuItem);
            });
        });
    }

    addToCart(product) {
        // Disparar un evento personalizado para que script.js lo maneje
        const event = new CustomEvent('addToCart', { detail: product });
        document.dispatchEvent(event);
    }

    showError(message) {
        // Mostrar mensaje de error en cada sección del menú
        Object.keys(this.products).forEach(category => {
            const container = document.getElementById(category);
            if (container) {
                container.innerHTML = `
                    <div class="error-message">
                        <i class="fas fa-exclamation-circle"></i>
                        <p>${message}</p>
                    </div>
                `;
            }
        });
    }
}

// Inicializar el gestor de productos cuando se cargue el documento
document.addEventListener('DOMContentLoaded', () => {
    new ProductManager();
}); 