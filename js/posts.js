const writeButton = document.querySelector("#writeButton");
const postList = document.querySelector("#postList");
const nextButton = document.querySelector("#nextButton");
const prevButton = document.querySelector("#prevButton");

const profileImage = document.querySelector("#profileImage");
const profileDropdown = document.querySelector("#profileDropdown");

const editProfileMenu = document.querySelector("#editProfileMenu");
const editPasswordMenu = document.querySelector("#editPasswordMenu");
const logoutButton = document.querySelector("#logoutButton");

let currentPage = 0;

async function loadPosts(page) {
    const response = await fetch(`http://localhost:8080/posts?page=${page}&size=10`);
    const result = await response.json();

    postList.innerHTML = "";

    result.data.forEach(function (post) {

        const displayTitle =
            post.title.length > 26
                ? post.title.substring(0, 26)
                : post.title;

        const createdAt = post.createdAt
            .replace("T", " ")
            .split(".")[0];

        const updatedAt = post.updatedAt
            .replace("T", " ")
            .split(".")[0];

        const displayTime =
            createdAt === updatedAt
                ? createdAt
                : `${updatedAt} (수정됨)`;

        postList.innerHTML += `
            <article class="post-card" data-id="${post.postId}">
                <h3>${displayTitle}</h3>

                <div class="post-info">
                    <span>좋아요 ${post.likeCount}</span>
                    <span>댓글 ${post.commentCount}</span>
                    <span>조회수 ${post.viewCount}</span>
                </div>

                <div class="post-footer">
                    <span>${displayTime}</span>
                    <span>${post.nickname}</span>
                </div>
            </article>
        `;
    });

    const postCards = document.querySelectorAll(".post-card");

    postCards.forEach(function (card) {
        card.addEventListener("click", function () {
            const postId = card.dataset.id;
            location.href = `./post-detail.html?postId=${postId}`;
        });
    });
}

loadPosts(currentPage);

nextButton.addEventListener("click", function () {
    currentPage++;
    loadPosts(currentPage);
});

prevButton.addEventListener("click", function () {
    if (currentPage === 0) {
        return;
    }

    currentPage--;
    loadPosts(currentPage);
});

writeButton.addEventListener("click", function () {
    location.href = "./post-create.html";
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