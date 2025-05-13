const apiJobOfferUrl = 'http://localhost:8080/PruebaDBConsola/Controller?ACTION=JOBOFFER.FIND_ALL';

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
    };
    

    // Verificamos que los elementos esenciales existan
    if (!DOM_ELEMENTS.title) {
        console.error('Elemento title no encontrado');
    }

    // Iniciar la carga de datos
    fetchJobOffer();

    async function fetchJobOffer() {
        // Mostrar estado de carga
        // if (DOM_ELEMENTS.title) {
        //     DOM_ELEMENTS.title.classList.add("loading");
        // }

        try {
            // Intentar obtener datos de la API
            const response = await fetch(apiJobOfferUrl);

            // Verificar si la respuesta es exitosa
            if (!response.ok) {
                throw new Error(`API returned status: ${response.status}`);
            }

            // Analizar datos JSON
            const data = await response.json();

            // Si data es un array, tomamos el primer elemento (asumiendo que es una lista de ofertas)
            const jobOffer = Array.isArray(data) ? data[0] : data;

            // Actualizar la UI con los datos del trabajo
            updateJobDisplay(jobOffer);
        } catch (error) {
            console.error("Error fetching job data:", error);

            updateJobDisplay(fallbackJobData);
        } finally {
            // Eliminar estado de carga
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
        if (DOM_ELEMENTS.title) DOM_ELEMENTS.title.innerText = data.m_strTitle || "Sin título";
        if (DOM_ELEMENTS.description) DOM_ELEMENTS.description.innerText = data.m_strDescription || "Sin descripción";
        if (DOM_ELEMENTS.salary) DOM_ELEMENTS.salary.innerText = `💰 $${data.m_dblMinSalary || 0} - $${data.m_dblMaxSalary || 0} por mes`;
        if (DOM_ELEMENTS.journal) DOM_ELEMENTS.journal.innerText = `🕒 Tipo de trabajo: ${data.journal || "No especificado"}`;
        if (DOM_ELEMENTS.details1) DOM_ELEMENTS.details1.innerText = `📅 Publicado: ${pubDate} | Finaliza: ${endDate}`;
        if (DOM_ELEMENTS.details2) DOM_ELEMENTS.details2.innerText = `📌 Experiencia: ${data.m_strExperienceRequired || "No especificada"}`;
        if (DOM_ELEMENTS.details3) DOM_ELEMENTS.details3.innerText = `🎓 Requisitos: ${data.m_strEducationRequired || "No especificados"}`;
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

    function showForm(formToShow) {
        // Ocultar todos los formularios
        candidateForm.style.display = 'none';
        
        // Mostrar el formulario seleccionado
        formToShow.style.display = 'block';
    }

    // Evento para cambiar al formulario de registro
    applyButton.addEventListener('click', function(e) {
        e.preventDefault();
        showForm(candidateForm);
    });

    // Manejo de envío de formularios
    candidateForm.addEventListener('submit', function(e) {
        e.preventDefault();
        // Aquí iría tu lógica para procesar el login
        console.log('Login submitted');
        // loginEmail y loginPassword tienen los datos
    });
   

});
