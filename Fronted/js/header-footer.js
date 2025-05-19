const apiUrl = 'http://localhost:8080/PruebaDBConsola/Controller?ACTION=ESTABLISHMENT.FIND_ALL';

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

    // We check that the elements exist before adding event listeners
    if (menuToggle) {
        menuToggle.addEventListener('click', function () {
            sidebar.classList.add('active');
            if (overlay) overlay.classList.add('active');
            console.log('Menu opened'); // For debugging
        });
    } else {
        console.error('The menu-toggle element was not found');
    }

    // Function to close the sidebar menu
    function closeSidebarMenu() {
        sidebar.classList.remove('active');
        if (overlay) overlay.classList.remove('active');
        console.log('Menu closed'); // For debugging
    }

    if (closeSidebar) {
        closeSidebar.addEventListener('click', closeSidebarMenu);
    } else {
        console.error('The close-sidebar element was not found');
    }

    // Only keep the event listener for the user icon
    if (userIcon) {
        userIcon.addEventListener('click', function () {
            alert('You have clicked on the user icon');
        });
    }

    // Event listeners for the menu links
    sidebarLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            closeSidebarMenu(); // Close the menu

            // If the link has a hash (anchor)
            if (this.hash) {
                // If we are on the same page
                if (window.location.pathname.endsWith('index.html')) {
                    e.preventDefault();
                    const targetElement = document.querySelector(this.hash);
                    if (targetElement) {
                        window.scrollTo({
                            top: targetElement.offsetTop - 80, // Offset for the header
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
            // Verificar si el elemento existe
            if (!DOM_ELEMENTS.footerLocations) {
                console.log('El elemento footer-locations no existe en esta página');
                return;
            }

            // Perform the fetch call to the URL
            const response = await fetch(`${apiUrl}`);
            if (!response.ok) {
                throw new Error('The establishments could not be loaded');
            }

            const data = await response.json();
            DOM_ELEMENTS.footerLocations.innerHTML = '';

            for (let establishment of data) {
                createEstablishmentCard(establishment);
            }
        } catch (error) {
            console.error('Error loading establishments:', error);

            // Verificar si el elemento existe antes de mostrar el error
            if (DOM_ELEMENTS.footerLocations) {
                DOM_ELEMENTS.footerLocations.innerHTML =
                    '<p>The establishments could not be loaded</p>';
            }
        }
    }

    function createEstablishmentCard(establishment) {
        // Verificar si el elemento existe
        if (!DOM_ELEMENTS.footerLocations) {
            console.log('El elemento footer-locations no existe en esta página');
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
