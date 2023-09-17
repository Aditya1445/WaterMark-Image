const detailsForm = document.querySelector("#detailsForm");
const email = document.querySelector("#email");
const password = document.querySelector("#password");
const emailError = document.getElementById("email-error");
const passwordError = document.getElementById("password-error");
const nameError = document.getElementById("name-error");
const deleteProfile = document.getElementById("deleteProfile");
const togglePassword = document.getElementById("togglePassword");

const getUserDetail = async function () {
  try {
    const response = await axios.get("/users/me");
    console.log(response);
    if (response.status === 200) {
      const {
        data: { user },
      } = response;
      detailsForm.name.value = user.name;
      detailsForm.email.value = user.email;
    }
  } catch (error) {
    console.log(error);
  }
};
togglePassword.addEventListener("click", function (e) {
  const type =
    password.getAttribute("type") === "password" ? "text" : "password";
  password.setAttribute("type", type);
  this.classList.toggle("fa-eye");
});

// get user profile upon page load
getUserDetail();

// Update user profile

// font-icons styling
const nameFontStyleDom = document.querySelector(".font-name");
const mailFontStyleDom = document.querySelector(".font-mail");
const passwordFontStyleDom = document.querySelector(".font-password");
detailsForm.addEventListener("submit", async function (e) {
  e.preventDefault();
  nameError.textContent = "";
  emailError.textContent = "";
  passwordError.textContent = "";

  const formValue = {
    name: detailsForm.name.value,
    email: detailsForm.email.value,
  };
  if (detailsForm.password.value !== "") {
    formValue.password = detailsForm.password.value;
  }
  try {
    const response = await axios.patch("/users/me", formValue);
    if (response.status === 200) {
      location.reload(location.href);
      getUserDetail();
    }
  } catch (error) {
    const {
      response: { data },
    } = error;
    nameError.textContent = data.name;
    emailError.textContent = data.email;
    passwordError.textContent = data.password;
    nameFontStyleDom.style.top = nameError.innerText !== "" ? "60%" : "";
    passwordFontStyleDom.style.top =
      passwordError.innerText !== "" ? "60%" : "";
    mailFontStyleDom.style.top = emailError.innerText !== "" ? "60%" : "";
  }
});

// delete user profile
deleteProfile.addEventListener('click', async function(e){
    e.preventDefault()
    try {
        const response = await axios.delete('/users/me');
        if(response.status === 200){
            console.log(response)
            location.assign('/users/signup')
            alert('Account removed successfully')
        }
    } catch (error) {
        console.log(error)
    }
})