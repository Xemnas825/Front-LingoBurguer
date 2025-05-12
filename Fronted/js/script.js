document.addEventListener('DOMContentLoaded', function() {
    // Variables para elementos del DOM
    const categoryBtns = document.querySelectorAll('.category-btn');
    const menuSections = document.querySelectorAll('.menu-items');
    const header = document.querySelector('header');
    const cartButton = document.getElementById('cart-button');
    const cartIcon = document.querySelector('.cart-icon');
    const cartItemsContainer = document.querySelector('.cart-items');
    const cartCount = document.querySelector('.cart-count');
    const cartTotalAmount = document.getElementById('cart-total-amount');


    let cart = [];
    
     // Cargar carrito desde localStorage al cargar la página
     initCart();
    
     // ===== EVENTOS DEL CARRITO =====
     // Abrir/cerrar el carrito al hacer clic en el icono
     cartButton.addEventListener('click', function(e) {
         e.preventDefault();
         e.stopPropagation();
         cartIcon.classList.toggle('active');
         
         // Cerrar el carrito si se hace clic fuera de él
         document.addEventListener('click', closeCartOnClickOutside);
     });
     
     // Evitar que el carrito se cierre cuando se hace clic dentro
     document.querySelector('.cart-dropdown').addEventListener('click', function(e) {
         e.stopPropagation();
     });
     
     // Añadir botones "Añadir al carrito" a los elementos del menú
     addCartButtonsToMenuItems();
     
     // Delegación de eventos para manejar incremento/decremento/eliminación de productos
     cartItemsContainer.addEventListener('click', function(e) {
         const target = e.target;
         const cartItem = target.closest('.cart-item');
         
         if (!cartItem) return;
         
         const itemId = cartItem.dataset.id;
         
         // Manejar clic en botón de incremento
         if (target.classList.contains('increase') || target.closest('.increase')) {
             updateCartItemQuantity(itemId, 1);
         }
         
         // Manejar clic en botón de decremento
         if (target.classList.contains('decrease') || target.closest('.decrease')) {
             updateCartItemQuantity(itemId, -1);
         }
         
         // Manejar clic en botón de eliminar
         if (target.classList.contains('fa-trash') || target.closest('.cart-item-remove')) {
             removeCartItem(itemId);
         }
     });
     
     // ===== FUNCIONES PRINCIPALES DEL CARRITO =====
     
     // Función para inicializar el carrito desde localStorage
     function initCart() {
         // Intentar cargar el carrito desde localStorage
         const savedCart = localStorage.getItem('lingoburguerCart');
         if (savedCart) {
             cart = JSON.parse(savedCart);
             renderCart();
         }
     }
     
     // Función para añadir botones al menú
     function addCartButtonsToMenuItems() {
         const menuItems = document.querySelectorAll('.menu-item');
         
         menuItems.forEach((item, index) => {
             // Extraer información del producto
             const name = item.querySelector('h3').textContent;
             const price = parseFloat(item.querySelector('.price').textContent.replace('$', ''));
             const imgSrc = item.querySelector('img').src || '/default-product.jpg';
             const productId = `product-${index}-${name.toLowerCase().replace(/\s+/g, '-')}`;
             
             // Crear el botón si no existe ya
             if (!item.querySelector('.add-to-cart-btn')) {
                 const addButton = document.createElement('button');
                 addButton.className = 'btn add-to-cart-btn';
                 addButton.textContent = 'Add to cart';
                 
                 // Añadir event listener
                 addButton.addEventListener('click', function() {
                     addToCart({
                         id: productId,
                         name: name,
                         price: price,
                         imgSrc: imgSrc,
                         quantity: 1
                     });
                     
                     // Mostrar feedback visual
                     this.textContent = 'Added!';
                     setTimeout(() => {
                         this.textContent = 'Add to cart';
                     }, 1500);
                 });
                 
                 item.appendChild(addButton);
             }
         });
     }
     
     // Función para añadir productos al carrito
     function addToCart(product) {
         // Comprobar si el producto ya está en el carrito
         const existingItemIndex = cart.findIndex(item => item.id === product.id);
         
         if (existingItemIndex > -1) {
             // Incrementar cantidad si ya existe
             cart[existingItemIndex].quantity += 1;
         } else {
             // Añadir nuevo producto al carrito
             cart.push(product);
         }
         
         // Guardar en localStorage y actualizar la interfaz
         saveCart();
         renderCart();
         
         // Mostrar el carrito cuando se añade un producto
         cartIcon.classList.add('active');
     }
     
     // Función para actualizar la cantidad de un producto
     function updateCartItemQuantity(itemId, change) {
         const itemIndex = cart.findIndex(item => item.id === itemId);
         
         if (itemIndex === -1) return;
         
         cart[itemIndex].quantity += change;
         
         // Eliminar producto si la cantidad llega a 0
         if (cart[itemIndex].quantity <= 0) {
             removeCartItem(itemId);
             return;
         }
         
         // Guardar y actualizar interfaz
         saveCart();
         renderCart();
     }
     
     // Función para eliminar un producto del carrito
     function removeCartItem(itemId) {
         cart = cart.filter(item => item.id !== itemId);
         saveCart();
         renderCart();
     }
     
     // Función para guardar el carrito en localStorage
     function saveCart() {
         localStorage.setItem('lingoburguerCart', JSON.stringify(cart));
     }
     
     // Función para limpiar el carrito
     function clearCart() {
         cart = [];
         saveCart();
         renderCart();
     }
     
     // Función para actualizar la UI del carrito
     function renderCart() {
         // Actualizar número de productos
         updateCartCount();
         
         // Limpiar contenedor
         cartItemsContainer.innerHTML = '';
         
         // Mostrar mensaje de carrito vacío si no hay productos
         if (cart.length === 0) {
             cartItemsContainer.innerHTML = '<div class="empty-cart-message">Your cart is empty</div>';
             updateCartTotal();
             return;
         }
         
         // Renderizar cada producto en el carrito
         cart.forEach(item => {
             const cartItemElement = document.createElement('div');
             cartItemElement.className = 'cart-item';
             cartItemElement.dataset.id = item.id;
             
             cartItemElement.innerHTML = `
                 <div class="cart-item-image">
                     <img src="${item.imgSrc}" alt="${item.name}">
                 </div>
                 <div class="cart-item-details">
                     <div class="cart-item-title">${item.name}</div>
                     <div class="cart-item-price">$${item.price.toFixed(2)}</div>
                     <div class="cart-item-quantity">
                         <button class="decrease">-</button>
                         <span>${item.quantity}</span>
                         <button class="increase">+</button>
                     </div>
                 </div>
                 <div class="cart-item-remove"><i class="fas fa-trash"></i></div>
             `;
             
             cartItemsContainer.appendChild(cartItemElement);
         });
         
         // Actualizar total
         updateCartTotal();
     }
     
     // Función para actualizar el contador del carrito
     function updateCartCount() {
         let itemCount = 0;
         
         // Sumar todas las cantidades
         cart.forEach(item => {
             itemCount += item.quantity;
         });
         
         cartCount.textContent = itemCount;
     }
     
     // Función para actualizar el total del carrito
     function updateCartTotal() {
         let total = 0;
         
         // Calcular total sumando precio * cantidad de cada producto
         cart.forEach(item => {
             total += item.price * item.quantity;
         });
         
         cartTotalAmount.textContent = `$${total.toFixed(2)}`;
     }
     
     // Función para cerrar el carrito al hacer clic fuera
     function closeCartOnClickOutside(e) {
         if (!cartIcon.contains(e.target)) {
             cartIcon.classList.remove('active');
             document.removeEventListener('click', closeCartOnClickOutside);
         }
     }
     
     // ===== PROCESAR CHECKOUT =====
     const checkoutBtn = document.querySelector('.checkout-btn');
     if (checkoutBtn) {
         checkoutBtn.addEventListener('click', function() {
             if (cart.length === 0) {
                 alert('Your cart is empty!');
                 return;
             }
             
             // Aquí iría la lógica para procesar el pedido
             
             alert('Thank you for your order! We are processing your purchase.');
             clearCart();
             cartIcon.classList.remove('active');
         });
     }




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
});


