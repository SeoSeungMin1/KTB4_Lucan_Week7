const backButton = document.querySelector("#backButton");
const editSubmitButton = document.querySelector("#editSubmitButton");

const profileImage = document.querySelector("#profileImage");
const profileDropdown = document.querySelector("#profileDropdown");

const editProfileMenu = document.querySelector("#editProfileMenu");
const editPasswordMenu = document.querySelector("#editPasswordMenu");
const logoutButton = document.querySelector("#logoutButton");

const params = new URLSearchParams(location.search);
const postId = params.get("postId");

const titleInput = document.querySelector("#title");
const contentInput = document.querySelector("#content");
const imageInput = document.querySelector("#imageInput");

const helperText = document.querySelector(".helper-text");

backButton.addEventListener("click", function () {
    location.href = `./post-detail.html?postId=${postId}`;
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

logoutButton.addEventListener("click", function () {
    localStorage.clear();
    location.href = "./login.html";
});

editSubmitButton.addEventListener("click", async function (event) {
    event.preventDefault();

    helperText.textContent = "";

    if (titleInput.value.trim() === "") {
        helperText.textContent = "* 제목을 입력해주세요.";
        return;
    }

    if (contentInput.value.trim() === "") {
        helperText.textContent = "* 내용을 입력해주세요.";
        return;
    }

    let imageFile = null;

    if (imageInput.files.length > 0) {
        imageFile = "../images/IMG_7563.JPG";
    }

    const response = await fetch(`http://localhost:8080/posts/${postId}`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            title: titleInput.value,
            content: contentInput.value,
            imageFile: imageFile
        })
    });

    if (response.ok) {
        location.href = `./post-detail.html?postId=${postId}`;
        return;
    }

    const result = await response.json();
    console.log(result.message);
});