const backButton = document.querySelector(".back-button");
const submitButton = document.querySelector("#submitButton");

const titleInput = document.querySelector("#title");
const contentInput = document.querySelector("#content");
const teamInput = document.querySelector("#team");
const imageInput = document.querySelector("#imageInput");

const titleHelper = document.querySelector("#titleHelper");
const contentHelper = document.querySelector("#contentHelper");
const teamHelper = document.querySelector("#teamHelper");


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


logoutButton.addEventListener("click", async function () {

    await fetch("http://127.0.0.1:8080/users/logout", {

        method: "POST",

        credentials: "include"

    });


    localStorage.clear();

    location.href = "./login.html";

});



submitButton.addEventListener("click", async function (event) {

    event.preventDefault();


    // 기존 에러 메시지 초기화

    titleHelper.textContent = "";

    contentHelper.textContent = "";

    teamHelper.textContent = "";



    // 제목 검사

    if (titleInput.value.trim() === "") {

        titleHelper.textContent = "*제목을 입력해주세요.";

        return;

    }



    // 내용 검사

    if (contentInput.value.trim() === "") {

        contentHelper.textContent = "*내용을 입력해주세요.";

        return;

    }



    // 팀 검사

    if (teamInput.value === "") {

        teamHelper.textContent = "*응원팀을 선택해주세요.";

        return;

    }



    let imageFile = "";


    if (imageInput.files.length > 0) {

        imageFile = "../images/IMG_7563.JPG";

    }



    const response = await fetch("http://127.0.0.1:8080/posts", {

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

        contentHelper.textContent = "*게시글 작성에 실패했습니다.";

        return;

    }



    const result = await response.json();


    location.href = `./post-detail.html?postId=${result.data.postId}`;

});