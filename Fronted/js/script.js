import ProductAPI from './api.js';

document.addEventListener('DOMContentLoaded', async function() {
    // Variables para elementos del DOM
    const categoryBtns = document.querySelectorAll('.category-btn');
    const menuSections = document.querySelectorAll('.menu-items');
    const header = document.querySelector('header');
    const cartIcon = document.getElementById('cart-icon');
    const cartDropdown = document.querySelector('.cart-dropdown');
    const cartItemsContainer = document.querySelector('.cart-items');
    const cartCount = document.querySelector('.cart-count');
    const cartTotalAmount = document.getElementById('cart-total-amount');
    const menuContainer = document.querySelector('.menu');

    let cart = [];
    let products = [];
    let currentCategory = 'hamburguesas';
    let isLoading = false;
    
    // Cargar productos desde la API
    async function loadProducts() {
        if (isLoading || products.length > 0) return; // Evitar cargas múltiples
        
        try {
            isLoading = true;
            console.log('Cargando todos los productos...');
            
            const loadingElement = document.createElement('div');
            loadingElement.className = 'loading';
            loadingElement.textContent = 'Cargando productos...';
            
            const currentSection = document.getElementById(currentCategory);
            if (currentSection) {
                currentSection.innerHTML = '';
                currentSection.appendChild(loadingElement);
            }

            products = await ProductAPI.getProducts();
            console.log('Productos cargados:', products);

            if (!Array.isArray(products) || products.length === 0) {
                throw new Error('No se encontraron productos');
            }

            renderProducts(currentCategory);
        } catch (error) {
            console.error('Error al cargar productos:', error);
            const errorMessage = document.createElement('p');
            errorMessage.className = 'error-message';
            errorMessage.textContent = 'Error al cargar los productos. Por favor, intenta más tarde.';
            
            const currentSection = document.getElementById(currentCategory);
            if (currentSection) {
                currentSection.innerHTML = '';
                currentSection.appendChild(errorMessage);
            }
        } finally {
            isLoading = false;
        }
    }

    // Renderizar productos
    function renderProducts(category) {
        console.log(`Renderizando productos para categoría: ${category}`);
        const categoryProducts = products.filter(product => {
            console.log(`Evaluando producto: ${product.name}, Categoría: ${product.category}, Buscando: ${category}`);
            return product.category === category;
        });
        
        const menuSection = document.getElementById(category);
        if (!menuSection) {
            console.error(`No se encontró la sección para la categoría: ${category}`);
            return;
        }

        if (categoryProducts.length === 0) {
            menuSection.innerHTML = '<p class="error-message">No hay productos disponibles en esta categoría</p>';
            return;
        }

        const productsHTML = categoryProducts.map(product => {
            console.log('Renderizando producto:', {
                nombre: product.name,
                imagen: product.imageUrl,
                precio: product.price,
                id: product.id,
                disponible: product.available
            });

            return `
                <div class="menu-item">
                    <img src="${product.imageUrl || '../images/default-product.jpg'}" 
                         alt="${product.name}"
                         onerror="this.onerror=null; this.src='../images/default-product.jpg';">
                    <div class="menu-item-content">
                        <div>
                            <h3>${product.name}</h3>
                            <span class="price">$${product.price.toFixed(2)}</span>
                        </div>
                        <button class="add-to-cart-btn" data-id="${product.id}" ${!product.available ? 'disabled' : ''}>
                            AGREGAR
                        </button>
                    </div>
                </div>
            `;
        }).join('');

        menuSection.innerHTML = productsHTML;

        // Agregar event listeners a los botones después de insertar el HTML
        const addToCartButtons = menuSection.querySelectorAll('.add-to-cart-btn');
        addToCartButtons.forEach(button => {
            if (!button.disabled) {
                button.addEventListener('click', function() {
                    const productId = parseInt(this.dataset.id);
                    const product = products.find(p => p.id === productId);
                    if (product) {
                        addToCart({
                            id: product.id,
                            name: product.name,
                            price: product.price,
                            image: product.imageUrl
                        });
                    }
                });
            }
        });
    }

    // Cargar carrito desde localStorage
    function initCart() {
        const savedCart = localStorage.getItem('cart');
        if (savedCart) {
            cart = JSON.parse(savedCart);
            updateCartUI();
        }
    }
    
    // Guardar carrito en localStorage
    function saveCart() {
        localStorage.setItem('cart', JSON.stringify(cart));
    }
    
    // Actualizar UI del carrito
    function updateCartUI() {
        const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
        cartCount.textContent = totalItems;
        cartCount.style.display = totalItems > 0 ? 'flex' : 'none';
        renderCartItems();
        updateCartTotal();
    }
    
    // Renderizar items del carrito
    function renderCartItems() {
        cartItemsContainer.innerHTML = '';
        if (cart.length === 0) {
            cartItemsContainer.innerHTML = '<p class="empty-cart-message">Tu carrito está vacío</p>';
            return;
        }
        
        cart.forEach(item => {
            cartItemsContainer.innerHTML += `
                <div class="cart-item" data-id="${item.id}">
                    <div class="cart-item-details">
                        <h4 class="cart-item-title">${item.name}</h4>
                        <div class="cart-item-pricing">
                            <div class="unit-price">$${item.price.toFixed(2)}</div>
                            <div class="cart-item-quantity">
                                <button class="quantity-btn decrease" type="button">-</button>
                                <span>${item.quantity}</span>
                                <button class="quantity-btn increase" type="button">+</button>
                            </div>
                        </div>
                    </div>
                    <button class="cart-item-remove" type="button">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            `;
        });
    }
    
    // Actualizar total del carrito
    function updateCartTotal() {
        const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        cartTotalAmount.textContent = `$${total.toFixed(2)}`;
    }
    
    // Agregar item al carrito
    function addToCart(item) {
        const existingItem = cart.find(cartItem => cartItem.id === item.id);
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            cart.push({ 
                ...item, 
                quantity: 1,
                unitPrice: item.price
            });
        }
        
        showNotification('Producto agregado al carrito');
        saveCart();
        updateCartUI();
    }
    
    // Mostrar notificación
    function showNotification(message) {
        const notification = document.createElement('div');
        notification.className = 'notification';
        notification.textContent = message;
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.classList.add('show');
            setTimeout(() => {
                notification.classList.remove('show');
                setTimeout(() => {
                    notification.remove();
                }, 300);
            }, 2000);
        }, 100);
    }
    
    // Event Listeners
    cartIcon.addEventListener('click', function(e) {
        e.stopPropagation();
        cartDropdown.classList.toggle('show');
    });

    cartDropdown.addEventListener('click', function(e) {
        e.stopPropagation();
    });
    
    document.addEventListener('click', function(e) {
        if (!cartDropdown.contains(e.target) && !cartIcon.contains(e.target)) {
            cartDropdown.classList.remove('show');
        }
    });

    cartItemsContainer.addEventListener('click', function(e) {
        const cartItem = e.target.closest('.cart-item');
        if (!cartItem) return;
        
        const itemId = cartItem.dataset.id;
        
        // Manejo del botón de incremento
        if (e.target.classList.contains('increase') || e.target.closest('.increase')) {
            const item = cart.find(item => item.id === parseInt(itemId));
            if (item) {
                item.quantity += 1;
                saveCart();
                updateCartUI();
                showNotification('Cantidad actualizada');
            }
        }
        
        // Manejo del botón de decremento
        if (e.target.classList.contains('decrease') || e.target.closest('.decrease')) {
            const item = cart.find(item => item.id === parseInt(itemId));
            if (item) {
                item.quantity -= 1;
                if (item.quantity <= 0) {
                    cart = cart.filter(i => i.id !== parseInt(itemId));
                    showNotification('Producto eliminado del carrito');
                } else {
                    showNotification('Cantidad actualizada');
                }
                saveCart();
                updateCartUI();
            }
        }
        
        // Manejo del botón de eliminar
        if (e.target.classList.contains('fa-trash') || e.target.closest('.cart-item-remove')) {
            cart = cart.filter(item => item.id !== parseInt(itemId));
            saveCart();
            updateCartUI();
            showNotification('Producto eliminado del carrito');
        }
    });

    // Un solo event listener para los botones de categoría
    categoryBtns.forEach(btn => {
        btn.addEventListener('click', async function() {
            const category = this.dataset.category;
            console.log('Categoría seleccionada:', category);
            
            categoryBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            
            currentCategory = category;
            
            menuSections.forEach(section => {
                console.log(`Sección: ${section.id}, Categoría actual: ${category}, Visible: ${section.id === category}`);
                if (section.id === category) {
                    section.style.display = 'grid';
                } else {
                    section.style.display = 'none';
                }
            });

            // Si no hay productos, cargarlos
            if (products.length === 0) {
                console.log('No hay productos cargados, cargando...');
                await loadProducts();
            }

            // Filtrar y mostrar productos de la categoría actual
            const categoryProducts = products.filter(p => p.category === category);
            console.log(`Productos encontrados para categoría ${category}:`, categoryProducts.map(p => p.name));

            renderProducts(category);
        });
    });

    // Efecto de scroll suave para los enlaces internos
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (!targetElement) return;
            
            window.scrollTo({
                top: targetElement.offsetTop - 80,
                behavior: 'smooth'
            });
        });
    });

    // Efecto de header al hacer scroll
    window.addEventListener('scroll', function() {
        if (window.scrollY > 100) {
            header.style.padding = '10px 0';
            header.style.background = 'rgba(0, 0, 0, 0.9)';
            header.style.color = 'white';
        } else {
            header.style.padding = '20px 0';
            header.style.background = 'transparent';
            header.style.color = 'white';
        }
    });

    // Event listener para el botón de checkout
    document.querySelector('.checkout-btn').addEventListener('click', function() {
        window.location.href = './buying_details.html';
    });

    // Inicializar la aplicación
    initCart();
    await loadProducts(); // Cargar productos una sola vez
});


