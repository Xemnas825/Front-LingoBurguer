const apiEstUrl = "http://localhost:8080/PruebaDBConsola/Controller?ACTION=ESTABLISHMENT.FIND_ALL";
const apiPaymentUrl = "http://localhost:8080/PruebaDBConsola/Controller?ACTION=PAYMENTMETHOD.FIND_ALL";
const apiOrderTypeUrl = "http://localhost:8080/PruebaDBConsola/Controller?ACTION=ORDER.FIND_ALL";

document.addEventListener('DOMContentLoaded', async function() {
    // Configuración de tipos de pedido fijos
    const orderTypes = [
        { name: 'LOCAL', icon: 'fa-store' },
        { name: 'TAKEAWAY', icon: 'fa-shopping-bag' }
    ];
    
    // Actualizar el contenedor de tipos de pedido
    const orderTypeContainer = document.querySelector('.order-type-options');
    if (orderTypeContainer) {
        orderTypeContainer.innerHTML = '';  
        
        orderTypes.forEach(type => {
            const div = document.createElement('div');
            div.className = 'order-type-option';
            div.setAttribute('data-type', type.name);
            div.innerHTML = `
                <i class="fas ${type.icon}"></i>
                <div>${type.name}</div>
            `;
            
            // Agregar evento click
            div.addEventListener('click', function() {
                // Remover clase selected de todas las opciones
                document.querySelectorAll('.order-type-option').forEach(opt => {
                    opt.classList.remove('selected');
                });
                // Agregar clase selected a la opción clickeada
                this.classList.add('selected');
                // Guardar el tipo de pedido seleccionado
                localStorage.setItem('selectedOrderType', type.name);
            });
            
            orderTypeContainer.appendChild(div);
        });
    }

    // Cargar métodos de pago desde la API
    try {
        const response = await fetch(apiPaymentUrl);
        if (!response.ok) {
            throw new Error('Error loading payment methods');
        }
        const paymentMethods = await response.json();
        
        // Mapeo de nombres a íconos
        const paymentIcons = {
            'Tarjeta': 'fa-credit-card',
            'Efectivo': 'fa-money-bill-wave',
            // Puedes agregar más métodos de pago y sus íconos aquí según necesites
        };
        
        // Actualizar el contenedor de métodos de pago
        const paymentOptionsContainer = document.querySelector('.payment-options');
        if (paymentOptionsContainer) {
            paymentOptionsContainer.innerHTML = '';  // Limpiar el contenedor
            
            paymentMethods.forEach(method => {
                const div = document.createElement('div');
                div.className = 'payment-option';
                div.setAttribute('data-id', method.m_iId);
                div.innerHTML = `
                    <i class="fas ${paymentIcons[method.m_strName] || 'fa-money-bill'}"></i>
                    <div>${method.m_strName}</div>
                `;
                
                // Agregar evento click
                div.addEventListener('click', function() {
                    document.querySelectorAll('.payment-option').forEach(opt => {
                        opt.classList.remove('selected');
                    });
                    this.classList.add('selected');
                });
                
                paymentOptionsContainer.appendChild(div);
            });
        }
    } catch (error) {
        console.error('Error loading payment methods:', error);
    }
    
    // Obtener el carrito del localStorage
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    
    // Si el carrito está vacío, redirigir al inicio
    if (cart.length === 0) {
        alert('The cart is empty');
        window.location.href = 'index.html';
        return;
    }
    
    // Función para renderizar el carrito
    function renderCart() {
        const productList = document.querySelector('.product-list');
        if (!productList) return;

        // Crear o actualizar el contenedor de productos
        let productsContainer = productList.querySelector('.products-container');
        if (!productsContainer) {
            productsContainer = document.createElement('div');
            productsContainer.className = 'products-container';
            productList.appendChild(productsContainer);
        }

        // Limpiar y actualizar solo el contenedor de productos
        productsContainer.innerHTML = '';
        
        cart.forEach(item => {
            productsContainer.innerHTML += `
                <div class="product-item" data-id="${item.id}">
                    <div class="product-info">
                        <img src="${item.image || '../images/default-product.jpg'}" 
                             alt="${item.name}" 
                             class="product-image"
                             onerror="this.onerror=null; this.src='../images/default-product.jpg';">
                        <div class="product-details">
                            <div class="product-name">${item.name}</div>
                            <div class="price-details">
                                <div class="unit-price">$${item.price.toFixed(2)}</div>
                                <div class="quantity-info">
                                    <div class="product-quantity">
                                        <button class="quantity-btn decrease" type="button">-</button>
                                        <span>${item.quantity}</span>
                                        <button class="quantity-btn increase" type="button">+</button>
                                    </div>
                                    <button class="remove-item" type="button">
                                        <i class="fas fa-trash"></i>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            `;
        });
    }

    // Función para actualizar los totales
    function updateTotals() {
        const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        const iva = subtotal * 0.16;
        const total = subtotal + iva;
        
        const totalSection = document.querySelector('.total-section');
        if (totalSection) {
            totalSection.innerHTML = `
                <div class="total-row">
                    <span>Total products:</span>
                    <span id="subtotal">$${subtotal.toFixed(2)}</span>
                </div>
                <div class="total-row">
                    <span>Tip (16%):</span>
                    <span id="iva">$${iva.toFixed(2)}</span>
                </div>
                <div class="total-row">
                    <span>Total to pay:</span>
                    <span id="total" class="total-amount">$${total.toFixed(2)}</span>
                </div>
            `;
        }
    }

    // Renderizar carrito inicial
    renderCart();
    updateTotals();

    // Event listeners para los botones de cantidad y eliminación
    const productListContainer = document.querySelector('.product-list');
    if (productListContainer) {
        productListContainer.addEventListener('click', function(e) {
            const productItem = e.target.closest('.product-item');
            if (!productItem) return;
            
            const itemId = parseInt(productItem.dataset.id);
            console.log('Click en producto con ID:', itemId);
            
            // Incrementar cantidad
            if (e.target.classList.contains('increase') || e.target.closest('.increase')) {
                console.log('Incrementando cantidad');
                const item = cart.find(item => item.id === itemId);
                if (item) {
                    item.quantity += 1;
                    localStorage.setItem('cart', JSON.stringify(cart));
                    renderCart();
                    updateTotals();
                }
            }
            
            // Decrementar cantidad
            if (e.target.classList.contains('decrease') || e.target.closest('.decrease')) {
                console.log('Decrementando cantidad');
                const item = cart.find(item => item.id === itemId);
                if (item) {
                    item.quantity -= 1;
                    if (item.quantity <= 0) {
                        cart = cart.filter(i => i.id !== itemId);
                    }
                    localStorage.setItem('cart', JSON.stringify(cart));
                    
                    if (cart.length === 0) {
                        alert('El carrito está vacío');
                        window.location.href = 'index.html';
                    } else {
                        renderCart();
                        updateTotals();
                    }
                }
            }
            
            // Eliminar producto
            if (e.target.classList.contains('fa-trash') || e.target.closest('.remove-item')) {
                console.log('Eliminando producto');
                cart = cart.filter(item => item.id !== itemId);
                localStorage.setItem('cart', JSON.stringify(cart));
                
                if (cart.length === 0) {
                    alert('El carrito está vacío');
                    window.location.href = 'index.html';
                } else {
                    renderCart();
                    updateTotals();
                }
            }
        });
    }

    // Manejar envío del formulario
    document.querySelector('.buying_details_card').addEventListener('submit', async function(e) {
        e.preventDefault();
        
        // Check if establishment is selected
        const selectedEstablishment = localStorage.getItem('selectedEstablishment');
        if (!selectedEstablishment) {
            alert('Please select an establishment');
            return;
        }
        
        // Check if payment method is selected
        const selectedPayment = document.querySelector('.payment-option.selected');
        if (!selectedPayment) {
            alert('Please select a payment method');
            return;
        }

        // Check if order type is selected
        const selectedOrderType = document.querySelector('.order-type-option.selected');
        if (!selectedOrderType) {
            alert('Please select an order type');
            return;
        }
        
        // Aquí iría la lógica para procesar el pago
        alert('¡Compra realizada con éxito!');
        
        // Limpiar el carrito
        localStorage.removeItem('cart');
        localStorage.removeItem('selectedEstablishment');
        
        // Redirigir al inicio
        window.location.href = 'index.html';
    });
}); 