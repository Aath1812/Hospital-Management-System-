let loginbtn = document.getElementById("login_btn");
 let signUpPage = document.getElementById("signup");
 let logInPage = document.getElementById("login");
 let signupSubmit = document.getElementById("signupbtn");
 let signupbtn = document.getElementById("signup_btn");
 let loginSubmit = document.getElementById("loginbtn");

 loginbtn.addEventListener('click', (e) =>{
    signUpPage.style.display = 'none';
    logInPage.style.display = 'block';
    })

 signupbtn.addEventListener('click', (e) =>{
 signUpPage.style.display = 'block';
 logInPage.style.display = 'none';
 })

 signupSubmit.addEventListener('click', (e) => {
     let email = document.getElementById("email").value;
     let password = document.getElementById("password").value;
     let firstname = document.getElementById("firstName").value;
     let lastname = document.getElementById("lastName").value;

     if(!email || !password || !firstname || !lastname){
         alert("All fields are required");
         return;
     }

     if(localStorage.getItem(email) === password){
      alert("User registered already");
      return;
      }

 localStorage.setItem(email,password);
 alert("New user Registered");
 window.location.href = "landing.html";
 })

loginSubmit.addEventListener('click', (e) => {
    e.preventDefault();
    let email = document.getElementById("email_login").value;
    let password = document.getElementById("password_login").value;       

    if(!email || !password){
        alert("All fields are required");
        return;
    }

    let savedPassword = localStorage.getItem(email);
    if(!(savedPassword==password)){
        alert("Invalid email or password");
        return;
    }
    
    alert("Login successful");
    window.location.href = "home.html";
    }) 

