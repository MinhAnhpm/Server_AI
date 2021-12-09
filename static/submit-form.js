function cambiar_login() {
    document.querySelector('.cont_forms').className = "cont_forms cont_forms_active_login";
    document.querySelector('.cont_form_login').style.display = "block";
    document.querySelector('.cont_form_sign_up').style.opacity = "0";

    setTimeout(function() {
        document.querySelector('.cont_form_login').style.opacity = "1";
    }, 400);

    setTimeout(function() {
        document.querySelector('.cont_form_sign_up').style.display = "none";
    }, 200);
}

function cambiar_sign_up(at) {
    document.querySelector('.cont_forms').className = "cont_forms cont_forms_active_sign_up";
    document.querySelector('.cont_form_sign_up').style.display = "block";
    document.querySelector('.cont_form_login').style.opacity = "0";

    setTimeout(function() {
        document.querySelector('.cont_form_sign_up').style.opacity = "1";
    }, 100);

    setTimeout(function() {
        document.querySelector('.cont_form_login').style.display = "none";
    }, 400);
}

function ocultar_login_sign_up() {
    document.querySelector('.cont_forms').className = "cont_forms";
    document.querySelector('.cont_form_sign_up').style.opacity = "0";
    document.querySelector('.cont_form_login').style.opacity = "0";

    setTimeout(function() {
        document.querySelector('.cont_form_sign_up').style.display = "none";
        document.querySelector('.cont_form_login').style.display = "none";
    }, 500);

}

var mailformat = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;

function validate_login() {
    let uEmail = document.getElementById("uEmail").value;
    let uPwd = document.getElementById("uPwd").value;
    if (uEmail === "" || uPwd === "") {
        alert("All fields must be filled in!");
        return false;
    }
    if ((!mailformat.test(uEmail))) {
        alert(uEmail + " isn't an email!");
    } else {
        login(uEmail, uPwd);
    }

}

function login(email, password) {
    let data = {
        "email": email,
        "password": password
    }
    axios.post(`http://104.215.180.216:5000/User/login`, data)
        .then((result) => {
            window.open("http://127.0.0.1:5000");
        }).catch((error) => {
            location.reload();
            alert("Email or Password is incorrect!");
        })
}


function validate_sign_up() {
    let sEmail = document.getElementById("sEmail").value;
    let sUserName = document.getElementById("sUserName").value;
    let sPwd = document.getElementById("sPwd").value;
    let sCfPwd = document.getElementById("sCfPwd").value;
    let sPhone = document.getElementById("sPhone").value;

    //Email 
    if (!mailformat.test(sEmail)) {
        alert(sEmail + " can't be an email. Please check your email!");
        return false;
    }

    //Name 
    if (sUserName == '' || sUserName.length < 5 || !/^[a-zA-Z0-9]+$/.test(sUserName)) {
        flag = false;
        alert(sUserName + " can't be set to a name. Please check your username!");
        return false;
    }

    //Password 
    if (sPwd == '' || sPwd.length < 8 || sPwd != sCfPwd) {
        alert(sPwd + " can't be set to a password. Please check your password and confirm it!");
        return false;
    }

    //Phone
    if (sPhone != '' && !/^[0-9]{10}$/.test(sPhone)) {
        alert(sPhone + " can't be a phone number. Please check your phone number!");
        return false;
    }

    register(sEmail, sUserName, sPwd, sPhone);

}

function register(email, name, password, phoneNumber) {
    let data = {
        "email": email,
        "name": name,
        "password": password,
        "phoneNumber": phoneNumber
    }
    axios.post(`http://104.215.180.216:5000/User/register`, data)
        .then((result) => {
            alert("Succes");
        }).catch((error) => {
            alert("Existed email!");
        })
}