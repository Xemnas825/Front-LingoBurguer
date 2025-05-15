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
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const productList = document.querySelector('.product-list');
    
    // Limpiar la lista de productos
    productList.innerHTML = '';
    
    let total = 0;
    
    // Renderizar cada producto del carrito
    cart.forEach(item => {
        total += item.price * item.quantity;
        
        productList.innerHTML += `
            <div class="product-item" data-id="${item.id}">
                <div class="product-info">
                    <img src="../images/${item.image || 'default-burger.jpg'}" alt="${item.name}" class="product-image">
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
    
    // Agregar los event listeners para los botones
    productList.addEventListener('click', function(e) {
        const productItem = e.target.closest('.product-item');
        if (!productItem) return;
        
        const itemId = productItem.dataset.id;
        const itemIndex = cart.findIndex(item => item.id === itemId);
        
        if (itemIndex === -1) return;
        
        if (e.target.classList.contains('increase') || e.target.closest('.increase')) {
            cart[itemIndex].quantity += 1;
        } else if (e.target.classList.contains('decrease') || e.target.closest('.decrease')) {
            cart[itemIndex].quantity -= 1;
            if (cart[itemIndex].quantity <= 0) {
                cart.splice(itemIndex, 1);
            }
        } else if (e.target.classList.contains('fa-trash') || e.target.closest('.remove-item')) {
            cart.splice(itemIndex, 1);
        }
        
        // Actualizar localStorage
        localStorage.setItem('cart', JSON.stringify(cart));
        
        // Recalcular totales y actualizar UI
        updateProductList();
    });
    
    // Función para actualizar la lista de productos y totales
    function updateProductList() {
        productList.innerHTML = '';
        
        let total = 0;
        
        cart.forEach(item => {
            total += item.price * item.quantity;
            
            productList.innerHTML += `
                <div class="product-item" data-id="${item.id}">
                    <div class="product-info">
                        <img src="../images/${item.image || 'default-burger.jpg'}" alt="${item.name}" class="product-image">
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
        
        // Si el carrito está vacío, mostrar mensaje y redirigir
        if (cart.length === 0) {
            alert('El carrito está vacío');
            window.location.href = 'index.html';
            return;
        }
        
        // Calcular y actualizar totales
        const iva = total * 0.16;
        const totalConIva = total + iva;
        
        document.querySelector('.total-section').innerHTML = `
            <div class="total-row">
                <span>Total productos:</span>
                <span>$${total.toFixed(2)}</span>
            </div>
            <div class="total-row">
                <span>IVA (16%):</span>
                <span>$${iva.toFixed(2)}</span>
            </div>
            <div class="total-row">
                <span>Total a pagar:</span>
                <span class="total-amount">$${totalConIva.toFixed(2)}</span>
            </div>
        `;
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
}); 