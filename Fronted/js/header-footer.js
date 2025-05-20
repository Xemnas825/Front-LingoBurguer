const apiUrl = 'http://52.44.178.183:8080/Controller?ACTION=ESTABLISHMENT.FIND_ALL';

document.addEventListener('DOMContentLoaded', function () {
    // We select the elements using the updated IDs
    const menuToggle = document.getElementById('menu-toggle');
    const sidebar = document.getElementById('sidebar');
    const closeSidebar = document.getElementById('close-sidebar');
    const overlay = document.getElementById('overlay');
    const cartIcon = document.getElementById('cart-icon');
    const userIcon = document.getElementById('user-icon');
    const DOM_ELEMENTS = {
        footerLocations: document.querySelector('.footer-locations')
    };
    const sidebarLinks = sidebar.querySelectorAll('a');

    // Comprobamos que los elementos existen antes de añadir escuchadores de eventos
    if (menuToggle) {
        menuToggle.addEventListener('click', function () {
            sidebar.classList.add('active');
            if (overlay) overlay.classList.add('active');
            console.log('Menu opened');
        });
    } else {
        console.error('The menu-toggle element was not found');
    }

    // Función para cerrar el menú lateral
    function closeSidebarMenu() {
        sidebar.classList.remove('active');
        if (overlay) overlay.classList.remove('active');
        console.log('Menu closed');
    }

    if (closeSidebar) {
        closeSidebar.addEventListener('click', closeSidebarMenu);
    } else {
        console.error('The close-sidebar element was not found');
    }

    // Mantener solo el escuchador de eventos para el icono de usuario
    if (userIcon) {
        userIcon.addEventListener('click', function () {
            // Verificar si estamos en la página de userDetail
            if (window.location.pathname.includes('userDetail.html')) {
                // Si estamos en userDetail, redirigir al index
                window.location.href = 'index.html';
            } else {
                // Verificar si el usuario está logueado
                const userData = sessionStorage.getItem('userData');
                if (userData) {
                    // Si está logueado, ir a userDetail
                    window.location.href = 'userDetail.html';
                } else {
                    // Si no está logueado, ir a login
                    window.location.href = 'login.html';
                }
            }
        });
    }

    // Escuchadores de eventos para los enlaces del menú
    sidebarLinks.forEach(link => {
        link.addEventListener('click', function (e) {
            closeSidebarMenu();

            // Si el enlace tiene un hash (anclaje)
            if (this.hash) {
                // Si estamos en la misma página
                if (window.location.pathname.endsWith('index.html')) {
                    e.preventDefault();
                    const targetElement = document.querySelector(this.hash);
                    if (targetElement) {
                        window.scrollTo({
                            top: targetElement.offsetTop - 80,
                            behavior: 'smooth'
                        });
                    }
                }
            }
        });
    });

    //Establishments Footer
    async function loadEstablishments() {
        try {
            // Comprobar si el elemento existe
            if (!DOM_ELEMENTS.footerLocations) {
                console.log('The footer-locations element does not exist on this page');
                return;
            }

            // Realizar la llamada fetch a la URL
            const response = await fetch(`${apiUrl}`);
            if (!response.ok) {
                throw new Error('The branches could not be loaded');
            }

            const data = await response.json();
            DOM_ELEMENTS.footerLocations.innerHTML = '';

            for (let establishment of data) {
                createEstablishmentCard(establishment);
            }
        } catch (error) {
            console.error('Error loading establishments:', error);

            // Comprobar si el elemento existe antes de mostrar el error
            if (DOM_ELEMENTS.footerLocations) {
                DOM_ELEMENTS.footerLocations.innerHTML =
                    '<p>The branches could not be loaded</p>';
            }
        }
    }

    function createEstablishmentCard(establishment) {
        // Comprobar si el elemento existe
        if (!DOM_ELEMENTS.footerLocations) {
            console.log('The footer-locations element does not exist on this page');
            return;
        }

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
    }

    document.addEventListener('DOMContentLoaded', () => {
        loadEstablishments();
    });

    loadEstablishments();
});
