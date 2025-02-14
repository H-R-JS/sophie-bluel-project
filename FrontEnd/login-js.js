const API_URL = "http://localhost:5678/api/";
const API_LOGIN = "users/login";

/** Login */

const mail = document.querySelector(".log-input.email");
const passw = document.querySelector(".log-input.password");
const errorLogin = document.querySelector(".error.login");

const btnSubmit = document.querySelector(".btn-submit");
const btnLoginMenu = document.querySelector(".btn-login-menu");

btnSubmit.addEventListener("click", login);
// Add style to btn menu
if (window.location.href.includes("login.html")) {
  btnLoginMenu.style.fontWeight = "800";
}

async function login(e) {
  e.preventDefault();
  const email = mail.value;
  const password = passw.value;

  if (!email || !password) {
    errorCatch(errorLogin, "Une ou des informations sont manquantes");
  } else {
    try {
      const res = await fetch(`${API_URL}${API_LOGIN}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });
      if (res.status == 200) {
        const data = await res.json();
        localStorage.setItem("user", JSON.stringify(data));
        window.location.href = "./index.html";
      } else {
        errorCatch(
          errorLogin,
          "Une erreur s'est produite ou une information est éronnée "
        );
      }
    } catch (err) {
      console.error(err);
    }
  }
}

function errorCatch(errorElement, text) {
  errorElement.innerHTML = `${text}`;
  errorElement.style.display = "inline-block";
}
