document.addEventListener('DOMContentLoaded', function() {
    // Variables para elementos del DOM
    const categoryBtns = document.querySelectorAll('.category-btn');
    const menuSections = document.querySelectorAll('.menu-items');
    const header = document.querySelector('header');
    const cartButton = document.getElementById('cart-button');
    const cartIcon = document.getElementById('cart-icon');
    const cartDropdown = document.querySelector('.cart-dropdown');
    const cartItemsContainer = document.querySelector('.cart-items');
    const cartCount = document.querySelector('.cart-count');
    const cartTotalAmount = document.getElementById('cart-total-amount');

    let cart = [];
    
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
                unitPrice: item.price // Guardamos el precio unitario original
            });
        }
        
        // Mostrar notificación
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
    
    // Event Listeners para el carrito
    cartIcon.addEventListener('click', function(e) {
        e.stopPropagation(); // Detener la propagación del evento
        cartDropdown.classList.toggle('show');
    });

    // Prevenir que el carrito se cierre cuando se hace clic dentro
    cartDropdown.addEventListener('click', function(e) {
        e.stopPropagation(); // Detener la propagación del evento
    });
    
    // Cerrar el carrito solo cuando se hace clic fuera
    document.addEventListener('click', function(e) {
        // Verificar si el clic fue fuera del carrito y del icono del carrito
        if (!cartDropdown.contains(e.target) && !cartIcon.contains(e.target)) {
            cartDropdown.classList.remove('show');
        }
    });

    // Delegación de eventos para los botones del carrito
    cartItemsContainer.addEventListener('click', function(e) {
        e.stopPropagation(); // Detener la propagación del evento
        const cartItem = e.target.closest('.cart-item');
        if (!cartItem) return;
        
        const itemId = cartItem.dataset.id;
        
        if (e.target.classList.contains('increase') || e.target.closest('.increase')) {
            const item = cart.find(item => item.id === itemId);
            if (item) {
                item.quantity += 1;
                saveCart();
                updateCartUI();
            }
        }
        
        if (e.target.classList.contains('decrease') || e.target.closest('.decrease')) {
            const item = cart.find(item => item.id === itemId);
            if (item) {
                item.quantity -= 1;
                if (item.quantity <= 0) {
                    cart = cart.filter(i => i.id !== itemId);
                }
                saveCart();
                updateCartUI();
            }
        }
        
        if (e.target.classList.contains('fa-trash') || e.target.closest('.cart-item-remove')) {
            cart = cart.filter(item => item.id !== itemId);
            saveCart();
            updateCartUI();
            showNotification('Producto eliminado del carrito');
        }
    });
    
    // Manejar cambios de categoría en el menú
    categoryBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            // Actualizar botones
            categoryBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            
            // Mostrar sección correspondiente
            const category = this.dataset.category;
            menuSections.forEach(section => {
                if (section.id === category) {
                    section.style.display = 'grid';
                } else {
                    section.style.display = 'none';
                }
            });
        });
    });
    
    // Agregar event listeners a los botones "Agregar al carrito"
    document.querySelectorAll('.add-to-cart-btn').forEach(button => {
        button.addEventListener('click', function() {
            const menuItem = this.closest('.menu-item');
            const itemId = this.dataset.id;
            const itemName = menuItem.querySelector('h3').textContent;
            const itemPrice = parseFloat(menuItem.querySelector('.price').textContent.replace('$', ''));
            
            addToCart({
                id: itemId,
                name: itemName,
                price: itemPrice
            });
        });
    });
    
    // ===== FUNCIONALIDAD DEL MENÚ =====
    // Cambiar categorías del menú al hacer clic
    categoryBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            // Remover clase active de todos los botones
            categoryBtns.forEach(b => b.classList.remove('active'));
            
            // Añadir clase active al botón clickeado
            this.classList.add('active');
            
            // Obtener la categoría a mostrar
            const category = this.getAttribute('data-category');
            
            // Mostrar/ocultar las secciones del menú según la categoría
            menuSections.forEach(section => {
                if (section.id === category) {
                    section.style.display = 'grid';
                } else {
                    section.style.display = 'none';
                }
            });
        });
    });
    
    // ===== NAVEGACIÓN SUAVE =====
    // Efecto de scroll suave para los enlaces internos
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return; // Prevenir acción en enlaces vacíos
            
            const targetElement = document.querySelector(targetId);
            if (!targetElement) return; // Verificar que el elemento existe
            
            window.scrollTo({
                top: targetElement.offsetTop - 80, // Offset para compensar header
                behavior: 'smooth'
            });
        });
    });
    
    // ===== CAMBIO DE HEADER AL HACER SCROLL =====
    // Efecto de transparencia y color en el header
    window.addEventListener('scroll', function() {
        if (window.scrollY > 100) {
            // Header compacto al hacer scroll
            header.style.padding = '10px 0';
            header.style.background = 'rgba(0, 0, 0, 0.9)'; // Negro semi-transparente
            header.style.color = 'white';
        } else {
            // Header normal al inicio de la página
            header.style.padding = '20px 0';
            header.style.background = 'transparent'; // Transparente
            header.style.color = 'white';
        }
    });
    
    // Modificar el event listener del botón de checkout
    document.querySelector('.checkout-btn').addEventListener('click', function() {
        // Redirigir a la página de detalles de compra
        window.location.href = './buying_details.html';
    });
    
    // Inicializar carrito
    initCart();
});


