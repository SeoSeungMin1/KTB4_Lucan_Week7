const backButton = document.querySelector(".back-button");
const submitButton = document.querySelector("#submitButton");

const titleInput = document.querySelector("#title");
const contentInput = document.querySelector("#content");
const imageInput = document.querySelector("#imageInput");
const helperText = document.querySelector(".helper-text");

const profileImage = document.querySelector("#profileImage");
const profileDropdown = document.querySelector("#profileDropdown");

const editProfileMenu = document.querySelector("#editProfileMenu");
const editPasswordMenu = document.querySelector("#editPasswordMenu");
const logoutButton = document.querySelector("#logoutButton");

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

logoutButton.addEventListener("click",  async function () {
    await fetch("http://localhost:8080/users/logout", {
        method: "POST",
        credentials: "include"
    });

    localStorage.clear();
    location.href = "./login.html";
});

submitButton.addEventListener("click", async function (event) {
    event.preventDefault();

    helperText.textContent = "";

    if (titleInput.value.trim() === "") {
        helperText.textContent = "*제목을 입력해주세요.";
        return;
    }

    if (contentInput.value.trim() === "") {
        helperText.textContent = "*내용을 입력해주세요.";
        return;
    }

    let imageFile = "";

    if (imageInput.files.length > 0) {
        imageFile = "../images/IMG_7563.JPG";
    }

    const response = await fetch("http://localhost:8080/posts", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            title: titleInput.value,
            content: contentInput.value,
            imageFile: imageFile,
            userId: Number(localStorage.getItem("userId"))
        }),
        credentials: "include"
    });

    if (!response.ok) {
        helperText.textContent = "*게시글 작성에 실패했습니다.";
        return;
    }

    const result = await response.json();

    location.href = `./post-detail.html?postId=${result.data.postId}`;
});