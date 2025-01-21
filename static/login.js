document.addEventListener("DOMContentLoaded", function() {
    // Attach the verifyUser function to the form submission
    const form = document.querySelector('.login-form');
    form.addEventListener('submit', function(event) {
        event.preventDefault(); // Prevent the default form submission
        verifyUser(); // Call your verification function
    });
});

function verifyUser(){
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;
    
    var xhr = new XMLHttpRequest(); 
    var url = new URL("http://localhost:5500/api/verifyUser");
    xhr.open("POST", url, true);

    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");

    var params = new URLSearchParams();
    params.append('login', username);
    params.append('password', password);
    
    xhr.onload = function (){
        if (xhr.status === 200) {
            responce = JSON.parse(xhr.responseText);
            if (this.response == '"user"'){
                window.location.href = "userPanel.html";
            } else if (this.response.role == '"admin"'){
                window.location.href = "adminPanel.html";
            }
            localStorage.setItem('username', username);
            localStorage.setItem('password', password);
        } else {
            console.log(xhr.status)
            alert("Неверный логин и пароль")   
        }
    }
    xhr.send(params.toString());
}
