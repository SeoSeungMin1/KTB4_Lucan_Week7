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

    const response = await fetch("http://localhost:8080/users/login", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            email: emailInput.value,
            password: passwordInput.value
        })
    });

    const result = await response.json();

console.log("로그인 응답:", result);

if (!response.ok) {
    passwordHelperText.textContent =
        "*이메일 또는 비밀번호가 일치하지 않습니다.";
    return;
}

localStorage.setItem("userId", result.data.userId);
localStorage.setItem("email", result.data.email);
localStorage.setItem("nickname", result.data.nickname);

location.href = "./posts.html";
});

signupButton.addEventListener("click", function () {
    location.href = "./signup.html";
});