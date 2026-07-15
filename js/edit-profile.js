const backButton = document.querySelector(".back-button");

const profileImage = document.querySelector("#profileImage");
const profileDropdown = document.querySelector("#profileDropdown");

const profileUpload = document.querySelector("#profileUpload");
const profileInput = document.querySelector("#profileInput");

const editProfileMenu = document.querySelector("#editProfileMenu");
const editPasswordMenu = document.querySelector("#editPasswordMenu");
const logoutButton = document.querySelector("#logoutButton");

const emailText = document.querySelector(".email-text");
const nicknameInput = document.querySelector("#nickname");
const nicknameHelperText = document.querySelector("#nicknameHelperText");
const profileSubmitButton = document.querySelector("#profileSubmitButton");
const toast = document.querySelector("#toast");
const deleteUserButton = document.querySelector("#deleteUserButton");

const deleteModal = document.querySelector("#deleteModal");
const cancelDeleteButton = document.querySelector("#cancelDeleteButton");
const confirmDeleteButton = document.querySelector("#confirmDeleteButton");


let selectedProfileImage = "";

emailText.textContent = localStorage.getItem("email");
nicknameInput.value = localStorage.getItem("nickname");

backButton.addEventListener("click", function () {
    location.href = "./posts.html";
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
    await fetch("http://127.0.0.1:8080/users/logout", {
        method: "POST",
        credentials: "include"
    });

    localStorage.clear();
    location.href = "./login.html";
});

profileUpload.addEventListener("click", function () {
    profileInput.click();
});

profileInput.addEventListener("change", function () {
    const file = profileInput.files[0];

    if (!file) {
        return;
    }

    const imageUrl = URL.createObjectURL(file);

    profileImage.style.backgroundImage = `url(${imageUrl})`;
    selectedProfileImage = imageUrl;
});

profileSubmitButton.addEventListener("click", async function () {

    nicknameHelperText.textContent = "";

    const nickname = nicknameInput.value.trim();

    if (!nickname) {
        nicknameHelperText.textContent =
            "*닉네임을 입력해주세요.";
        return;
    }

    if (nickname.length > 10) {
        nicknameHelperText.textContent =
            "*닉네임은 최대 10자 까지 작성 가능합니다.";
        return;
    }

    const userId = Number(localStorage.getItem("userId"));

    const response = await fetch(
        `http://127.0.0.1:8080/users/${userId}`,
        {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                nickname: nickname,
                profileImage: selectedProfileImage
            }),
            credentials: "include"
        }
    );

    const result = await response.json();

    if (!response.ok) {

        if (result.message === "nickname_already_exists") {
            nicknameHelperText.textContent =
                "*중복된 닉네임 입니다.";
        }

        return;
    }

    localStorage.setItem("nickname", nickname);

    toast.classList.add("show");

    setTimeout(function () {
        toast.classList.remove("show");
    }, 2000);
});
deleteUserButton.addEventListener("click", function () {
    deleteModal.style.display = "flex";
});

cancelDeleteButton.addEventListener("click", function () {
    deleteModal.style.display = "none";
});

confirmDeleteButton.addEventListener("click", async function () {
    const userId = Number(localStorage.getItem("userId"));

    const response = await fetch(
        `http://127.0.0.1:8080/users/${userId}`,
        {
            method: "DELETE",
            credentials: "include"
        }
    );

    if (!response.ok) {
        console.log(await response.text());
        return;
    }

    localStorage.clear();
    location.href = "./login.html";
});