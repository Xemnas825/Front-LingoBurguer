document.addEventListener('DOMContentLoaded', function() {
   //Referencia API Ejemplo formato: 'http://localhost:8080/PruebaDBConsola/Controller?ACTION=EMPLOYEE.FIND_ALL'
   const apiClientUrl = 'http://localhost:8080/PruebaDBConsola/Controller?ACTION=CLIENT.FIND_ALL';
   const apiEmployeeUrl = 'http://localhost:8080/PruebaDBConsola/Controller?ACTION=EMPLOYEE.FIND_ALL';
   
    // Referencias a los formularios
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');
    const forgotPasswordForm = document.getElementById('forgotPasswordForm');

    // Referencias a los enlaces que cambian entre formularios
    const registerLink = document.getElementById('registerLink');
    const forgotPasswordLink = document.getElementById('forgotPasswordLink');
    const alreadyHaveAccount = document.getElementById('alreadyHaveAccount');
    const rememberPasswordLink = document.getElementById('rememberPasswordLink');
    const backToLoginFromRegister = document.getElementById('backToLoginFromRegister');
    const backToLoginFromForgot = document.getElementById('backToLoginFromForgot');

    // Función para mostrar un formulario y ocultar los demás
    function showForm(formToShow) {
        // Ocultar todos los formularios
        loginForm.style.display = 'none';
        registerForm.style.display = 'none';
        forgotPasswordForm.style.display = 'none';
        
        // Mostrar el formulario seleccionado
        formToShow.style.display = 'block';
    }

    // Evento para cambiar al formulario de registro
    registerLink.addEventListener('click', function(e) {
        e.preventDefault();
        showForm(registerForm);
    });

    // Evento para cambiar al formulario de recuperación de contraseña
    forgotPasswordLink.addEventListener('click', function(e) {
        e.preventDefault();
        showForm(forgotPasswordForm);
    });

    // Evento para volver al login desde el registro
    alreadyHaveAccount.addEventListener('click', function(e) {
        e.preventDefault();
        showForm(loginForm);
    });

    // Evento para volver al login desde el botón de atrás del registro
    backToLoginFromRegister.addEventListener('click', function(e) {
        e.preventDefault();
        showForm(loginForm);
    });

    // Evento para volver al login desde recuperación de contraseña
    rememberPasswordLink.addEventListener('click', function(e) {
        e.preventDefault();
        showForm(loginForm);
    });

    // Evento para volver al login desde el botón de atrás de recuperación de contraseña
    backToLoginFromForgot.addEventListener('click', function(e) {
        e.preventDefault();
        showForm(loginForm);
    });

    // Manejo de envío de formularios
    loginForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        const email = document.getElementById('loginEmail').value;
        const password = document.getElementById('loginPassword').value;

        try {
            // Primero intentamos buscar en empleados
            const employeeResponse = await fetch(apiEmployeeUrl);
            const employeeData = await employeeResponse.json();
            const employee = employeeData.find(emp => emp.email === email && emp.password === password);

            if (employee) {
                // Es un empleado
                sessionStorage.setItem('userRole', 'employee');
                sessionStorage.setItem('userData', JSON.stringify(employee));
                window.location.href = 'userDetail.html';
                return;
            }

            // Si no es empleado, buscamos en clientes
            const clientResponse = await fetch(apiClientUrl);
            const clientData = await clientResponse.json();
            const client = clientData.find(cli => cli.email === email && cli.password === password);

            if (client) {
                // Es un cliente
                sessionStorage.setItem('userRole', 'client');
                sessionStorage.setItem('userData', JSON.stringify(client));
                window.location.href = 'userDetail.html';
                return;
            }

            // Si no se encuentra en ninguna base
            alert('Invalid email or password');

        } catch (error) {
            console.error('Error during login:', error);
            alert('An error occurred during login. Please try again.');
        }
    });

    ///////////////////////
    // Registro de datos //
    ///////////////////////
    registerForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const userData = {
            name: document.getElementById('registerName').value,
            lastName: document.getElementById('registerLastName').value,
            birthDate: document.getElementById('registerBirth').value,
            phoneNumber: document.getElementById('registerPhoneNumber').value,
            email: document.getElementById('registerEmail').value,
            password: document.getElementById('registerPassword').value
        };

        const confirmPassword = document.getElementById('confirmPassword').value;

        if (userData.password !== confirmPassword) {
            alert('Passwords do not match');
            return;
        }

        try {
            // Por defecto registramos como cliente
            const response = await fetch(apiClientUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(userData)
            });

            if (response.ok) {
                alert('Registration successful!');
                showForm(loginForm);
            } else {
                alert('Error during registration. Please try again.');
            }
        } catch (error) {
            console.error('Error during registration:', error);
            alert('An error occurred during registration. Please try again.');
        }
    });

    forgotPasswordForm.addEventListener('submit', function(e) {
        e.preventDefault();
        // Aquí iría tu lógica para procesar la recuperación de contraseña
        const resetEmail = document.getElementById('resetEmail').value;
        alert('If an account exists with ' + resetEmail + ', you will receive a password reset email.');
        showForm(loginForm);
    });
});