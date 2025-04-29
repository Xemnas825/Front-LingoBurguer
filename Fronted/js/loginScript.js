document.addEventListener('DOMContentLoaded', function() {
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
    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();
        // Aquí iría tu lógica para procesar el login
        console.log('Login submitted');
        // loginEmail y loginPassword tienen los datos
    });


    ///////////////////////
    // Registro de datos //
    ///////////////////////
    registerForm.addEventListener('submit', function(e) {
        e.preventDefault();
        // Aquí iría tu lógica para procesar el registro
        console.log('Register submitted');
        // registerName, registerEmail, registerPassword, confirmPassword, etc tienen los datos
    });

    forgotPasswordForm.addEventListener('submit', function(e) {
        e.preventDefault();
        // Aquí iría tu lógica para procesar la recuperación de contraseña
        console.log('Password reset submitted');
        // resetEmail tiene el dato
    });
});