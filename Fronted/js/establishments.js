const API_URL = 'http://localhost:8080/PruebaDBConsola/Controller';

class EstablishmentManager {
    constructor() {
        this.loadEstablishments();
    }

    async loadEstablishments() {
        try {
            const response = await fetch(`${API_URL}?ACTION=ESTABLISHMENT.FIND_ALL`);
            if (!response.ok) {
                throw new Error('Error al cargar los establecimientos');
            }
            const establishments = await response.json();
            this.displayEstablishments(establishments);
        } catch (error) {
            console.error('Error:', error);
            this.showError('No se pudieron cargar los establecimientos');
        }
    }

    displayEstablishments(establishments) {
        const container = document.querySelector('.establishment-options');
        if (!container) return;

        container.innerHTML = establishments.map(establishment => `
            <div class="establishment-option" onclick="establishmentManager.selectEstablishment(this, '${establishment.m_iId}')">
                <div class="establishment-info">
                    <div class="establishment-icon">
                        <i class="fas fa-store"></i>
                    </div>
                    <div class="establishment-details">
                        <div class="establishment-name">${establishment.m_strName}</div>
                        <div class="establishment-address">${establishment.m_strAddress}</div>
                    </div>
                </div>
            </div>
        `).join('');

        // Restaurar la selección previa si existe
        const selectedId = localStorage.getItem('selectedEstablishment');
        if (selectedId) {
            const option = document.querySelector(`.establishment-option[onclick*="${selectedId}"]`);
            if (option) {
                option.classList.add('selected');
            }
        }
    }

    selectEstablishment(element, id) {
        // Remover la selección previa
        document.querySelectorAll('.establishment-option').forEach(option => {
            option.classList.remove('selected');
        });
        
        // Agregar la clase selected al elemento clickeado
        element.classList.add('selected');
        
        // Guardar la selección en localStorage
        localStorage.setItem('selectedEstablishment', id);
        
        // Opcional: Habilitar el botón de confirmar compra solo si hay un establecimiento seleccionado
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
                    <button onclick="establishmentManager.loadEstablishments()">Reintentar</button>
                </div>
            `;
        }
    }
}

// Inicializar cuando el DOM esté listo
let establishmentManager;
document.addEventListener('DOMContentLoaded', () => {
    establishmentManager = new EstablishmentManager();
});