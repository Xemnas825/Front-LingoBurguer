const apiEstUrl = "http://localhost:8080/PruebaDBConsola/Controller?ACTION=ESTABLISHMENT.FIND_ALL";
const apiPaymentUrl = "http://localhost:8080/PruebaDBConsola/Controller?ACTION=PAYMENTMETHOD.FIND_ALL";

document.addEventListener('DOMContentLoaded', async function() {
    // Cargar métodos de pago desde la API
    try {
        const response = await fetch(apiPaymentUrl);
        if (!response.ok) {
            throw new Error('Error al cargar los métodos de pago');
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
        console.error('Error al cargar los métodos de pago:', error);
    }
    
    // Obtener el carrito del localStorage
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    
    // Si el carrito está vacío, redirigir al inicio
    if (cart.length === 0) {
        alert('El carrito está vacío');
        window.location.href = 'index.html';
        return;
    }
    
    // Función para renderizar el carrito
    function renderCart() {
        const productList = document.querySelector('.product-list');
        if (!productList) return;

        productList.innerHTML = '';
        
        cart.forEach(item => {
            productList.innerHTML += `
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
                    <span>Total productos:</span>
                    <span id="subtotal">$${subtotal.toFixed(2)}</span>
                </div>
                <div class="total-row">
                    <span>IVA (16%):</span>
                    <span id="iva">$${iva.toFixed(2)}</span>
                </div>
                <div class="total-row">
                    <span>Total a pagar:</span>
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
    document.querySelector('.buying_details_card').addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Verificar que se haya seleccionado un establecimiento
        const selectedEstablishment = localStorage.getItem('selectedEstablishment');
        if (!selectedEstablishment) {
            alert('Por favor selecciona un establecimiento');
            return;
        }
        
        // Verificar que se haya seleccionado un método de pago
        const selectedPayment = document.querySelector('.payment-option.selected');
        if (!selectedPayment) {
            alert('Por favor selecciona un método de pago');
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

    const pickupBtn = document.getElementById('pickup-btn');
    const deliveryBtn = document.getElementById('delivery-btn');

    pickupBtn.addEventListener('click', function() {
        pickupBtn.classList.add('active');
        deliveryBtn.classList.remove('active');
        // Aquí puedes guardar la opción seleccionada en una variable o en localStorage
    });

    deliveryBtn.addEventListener('click', function() {
        deliveryBtn.classList.add('active');
        pickupBtn.classList.remove('active');
        // Aquí puedes guardar la opción seleccionada en una variable o en localStorage
    });
}); 