const apiEstUrl = "http://52.44.178.183:8080/Controller?ACTION=ESTABLISHMENT.FIND_ALL";
const apiPaymentUrl = "http://52.44.178.183:8080/Controller?ACTION=PAYMENTMETHOD.FIND_ALL";
const apiOrderTypeUrl = "http://52.44.178.183:8080/Controller?ACTION=ORDER.FIND_ALL";

document.addEventListener('DOMContentLoaded', async function() {
    // Configuración de tipos de pedido fijos
    const orderTypes = [
        { name: 'LOCAL', value: 'local', icon: 'fa-store' },
        { name: 'TAKE AWAY', value: 'take_away', icon: 'fa-shopping-bag' }
    ];
    
    // Actualizar el contenedor de tipos de pedido
    const orderTypeContainer = document.querySelector('.order-type-options');
    if (orderTypeContainer) {
        orderTypeContainer.innerHTML = '';  // Limpiar contenedor
        
        orderTypes.forEach(type => {
            const div = document.createElement('div');
            div.className = 'order-type-option';
            div.setAttribute('data-type', type.value);
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
                localStorage.setItem('selectedOrderType', type.value);
            });
            
            orderTypeContainer.appendChild(div);
        });
    }

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
    const form = document.querySelector('.buying_details_card');
    console.log('Formulario encontrado:', form); // Debug log

    if (!form) {
        console.error('No se encontró el formulario .buying_details_card');
    } else {
        form.addEventListener('submit', async function(e) {
            console.log('Formulario enviado'); // Debug log
            e.preventDefault();
            
            // Check if establishment is selected
            const selectedEstablishment = localStorage.getItem('selectedEstablishment');
            console.log('Establecimiento seleccionado:', selectedEstablishment); // Debug log
            if (!selectedEstablishment) {
                alert('Please select an establishment');
                return;
            }
            
            // Check if payment method is selected
            const selectedPayment = document.querySelector('.payment-option.selected');
            console.log('Método de pago seleccionado:', selectedPayment?.dataset.id); // Debug log
            if (!selectedPayment) {
                alert('Please select a payment method');
                return;
            }

            // Check if order type is selected
            const selectedOrderType = document.querySelector('.order-type-option.selected');
            console.log('Tipo de orden seleccionado:', selectedOrderType?.dataset.type); // Debug log
            if (!selectedOrderType) {
                alert('Please select an order type');
                return;
            }

            // Get user data from sessionStorage
            const userData = JSON.parse(sessionStorage.getItem('userData'));
            console.log('Datos del usuario:', userData); // Debug log
            if (!userData) {
                alert('Please log in to complete your order');
                window.location.href = 'login.html';
                return;
            }

            try {
                // Crear la orden principal primero
                const orderParams = new URLSearchParams();
                
                // Debug logs para verificar los valores
                console.log('Tipo de orden seleccionado:', selectedOrderType);
                console.log('Dataset type:', selectedOrderType.dataset.type);
                
                // Usar el valor en minúsculas
                const orderStatus = selectedOrderType.dataset.type.toLowerCase();
                console.log('Status final que se enviará:', orderStatus);

                // Calcular el total del carrito
                const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
                const iva = subtotal * 0.16;
                const total = subtotal + iva;
                console.log('Total calculado:', total);
                
                // Construir los parámetros incluyendo el total_price
                orderParams.append('status', orderStatus);
                orderParams.append('establishment_id2', selectedEstablishment);
                orderParams.append('client_id1', userData.m_iId || userData.id);
                orderParams.append('payment_method_id1', selectedPayment.dataset.id);
                orderParams.append('total_price', total);

                const orderUrl = 'http://52.44.178.183:8080/Controller?ACTION=ORDER.ADD';
                const fullOrderUrl = `${orderUrl}&${orderParams.toString()}`;
                console.log('URL completa de la orden:', fullOrderUrl);
                console.log('Parámetros de la orden:', Object.fromEntries(orderParams.entries()));

                // Crear la orden principal
                console.log('Enviando petición ORDER.ADD...');
                const orderResponse = await fetch(orderUrl, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                    },
                    body: orderParams
                });

                console.log('Respuesta recibida:', orderResponse.status);
                const orderResponseText = await orderResponse.text();
                console.log('Respuesta texto de la orden:', orderResponseText);

                if (!orderResponse.ok) {
                    console.error('Error del servidor:', orderResponseText);
                    throw new Error(`Error al crear la orden: ${orderResponseText}`);
                }

                // Esperar a que la orden se cree completamente
                console.log('Esperando 1 segundo para asegurar la creación de la orden...');
                await new Promise(resolve => setTimeout(resolve, 1000));

                // Verificar que la orden existe
                console.log('Verificando la creación de la orden...');
                const verifyOrderResponse = await fetch(`http://52.44.178.183:8080/Controller?ACTION=ORDER.FIND_ALL`);
                const verifiedOrders = await verifyOrderResponse.json();
                console.log('Órdenes encontradas:', verifiedOrders);

                // Ordenar por ID descendente y tomar la primera (la más reciente)
                const sortedOrders = verifiedOrders.sort((a, b) => b.m_iId - a.m_iId);
                const createdOrder = sortedOrders[0];
                console.log('Orden más reciente:', createdOrder);

                if (!createdOrder) {
                    console.error('No se encontró la orden creada');
                    throw new Error('No se pudo verificar la creación de la orden');
                }

                const orderId = createdOrder.m_iId;
                console.log('ID de la orden verificada:', orderId);

                alert('¡Pedido realizado con éxito!');
                // Limpiar el carrito y datos de selección
                localStorage.removeItem('cart');
                localStorage.removeItem('selectedEstablishment');
                localStorage.removeItem('selectedOrderType');
                // Redirigir al inicio
                window.location.href = 'index.html';
            } catch (error) {
                console.error('Error al procesar el pedido:', error);
                alert('Error al procesar el pedido. Por favor, inténtalo de nuevo.');
            }
        });
    }
}); 