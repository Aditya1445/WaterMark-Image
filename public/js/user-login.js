const loginForm = document.getElementById("loginForm");
const inputEmail = document.getElementById("email");
const inputPassword = document.getElementById("password");

// form error handler
const emailError = document.getElementById("email-error");
const passwordError = document.getElementById("password-error");
const emailFontStyleDom = document.querySelector(".font-mail");
const fontPasswordStyle = document.querySelector(".font-password");

loginForm.addEventListener("submit", async function (event) {
  event.preventDefault();
  emailError.innerText = "";
  passwordError.innerText = "";

  const formValue = { email: inputEmail.value, password: inputPassword.value };
  try {
    const response = await axios.post("/users/login", formValue);
    if (response.status === 200) {
      console.log(response);
      alert("Successfully LoggedIn");
      location.assign('/home');    }
  } catch (e) {
    console.log("Error", e.response.data);
    emailError.innerText = e.response.data.error.email;
    passwordError.innerText = e.response.data.error.password;
    emailFontStyleDom.style.top = emailError.textContent !== "" ? "55%" : "" 
    fontPasswordStyle.style.top = passwordError.textContent !== "" ? "53%" : ""
  }
});
