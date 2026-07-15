const backButton = document.querySelector(".back-button");

const profileImage = document.querySelector("#profileImage");
const profileDropdown = document.querySelector("#profileDropdown");

const editProfileMenu = document.querySelector("#editProfileMenu");
const editPasswordMenu = document.querySelector("#editPasswordMenu");
const logoutButton = document.querySelector("#logoutButton");

const currentPasswordInput = document.querySelector("#currentPassword");
const passwordInput = document.querySelector("#password");
const passwordConfirmInput = document.querySelector("#passwordConfirm");

const currentPasswordHelper = document.querySelector("#currentPasswordHelper");
const passwordHelper = document.querySelector("#passwordHelper");
const passwordConfirmHelper = document.querySelector("#passwordConfirmHelper");

const passwordSubmitButton = document.querySelector("#passwordSubmitButton");
const toast = document.querySelector("#toast");

// 뒤로가기
backButton.addEventListener("click", function () {
    location.href = "./posts.html";
});

// 프로필 메뉴
profileImage.addEventListener("click", function () {
    profileDropdown.classList.toggle("show");
});

editProfileMenu.addEventListener("click", function () {
    location.href = "./edit-profile.html";
});

editPasswordMenu.addEventListener("click", function () {
    location.href = "./edit-password.html";
});

// 로그아웃
logoutButton.addEventListener("click", async function () {
    await fetch("http://127.0.0.1:8080/users/logout", {
        method: "POST",
        credentials: "include"
    });

    localStorage.clear();
    location.href = "./login.html";
});

// 비밀번호 수정
passwordSubmitButton.addEventListener("click", async function () {

    const userId = localStorage.getItem("userId");

    const currentPassword = currentPasswordInput.value.trim();
    const password = passwordInput.value.trim();
    const passwordConfirm = passwordConfirmInput.value.trim();

    currentPasswordHelper.textContent = "";
    passwordHelper.textContent = "";
    passwordConfirmHelper.textContent = "";

    const response = await fetch(
        `http://127.0.0.1:8080/users/${userId}/password`,
        {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json"
            },
            credentials: "include",
            body: JSON.stringify({
                currentPassword,
                password,
                passwordConfirm
            })
        }
    );

    const result = await response.json();

    console.log(response.status);
    console.log(result);

    if (!response.ok) {

        if (result.message === "invalid_request") {
            passwordHelper.textContent =
                "*비밀번호는 8자 이상 20자 이하여야 합니다.";
            return;
        }

        if (result.message === "current_password_not_match") {
            currentPasswordHelper.textContent =
                "*현재 비밀번호가 일치하지 않습니다.";
            return;
        }

        if (result.message === "password_not_match") {
            passwordConfirmHelper.textContent =
                "*비밀번호가 일치하지 않습니다.";
            return;
        }

        return;
    }

    if (result.message === "password_update_success") {

        toast.classList.add("show");

        setTimeout(function () {
            toast.classList.remove("show");
            location.href = "./login.html";
        }, 1500);
    }
});