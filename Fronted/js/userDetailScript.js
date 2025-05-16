document.addEventListener('DOMContentLoaded', function() {
    // Verificar si el usuario está autenticado
    let userRole = sessionStorage.getItem('userRole');
    let userData = JSON.parse(sessionStorage.getItem('userData'));

    // URLs del API
    const apiUrlADDEmployee = 'http://localhost:8080/PruebaDBConsola/Controller?ACTION=EMPLOYEE.ADD';
    const apiUrlGetEmployees = 'http://localhost:8080/PruebaDBConsola/Controller?ACTION=EMPLOYEE.FIND_ALL';
    const apiUrlDeleteEmployee = 'http://localhost:8080/PruebaDBConsola/Controller?ACTION=EMPLOYEE.DELETE';
    const apiUrlUpdateEmployee = 'http://localhost:8080/PruebaDBConsola/Controller?ACTION=EMPLOYEE.UPDATE';
    const apiUrlGetJobs = 'http://localhost:8080/PruebaDBConsola/Controller?ACTION=JOB.FIND_ALL';
    const apiUrlGetEstablishments = 'http://localhost:8080/PruebaDBConsola/Controller?ACTION=ESTABLISHMENT.FIND_ALL';
    const apiUrlADDProduct = 'http://localhost:8080/PruebaDBConsola/Controller?ACTION=PRODUCT.ADD';

    let jobs = {};
    let establishments = {};

    let editingEmployeeId = null; // Para mantener el ID del empleado que se está editando

    // TEMPORAL: Si no hay datos en sessionStorage, usar datos de prueba
    if (!userRole || !userData) {
        userRole = 'employee'; // o 'client' para probar diferentes roles
        userData = {
            m_strFirstName: 'John',
            m_strLastName: 'Doe',
            m_strEmail: 'john.doe@example.com'
        };
        // En producción, descomentar esta redirección:
        // window.location.href = 'login.html';
        // return;
    }

    // Elementos del DOM
    const editBtn = document.getElementById('edit-info-btn');
    const orderPannel = document.getElementById('orders-pannel');
    const personalPannel = document.getElementById('persInfoPannel');
    const employeesPanel = document.getElementById('employees-panel');
    const productsPanel = document.getElementById('products-panel');
    const cancelBtn = document.getElementById('cancel-btn');
    const form = document.getElementById('personal-info-form');
    const formInputs = form.querySelectorAll('input, textarea, select');
    const formButtons = form.querySelector('.form-buttons');
    
    // Botones del menú lateral
    const persInfoBtn = document.getElementById('persInfoBtn').closest('a');
    const ordersBtn = document.getElementById('ordersBtn').closest('a');
    const employeesBtn = document.getElementById('employeesBtn').closest('a');
    const productsBtn = document.getElementById('productsBtn').closest('a');
    
    // Formularios de empleados y productos
    const employeeForm = document.getElementById('employee-form');
    const productForm = document.getElementById('product-form');
    const addEmployeeBtn = document.getElementById('add-employee-btn');
    const addProductBtn = document.getElementById('add-product-btn');
    const cancelEmployeeBtn = document.getElementById('cancel-employee-btn');
    const cancelProductBtn = document.getElementById('cancel-product-btn');

    // Cargar datos del usuario
    document.querySelector('.user-name').textContent = userData.m_strFirstName + ' ' + userData.m_strLastName;
    document.querySelector('.user-email').textContent = userData.m_strEmail;

    // Configurar visibilidad según el rol
    const adminSection = document.querySelector('.nav-menu h3:nth-of-type(2)');
    const adminLinks = adminSection?.nextElementSibling;

    if (userRole === 'client') {
        // Ocultar sección de administración para clientes
        if (adminSection) adminSection.style.display = 'none';
        if (adminLinks) adminLinks.style.display = 'none';
    }
    
    // Función para cambiar entre paneles
    function showPanel(panelToShow) {
        // Oculta todos los paneles
        personalPannel.style.display = 'none';
        orderPannel.style.display = 'none';
        if (userRole === 'employee') {
            employeesPanel.style.display = 'none';
            productsPanel.style.display = 'none';
        }
        
        // Muestra solo el panel seleccionado
        switch(panelToShow) {
            case 'personal':
                personalPannel.style.display = 'block';
                break;
            case 'orders':
                orderPannel.style.display = 'block';
                break;
            case 'employees':
                if (userRole === 'employee') {
                    employeesPanel.style.display = 'block';
                    console.log('Cargando panel de empleados...');
                    
                    // Primero cargar los jobs
                    loadJobs().then(() => {
                        console.log('Jobs cargados, cargando establecimientos...');
                        return loadEstablishments();
                    }).then(() => {
                        console.log('Establecimientos cargados, cargando lista de empleados...');
                        loadEmployeesList();
                    }).catch(error => {
                        console.error('Error en la secuencia de carga:', error);
                    });
                }
                break;
            case 'products':
                if (userRole === 'employee') {
                    productsPanel.style.display = 'block';
                }
                break;
        }
    }

    // Función para actualizar el menú activo
    function updateActiveMenu(clickedLink) {
        document.querySelectorAll('.nav-menu a').forEach(link => link.classList.remove('active'));
        clickedLink.classList.add('active');
    }

    // Eventos para los botones del menú
    persInfoBtn.addEventListener('click', function(e) {
        e.preventDefault();
        showPanel('personal');
        updateActiveMenu(this);
    });

    ordersBtn.addEventListener('click', function(e) {
        e.preventDefault();
        showPanel('orders');
        updateActiveMenu(this);
    });

    if (userRole === 'employee') {
        employeesBtn?.addEventListener('click', function(e) {
            e.preventDefault();
            showPanel('employees');
            updateActiveMenu(this);
        });

        productsBtn?.addEventListener('click', function(e) {
            e.preventDefault();
            showPanel('products');
            updateActiveMenu(this);
        });
    }

    // Función para cargar la lista de empleados
    function loadEmployeesList() {
        console.log("Cargando lista de empleados...");
        fetch(apiUrlGetEmployees)
            .then(response => response.text())
            .then(text => {
                try {
                    let employees = [];
                    if (text.trim()) {
                        employees = JSON.parse(text);
                    }
                    
                    const tableBody = document.getElementById('employees-table-body');
                    if (!tableBody) {
                        console.error('No se encontró la tabla de empleados');
                        return;
                    }
                    
                    tableBody.innerHTML = ''; // Limpiar tabla

                    if (employees.length === 0) {
                        const row = document.createElement('tr');
                        row.innerHTML = '<td colspan="6" style="text-align: center;">No hay empleados registrados</td>';
                        tableBody.appendChild(row);
                        return;
                    }

                    employees.forEach(employee => {
                        console.log('Procesando empleado:', employee); // Debug
                        
                        // Formatear la fecha de contratación
                        let hireDate = employee.m_dtHireDate || employee.m_hireDate || employee.hire_date || '';
                        if (hireDate) {
                            try {
                                // Función auxiliar para convertir nombre de mes a número
                                const getMonthNumber = (monthName) => {
                                    const months = {
                                        // Meses en inglés
                                        'jan': '01', 'feb': '02', 'mar': '03', 'apr': '04', 'may': '05', 'jun': '06',
                                        'jul': '07', 'aug': '08', 'sep': '09', 'oct': '10', 'nov': '11', 'dec': '12',
                                        'january': '01', 'february': '02', 'march': '03', 'april': '04', 'june': '06',
                                        'july': '07', 'august': '08', 'september': '09', 'october': '10', 'november': '11', 'december': '12',
                                        // Meses en español
                                        'ene': '01', 'feb': '02', 'mar': '03', 'abr': '04', 'may': '05', 'jun': '06',
                                        'jul': '07', 'ago': '08', 'sep': '09', 'oct': '10', 'nov': '11', 'dic': '12',
                                        'enero': '01', 'febrero': '02', 'marzo': '03', 'abril': '04', 'mayo': '05', 'junio': '06',
                                        'julio': '07', 'agosto': '08', 'septiembre': '09', 'octubre': '10', 'noviembre': '11', 'diciembre': '12'
                                    };
                                    return months[monthName.toLowerCase()];
                                };

                                if (typeof hireDate === 'string') {
                                    // Si ya está en formato YYYY/MM/DD, dejarlo así
                                    if (/^\d{4}\/\d{2}\/\d{2}$/.test(hireDate)) {
                                        // No hacer nada, mantener el formato actual
                                    }
                                    // Si la fecha incluye el nombre del mes (en inglés o español)
                                    else if (/[a-zA-Z]/.test(hireDate)) {
                                        const parts = hireDate.replace(',', '').split(' ');
                                        if (parts.length >= 3) {
                                            const month = getMonthNumber(parts[0]);
                                            const day = String(parseInt(parts[1])).padStart(2, '0');
                                            const year = parts[2];
                                            if (month && day && year) {
                                                hireDate = `${year}/${month}/${day}`;
                                            }
                                        }
                                    }
                                    // Si la fecha viene en formato ISO o con guiones
                                    else if (hireDate.includes('T') || hireDate.includes('-')) {
                                        const parts = hireDate.split(/[-T]/);
                                        if (parts.length >= 3) {
                                            hireDate = `${parts[0]}/${parts[1]}/${parts[2].split('T')[0]}`;
                                        }
                                    }
                                    // Para cualquier otro formato, intentar con Date
                                    else {
                                        const date = new Date(hireDate);
                                        if (!isNaN(date.getTime())) {
                                            const year = date.getFullYear();
                                            const month = String(date.getMonth() + 1).padStart(2, '0');
                                            const day = String(date.getDate()).padStart(2, '0');
                                            hireDate = `${year}/${month}/${day}`;
                                        }
                                    }
                                }
                                console.log('Fecha formateada:', hireDate); // Debug
                            } catch (e) {
                                console.error('Error al formatear la fecha:', e);
                                const today = new Date();
                                hireDate = `${today.getFullYear()}/${String(today.getMonth() + 1).padStart(2, '0')}/${String(today.getDate()).padStart(2, '0')}`;
                            }
                        } else {
                            const today = new Date();
                            hireDate = `${today.getFullYear()}/${String(today.getMonth() + 1).padStart(2, '0')}/${String(today.getDate()).padStart(2, '0')}`;
                        }
                        
                        const row = document.createElement('tr');
                        row.innerHTML = `
                            <td>${employee.m_strFirstName || ''} ${employee.m_strLastName || ''}</td>
                            <td>${employee.m_strEmail || ''}</td>
                            <td>${employee.m_strTelephone || 'N/A'}</td>
                            <td>${getJobName(employee.m_fkJob)}</td>
                            <td>${hireDate}</td>
                            <td>
                                <button class="action-btn edit-btn" data-id="${employee.m_iId}">
                                    <i class="fas fa-edit"></i>
                                </button>
                                <button class="action-btn delete-btn" data-id="${employee.m_iId}">
                                    <i class="fas fa-trash"></i>
                                </button>
                            </td>
                        `;
                        tableBody.appendChild(row);

                        // Añadir event listener al botón de editar
                        const editBtn = row.querySelector('.edit-btn');
                        editBtn.addEventListener('click', function() {
                            console.log('Click en editar para empleado:', employee);
                            editingEmployeeId = employee.m_iId;
                            
                            // Rellenar el formulario con los datos del empleado
                            document.getElementById("emp-firstName").value = employee.m_strFirstName || '';
                            document.getElementById("emp-lastName").value = employee.m_strLastName || '';
                            document.getElementById("emp-email").value = employee.m_strEmail || '';
                            document.getElementById("emp-telephone").value = employee.m_strTelephone || '';
                            document.getElementById("emp-role").value = employee.m_fkJob || '';
                            document.getElementById("emp-establishment").value = employee.m_fkEstablishment || '';
                            document.getElementById("emp-salary").value = employee.m_dblSalary || '';
                            
                            // Formatear la fecha para el formulario usando la función común
                            const formatDate = (dateStr) => {
                                if (!dateStr) return '';
                                
                                const getMonthNumber = (monthName) => {
                                    const months = {
                                        // Meses en inglés
                                        'jan': '01', 'feb': '02', 'mar': '03', 'apr': '04', 'may': '05', 'jun': '06',
                                        'jul': '07', 'aug': '08', 'sep': '09', 'oct': '10', 'nov': '11', 'dec': '12',
                                        'january': '01', 'february': '02', 'march': '03', 'april': '04', 'june': '06',
                                        'july': '07', 'august': '08', 'september': '09', 'october': '10', 'november': '11', 'december': '12',
                                        // Meses en español
                                        'ene': '01', 'feb': '02', 'mar': '03', 'abr': '04', 'may': '05', 'jun': '06',
                                        'jul': '07', 'ago': '08', 'sep': '09', 'oct': '10', 'nov': '11', 'dic': '12',
                                        'enero': '01', 'febrero': '02', 'marzo': '03', 'abril': '04', 'mayo': '05', 'junio': '06',
                                        'julio': '07', 'agosto': '08', 'septiembre': '09', 'octubre': '10', 'noviembre': '11', 'diciembre': '12'
                                    };
                                    return months[monthName.toLowerCase()];
                                };

                                try {
                                    if (typeof dateStr === 'string') {
                                        // Si ya está en formato YYYY/MM/DD, dejarlo así
                                        if (/^\d{4}\/\d{2}\/\d{2}$/.test(dateStr)) {
                                            return dateStr;
                                        }
                                        // Si la fecha incluye el nombre del mes (en inglés o español)
                                        if (/[a-zA-Z]/.test(dateStr)) {
                                            const parts = dateStr.replace(',', '').split(' ');
                                            if (parts.length >= 3) {
                                                const month = getMonthNumber(parts[0]);
                                                const day = String(parseInt(parts[1])).padStart(2, '0');
                                                const year = parts[2];
                                                if (month && day && year) {
                                                    return `${year}/${month}/${day}`;
                                                }
                                            }
                                        }
                                        // Si la fecha viene en formato ISO o con guiones
                                        else if (dateStr.includes('T') || dateStr.includes('-')) {
                                            const parts = dateStr.split(/[-T]/);
                                            if (parts.length >= 3) {
                                                return `${parts[0]}/${parts[1]}/${parts[2].split('T')[0]}`;
                                            }
                                        }
                                    }
                                    // Para cualquier otro formato, intentar con Date
                                    const date = new Date(dateStr);
                                    if (!isNaN(date.getTime())) {
                                        const year = date.getFullYear();
                                        const month = String(date.getMonth() + 1).padStart(2, '0');
                                        const day = String(date.getDate()).padStart(2, '0');
                                        return `${year}/${month}/${day}`;
                                    }
                                } catch (e) {
                                    console.error('Error al formatear la fecha:', e);
                                }
                                return dateStr; // Devolver la fecha original si no se pudo formatear
                            };

                            const formHireDate = formatDate(employee.m_dtHireDate || employee.m_hireDate || employee.hire_date);
                            console.log('Fecha para el formulario:', formHireDate); // Debug
                            document.getElementById("emp-hire-date").value = formHireDate;

                            // Guardar la contraseña actual en una variable global
                            window.currentEmployeePassword = employee.m_strPasswordHash || employee.password_hash;
                            console.log('Contraseña guardada:', window.currentEmployeePassword); // Debug

                            // Ocultar y hacer no requerido el campo de contraseña durante edición
                            const passwordField = document.getElementById("emp-password");
                            const passwordLabel = passwordField.previousElementSibling;
                            passwordField.style.display = 'none';
                            passwordLabel.style.display = 'none';
                            passwordField.required = false;
                            passwordField.value = '';

                            // Mostrar el formulario
                            employeeForm.style.display = 'block';
                            addEmployeeBtn.style.display = 'none';
                            
                            // Cambiar el texto del botón submit
                            const submitBtn = employeeForm.querySelector('button[type="submit"]');
                            submitBtn.textContent = 'Update Employee';
                            
                            // Desplazarse suavemente hasta el formulario
                            employeeForm.scrollIntoView({ behavior: 'smooth', block: 'start' });
                            
                            console.log('Formulario preparado para edición del empleado:', editingEmployeeId);
                        });

                        // Añadir event listener al botón de eliminar
                        const deleteBtn = row.querySelector('.delete-btn');
                        deleteBtn.addEventListener('click', function() {
                            const employeeId = this.getAttribute('data-id');
                            const employeeEmail = employee.m_strEmail; // Obtener el email del empleado
                            if (confirm('¿Estás seguro de que deseas eliminar este empleado?')) {
                                deleteEmployee(employeeId, employeeEmail);
                            }
                        });
                    });
                } catch (e) {
                    console.error('Error al parsear la respuesta:', e);
                    console.error('Texto que causó el error:', text);
                }
            })
            .catch(error => {
                console.error('Error al cargar empleados:', error);
            });
    }

    // Función para eliminar empleado
    function deleteEmployee(employeeId, employeeEmail) {
        if (!employeeId || !employeeEmail) {
            console.error('ID o email de empleado no válido');
            alert('Error: Datos de empleado no válidos');
            return;
        }

        console.log('Intentando eliminar empleado:', { id: employeeId, email: employeeEmail }); // Debug

        // Construir la URL con el email
        const params = new URLSearchParams();
        params.append('email', employeeEmail);
        
        const urlWithParams = `${apiUrlDeleteEmployee}&${params.toString()}`;
        console.log('URL de eliminación:', urlWithParams); // Debug
        
        fetch(urlWithParams, {
            method: "POST",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        })
        .then(response => {
            console.log('Status de la respuesta:', response.status); // Debug
            return response.text();
        })
        .then(text => {
            console.log("Respuesta del servidor:", text); // Debug
            
            if (text.includes("error") || text.includes("Error")) {
                throw new Error("No se pudo eliminar el empleado");
            }

            // Si la eliminación fue exitosa
            alert("Empleado eliminado correctamente");
            
            // Limpiar la tabla actual
            const tableBody = document.getElementById('employees-table-body');
            tableBody.innerHTML = '';
            
            // Recargar la lista de empleados inmediatamente
            return fetch(apiUrlGetEmployees);
        })
        .then(response => response.text())
        .then(text => {
            try {
                let employees = [];
                if (text.trim()) {
                    employees = JSON.parse(text);
                }
                
                const tableBody = document.getElementById('employees-table-body');
                
                if (employees.length === 0) {
                    const row = document.createElement('tr');
                    row.innerHTML = '<td colspan="6" style="text-align: center;">No hay empleados registrados</td>';
                    tableBody.appendChild(row);
                    return;
                }

                employees.forEach(employee => {
                    // Formatear la fecha usando la función existente
                    let hireDate = employee.m_dtHireDate || employee.m_hireDate || employee.hire_date || '';
                    if (hireDate) {
                        try {
                            if (typeof hireDate === 'string') {
                                if (/^\d{4}\/\d{2}\/\d{2}$/.test(hireDate)) {
                                    // Ya está en formato correcto
                                } else if (/[a-zA-Z]/.test(hireDate)) {
                                    const parts = hireDate.replace(',', '').split(' ');
                                    if (parts.length >= 3) {
                                        const month = getMonthNumber(parts[0]);
                                        const day = String(parseInt(parts[1])).padStart(2, '0');
                                        const year = parts[2];
                                        if (month && day && year) {
                                            hireDate = `${year}/${month}/${day}`;
                                        }
                                    }
                                } else if (hireDate.includes('T') || hireDate.includes('-')) {
                                    const parts = hireDate.split(/[-T]/);
                                    if (parts.length >= 3) {
                                        hireDate = `${parts[0]}/${parts[1]}/${parts[2].split('T')[0]}`;
                                    }
                                }
                            }
                        } catch (e) {
                            console.error('Error al formatear la fecha:', e);
                            const today = new Date();
                            hireDate = `${today.getFullYear()}/${String(today.getMonth() + 1).padStart(2, '0')}/${String(today.getDate()).padStart(2, '0')}`;
                        }
                    }
                    
                    const row = document.createElement('tr');
                    row.innerHTML = `
                        <td>${employee.m_strFirstName || ''} ${employee.m_strLastName || ''}</td>
                        <td>${employee.m_strEmail || ''}</td>
                        <td>${employee.m_strTelephone || 'N/A'}</td>
                        <td>${getJobName(employee.m_fkJob)}</td>
                        <td>${hireDate}</td>
                        <td>
                            <button class="action-btn edit-btn" data-id="${employee.m_iId}">
                                <i class="fas fa-edit"></i>
                            </button>
                            <button class="action-btn delete-btn" data-id="${employee.m_iId}">
                                <i class="fas fa-trash"></i>
                            </button>
                        </td>
                    `;
                    tableBody.appendChild(row);

                    // Añadir los event listeners a los nuevos botones
                    const newEditBtn = row.querySelector('.edit-btn');
                    const newDeleteBtn = row.querySelector('.delete-btn');

                    newEditBtn.addEventListener('click', function() {
                        console.log('Click en editar para empleado:', employee);
                        editingEmployeeId = employee.m_iId;
                        
                        document.getElementById("emp-firstName").value = employee.m_strFirstName || '';
                        document.getElementById("emp-lastName").value = employee.m_strLastName || '';
                        document.getElementById("emp-email").value = employee.m_strEmail || '';
                        document.getElementById("emp-telephone").value = employee.m_strTelephone || '';
                        document.getElementById("emp-role").value = employee.m_fkJob || '';
                        document.getElementById("emp-establishment").value = employee.m_fkEstablishment || '';
                        document.getElementById("emp-salary").value = employee.m_dblSalary || '';
                        document.getElementById("emp-hire-date").value = hireDate;

                        window.currentEmployeePassword = employee.m_strPasswordHash || employee.password_hash;

                        const passwordField = document.getElementById("emp-password");
                        const passwordLabel = passwordField.previousElementSibling;
                        passwordField.style.display = 'none';
                        passwordLabel.style.display = 'none';
                        passwordField.required = false;
                        passwordField.value = '';

                        employeeForm.style.display = 'block';
                        addEmployeeBtn.style.display = 'none';
                        
                        const submitBtn = employeeForm.querySelector('button[type="submit"]');
                        submitBtn.textContent = 'Update Employee';
                        
                        employeeForm.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    });

                    newDeleteBtn.addEventListener('click', function() {
                        if (confirm('¿Estás seguro de que deseas eliminar este empleado?')) {
                            deleteEmployee(employee.m_iId, employee.m_strEmail);
                        }
                    });
                });
            } catch (e) {
                console.error('Error al actualizar la lista:', e);
                alert('Error al actualizar la lista de empleados');
            }
        })
        .catch(error => {
            console.error('Error al eliminar empleado:', error);
            alert("Error al eliminar empleado: " + error.message);
        });
    }

    // Gestión de formularios de empleados
    if (userRole === 'employee') {
        // Cargar lista inicial de empleados si el panel está visible
        if (employeesPanel.style.display === 'block') {
            loadEmployeesList();
        }

        addEmployeeBtn?.addEventListener('click', function() {
            employeeForm.style.display = 'block';
            addEmployeeBtn.style.display = 'none';
            // Mostrar y resetear el campo de contraseña para nuevo empleado
            const passwordField = document.getElementById("emp-password");
            const passwordLabel = passwordField.previousElementSibling;
            passwordField.style.display = 'block';
            passwordLabel.style.display = 'block';
            passwordField.value = '';
            passwordField.placeholder = 'Enter password';
            passwordField.required = true;
        });

        cancelEmployeeBtn?.addEventListener('click', function() {
            editingEmployeeId = null;
            const submitBtn = employeeForm.querySelector('button[type="submit"]');
            submitBtn.textContent = 'Save Employee';
            employeeForm.style.display = 'none';
            addEmployeeBtn.style.display = 'block';
            
            // Mostrar y resetear el campo de contraseña
            const passwordField = document.getElementById("emp-password");
            const passwordLabel = passwordField.previousElementSibling;
            passwordField.style.display = 'block';
            passwordLabel.style.display = 'block';
            passwordField.value = '';
            passwordField.placeholder = 'Enter password';
            passwordField.required = true;
            
            // Resetear el formulario
            employeeForm.reset();
            
            // Desplazarse de vuelta a la lista de empleados si estamos editando
            document.getElementById('employees-table-body').scrollIntoView({ behavior: 'smooth' });
        });

        employeeForm?.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Determinar si estamos editando o creando
            const isEditing = editingEmployeeId !== null;
            
            // Obtener los valores del formulario
            const formData = {
                firstName: document.getElementById("emp-firstName").value,
                lastName: document.getElementById("emp-lastName").value,
                email: document.getElementById("emp-email").value,
                telephone: document.getElementById("emp-telephone").value,
                password: document.getElementById("emp-password").value,
                jobId: document.getElementById("emp-role").value,
                establishmentId: document.getElementById("emp-establishment").value,
                salary: document.getElementById("emp-salary").value,
                hireDate: document.getElementById("emp-hire-date").value
            };

            // Validar campos obligatorios
            if (!formData.firstName || !formData.lastName || !formData.email || !formData.jobId || !formData.establishmentId) {
                alert("Por favor, complete los campos obligatorios (Nombre, Apellido, Email, Rol y Establecimiento)");
                return;
            }

            // Construir el objeto de datos para enviar
            const employeeData = {
                first_name: formData.firstName,
                last_name: formData.lastName,
                email: formData.email,
                telephone: formData.telephone || '',
                job_id1: formData.jobId,
                establishment_id1: formData.establishmentId,
                salary: formData.salary || '0',
                hire_date: formData.hireDate
            };

            if (isEditing) {
                // Añadir el ID del empleado que se está editando
                employeeData.id = editingEmployeeId;
                // Usar la contraseña almacenada para actualizaciones
                employeeData.password_hash = window.currentEmployeePassword;
            } else {
                if (!formData.password) {
                    alert("La contraseña es obligatoria para nuevos empleados");
                    return;
                }
                employeeData.password_hash = formData.password;
            }

            // Construir la URL base
            let baseUrl = isEditing ? apiUrlUpdateEmployee : apiUrlADDEmployee;

            // Construir la URL con parámetros
            const params = new URLSearchParams();
            for (const [key, value] of Object.entries(employeeData)) {
                if (value !== null && value !== undefined && value !== '') {
                    params.append(key, value);
                }
            }
            
            const urlWithParams = `${baseUrl}&${params.toString()}`;
            console.log('URL completa:', urlWithParams);

            // Realizar la petición
            fetch(urlWithParams, {
                method: "POST",
                headers: {
                    'Accept': 'application/json'
                }
            })
            .then(response => response.text())
            .then(text => {
                console.log("Respuesta del servidor:", text);
                
                if (text.includes("error") || text.includes("Error") || text === "Faltan datos") {
                    throw new Error(`No se pudo ${isEditing ? 'actualizar' : 'agregar'} el empleado`);
                }

                // Operación exitosa
                alert(`Empleado ${isEditing ? 'actualizado' : 'registrado'} correctamente`);
                employeeForm.reset();
                employeeForm.style.display = 'none';
                addEmployeeBtn.style.display = 'block';
                
                // Resetear el modo de edición
                editingEmployeeId = null;
                const submitBtn = employeeForm.querySelector('button[type="submit"]');
                submitBtn.textContent = 'Save Employee';
                
                // Recargar la lista de empleados
                loadEmployeesList();
            })
            .catch(error => {
                console.error("Error:", error);
                alert(error.message);
            });
        });

        // Gestión de formularios de productos
        addProductBtn?.addEventListener('click', function() {
            // Cargar jobs y establishments antes de mostrar el formulario
            Promise.all([loadJobs(), loadEstablishments()])
                .then(() => {
                    productForm.style.display = 'block';
                    addProductBtn.style.display = 'none';
                })
                .catch(error => {
                    console.error('Error al cargar datos para el formulario de productos:', error);
                    alert('Error al cargar los datos necesarios. Por favor, inténtelo de nuevo.');
                });
        });

        cancelProductBtn?.addEventListener('click', function() {
            productForm.style.display = 'none';
            addProductBtn.style.display = 'block';
            productForm.reset();
        });

        productForm?.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Obtener los valores del formulario
            const productData = {
                m_strName: document.getElementById("product-name").value,
                m_strDescription: document.getElementById("product-description").value,
                m_dblPrice: parseFloat(document.getElementById("product-price").value),
                m_fkJob: parseInt(document.getElementById("product-role").value),
                m_fkEstablishment: parseInt(document.getElementById("product-establishment").value)
            };

            // Validar que todos los campos estén llenos
            for (let key in productData) {
                if (!productData[key] && productData[key] !== 0) {
                    alert("Por favor, complete todos los campos");
                    return;
                }
            }

            // Validar que el precio sea un número válido
            if (isNaN(productData.m_dblPrice)) {
                alert("Por favor, ingrese un precio válido");
                return;
            }

            // Crear los parámetros de la URL
            const params = new URLSearchParams();
            
            // Añadir los parámetros del producto
            for (let key in productData) {
                params.append(key, productData[key]);
            }

            // Construir la URL completa
            const urlWithParams = `${apiUrlADDProduct}&${params.toString()}`;

            console.log('Enviando datos del producto:', productData);
            console.log('URL con parámetros:', urlWithParams);

            // Configuración de fetch()
            fetch(urlWithParams, {
                method: "POST",
                headers: {
                    'Accept': 'application/json'
                }
            })
            .then(response => {
                console.log("Status:", response.status);
                console.log("Status Text:", response.statusText);
                
                return response.text().then(text => {
                    console.log("Respuesta del servidor:", text);
                    
                    if (text === "Faltan datos") {
                        throw new Error("Por favor, complete todos los campos correctamente");
                    }
                    
                    if (text.includes("No se pudo")) {
                        throw new Error("No se pudo agregar el producto");
                    }

                    // Si llegamos aquí, consideramos que la operación fue exitosa
                    alert("Producto registrado correctamente");
                    productForm.style.display = 'none';
                    addProductBtn.style.display = 'block';
                    productForm.reset();
                    return { status: "success" };
                });
            })
            .catch(error => {
                console.error("Error en la petición:", error);
                alert("Error: " + error.message);
            });
        });
    }

    // Eventos para edición de información personal
    editBtn.addEventListener('click', function() {
        formInputs.forEach(input => {
            input.disabled = false;
        });
        formButtons.style.display = 'flex';
        editBtn.style.display = 'none';
    });
    
    cancelBtn.addEventListener('click', function() {
        formInputs.forEach(input => {
            input.disabled = true;
        });
        formButtons.style.display = 'none';
        editBtn.style.display = 'flex';
    });
    
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        formInputs.forEach(input => {
            input.disabled = true;
        });
        formButtons.style.display = 'none';
        editBtn.style.display = 'flex';
        alert('Information updated successfully!');
    });

    // Menú móvil (toggle)
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const navMenu = document.querySelector('.nav-menu');
    
    if (mobileMenuToggle) {
        mobileMenuToggle.addEventListener('click', function() {
            navMenu.classList.toggle('active');
        });
    }

    // Gestión del logout
    const logoutBtn = document.querySelector('.logout-btn');
    logoutBtn.addEventListener('click', function() {
        sessionStorage.clear();
        window.location.href = 'login.html';
    });

    // Mostrar "Información Personal" por defecto al cargar la página
    showPanel('personal');
    persInfoBtn.classList.add('active');

    // Función para obtener el nombre del trabajo según el ID
    function getJobName(jobId) {
        console.log('Buscando nombre para jobId:', jobId);
        console.log('Jobs disponibles:', jobs);
        if (!jobId) return 'N/A';
        return jobs[jobId] || 'Unknown';
    }

    // Función para cargar los trabajos
    function loadJobs() {
        console.log('Iniciando carga de jobs...');
        return fetch(apiUrlGetJobs)
            .then(response => response.text())
            .then(text => {
                try {
                    console.log('Respuesta raw de jobs:', text);
                    const jobsList = JSON.parse(text);
                    console.log('Jobs parseados:', jobsList);
                    
                    const jobSelect = document.getElementById('emp-role');
                    if (!jobSelect) {
                        console.error('No se encontró el elemento select de jobs');
                        return;
                    }
                    
                    // Limpiar el selector
                    jobSelect.innerHTML = '<option value="">Select a role</option>';
                    
                    if (!Array.isArray(jobsList)) {
                        console.error('La respuesta de jobs no es un array:', jobsList);
                        return;
                    }
                    
                    jobsList.forEach(job => {
                        console.log('Procesando job:', job);
                        // Almacenar en el objeto jobs usando el ID como clave
                        const jobId = job.m_iId || job.id;
                        const jobTitle = job.m_strTitle || job.title || job.getTitle || job.m_strName || 'Unknown';
                        
                        jobs[jobId] = jobTitle;
                        
                        // Crear option para el selector
                        const option = document.createElement('option');
                        option.value = jobId;
                        option.textContent = jobTitle;
                        jobSelect.appendChild(option);
                        
                        console.log(`Añadido job: ID=${jobId}, Title=${jobTitle}`);
                    });
                    
                    console.log('Jobs cargados:', jobs);
                    
                    // Verificar si hay opciones añadidas
                    console.log('Número de opciones en el select:', jobSelect.options.length);
                    
                } catch (e) {
                    console.error('Error al parsear jobs:', e);
                    console.error('Texto que causó el error:', text);
                }
            })
            .catch(error => {
                console.error('Error al cargar jobs:', error);
            });
    }

    // Función para cargar los establecimientos
    function loadEstablishments() {
        return fetch(apiUrlGetEstablishments)
            .then(response => response.text())
            .then(text => {
                try {
                    console.log('Respuesta de establishments:', text); // Debug
                    const establishmentsList = JSON.parse(text);
                    const establishmentSelect = document.getElementById('emp-establishment');
                    const productEstablishmentSelect = document.getElementById('product-establishment');
                    
                    // Limpiar los selectores
                    if (establishmentSelect) {
                        establishmentSelect.innerHTML = '<option value="">Select an establishment</option>';
                    }
                    if (productEstablishmentSelect) {
                        productEstablishmentSelect.innerHTML = '<option value="">Select an establishment</option>';
                    }
                    
                    establishmentsList.forEach(establishment => {
                        // Almacenar en el objeto establishments
                        establishments[establishment.m_iId] = establishment.m_strName || establishment.getName || establishment.name || 'Unknown';
                        
                        // Crear option para el selector de empleados
                        if (establishmentSelect) {
                            const option = document.createElement('option');
                            option.value = establishment.m_iId;
                            option.textContent = establishments[establishment.m_iId];
                            establishmentSelect.appendChild(option);
                        }
                        
                        // Crear option para el selector de productos
                        if (productEstablishmentSelect) {
                            const option = document.createElement('option');
                            option.value = establishment.m_iId;
                            option.textContent = establishments[establishment.m_iId];
                            productEstablishmentSelect.appendChild(option);
                        }
                    });
                    console.log('Establishments cargados:', establishments); // Debug
                } catch (e) {
                    console.error('Error al parsear establecimientos:', e);
                }
            })
            .catch(error => {
                console.error('Error al cargar establishments:', error);
            });
    }

    // Función para obtener el nombre del establecimiento según el ID
    function getEstablishmentName(establishmentId) {
        if (!establishmentId) return 'N/A';
        return establishments[establishmentId] || 'Unknown';
    }

    // Cargar los datos inicialmente
    if (userRole === 'employee') {
        // Si el panel de empleados está visible al inicio, cargar los datos
        if (employeesPanel.style.display === 'block') {
            console.log("Cargando datos iniciales...");
            loadEmployeesList();
        }
    }
});