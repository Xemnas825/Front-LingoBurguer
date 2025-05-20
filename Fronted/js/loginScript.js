document.addEventListener('DOMContentLoaded', function () {
    const apiUrl = 'http://52.44.178.183:8080/Controller';
    const apiClientUrl = 'http://52.44.178.183:8080/Controller?ACTION=CLIENT.FIND_ALL';
    const apiEmployeeUrl = 'http://52.44.178.183:8080/Controller?ACTION=EMPLOYEE.FIND_ALL';

    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');
    const forgotPasswordForm = document.getElementById('forgotPasswordForm');

    const registerLink = document.getElementById('registerLink');
    const forgotPasswordLink = document.getElementById('forgotPasswordLink');
    const alreadyHaveAccount = document.getElementById('alreadyHaveAccount');
    const rememberPasswordLink = document.getElementById('rememberPasswordLink');
    const backToLoginFromRegister = document.getElementById('backToLoginFromRegister');
    const backToLoginFromForgot = document.getElementById('backToLoginFromForgot');

    function showForm(formToShow) {
        loginForm.style.display = 'none';
        registerForm.style.display = 'none';
        forgotPasswordForm.style.display = 'none';
        formToShow.style.display = 'block';
    }

    registerLink.addEventListener('click', e => { e.preventDefault(); showForm(registerForm); });
    forgotPasswordLink.addEventListener('click', e => { e.preventDefault(); showForm(forgotPasswordForm); });
    alreadyHaveAccount.addEventListener('click', e => { e.preventDefault(); showForm(loginForm); });
    backToLoginFromRegister.addEventListener('click', e => { e.preventDefault(); showForm(loginForm); });
    backToLoginFromForgot.addEventListener('click', e => { e.preventDefault(); showForm(loginForm); });

    loginForm.addEventListener('submit', async function (e) {
        e.preventDefault();

        const email = document.getElementById('loginEmail').value.trim();
        const password = document.getElementById('loginPassword').value;

        try {
            const employeeResponse = await fetch(apiEmployeeUrl);
            const employeeData = await employeeResponse.json();

            const employee = employeeData.find(emp =>
                (emp.m_strEmail === email || emp.email === email) &&
                (emp.m_strPasswordHash === password || emp.password === password)
            );

            if (employee) {
                sessionStorage.setItem('userRole', 'employee');
                sessionStorage.setItem('userData', JSON.stringify(employee));
                window.location.href = 'userDetail.html';
                return;
            }

            const clientResponse = await fetch(apiClientUrl);
            const clientData = await clientResponse.json();

            const client = clientData.find(cli =>
                (cli.m_strEmail === email || cli.email === email) &&
                (cli.m_strPasswordHash === password || cli.password === password)
            );

            if (client) {
                sessionStorage.setItem('userRole', 'client');
                sessionStorage.setItem('userData', JSON.stringify(client));
                window.location.href = 'userDetail.html';
                return;
            }

            alert('Invalid email or password');
        } catch (error) {
            console.error('Login error:', error);
            alert('An error occurred during login. Please try again.');
        }
    });

   document.getElementById("submitBtn").addEventListener("click", async function (e) {
    e.preventDefault();
    const password = document.getElementById("registerPassword").value;
    const confirmPassword = document.getElementById("confirmPassword").value;

    if (confirmPassword !== password || password === "") {
        alert("Las contraseñas deben coincidir");
        return;
    }

    const userObj = {
        first_name: document.getElementById("registerName").value.trim(),
        last_name: document.getElementById("registerLastName").value.trim(),
        email: document.getElementById("registerEmail").value.trim(),
        telephone: document.getElementById("registerPhoneNumber").value.trim(),
        password_hash: password
    };

    for (let key in userObj) {
        if (!userObj[key]) {
            alert("Por favor, complete todos los campos");
            return;
        }
    }

    try {
        // Validar si el email ya existe
        const [employeeRes, clientRes] = await Promise.all([
            fetch('http://52.44.178.183:8080/Controller?ACTION=EMPLOYEE.FIND_ALL'),
            fetch('http://52.44.178.183:8080/Controller?ACTION=CLIENT.FIND_ALL')
        ]);

        const employeeData = await employeeRes.json();
        const clientData = await clientRes.json();

        const emailExists = employeeData.some(emp =>
            emp.m_strEmail === userObj.email || emp.email === userObj.email
        ) || clientData.some(cli =>
            cli.m_strEmail === userObj.email || cli.email === userObj.email
        );

        if (emailExists) {
            alert("Este correo ya está registrado como empleado o cliente.");
            return;
        }

        const params = new URLSearchParams();
        params.append('ACTION', 'CLIENT.ADD');
        for (let key in userObj) {
            params.append(key, userObj[key]);
        }

        const response = await fetch(`${apiUrl}?${params.toString()}`, {
            method: "POST",
            headers: { 'Accept': 'application/json' }
        });

        const text = await response.text();

        if (text === "Faltan datos" || text.includes("No se pudo")) {
            throw new Error(text);
        }

        alert("Cliente registrado correctamente");
        window.location.href = 'index.html';

    } catch (error) {
        console.error("Error en registro:", error);
        alert("Error al registrar: " + error.message);
    }
});


    forgotPasswordForm.addEventListener('submit', function (e) {
        e.preventDefault();
        const resetEmail = document.getElementById('resetEmail').value;
        alert('If an account exists with ' + resetEmail + ', you will receive a password reset email.');
        showForm(loginForm);
    });
});
