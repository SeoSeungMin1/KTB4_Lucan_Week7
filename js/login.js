const loginButton = document.querySelector("#loginButton");
const signupButton = document.querySelector("#signupButton");

const emailInput = document.querySelector("#email");
const passwordInput = document.querySelector("#password");

const emailHelperText = document.querySelector("#emailHelperText");
const passwordHelperText = document.querySelector("#passwordHelperText");

loginButton.addEventListener("click", async function () {

    emailHelperText.textContent = "";
    passwordHelperText.textContent = "";

    if (emailInput.value.trim() === "") {
        emailHelperText.textContent = "*이메일을 입력해주세요.";
        return;
    }

    if (passwordInput.value.trim() === "") {
        passwordHelperText.textContent = "*비밀번호를 입력해주세요.";
        return;
    }

    const params = new URLSearchParams();
    params.append("email", emailInput.value);
    params.append("password", passwordInput.value);

    const response = await fetch("http://localhost:8080/users/login", {
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded"
        },
        body: params,
        credentials: "include"
    });

    if (!response.ok) {
        passwordHelperText.textContent =
            "*이메일 또는 비밀번호가 일치하지 않습니다.";
        return;
    }

    const result = await response.json();

    localStorage.setItem("userId", result.data.userId);
    localStorage.setItem("email", result.data.email);
    localStorage.setItem("nickname", result.data.nickname);

    location.href = "./posts.html";
});

signupButton.addEventListener("click", function () {
    location.href = "./signup.html";
});