const apiJobOfferUrl = 'http://52.44.178.183:8080/Controller?ACTION=JOBOFFER.FIND_ALL';

document.addEventListener('DOMContentLoaded', function () {
    // Definimos los elementos DOM que vamos a usar
    const DOM_ELEMENTS = {
        title: document.getElementById("title"),
        description: document.getElementById("description"),
        salary: document.getElementById("salary"),
        journal: document.getElementById("journal"),
        details1: document.getElementById("details1"),
        details2: document.getElementById("details2"),
        details3: document.getElementById("details3"),
        applyButton: document.getElementById("apply-btn"),
        candidateForm: document.getElementById("candidateForm"),
        successMessage: document.getElementById("successMessage")
    };
    
    // Verificamos que los elementos esenciales existan
    if (!DOM_ELEMENTS.title) {
        console.error('Element title not found');
    }

    // Crear y añadir el overlay
    const overlay = document.createElement('div');
    overlay.className = 'overlay';
    document.body.appendChild(overlay);

    // Crear y añadir el botón de cerrar
    const closeButton = document.createElement('button');
    closeButton.className = 'close-form';
    closeButton.innerHTML = '×';
    if (DOM_ELEMENTS.candidateForm) {
        DOM_ELEMENTS.candidateForm.appendChild(closeButton);
    }

    // Función para mostrar el formulario
    function showForm() {
        if (DOM_ELEMENTS.candidateForm && overlay) {
            overlay.classList.add('show');
            DOM_ELEMENTS.candidateForm.style.display = 'block';
            DOM_ELEMENTS.candidateForm.classList.add('show');
            document.body.style.overflow = 'hidden';
        }
    }

    // Función para ocultar el formulario
    function hideForm() {
        if (DOM_ELEMENTS.candidateForm && overlay) {
            overlay.classList.remove('show');
            DOM_ELEMENTS.candidateForm.classList.remove('show');
            DOM_ELEMENTS.candidateForm.style.display = 'none';
            document.body.style.overflow = '';
            if (DOM_ELEMENTS.successMessage) {
                DOM_ELEMENTS.successMessage.style.display = 'none';
            }
        }
    }

    // Event listeners
    if (DOM_ELEMENTS.applyButton) {
        DOM_ELEMENTS.applyButton.addEventListener('click', function(e) {
            e.preventDefault();
            console.log('Apply button clicked'); // Debug
            showForm();
        });
    }

    closeButton.addEventListener('click', function(e) {
        e.preventDefault();
        hideForm();
    });

    overlay.addEventListener('click', function(e) {
        e.preventDefault();
        hideForm();
    });

    // Prevenir que clicks dentro del formulario cierren el overlay
    if (DOM_ELEMENTS.candidateForm) {
        DOM_ELEMENTS.candidateForm.addEventListener('click', function(e) {
            e.stopPropagation();
        });

        // Manejo de envío de formularios
        DOM_ELEMENTS.candidateForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const submitButton = this.querySelector('button[type="submit"]');
            if (submitButton) {
                submitButton.disabled = true;
                submitButton.innerHTML = 'Sending...';

                // Simulamos una petición al servidor
                setTimeout(() => {
                    submitButton.disabled = false;
                    submitButton.innerHTML = 'Apply';
                    
                    // Mostrar mensaje de éxito
                    if (DOM_ELEMENTS.successMessage) {
                        DOM_ELEMENTS.successMessage.classList.add('show');
                        DOM_ELEMENTS.successMessage.style.display = 'flex';
                    }

                    // Limpiar el formulario
                    this.reset();

                    // Ocultar el mensaje y el formulario después de 3 segundos
                    setTimeout(() => {
                        hideForm();
                    }, 3000);
                }, 1500);
            }
        });
    }

    // Iniciar la carga de datos
    fetchJobOffer();

    async function fetchJobOffer() {
        
        try {
            const response = await fetch(apiJobOfferUrl);

            if (!response.ok) {
                throw new Error(`API returned status: ${response.status}`);
            }

            const data = await response.json();

            const jobOffer = Array.isArray(data) ? data[0] : data;

            updateJobDisplay(jobOffer);
        } catch (error) {
            console.error("Error fetching job data:", error);

            updateJobDisplay(fallbackJobData);
        } finally {
            if (DOM_ELEMENTS.title) {
                DOM_ELEMENTS.title.classList.remove("loading");
            }
        }
    }

    function updateJobDisplay(data) {
        // Formato de fechas
        const pubDate = formatDate(data.m_dPublicationDate);
        const endDate = formatDate(data.m_dEndDate);

        // Actualizar elementos de la UI
        if (DOM_ELEMENTS.title) DOM_ELEMENTS.title.innerText = data.m_strTitle || "No title";
        if (DOM_ELEMENTS.description) DOM_ELEMENTS.description.innerText = data.m_strDescription || "No description";
        if (DOM_ELEMENTS.salary) DOM_ELEMENTS.salary.innerText = `💰 $${data.m_dblMinSalary || 0} - $${data.m_dblMaxSalary || 0} per month`;
        if (DOM_ELEMENTS.journal) DOM_ELEMENTS.journal.innerText = `🕒 Job type: ${data.journal || "No specified"}`;
        if (DOM_ELEMENTS.details1) DOM_ELEMENTS.details1.innerText = `📅 Published: ${pubDate} | Ends: ${endDate}`;
        if (DOM_ELEMENTS.details2) DOM_ELEMENTS.details2.innerText = `📌 Experience: ${data.m_strExperienceRequired || "No specified"}`;
        if (DOM_ELEMENTS.details3) DOM_ELEMENTS.details3.innerText = `🎓 Requirements: ${data.m_strEducationRequired || "No specified"}`;
    }

    function formatDate(dateString) {
        // Formato de fecha simple en caso de que las fechas vengan en diferentes formatos
        if (!dateString) return "N/A";

        // Intentar analizar la fecha - si falla, devolver la cadena original
        try {
            // Verificar si la fecha está en formato DD-MM-YYYY
            if (dateString.includes('-')) {
                const parts = dateString.split('-');
                if (parts.length === 3) {
                    return dateString; // Ya está en formato DD-MM-YYYY
                }
            }

            // Si está en otro formato, convertir a DD-MM-YYYY
            const date = new Date(dateString);
            if (isNaN(date)) return dateString;

            return `${String(date.getDate()).padStart(2, '0')}-${String(date.getMonth() + 1).padStart(2, '0')}-${date.getFullYear()}`;
        } catch (e) {
            return dateString;
        }
    }
});
