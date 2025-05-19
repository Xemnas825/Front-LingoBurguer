document.addEventListener('DOMContentLoaded', function () {
    const apiUrlADDClient = 'http://localhost:8080/PruebaDBConsola/Controller';
    const apiClientUrl = 'http://localhost:8080/PruebaDBConsola/Controller?ACTION=CLIENT.FIND_ALL';
    const apiEmployeeUrl = 'http://localhost:8080/PruebaDBConsola/Controller?ACTION=EMPLOYEE.FIND_ALL';

    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');
    const forgotPasswordForm = document.getElementById('forgotPasswordForm');

    const registerLink = document.getElementById('registerLink');
    const forgotPasswordLink = document.getElementById('forgotPasswordLink');
    const alreadyHaveAccount = document.getElementById('alreadyHaveAccount');
    const rememberPasswordLink = document.getElementById('rememberPasswordLink');
    const backToLoginFromRegister = document.getElementById('backToLoginFromRegister');
    const backToLoginFromForgot = document.getElementById('backToLoginFromForgot');

    
    const submitBtn = document.getElementById('submitButton');
    

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

    // Evento para volver al formulario de inicio de sesión desde el registro
    alreadyHaveAccount.addEventListener('click', function(e) {
        e.preventDefault();
        showForm(loginForm);
    });

    // Evento para volver al formulario de inicio de sesión desde el botón de registro
    backToLoginFromRegister.addEventListener('click', function(e) {
        e.preventDefault();
        showForm(loginForm);
    });

    // Evento para volver al formulario de inicio de sesión desde el botón de recuperación de contraseña
    rememberPasswordLink.addEventListener('click', function(e) {
        e.preventDefault();
        showForm(loginForm);
    });

    // Evento para volver al formulario de inicio de sesión desde el botón de recuperación de contraseña
    backToLoginFromForgot.addEventListener('click', function(e) {
        e.preventDefault();
        showForm(loginForm);
    });

    // Manejar la presentación del formulario
    loginForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        const email = document.getElementById('loginEmail').value;
        const password = document.getElementById('loginPassword').value;

        try {
            // Primero intenta buscar en empleados
            const employeeResponse = await fetch(apiEmployeeUrl);
            const employeeData = await employeeResponse.json();

            const employee = employeeData.find(emp =>
                (emp.m_strEmail === email || emp.email === email) &&
                (emp.m_strPasswordHash === password || emp.password === password)
            );

            if (employee) {
                // Es un empleado
                sessionStorage.setItem('userRole', 'employee');
                sessionStorage.setItem('userData', JSON.stringify(employee));
                window.location.href = 'index.html';
                return;
            }

            // Si no es un empleado, busca en clientes
            const clientResponse = await fetch(apiClientUrl);
            const clientData = await clientResponse.json();

            const client = clientData.find(cli =>
                (cli.m_strEmail === email || cli.email === email) &&
                (cli.m_strPasswordHash === password || cli.password === password)
            );

            if (client) {
                // Es un cliente
                sessionStorage.setItem('userRole', 'client');
                sessionStorage.setItem('userData', JSON.stringify(client));
                window.location.href = 'index.html';
                return;
            }

            // Si no se encuentra en ninguna base de datos
            alert('Invalid email or password');
        } catch (error) {
            console.error('Login error:', error);
            alert('An error occurred during login. Please try again.');
        }
    });

    //Show in class
    submitBtn.addEventListener('click',function(e){
        const password = document.querySelector('input[id=registerPassword]');
        const confirm = document.querySelector('input[id=confirmPassword]');

        const userObj = { // create obj
            first_name: document.getElementById('registerName').value,
            last_name: document.getElementById('registerLastName').value,
            telephone: document.getElementById('registerPhoneNumber').value,
            email: document.getElementById('registerEmail').value,
            password_hash: document.getElementById('registerPassword').value,
        }
        const param = {  
            headers:{'content-type': 'application/json; charset = UTF-8'}, 
            body:userObj, 
            method: 'POST', 
            mode:'cors', 
        };


        if(confirm.value != password.value){
             alert('The password must be the same');
             document.getElementById('registerPassword').style.backgroundColor = "#ab371f" 
             document.getElementById('confirmPassword').style.backgroundColor = "#ab371f" 
        }else{
            //incomplete url D:
            console.log("soy el userObj: ",userObj);
            console.log("soy el param: ",param);
            console.log("soy la api: ",apiUrl);
            
            fetch(apiUrl,param) // la url y lo que enviamos a esa url pal back
                .then(function(response){ 
                    if(response.ok){
                        return response.json(); 
                    }else{
                        throw new Error ('I can not get the data:' + response.statusText);
                    }
                })
            return true;
        }
    })

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

    forgotPasswordForm.addEventListener('submit', function (e) {
        e.preventDefault();
        const resetEmail = document.getElementById('resetEmail').value;
        alert('If an account exists with ' + resetEmail + ', you will receive a password reset email.');
        showForm(loginForm);
    });
});
