document.addEventListener('DOMContentLoaded', function() {
   //Referencia API Ejemplo formato: 'http://localhost:8080/PruebaDBConsola/Controller?ACTION=EMPLOYEE.FIND_ALL'
   const apiUrl = 'http://localhost:8080/PruebaDBConsola/Controller?ACTION=CLIENT.';
   const apiClientUrl = 'http://localhost:8080/PruebaDBConsola/Controller?ACTION=CLIENT.FIND_ALL';
   const apiEmployeeUrl = 'http://localhost:8080/PruebaDBConsola/Controller?ACTION=CLIENT.FIND_ALL';
   
   

   
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
    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();
        // Aquí iría tu lógica para procesar el login
        console.log('Login submitted');
        // loginEmail y loginPassword tienen los datos
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



    //Enseñar en clase
    submitBtn.addEventListener('click',function(e){
        const password = document.querySelector('input[id=registerPassword]');
        const confirm = document.querySelector('input[id=confirmPassword]');

        const userObj = { // creamos obj
            first_name: document.getElementById('registerName').value,
            last_name: document.getElementById('registerLastName').value,
            telephone: document.getElementById('registerPhoneNumber').value,
            email: document.getElementById('registerEmail').value,
            password_hash: document.getElementById('registerPassword').value,
        }
        const param = { //creamos peticion 
            headers:{'content-type': 'application/json; charset = UTF-8'}, // Formatos del param
            body:userObj, //lo que hay en el param
            method: 'POST', // lo que hacemos con el param, se puede poner GET, PUT, POST y DELETE
            mode:'cors', //politica
        };



        if(confirm.value != password.value){
             alert('The password must be the same');
             document.getElementById('registerPassword').style.backgroundColor = "#ab371f" // es rojo no muy fuerte;
             document.getElementById('confirmPassword').style.backgroundColor = "#ab371f" // es rojo no muy fuerte;
        }else{
            //url incompleta D:
            console.log("soy el userObj: ",userObj);
            console.log("soy el param: ",param);
            console.log("soy la api: ",apiUrl);
            
            fetch(apiUrl,param) // la url y lo que mandamos a esa url pal back
                .then(function(response){ // si el back responde ok (que ha llegado el param)
                    if(response.ok){
                        return response.json();//nos devuelve 
                    }else{
                        throw new Error ('No llego capo, socorro:' + response.statusText);
                    }
                })
            return true;
        }
    })

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