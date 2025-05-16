document.addEventListener('DOMContentLoaded', function() {
   //Referencia API Ejemplo formato: 'http://localhost:8080/PruebaDBConsola/Controller?ACTION=EMPLOYEE.FIND_ALL'
   const apiUrlADDClient = 'http://localhost:8080/PruebaDBConsola/Controller';
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

    //Elementos de registro
    // const registerBtn = documentElement.getElementById('registerPassword').value;
    // const confirRegister = documentElement.getElementById('confirmPassword').value;
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

    // var check = function(){
    //     if(registerBtn != confirRegister ){
    //         alert("aushdaidfhisadf");
    //     }
    // }

    // function joseluis(event){
    //     const password = document.querySelector('input[id=registerPassword]');
    //     const confirm = document.querySelector('input[id=confirmPassword]');

    //     if(confirm.value != password.value){
    //         alert('asd');
    //     }
    // }



    //Enseñar en clase (funcion del boton submit)
    document.getElementById("submitBtn").addEventListener("click", function (e) {
        e.preventDefault(); // Evita la recarga de la página al enviar el formulario
    
        const password = document.getElementById("registerPassword").value;
        const confirmPassword = document.getElementById("confirmPassword").value;
    
        if (confirmPassword !== password || password === "") {
            alert("Las contraseñas deben coincidir");
            document.getElementById("registerPassword").style.backgroundColor = "#ab371f";
            document.getElementById("confirmPassword").style.backgroundColor = "#ab371f";
            return; // Salimos de la función si hay error
        }
    
        // Crear objeto con los datos en el formato esperado
        const userObj = {
            first_name: document.getElementById("registerName").value,
            last_name: document.getElementById("registerLastName").value,
            email: document.getElementById("registerEmail").value,
            telephone: document.getElementById("registerPhoneNumber").value,
            password_hash: password
        };

        // Validar que todos los campos estén llenos
        for (let key in userObj) {
            if (!userObj[key]) {
                alert("Por favor, complete todos los campos");
                return;
            }
        }

        // Crear los parámetros de la URL
        const params = new URLSearchParams();
        params.append('ACTION', 'CLIENT.ADD');
        
        // Añadir los parámetros del usuario exactamente como los espera el backend
        for (let key in userObj) {
            params.append(key, userObj[key]);
        }

        // Construir la URL completa
        const urlWithParams = `${apiUrlADDClient}?${params.toString()}`;

        console.log("==== DATOS DE LA PETICIÓN ====");
        console.log("URL completa:", urlWithParams);
        console.log("Método:", "POST");
        console.log("Parámetros enviados:", {
            ACTION: 'CLIENT.ADD',
            ...userObj
        });
        console.log("URL decodificada:", decodeURIComponent(urlWithParams));
        console.log("==========================");

        // Configuración de `fetch()`
        fetch(urlWithParams, {
            method: "POST",
            headers: {
                'Accept': 'application/json'
            }
        })
        .then(response => {
            console.log("==== RESPUESTA DEL SERVIDOR ====");
            console.log("Status:", response.status);
            console.log("Status Text:", response.statusText);
            console.log("Headers:", Object.fromEntries(response.headers));
            
            return response.text().then(text => {
                console.log("Respuesta completa (raw):", text);
                console.log("==========================");
                
                // Consideramos cualquier respuesta que no sea un error explícito como exitosa
                if (text === "Faltan datos") {
                    throw new Error("Por favor, complete todos los campos correctamente");
                }
                
                if (text === "No se pudo agregar el cliente") {
                    throw new Error("No se pudo agregar el cliente. Por favor, intente nuevamente");
                }

                // Si llegamos aquí, consideramos que el registro fue exitoso
                alert("Cliente registrado correctamente");
                window.location.href = 'index.html';
                return { status: "success" };
            });
        })
        .catch(error => {
            console.error("Error en la petición:", error);
            // Solo mostramos alert para errores específicos
            if (error.message.includes("complete todos los campos") || 
                error.message.includes("No se pudo agregar el cliente")) {
                alert("Error al registrar: " + error.message);
            }
        });
    });



    forgotPasswordForm.addEventListener('submit', function(e) {
        e.preventDefault();
        // Aquí iría tu lógica para procesar la recuperación de contraseña
        const resetEmail = document.getElementById('resetEmail').value;
        alert('If an account exists with ' + resetEmail + ', you will receive a password reset email.');
        showForm(loginForm);
    });
});