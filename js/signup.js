const backButton = document.querySelector(".back-button");
const profileCircle = document.querySelector(".profile-circle");
const signupButton = document.querySelector("#signupButton");
const loginText = document.querySelector("#loginText");

const emailInput = document.querySelector("#email");
const passwordInput = document.querySelector("#password");
const passwordConfirmInput = document.querySelector("#passwordConfirm");
const nicknameInput = document.querySelector("#nickname");

const signupToast = document.querySelector("#signupToast");

const profileHelperText = document.querySelector("#profileHelperText");

const emailHelperText = document.querySelector("#emailHelperText");
const passwordHelperText = document.querySelector("#passwordHelperText");
const passwordConfirmHelperText = document.querySelector("#passwordConfirmHelperText");
const nicknameHelperText = document.querySelector("#nicknameHelperText");

backButton.addEventListener("click", function () {
    location.href = "./login.html";
});

profileCircle.addEventListener("click", function () {
    location.href = "./profile.html";
});

signupButton.addEventListener("click", async function () {

    profileHelperText.textContent = "";
    emailHelperText.textContent = "";
    passwordHelperText.textContent = "";
    passwordConfirmHelperText.textContent = "";
    nicknameHelperText.textContent = "";

    if (emailInput.value.trim() === "") {
        emailHelperText.textContent = "*이메일을 입력해주세요.";
        return;
    }

    if (passwordInput.value.trim() === "") {
        passwordHelperText.textContent = "*비밀번호를 입력해주세요.";
        return;
    }

    if (passwordConfirmInput.value.trim() === "") {
        passwordConfirmHelperText.textContent = "*비밀번호를 한번 더 입력해주세요.";
        return;
    } else if (passwordInput.value !== passwordConfirmInput.value) {
        passwordConfirmHelperText.textContent = "*비밀번호가 다릅니다.";
        return;
    }

    if (nicknameInput.value.trim() === "") {
        nicknameHelperText.textContent = "*닉네임을 입력해주세요.";
        return;
    }


    const response = await fetch("http://localhost:8080/users/signup", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            email: emailInput.value,
            password: passwordInput.value,
            passwordConfirm: passwordConfirmInput.value,
            nickname: nicknameInput.value,
            profileImage: null
        })
    });

    const result = await response.json();

    console.log("회원가입 응답:", result);

    if (!response.ok) {

    if (result.message === "email_already_exists") {
        emailHelperText.textContent = "*중복된 이메일입니다.";
    }

    if (result.message === "nickname_already_exists") {
        nicknameHelperText.textContent = "*중복된 닉네임입니다.";
    }

    return;
}

    if (response.ok) {
        signupToast.classList.add("show");

        setTimeout(function () {
            signupToast.classList.remove("show");
        }, 3000);
    }
});

loginText.addEventListener("click", function () {
    location.href = "./login.html";
});