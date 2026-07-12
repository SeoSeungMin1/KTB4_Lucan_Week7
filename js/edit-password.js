const backButton = document.querySelector(".back-button");

const profileImage = document.querySelector("#profileImage");
const profileDropdown = document.querySelector("#profileDropdown");

const editProfileMenu = document.querySelector("#editProfileMenu");
const editPasswordMenu = document.querySelector("#editPasswordMenu");
const logoutButton = document.querySelector("#logoutButton");

const currentPasswordInput = document.querySelector("#currentPassword");
const passwordInput = document.querySelector("#password");
const passwordConfirmInput = document.querySelector("#passwordConfirm");
const passwordSubmitButton = document.querySelector("#passwordSubmitButton");

const toast = document.querySelector("#toast");

backButton.addEventListener("click", function () {
    location.href = "./login.html";
});

profileImage.addEventListener("click", function () {
    profileDropdown.classList.toggle("show");
});

editProfileMenu.addEventListener("click", function () {
    location.href = "./edit-profile.html";
});

editPasswordMenu.addEventListener("click", function () {
    location.href = "./edit-password.html";
});

logoutButton.addEventListener("click", async function () {
    await fetch("http://localhost:8080/users/logout", {
        method: "POST",
        credentials: "include"
    });

    localStorage.clear();
    location.href = "./login.html";
});

passwordSubmitButton.addEventListener("click", function () {
    const userId = localStorage.getItem("userId");

    const currentPassword = currentPasswordInput.value.trim();
    const password = passwordInput.value.trim();
    const passwordConfirm = passwordConfirmInput.value.trim();

    currentPasswordHelper.textContent = "";
    passwordHelper.textContent = "";
    passwordConfirmHelper.textContent = "";

    fetch(`http://localhost:8080/users/${userId}/password`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            currentPassword,
            password,
            passwordConfirm
        }),
        credentials: "include"
    })
        .then(response => response.json())
        .then(result => {
            console.log(result);

            if (result.message === "password_update_success") {
                toast.classList.add("show");

                setTimeout(function () {
                    toast.classList.remove("show");
                    location.href = "./login.html";
                }, 1500);

                return;
            }

            if (result.message === "current_password_not_match") {
                currentPasswordHelper.textContent = "*현재 비밀번호가 일치하지 않습니다.";
                return;
            }

            if (result.message === "password_not_match") {
                passwordConfirmHelper.textContent = "*비밀번호와 다릅니다.";
                return;
            }
        });
});