const apiUrl = 'http://localhost:8080/PruebaDBConsola/Controller?ACTION=ESTABLISHMENT.FIND_ALL';

document.addEventListener('DOMContentLoaded', function () {
    // Seleccionamos los elementos usando los IDs actualizados
    const menuToggle = document.getElementById('menu-toggle');
    const sidebar = document.getElementById('sidebar');
    const closeSidebar = document.getElementById('close-sidebar');
    const overlay = document.getElementById('overlay');
    const cartIcon = document.getElementById('cart-icon');
    const userIcon = document.getElementById('user-icon');
    const DOM_ELEMENTS = {
        footerLocations: document.querySelector('.footer-locations')
    };


    // Verificamos que los elementos existan antes de agregar event listeners
    if (menuToggle) {
        menuToggle.addEventListener('click', function () {
            sidebar.classList.add('active');
            overlay.classList.add('active');
            console.log('Menú abierto'); // Para depuración
        });
    } else {
        console.error('El elemento menu-toggle no fue encontrado');
    }

    // Función para cerrar el menú lateral
    function closeSidebarMenu() {
        sidebar.classList.remove('active');
        console.log('Menú cerrado'); // Para depuración
    }

    if (closeSidebar) {
        closeSidebar.addEventListener('click', closeSidebarMenu);
    } else {
        console.error('El elemento close-sidebar no fue encontrado');
    }


    // Funciones básicas para los otros iconos (para demostración)
    if (cartIcon) {
        cartIcon.addEventListener('click', function () {
            alert('Has hecho clic en el carrito de compras');
        });
    }

    if (userIcon) {
        userIcon.addEventListener('click', function () {
            alert('Has hecho clic en el icono de usuario');
        });
    }

    //Etsablecimientos Footer
    async function loadEstablishments() {
        try {
            // Realizar la llamada fetch a la URL
            const response = await fetch(`${apiUrl}`);
            if (!response.ok) {
                throw new Error('No se pudieron cargar los establecimientos');
            }

            const data = await response.json();
            DOM_ELEMENTS.footerLocations.innerHTML = '';

            for (let establishment of data) {
                createEstablishmentCard(establishment);
            }
        } catch (error) {
            console.error('Error al cargar establecimientos:', error);

            // Usar la constante para mostrar el error
            DOM_ELEMENTS.footerLocations.innerHTML =
                '<p>No se pudieron cargar los establecimientos</p>';
        }
    }


    function createEstablishmentCard(establishment) {
            const ubicationElement = document.createElement('div');
            ubicationElement.classList.add('footer-locations-pack');
            ubicationElement.innerHTML = `
            <div class="footer-name-location">
                <h3>${establishment.m_strName}</h3>
                <p>${establishment.m_strAddress}
                    <br>${establishment.m_strTelephone}
                </p>
            </div>`;
            DOM_ELEMENTS.footerLocations.appendChild(ubicationElement);
        //})
    }

    document.addEventListener('DOMContentLoaded', () => {
        loadEstablishments();
    });
loadEstablishments();

});
