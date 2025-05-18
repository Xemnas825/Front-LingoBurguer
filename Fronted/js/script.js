document.addEventListener('DOMContentLoaded', function() {
    // Variables para elementos del DOM
    const categoryBtns = document.querySelectorAll('.category-btn');
    const menuSections = document.querySelectorAll('.menu-items');
    const header = document.querySelector('header');
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
        if (!cartItemsContainer) return;
        
        if (cart.length === 0) {
            cartItemsContainer.innerHTML = '<div class="empty-cart-message">Tu carrito está vacío</div>';
            return;
        }
        
        cartItemsContainer.innerHTML = cart.map(item => `
            <div class="cart-item" data-id="${item.id}">
                <img src="../images/${item.image || 'default.jpg'}" alt="${item.name}" class="cart-item-image">
                <div class="cart-item-details">
                    <div class="cart-item-name">${item.name}</div>
                    <div class="cart-item-price">$${(item.price * item.quantity).toFixed(2)}</div>
                    <div class="cart-item-quantity">
                        <button class="quantity-btn decrease">-</button>
                        <span>${item.quantity}</span>
                        <button class="quantity-btn increase">+</button>
                    </div>
                </div>
                <button class="remove-item">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        `).join('');
        
        // Agregar event listeners a los botones de cantidad
        cartItemsContainer.querySelectorAll('.cart-item').forEach(item => {
            const itemId = item.dataset.id;
            const decreaseBtn = item.querySelector('.decrease');
            const increaseBtn = item.querySelector('.increase');
            const removeBtn = item.querySelector('.remove-item');
            
            decreaseBtn.addEventListener('click', () => updateItemQuantity(itemId, -1));
            increaseBtn.addEventListener('click', () => updateItemQuantity(itemId, 1));
            removeBtn.addEventListener('click', () => removeFromCart(itemId));
        });
    }
    
    // Actualizar total del carrito
    function updateCartTotal() {
        if (!cartTotalAmount) return;
        
        const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        cartTotalAmount.textContent = `$${total.toFixed(2)}`;
    }
    
    // Agregar item al carrito
    function addToCart(product) {
        const existingItem = cart.find(item => item.id === product.id);
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            cart.push({ ...product, quantity: 1 });
        }
        
        showNotification('Producto agregado al carrito');
        saveCart();
        updateCartUI();
    }
    
    // Actualizar cantidad de un item
    function updateItemQuantity(itemId, change) {
        const item = cart.find(item => item.id === itemId);
        if (!item) return;
        
        item.quantity += change;
        
        if (item.quantity <= 0) {
            removeFromCart(itemId);
        } else {
            saveCart();
            updateCartUI();
        }
    }
    
    // Eliminar item del carrito
    function removeFromCart(itemId) {
        cart = cart.filter(item => item.id !== itemId);
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
    
    // Manejar cambios de categoría en el menú
    categoryBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            categoryBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            
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

    // Escuchar el evento personalizado de agregar al carrito
    document.addEventListener('addToCart', function(e) {
        addToCart(e.detail);
    });
    
    // Inicializar carrito
    initCart();
});


