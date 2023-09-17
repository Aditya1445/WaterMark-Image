const signupForm = document.querySelector("#signUpForm");
const userName = document.querySelector("#name");
const userMail = document.querySelector("#email");
const userPassword = document.querySelector("#password");

// Signup form email handler
const userNameError = document.querySelector("#name-error");
const userMailError = document.querySelector("#email-error");
const userPasswordError = document.querySelector("#password-error");

// font-icons styling
const nameFontStyleDom = document.querySelector(".font-name");
const mailFontStyleDom = document.querySelector(".font-mail");
const passwordFontStyleDom = document.querySelector(".font-password");

signupForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  userNameError.innerText = "";
  userMailError.innerText = "";
  userPasswordError.innerText = "";

  const formValue = {
    name: userName.value,
    email: userMail.value,
    password: userPassword.value,
  };

  try {
    let response = await axios.post("/users/signup", formValue);
    if (response.status === 201) {
      alert('Welcome!')
      axios.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`;
      location.assign("/home");
    }
  } catch (error) {
    userNameError.innerText = error.response.data.name;
    userPasswordError.innerText = error.response.data.password;
    userMailError.innerText = error.response.data.email;

    nameFontStyleDom.style.top = userNameError.innerText !== "" ? "53%" : "";
    passwordFontStyleDom.style.top =
      userPasswordError.innerText !== "" ? "53%" : "";
    mailFontStyleDom.style.top = userMailError.innerText !== "" ? "53%" : "";
  }
});
