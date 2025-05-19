document.addEventListener('DOMContentLoaded', function () {
    // Verificar si el usuario está autenticado
    let userRole = sessionStorage.getItem('userRole');
    let userData = JSON.parse(sessionStorage.getItem('userData'));

    // Añadir event listener al logo
    const logo = document.querySelector('.logo');
    if (logo) {
        logo.addEventListener('click', function () {
            window.location.href = 'index.html';
        });
        // Hacer el logo clickeable
        logo.style.cursor = 'pointer';
    }

    console.log('User role:', userRole); // Debugging

    // Actualiza la sección del perfil del sidebar con los datos del usuario
    const userNameEl = document.querySelector('.user-name');
    const userEmailEl = document.querySelector('.user-email');

    if (userData) {
        userNameEl.textContent = `${userData.m_strFirstName} ${userData.m_strLastName}`;
        userEmailEl.textContent = userData.m_strEmail;
    }

    // Mostrar datos personales del usuario en la sección Personal Information
    if (userData) {
        document.getElementById('firstName').value = userData.m_strFirstName || '';
        document.getElementById('lastName').value = userData.m_strLastName || '';
        document.getElementById('email').value = userData.m_strEmail || '';
        document.getElementById('phone').value = userData.m_strTelephone || '';

    }

    // URLs del API
    const apiUrlADDEmployee = 'http://localhost:8080/PruebaDBConsola/Controller?ACTION=EMPLOYEE.ADD';
    const apiUrlGetEmployees = 'http://localhost:8080/PruebaDBConsola/Controller?ACTION=EMPLOYEE.FIND_ALL';
    const apiUrlDeleteEmployee = 'http://localhost:8080/PruebaDBConsola/Controller?ACTION=EMPLOYEE.DELETE';
    const apiUrlUpdateEmployee = 'http://localhost:8080/PruebaDBConsola/Controller?ACTION=EMPLOYEE.UPDATE';
    const apiUrlGetJobs = 'http://localhost:8080/PruebaDBConsola/Controller?ACTION=JOB.FIND_ALL';
    const apiUrlGetEstablishments = 'http://localhost:8080/PruebaDBConsola/Controller?ACTION=ESTABLISHMENT.FIND_ALL';
    const apiUrlADDProduct = 'http://localhost:8080/PruebaDBConsola/Controller?ACTION=PRODUCT.ADD';
    const apiUrlGetProducts = 'http://localhost:8080/PruebaDBConsola/Controller?ACTION=PRODUCT.FIND_ALL';
    const apiUrlUpdateProduct = 'http://localhost:8080/PruebaDBConsola/Controller?ACTION=PRODUCT.UPDATE';
    const apiUrlDeleteProduct = 'http://localhost:8080/PruebaDBConsola/Controller?ACTION=PRODUCT.DELETE';
    const apiUrlGetCategories = 'http://localhost:8080/PruebaDBConsola/Controller?ACTION=CATEGORY.FIND_ALL';

    // Variables globales para cuando se edita un empleado
    let editingEmployeeId = null;
    let currentEmployeeEmail = null;
    let currentEmployeePassword = null;
    let jobs = {};
    let establishments = {};

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
    const persInfoBtn = document.getElementById('persInfoBtn')?.closest('a');
    const ordersBtn = document.getElementById('ordersBtn')?.closest('a');
    const employeesBtn = document.getElementById('employeesBtn');
    const productsBtn = document.getElementById('productsBtn');


    // Formularios de empleados y productos
    const employeeForm = document.getElementById('employee-form');
    const productForm = document.getElementById('product-form');
    const addEmployeeBtn = document.getElementById('add-employee-btn');
    const addProductBtn = document.getElementById('add-product-btn');
    const cancelEmployeeBtn = document.getElementById('cancel-employee-btn');
    const cancelProductBtn = document.getElementById('cancel-product-btn');

    // Configurar visibilidad según el rol
    // Importante: hacer esto al principio para asegurar que la sección de admin esté correctamente oculta/visible
    const adminSection = document.querySelector('.nav-menu h3:nth-of-type(2)');
    const adminLinks = adminSection?.nextElementSibling;

    // Mejorar la visibilidad de los elementos administrativos según el rol
    if (userRole === 'client') {
        // Ocultar sección de administración para clientes
        if (adminSection) adminSection.style.display = 'none';
        if (adminLinks) adminLinks.style.display = 'none';

        // También ocultar paneles de administración
        if (employeesPanel) employeesPanel.style.display = 'none';
        if (productsPanel) productsPanel.style.display = 'none';

        // Ocultar los botones relacionados si existen
        if (employeesBtn) employeesBtn.closest('li').style.display = 'none';
        if (productsBtn) productsBtn.closest('li').style.display = 'none';
    }

    // Event Listeners para los botones del menú - estos se añaden para todos los usuarios
    persInfoBtn?.addEventListener('click', function (e) {
        e.preventDefault();
        showPanel('personal');
        updateActiveMenu(this);
    });

    ordersBtn?.addEventListener('click', function (e) {
        e.preventDefault();
        showPanel('orders');
        updateActiveMenu(this);
    });

    // Solo añadir event listeners para funciones de empleado si el usuario es empleado
    if (userRole === 'employee') {
        // Event listeners para botones de navegación admin
        employeesBtn?.addEventListener('click', function (e) {
            e.preventDefault();
            showPanel('employees');
            updateActiveMenu(this);
        });

        productsBtn?.addEventListener('click', function (e) {
            e.preventDefault();
            showPanel('products');
            updateActiveMenu(this);
        });

        // Event listeners para formularios de productos
        addProductBtn?.addEventListener('click', function () {
            productForm.style.display = 'block';
            addProductBtn.style.display = 'none';
        });

        cancelProductBtn?.addEventListener('click', function () {
            productForm.style.display = 'none';
            addProductBtn.style.display = 'block';
            productForm.reset();
            editingProductId = null;
        });

        // Event listeners para formularios de empleados
        addEmployeeBtn?.addEventListener('click', function () {
            employeeForm.style.display = 'block';
            addEmployeeBtn.style.display = 'none';

            // Mostrar y hacer requerido el campo de contraseña para nuevos empleados
            const passwordField = document.getElementById("emp-password");
            const passwordLabel = passwordField.previousElementSibling;
            passwordField.style.display = 'block';
            passwordLabel.style.display = 'block';
            passwordField.value = '';
            passwordField.placeholder = 'Enter password';
            passwordField.required = true;
        });

        cancelEmployeeBtn?.addEventListener('click', function () {
            employeeForm.style.display = 'none';
            addEmployeeBtn.style.display = 'block';
            // Resetear variables de edición
            editingEmployeeId = null;
            currentEmployeeEmail = null;

            // Mostrar y resetear el campo de contraseña
            const passwordField = document.getElementById("emp-password");
            const passwordLabel = passwordField.previousElementSibling;
            passwordField.style.display = 'block';
            passwordLabel.style.display = 'block';
            passwordField.required = true;

            // Cambiar el texto del botón submit de vuelta a su estado original
            const submitBtn = employeeForm.querySelector('button[type="submit"]');
            submitBtn.textContent = 'Save Employee';

            // Resetear el formulario
            employeeForm.reset();
        });

        // Event listener para el formulario de empleados
        employeeForm?.addEventListener('submit', function (e) {
            e.preventDefault();

            const isEditing = editingEmployeeId !== null;
            console.log('Mode:', isEditing ? 'Editing' : 'Creation');


            // 1. Recoger datos
            const formData = {
                firstName: document.getElementById("emp-firstName").value.trim(),
                lastName: document.getElementById("emp-lastName").value.trim(),
                email: document.getElementById("emp-email").value.trim(),
                telephone: document.getElementById("emp-telephone").value.trim(),
                password: document.getElementById("emp-password").value,
                jobId: document.getElementById("emp-role").value,
                establishmentId: document.getElementById("emp-establishment").value,
                salary: document.getElementById("emp-salary").value,
                hireDate: document.getElementById("emp-hire-date").value
            };

            // 2. Validación mínima
            if (!formData.firstName || !formData.lastName || !formData.email) {
                alert("First name, last name and email are required");

                return;
            }

            // 3. Preparar parámetros para el backend
            const params = new URLSearchParams();

            // Parámetros clave para actualización
            if (isEditing) {
                params.append('original_email', currentEmployeeEmail); // Email original para buscar el ID
            }
            params.append('email', formData.email); // Email actualizado (si ha cambiado)

            // Campos obligatorios
            params.append('first_name', formData.firstName);
            params.append('last_name', formData.lastName);
            params.append('email', formData.email); // Nuevo email (si cambió)
            params.append('telephone', formData.telephone || '');

            // Contraseña: solo se envía al CREAR
            if (isEditing) {
                params.append('password_hash', currentEmployeePassword);
            } else {
                if (!formData.password) {
                    alert("The password is required for new employees");

                    return;
                }
                params.append('password_hash', formData.password);
            }

            params.append('job_id1', formData.jobId || '1');
            params.append('establishment_id1', formData.establishmentId || '1');
            params.append('salary', formData.salary || '0');

            // Formatear fecha al formato YYYY-MM-DD que espera el backend
            if (formData.hireDate) {
                const date = new Date(formData.hireDate);
                const formattedDate = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
                params.append('hire_date', formattedDate);
            } else {
                // Fecha por defecto si no se proporciona
                const today = new Date();
                const defaultDate = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
                params.append('hire_date', defaultDate);
            }

            console.log('Parámetros finales:', Object.fromEntries(params.entries()));

            // 4. Enviar petición
            const apiUrl = isEditing ? apiUrlUpdateEmployee : apiUrlADDEmployee;

            fetch(apiUrl, {
                method: "POST",
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: params
            })
                .then(response => response.text())
                .then(text => {
                    console.log('Server response:', text);


                    if (text.includes("error") || text.includes("Error") || text === "Faltan datos") {
                        throw new Error(text);
                    }

                    alert(`Employee ${isEditing ? 'updated' : 'created'} correctly!`);

                    loadEmployeesList();

                    // Resetear el formulario
                    employeeForm.style.display = 'none';
                    addEmployeeBtn.style.display = 'block';
                    employeeForm.reset();
                    editingEmployeeId = null;
                    currentEmployeeEmail = null;
                })
                .catch(error => {
                    console.error('Error:', error);
                    alert(`Error: ${error.message}`);
                });
        });
    }

    // Mostrar panel inicial
    showPanel('personal');
    if (persInfoBtn) persInfoBtn.classList.add('active');

    // Función para cambiar entre paneles
    function showPanel(panelToShow) {
        console.log('Mostrando panel:', panelToShow);

        // Ocultar todos los paneles
        personalPannel.style.display = 'none';
        orderPannel.style.display = 'none';

        // Solo acceder a paneles de empleado si el usuario es empleado
        if (userRole === 'employee') {
            if (employeesPanel) employeesPanel.style.display = 'none';
            if (productsPanel) productsPanel.style.display = 'none';
        }

        // Muestra solo el panel seleccionado
        switch (panelToShow) {
            case 'personal':
                personalPannel.style.display = 'block';
                break;
            case 'orders':
                orderPannel.style.display = 'block';
                loadUserOrders();
                break;
            case 'employees':
                if (userRole === 'employee' && employeesPanel) {
                    employeesPanel.style.display = 'block';
                    console.log('Loading employees panel...');


                    // Primero cargar los jobs
                    loadJobs().then(() => {
                        console.log('Jobs loaded, loading establishments...');

                        return loadEstablishments();
                    }).then(() => {
                        console.log('Establishments loaded, loading employees list...');

                        loadEmployeesList();
                    }).catch(error => {
                        console.error('Error in the loading sequence:', error);

                    });
                }
                break;
            case 'products':
                if (userRole === 'employee' && productsPanel) {
                    productsPanel.style.display = 'block';
                    loadCategories()
                        .then(() => loadProductsList())
                        .catch(error => console.error('Error loading product data:', error));

                }
                break;
        }
    }

    // Función para actualizar el menú activo
    function updateActiveMenu(clickedLink) {
        document.querySelectorAll('.nav-menu a').forEach(link => link.classList.remove('active'));
        clickedLink.classList.add('active');
    }

    // Función para cargar la lista de empleados
    function loadEmployeesList() {
        console.log("Loading employees list...");

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
                        console.error('No table of employees found');

                        return;
                    }

                    tableBody.innerHTML = '';

                    if (employees.length === 0) {
                        const row = document.createElement('tr');
                        row.innerHTML = '<td colspan="6" style="text-align: center;">No employees registered</td>';

                        tableBody.appendChild(row);
                        return;
                    }

                    employees.forEach(employee => {
                        let hireDate = employee.m_dtHireDate || employee.m_hireDate || employee.hire_date || '';
                        if (hireDate) {
                            try {
                                const getMonthNumber = (monthName) => {
                                    const months = {
                                        'jan': '01', 'feb': '02', 'mar': '03', 'apr': '04', 'may': '05', 'jun': '06',
                                        'jul': '07', 'aug': '08', 'sep': '09', 'oct': '10', 'nov': '11', 'dec': '12',
                                        'january': '01', 'february': '02', 'march': '03', 'april': '04', 'june': '06',
                                        'july': '07', 'august': '08', 'september': '09', 'october': '10', 'november': '11', 'december': '12',
                                        'ene': '01', 'feb': '02', 'mar': '03', 'abr': '04', 'may': '05', 'jun': '06',
                                        'jul': '07', 'ago': '08', 'sep': '09', 'oct': '10', 'nov': '11', 'dic': '12',
                                        'enero': '01', 'febrero': '02', 'marzo': '03', 'abril': '04', 'mayo': '05', 'junio': '06',
                                        'julio': '07', 'agosto': '08', 'septiembre': '09', 'octubre': '10', 'noviembre': '11', 'diciembre': '12'
                                    };
                                    return months[monthName.toLowerCase()];
                                };

                                if (typeof hireDate === 'string') {
                                    if (/^\d{4}\/\d{2}\/\d{2}$/.test(hireDate)) {
                                        // Ya está en formato correcto, no hacemos nada
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
                                console.error('Error formatting the date:', e);

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
                                <button class="action-btn edit-btn" data-id="${employee.m_iId}" data-email="${employee.m_strEmail}">
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
                        editBtn.addEventListener('click', function () {
                            editingEmployeeId = this.getAttribute('data-id');
                            currentEmployeeEmail = this.getAttribute('data-email');
                            currentEmployeePassword = employee.m_strPasswordHash || employee.m_strPassword || '';

                            console.log('Datos completos del empleado:', employee); // Log para ver la estructura

                            // Rellenar el formulario con los datos del empleado
                            document.getElementById("emp-firstName").value = employee.m_strFirstName || '';
                            document.getElementById("emp-lastName").value = employee.m_strLastName || '';
                            document.getElementById("emp-email").value = employee.m_strEmail || '';
                            document.getElementById("emp-telephone").value = employee.m_strTelephone || '';
                            document.getElementById("emp-role").value = employee.m_fkJob || '';
                            document.getElementById("emp-establishment").value = employee.m_fkEstablishment || '';
                            document.getElementById("emp-salary").value = employee.salary || employee.m_dblSalary || employee.m_salary || '';
                            console.log('Valor del salario:', employee.salary, employee.m_dblSalary, employee.m_salary); // Log para ver los valores posibles
                            document.getElementById("emp-hire-date").value = hireDate;


                            // Ocultar y hacer no requerido el campo de contraseña durante edición
                            const passwordField = document.getElementById("emp-password");
                            const passwordLabel = passwordField.previousElementSibling;
                            passwordField.style.display = 'none';
                            passwordLabel.style.display = 'none';
                            passwordField.required = false;
                            passwordField.value = ''; // Limpiar el campo de contraseña




                            // Mostrar el formulario
                            employeeForm.style.display = 'block';
                            addEmployeeBtn.style.display = 'none';


                            // Cambiar el texto del botón submit
                            const submitBtn = employeeForm.querySelector('button[type="submit"]');
                            submitBtn.textContent = 'Update Employee';


                            // Desplazarse suavemente hasta el formulario
                            employeeForm.scrollIntoView({ behavior: 'smooth', block: 'start' });
                        });




                        // Añadir event listener al botón de eliminar
                        const deleteBtn = row.querySelector('.delete-btn');
                        deleteBtn.addEventListener('click', function () {
                            const employeeId = this.getAttribute('data-id');
                            const employeeEmail = employee.m_strEmail;
                            if (confirm('Are you sure you want to delete this employee?')) {

                                deleteEmployee(employeeId, employeeEmail);
                            }
                        });
                    });
                } catch (e) {
                    console.error('Error parsing the response:', e);
                    console.error('Text that caused the error:', text);

                }
            })
            .catch(error => {
                console.error('Error loading employees:', error);

            });
    }




    // Función para eliminar empleado
    function deleteEmployee(employeeId, employeeEmail) {
        if (!employeeId || !employeeEmail) {
            console.error('Invalid employee ID or email');
            alert('Error: Invalid employee data');

            return;
        }


        const params = new URLSearchParams();
        params.append('email', employeeEmail);


        const urlWithParams = `${apiUrlDeleteEmployee}&${params.toString()}`;


        fetch(urlWithParams, {
            method: "POST",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        })
            .then(response => response.text())
            .then(text => {
                if (text.includes("error") || text.includes("Error")) {
                    throw new Error("Could not delete employee");

                }


                alert("Employee deleted correctly");

                loadEmployeesList();
            })
            .catch(error => {
                console.error('Error deleting employee:', error);
                alert("Error deleting employee: " + error.message);

            });
    }




    // Gestión de formularios de empleados
    if (userRole === 'employee') {
        if (employeesPanel.style.display === 'block') {
            loadEmployeesList();
        }




        addEmployeeBtn?.addEventListener('click', function () {
            employeeForm.style.display = 'block';
            addEmployeeBtn.style.display = 'none';
            const passwordField = document.getElementById("emp-password");
            const passwordLabel = passwordField.previousElementSibling;
            passwordField.style.display = 'block';
            passwordLabel.style.display = 'block';
            passwordField.value = '';
            passwordField.placeholder = 'Enter password';
            passwordField.required = true;
        });




        cancelEmployeeBtn?.addEventListener('click', function () {
            employeeForm.style.display = 'none';
            addEmployeeBtn.style.display = 'block';
            // Resetear variables de edición
            editingEmployeeId = null;
            currentEmployeeEmail = null;


            // Mostrar y resetear el campo de contraseña
            const passwordField = document.getElementById("emp-password");
            const passwordLabel = passwordField.previousElementSibling;
            passwordField.style.display = 'block';
            passwordLabel.style.display = 'block';
            passwordField.required = true;


            // Cambiar el texto del botón submit de vuelta a su estado original
            const submitBtn = employeeForm.querySelector('button[type="submit"]');
            submitBtn.textContent = 'Save Employee';


            // Resetear el formulario
            employeeForm.reset();
        });




        employeeForm?.addEventListener('submit', function (e) {
            e.preventDefault();


            const isEditing = editingEmployeeId !== null;
            console.log('Mode:', isEditing ? 'Editing' : 'Creation');



            // 1. Recoger datos
            const formData = {
                firstName: document.getElementById("emp-firstName").value.trim(),
                lastName: document.getElementById("emp-lastName").value.trim(),
                email: document.getElementById("emp-email").value.trim(),
                telephone: document.getElementById("emp-telephone").value.trim(),
                password: document.getElementById("emp-password").value,
                jobId: document.getElementById("emp-role").value,
                establishmentId: document.getElementById("emp-establishment").value,
                salary: document.getElementById("emp-salary").value,
                hireDate: document.getElementById("emp-hire-date").value
            };




            // 2. Validación mínima
            if (!formData.firstName || !formData.lastName || !formData.email) {
                alert("First name, last name and email are required");

                return;
            }




            // 3. Preparar parámetros para el backend
            const params = new URLSearchParams();


            // Parámetros clave para actualización
            if (isEditing) {
                params.append('original_email', currentEmployeeEmail); // Email original para buscar el ID
            }
            params.append('email', formData.email); // Email actualizado (si ha cambiado)


            // Campos obligatorios
            params.append('first_name', formData.firstName);
            params.append('last_name', formData.lastName);
            params.append('email', formData.email); // Nuevo email (si cambió)
            params.append('telephone', formData.telephone || '');


            // Contraseña: solo se envía al CREAR
            if (isEditing) {
                params.append('password_hash', currentEmployeePassword);
            } else {
                if (!formData.password) {
                    alert("The password is required for new employees");

                    return;
                }
                params.append('password_hash', formData.password);
            }


            // 🔁 Elimina esta validación duplicada:
            // if (!formData.password && !isEditing) { ... }


            params.append('job_id1', formData.jobId || '1');
            params.append('establishment_id1', formData.establishmentId || '1');
            params.append('salary', formData.salary || '0');


            // Formatear fecha al formato YYYY-MM-DD que espera el backend
            if (formData.hireDate) {
                const date = new Date(formData.hireDate);
                const formattedDate = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
                params.append('hire_date', formattedDate);
            } else {
                // Fecha por defecto si no se proporciona
                const today = new Date();
                const defaultDate = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
                params.append('hire_date', defaultDate);
            }




            console.log('Final parameters:', Object.fromEntries(params.entries()));





            // 4. Enviar petición
            const apiUrl = isEditing ? apiUrlUpdateEmployee : apiUrlADDEmployee;


            fetch(apiUrl, {
                method: "POST",
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: params
            })
                .then(response => response.text())
                .then(text => {
                    console.log('Server response:', text);



                    if (text.includes("error") || text.includes("Error") || text === "Faltan datos") {
                        throw new Error(text);
                    }


                    alert(`Employee ${isEditing ? 'updated' : 'created'} correctly!`);

                    loadEmployeesList();
                    resetEmployeeForm();
                })
                .catch(error => {
                    console.error('Error:', error);
                    alert(`Error: ${error.message}`);
                });
        });
    }




    // Eventos para edición de información personal
    editBtn.addEventListener('click', function () {
        formInputs.forEach(input => input.disabled = false);
        formButtons.style.display = 'flex';
        editBtn.style.display = 'none';
    });


    cancelBtn.addEventListener('click', function () {
        formInputs.forEach(input => input.disabled = true);
        formButtons.style.display = 'none';
        editBtn.style.display = 'flex';
    });

    //Aceptar Cambios
    form.addEventListener('submit', function (e) {
        e.preventDefault();
        formInputs.forEach(input => input.disabled = true);
        formButtons.style.display = 'none';
        editBtn.style.display = 'flex';
        alert('Information updated successfully!');
    });




    // Menú móvil (toggle)
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const navMenu = document.querySelector('.nav-menu');


    if (mobileMenuToggle) {
        mobileMenuToggle.addEventListener('click', function () {
            navMenu.classList.toggle('active');
        });
    }



    // Gestión del logout
    const logoutBtn = document.querySelector('.logout-btn');
    logoutBtn.addEventListener('click', function () {
        sessionStorage.clear();
        window.location.href = 'login.html';
    });




    // Mostrar "Información Personal" por defecto al cargar la página
    showPanel('personal');
    persInfoBtn.classList.add('active');




    // Función para obtener el nombre del trabajo según el ID
    function getJobName(jobId) {
        if (!jobId) return 'N/A';
        return jobs[jobId] || 'Unknown';
    }




    // Función para cargar los trabajos
    function loadJobs() {
        console.log('Starting jobs loading...');

        return fetch(apiUrlGetJobs)
            .then(response => response.text())
            .then(text => {
                try {
                    const jobsList = JSON.parse(text);
                    const jobSelect = document.getElementById('emp-role');
                    if (!jobSelect) {
                        console.error('No table of jobs found');

                        return;
                    }


                    jobSelect.innerHTML = '<option value="">Select a role</option>';


                    jobsList.forEach(job => {
                        const jobId = job.m_iId || job.id;
                        const jobTitle = job.m_strTitle || job.title || job.getTitle || job.m_strName || 'Unknown';
                        jobs[jobId] = jobTitle;


                        const option = document.createElement('option');
                        option.value = jobId;
                        option.textContent = jobTitle;
                        jobSelect.appendChild(option);
                    });
                } catch (e) {
                    console.error('Error parsing jobs:', e);

                }
            })
            .catch(error => {
                console.error('Error loading jobs:', error);

            });
    }




    // Función para cargar los establecimientos
    function loadEstablishments() {
        return fetch(apiUrlGetEstablishments)
            .then(response => response.text())
            .then(text => {
                try {
                    const establishmentsList = JSON.parse(text);
                    const establishmentSelect = document.getElementById('emp-establishment');
                    const productEstablishmentSelect = document.getElementById('product-establishment');


                    if (establishmentSelect) {
                        establishmentSelect.innerHTML = '<option value="">Select an establishment</option>';
                    }
                    if (productEstablishmentSelect) {
                        productEstablishmentSelect.innerHTML = '<option value="">Select an establishment</option>';
                    }


                    establishmentsList.forEach(establishment => {
                        establishments[establishment.m_iId] = establishment.m_strName || establishment.getName || establishment.name || 'Unknown';


                        if (establishmentSelect) {
                            const option = document.createElement('option');
                            option.value = establishment.m_iId;
                            option.textContent = establishments[establishment.m_iId];
                            establishmentSelect.appendChild(option);
                        }


                        if (productEstablishmentSelect) {
                            const option = document.createElement('option');
                            option.value = establishment.m_iId;
                            option.textContent = establishments[establishment.m_iId];
                            productEstablishmentSelect.appendChild(option);
                        }
                    });
                } catch (e) {
                    console.error('Error parsing establishments:', e);

                }
            })
            .catch(error => {
                console.error('Error loading establishments:', error);

            });
    }

    function resetEmployeeForm() {
        // Oculta el formulario
        employeeForm.style.display = 'none';
        // Muestra el botón de añadir empleado
        addEmployeeBtn.style.display = 'block';
        // Reinicia el formulario
        employeeForm.reset();
        // Reinicia los estados de edición
        editingEmployeeId = null;
        currentEmployeeEmail = null;
        // Muestra el campo de contraseña nuevamente y lo hace requerido
        const passwordField = document.getElementById("emp-password");
        const passwordLabel = passwordField.previousElementSibling;
        passwordField.style.display = 'block';
        passwordLabel.style.display = 'block';
        passwordField.required = true;
        // Cambia el texto del botón submit
        const submitBtn = employeeForm.querySelector('button[type="submit"]');
        submitBtn.textContent = 'Save Employee';
    }

    // Función para cargar las categorías
    function loadCategories() {
        console.log('Loading categories...');

        return fetch(apiUrlGetCategories)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`Error HTTP: ${response.status}`);
                }
                return response.text();
            })
            .then(text => {
                try {
                    console.log('Server response (categories):', text);


                    // Intentar parsear la respuesta
                    let categoriesList = [];
                    if (text && text.trim()) {
                        categoriesList = JSON.parse(text);
                    }
                    console.log('Parsed categories:', categoriesList);


                    // Limpiar el objeto categories
                    categories = {};

                    // Procesar cada categoría
                    if (Array.isArray(categoriesList)) {
                        categoriesList.forEach(category => {
                            console.log('Processing category:', category);


                            // Extraer datos de la categoría
                            const categoryData = {
                                id: category.category_id1 || category.id || category.m_iId || '',
                                name: category.name || category.m_strName || 'Sin nombre'
                            };

                            if (categoryData.id) {
                                categories[categoryData.id] = categoryData.name;
                                console.log(`Category added - ID: ${categoryData.id}, Name: ${categoryData.name}`);

                            }
                        });

                        // Actualizar el select de categorías
                        const categorySelect = document.getElementById('prod-category');
                        if (categorySelect) {
                            categorySelect.innerHTML = '<option value="">Select a category</option>';


                            Object.entries(categories).forEach(([id, name]) => {
                                const option = document.createElement('option');
                                option.value = id;
                                option.textContent = name;
                                categorySelect.appendChild(option);
                            });

                            console.log('Select of categories updated with', Object.keys(categories).length, 'options');

                        }
                    } else {
                        console.error('The response of categories is not an array:', categoriesList);

                    }

                    console.log('Categories loaded:', categories);

                    return categories;
                } catch (error) {
                    console.error('Error processing categories:', error);
                    console.error('Text that caused the error:', text);

                    throw error;
                }
            })
            .catch(error => {
                console.error('Error loading categories:', error);
                alert('Error loading categories');

                return {};
            });
    }

    // Función para cargar la lista de productos
    function loadProductsList() {
        console.log('Loading products list...');


        fetch(apiUrlGetProducts)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`Error HTTP: ${response.status}`);
                }
                return response.text();
            })
            .then(text => {
                try {
                    console.log('Server response (products):', text);

                    // Intentar parsear la respuesta
                    let products = [];
                    if (text && text.trim()) {
                        products = JSON.parse(text);
                    }
                    console.log('Parsed products:', products);


                    const tableBody = document.getElementById('products-table-body');
                    if (!tableBody) {
                        console.error('No table of products found');

                        return;
                    }

                    tableBody.innerHTML = '';

                    if (!Array.isArray(products) || products.length === 0) {
                        tableBody.innerHTML = '<tr><td colspan="5" class="text-center">No products registered</td></tr>';

                        return;
                    }

                    products.forEach(product => {
                        console.log('Original product from the DB:', product);


                        // Extraer datos del producto
                        const productData = {
                            id: product.id || product.m_iId || '',
                            name: product.name || product.m_strName || '',
                            description: product.description || product.m_strDescription || '',
                            price: parseFloat(product.price || product.m_dblPrice || 0).toFixed(2),
                            categoryId: product.category_id1 || product.m_fkCategory || '',
                            available: String(product.available || product.m_bAvailable || false).toLowerCase()
                        };

                        // Crear el select de disponibilidad si no existe
                        const availabilitySelect = document.getElementById('prod-availability');
                        if (availabilitySelect && availabilitySelect.options.length === 0) {
                            availabilitySelect.innerHTML = `
                                <option value="true">Available</option>
                                <option value="false">Not available</option>

                            `;
                        }

                        const categoryName = categories[productData.categoryId] || 'Unknown category';


                        const row = document.createElement('tr');
                        row.innerHTML = `
                            <td>${productData.name}</td>
                            <td>${productData.description}</td>
                            <td>$${productData.price}</td>
                            <td>${categoryName}</td>
                            <td>
                                <button class="action-btn edit-btn" data-id="${productData.id}">
                                    <i class="fas fa-edit"></i>
                                </button>
                                <button class="action-btn delete-btn" data-id="${productData.id}">
                                    <i class="fas fa-trash"></i>
                                </button>
                            </td>
                        `;

                        tableBody.appendChild(row);

                        // Configurar botón de editar
                        const editBtn = row.querySelector('.edit-btn');
                        editBtn.addEventListener('click', function () {
                            editingProductId = this.getAttribute('data-id');

                            // Guardar el nombre original para la actualización
                            productForm.setAttribute('data-original-name', productData.name);

                            document.getElementById("prod-name").value = productData.name;
                            document.getElementById("prod-description").value = productData.description;
                            document.getElementById("prod-category").value = productData.categoryId;
                            document.getElementById("prod-price").value = productData.price;
                            document.getElementById("prod-availability").value = productData.available === "true" ? "true" : "false";

                            productForm.style.display = 'block';
                            addProductBtn.style.display = 'none';

                            // Hacer scroll al formulario
                            productForm.scrollIntoView({ behavior: 'smooth', block: 'start' });
                        });

                        // Configurar botón de eliminar
                        const deleteBtn = row.querySelector('.delete-btn');
                        deleteBtn.addEventListener('click', function () {
                            if (confirm('Are you sure you want to delete this product?')) {
                                deleteProduct(productData.name);
                            }
                        });
                    });
                } catch (error) {
                    console.error('Error processing products:', error);
                    console.error('Text that caused the error:', text);
                    alert('Error processing products');
                }
            })
            .catch(error => {
                console.error('Invalid product name');
                alert('Error: Invalid product name');

            });
    }

    // Función para eliminar producto
    function deleteProduct(productName) {
        if (!productName) {
            console.error('Invalid product name');
            alert('Error: Invalid product name');

            return;
        }

        const params = new URLSearchParams();
        params.append('name', productName);

        const urlWithParams = `${apiUrlDeleteProduct}&${params.toString()}`;
        console.log('URL of deletion:', urlWithParams);


        fetch(urlWithParams, {
            method: "POST",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        })
            .then(response => response.text())
            .then(text => {
                console.log('Response to delete:', text);

                if (text.includes("error") || text.includes("Error")) {
                    throw new Error("Could not delete product");

                }

                alert("Product deleted correctly");

                loadProductsList();
            })
            .catch(error => {
                console.error('Error deleting product:', error);
                alert("Error deleting product: " + error.message);

            });
    }

    // Función para resetear el formulario de productos
    function resetProductForm() {
        // Oculta el formulario
        productForm.style.display = 'none';
        // Muestra el botón de añadir producto
        addProductBtn.style.display = 'block';
        // Reinicia el formulario
        productForm.reset();
        // Reinicia el estado de edición
        editingProductId = null;
        // Cambia el texto del botón submit
        const submitBtn = productForm.querySelector('button[type="submit"]');
        submitBtn.textContent = 'Save Product';
    }


    async function loadUserOrders() {
        const userData = JSON.parse(sessionStorage.getItem('userData'));
        const userRole = sessionStorage.getItem('userRole');

        if (!userData || userRole !== 'client') {
            console.warn('Solo los clientes pueden ver sus pedidos.');
            return;
        }

        const clientId = userData.m_iId;
        const ordersContainer = document.getElementById('orders-list'); // Asegúrate de tener un contenedor con este ID

        try {
            const response = await fetch('http://localhost:8080/PruebaDBConsola/Controller?ACTION=ORDER.FIND_ALL');
            if (!response.ok) throw new Error('Error al cargar pedidos');

            const allOrders = await response.json();
            console.log('Todas las órdenes del backend:', allOrders);


            // Filtrar solo los pedidos del cliente actual
            const userOrders = allOrders.filter(order => order.m_fkClient === clientId);
            console.log('Client ID desde sessionStorage:', clientId);


            ordersContainer.innerHTML = ''; // Limpiar contenido anterior

            if (userOrders.length === 0) {
                ordersContainer.innerHTML = '<p>No tienes pedidos registrados.</p>';
                return;
            }

            userOrders.forEach(order => {
                const row = document.createElement('tr');

                const idCell = document.createElement('td');
                idCell.textContent = order.m_iId;

                const totalCell = document.createElement('td');
                totalCell.textContent = `$${parseFloat(order.m_dblTotalPrice).toFixed(2)}`;

                row.appendChild(idCell);
                row.appendChild(totalCell);

                ordersContainer.appendChild(row);
            });


        } catch (error) {
            console.error('Error al cargar pedidos del cliente:', error);
            ordersContainer.innerHTML = '<p>Error al cargar tus pedidos.</p>';
        }
    }



    // Manejo del formulario de productos
    productForm?.addEventListener('submit', function (e) {
        e.preventDefault();

        // Obtener valores del formulario
        const name = document.getElementById("prod-name").value.trim();
        const description = document.getElementById("prod-description").value.trim();
        const price = document.getElementById("prod-price").value.trim();
        const category = document.getElementById("prod-category").value.trim();
        const available = document.getElementById("prod-availability").value;

        // Validar campos requeridos
        if (!name || !description || !price || !category) {
            alert('Please complete all required fields');

            return;
        }

        // Validar y convertir precio a número
        const priceNum = parseFloat(price);
        if (isNaN(priceNum)) {
            alert('The price must be a valid number');

            return;
        }

        // Determinar la imagen a usar
        let imageUrl = "img/default-product.jpg";
        const imageInput = document.getElementById("prod-image");
        if (imageInput && imageInput.files && imageInput.files.length > 0) {
            imageUrl = "img/" + imageInput.files[0].name.toLowerCase();
        }

        // Crear los parámetros para la URL
        const params = new URLSearchParams();

        // Si estamos editando un producto existente o creando uno nuevo
        let editingProductId = null;
        const isEditing = editingProductId !== null;
        const apiUrl = isEditing ? apiUrlUpdateProduct : apiUrlADDProduct;

        if (!isEditing) {
            // Para nuevos productos, generamos un ID único
            const randomId = Math.floor(Math.random() * 1000) + 1;
            params.append('id', randomId);
        }

        params.append('name', name);
        params.append('description', description);
        params.append('price', priceNum);
        params.append('available', available);
        params.append('image', imageUrl);
        params.append('category_id1', category);

        const finalUrl = `${apiUrl}&${params.toString()}`;
        console.log('URL of the operation:', finalUrl);


        // Enviar la petición
        fetch(finalUrl, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        })
            .then(response => response.text())
            .then(text => {
                console.log('Server response:', text);
                if (text.includes("error") || text.includes("Error") || text.includes("Faulty data") || text.includes("not found")) {

                    throw new Error(text);
                }

                alert(isEditing ? "Product updated correctly" : "Product added correctly");

                resetProductForm();
                loadProductsList();
            })
            .catch(error => {
                console.error('Detailed error:', error);
                alert(`Error ${isEditing ? 'updating' : 'adding'} the product: ${error.message}`);

            });
    });
});
