const API_URL = 'http://localhost:8080/PruebaDBConsola/Controller';

class EstablishmentManager {
    constructor() {
        this.init();
    }

    async init() {
        try {
            await this.loadEstablishments();
        } catch (error) {
            console.error('Error al inicializar EstablishmentManager:', error);
        }
    }

    async loadEstablishments() {
        try {
            const response = await fetch(`${API_URL}?ACTION=ESTABLISHMENT.FIND_ALL`);
            if (!response.ok) {
                throw new Error(`Error HTTP: ${response.status}`);
            }
            const establishments = await response.json();
            if (!Array.isArray(establishments)) {
                throw new Error('La respuesta no es un array de establecimientos');
            }
            this.displayEstablishments(establishments);
        } catch (error) {
            console.error('Error al cargar establecimientos:', error);
            this.showError('No se pudieron cargar los establecimientos. Por favor, intente de nuevo más tarde.');
        }
    }

    displayEstablishments(establishments) {
        const container = document.querySelector('.establishment-options');
        if (!container) {
            console.error('No se encontró el contenedor de establecimientos');
            return;
        }

        if (establishments.length === 0) {
            container.innerHTML = `
                <div class="error-message">
                    <i class="fas fa-info-circle"></i>
                    <p>No hay establecimientos disponibles en este momento.</p>
                </div>
            `;
            return;
        }

        container.innerHTML = establishments.map(establishment => `
            <div class="establishment-option" data-id="${establishment.m_iId}">
                <div class="establishment-info">
                    <div class="establishment-icon">
                        <i class="fas fa-store"></i>
                    </div>
                    <div class="establishment-details">
                        <div class="establishment-name">${establishment.m_strName || 'Sin nombre'}</div>
                        <div class="establishment-address">${establishment.m_strAddress || 'Dirección no disponible'}</div>
                    </div>
                </div>
            </div>
        `).join('');

        // Agregar event listeners a las opciones
        container.querySelectorAll('.establishment-option').forEach(option => {
            option.addEventListener('click', () => {
                this.selectEstablishment(option, option.dataset.id);
            });
        });

        // Restaurar la selección previa si existe
        const selectedId = localStorage.getItem('selectedEstablishment');
        if (selectedId) {
            const option = container.querySelector(`.establishment-option[data-id="${selectedId}"]`);
            if (option) {
                option.classList.add('selected');
            }
        }
    }

    selectEstablishment(element, id) {
        document.querySelectorAll('.establishment-option').forEach(option => {
            option.classList.remove('selected');
        });
        
        element.classList.add('selected');
        localStorage.setItem('selectedEstablishment', id);
        
        const confirmButton = document.querySelector('.confirm-button');
        if (confirmButton) {
            confirmButton.disabled = false;
        }
    }

    showError(message) {
        const container = document.querySelector('.establishment-options');
        if (container) {
            container.innerHTML = `
                <div class="error-message">
                    <i class="fas fa-exclamation-circle"></i>
                    <p>${message}</p>
                    <button class="retry-button">Reintentar</button>
                </div>
            `;

            const retryButton = container.querySelector('.retry-button');
            if (retryButton) {
                retryButton.addEventListener('click', () => this.loadEstablishments());
            }
        }
    }
}

// Exportar la clase para que pueda ser usada pors otros módulos
window.EstablishmentManager = EstablishmentManager;

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    window.establishmentManager = new EstablishmentManager();
});