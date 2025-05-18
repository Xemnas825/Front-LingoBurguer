document.addEventListener('DOMContentLoaded', function() {
   //API Example format: 'http://localhost:8080/PruebaDBConsola/Controller?ACTION=EMPLOYEE.FIND_ALL'
   const apiUrl = 'http://localhost:8080/PruebaDBConsola/Controller?ACTION=CLIENT.';
   const apiClientUrl = 'http://localhost:8080/PruebaDBConsola/Controller?ACTION=CLIENT.FIND_ALL';

   const apiEmployeeUrl = 'http://localhost:8080/PruebaDBConsola/Controller?ACTION=CLIENT.FIND_ALL';
   
    // References to the forms
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');
    const forgotPasswordForm = document.getElementById('forgotPasswordForm');

    // References to the links that change between forms
    const registerLink = document.getElementById('registerLink');
    const forgotPasswordLink = document.getElementById('forgotPasswordLink');
    const alreadyHaveAccount = document.getElementById('alreadyHaveAccount');
    const rememberPasswordLink = document.getElementById('rememberPasswordLink');
    const backToLoginFromRegister = document.getElementById('backToLoginFromRegister');
    const backToLoginFromForgot = document.getElementById('backToLoginFromForgot');

    // Register elements
    // const registerBtn = documentElement.getElementById('registerPassword').value;
    // const confirRegister = documentElement.getElementById('confirmPassword').value;
    const submitBtn = document.getElementById('submitButton');
    

    // Function to show a form and hide the others
    function showForm(formToShow) {
        // Hide all forms
        loginForm.style.display = 'none';
        registerForm.style.display = 'none';
        forgotPasswordForm.style.display = 'none';
        
        // Show the selected form
        formToShow.style.display = 'block';
    }

    // Event to change to the registration form
    registerLink.addEventListener('click', function(e) {
        e.preventDefault();
        showForm(registerForm);
    });

    // Event to change to the forgot password form
    forgotPasswordLink.addEventListener('click', function(e) {
        e.preventDefault();
        showForm(forgotPasswordForm);
    });

    // Event to go back to login from registration
    alreadyHaveAccount.addEventListener('click', function(e) {
        e.preventDefault();
        showForm(loginForm);
    });

    // Event to go back to login from the registration back button
    backToLoginFromRegister.addEventListener('click', function(e) {
        e.preventDefault();
        showForm(loginForm);
    });

    // Event to go back to login from the forgot password back button
    rememberPasswordLink.addEventListener('click', function(e) {
        e.preventDefault();
        showForm(loginForm);
    });

    // Event to go back to login from the forgot password back button
    backToLoginFromForgot.addEventListener('click', function(e) {
        e.preventDefault();
        showForm(loginForm);
    });

    // Handle form submission
    loginForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        const email = document.getElementById('loginEmail').value;
        const password = document.getElementById('loginPassword').value;

        try {
            // First try to search in employees
            const employeeResponse = await fetch(apiEmployeeUrl);
            const employeeData = await employeeResponse.json();
            const employee = employeeData.find(emp => emp.email === email && emp.password === password);

            if (employee) {
                // It's an employee
                sessionStorage.setItem('userRole', 'employee');
                sessionStorage.setItem('userData', JSON.stringify(employee));
                window.location.href = 'userDetail.html';
                return;
            }

            // If it's not an employee, search in clients
            const clientResponse = await fetch(apiClientUrl);
            const clientData = await clientResponse.json();
            const client = clientData.find(cli => cli.email === email && cli.password === password);

            if (client) {
                // It's a client
                sessionStorage.setItem('userRole', 'client');
                sessionStorage.setItem('userData', JSON.stringify(client));
                window.location.href = 'userDetail.html';
                return;
            }

            // If it's not found in any base
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
        const param = { //create request 
            headers:{'content-type': 'application/json; charset = UTF-8'}, // Formatos del param
            body:userObj, //what is in the param
            method: 'POST', // what we do with the param, can be GET, PUT, POST and DELETE
            mode:'cors', //policy
        };


        if(confirm.value != password.value){
             alert('The password must be the same');
             document.getElementById('registerPassword').style.backgroundColor = "#ab371f" // is not very strong red;
             document.getElementById('confirmPassword').style.backgroundColor = "#ab371f" // is not very strong red;
        }else{
            //incomplete url D:
            console.log("soy el userObj: ",userObj);
            console.log("soy el param: ",param);
            console.log("soy la api: ",apiUrl);
            
            fetch(apiUrl,param) // the url and what we send to that url pal back
                .then(function(response){ // if the back responds ok (that the param has arrived)
                    if(response.ok){
                        return response.json();//returns 
                    }else{
                        throw new Error ('No llego capo, socorro:' + response.statusText);
                    }
                })
            return true;
        }
    })

    ///////////////////////
    // Register data //
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
            // By default we register as a client
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
        // Here goes your logic to process the password recovery
        const resetEmail = document.getElementById('resetEmail').value;
        alert('If an account exists with ' + resetEmail + ', you will receive a password reset email.');
        showForm(loginForm);
    });
});