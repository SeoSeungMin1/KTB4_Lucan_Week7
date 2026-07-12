const backButton = document.querySelector(".back-button");
const editButton = document.querySelector("#editButton");
const deleteButton = document.querySelector("#deleteButton");
const commentButton = document.querySelector("#commentButton");
const likeButton = document.querySelector("#likeButton");

const profileImage = document.querySelector("#profileImage");
const profileDropdown = document.querySelector("#profileDropdown");
const editProfileMenu = document.querySelector("#editProfileMenu");
const editPasswordMenu = document.querySelector("#editPasswordMenu");
const logoutButton = document.querySelector("#logoutButton");

const deleteModal = document.querySelector("#deleteModal");
const cancelDeleteButton = document.querySelector("#cancelDeleteButton");
const confirmDeleteButton = document.querySelector("#confirmDeleteButton");

const commentDeleteModal = document.querySelector("#commentDeleteModal");
const cancelCommentDeleteButton = document.querySelector("#cancelCommentDeleteButton");
const confirmCommentDeleteButton = document.querySelector("#confirmCommentDeleteButton");

const commentInput = document.querySelector("#commentInput");
const commentList = document.querySelector("#commentList");

const titleElement = document.querySelector("#postTitle");
const contentElement = document.querySelector("#postContent");
const nicknameElement = document.querySelector("#postNickname");
const createdAtElement = document.querySelector("#postCreatedAt");
const likeCountElement = document.querySelector("#likeCount");
const viewCountElement = document.querySelector("#viewCount");
const commentCountElement = document.querySelector("#commentCount");
const postImageElement = document.querySelector("#postImage");

const params = new URLSearchParams(location.search);
const postId = params.get("postId");

let liked = false;
let deleteCommentId = null;

loadPost();

async function loadPost() {

    const userId = Number(localStorage.getItem("userId"));

    const response = await fetch(`http://localhost:8080/posts/${postId}?userId=${userId}`,
        {
            method: "GET",
            credentials: "include"
        }
    );

    const result = await response.json();

    const post = result.data;

    liked = post.liked;

    likeButton.textContent = liked ? "♥" : "♡";

    titleElement.textContent = post.title;
    contentElement.textContent = post.content;
    nicknameElement.textContent = post.nickname;
    likeCountElement.textContent = post.likeCount;
    viewCountElement.textContent = post.viewCount;
    commentCountElement.textContent = post.commentCount;

    const createdTime = post.createdAt
        .replace("T", " ")
        .split(".")[0];

    const updatedTime = post.updatedAt
        .replace("T", " ")
        .split(".")[0];

    if (createdTime === updatedTime) {
        createdAtElement.textContent = createdTime;
    } else {
        createdAtElement.textContent = updatedTime + " (수정됨)";
    }

    if (post.imageFile === null || post.imageFile === "") {
        postImageElement.style.display = "none";
    } else {
        postImageElement.src = post.imageFile;
        postImageElement.style.display = "block";
    }
}

loadComments();

async function loadComments() {
    const response = await fetch(`http://localhost:8080/posts/${postId}/comments`, {
        method: "GET",
        credentials: "include"
    });
    const result = await response.json();

    commentList.innerHTML = "";

    result.data.forEach(function (comment) {
        const createdAt = comment.createdAt
            .replace("T", " ")
            .split(".")[0];

        const updatedAt = comment.updatedAt
            .replace("T", " ")
            .split(".")[0];

        const displayTime =
            createdAt === updatedAt
                ? createdAt
                : `${updatedAt} (수정됨)`;

        commentList.innerHTML += `
            <article class="comment-card" data-id="${comment.commentId}">
                <div class="comment-header">
                    <div class="writer-info">
                        <div class="writer-profile"></div>
                        <span>${comment.nickname}</span>
                    </div>

                    <span>${displayTime}</span>
                </div>

                <div class="comment-body">
                    <p class="comment-content">
                        ${comment.content}
                    </p>

                    <div class="comment-buttons">
                        <button class="comment-edit-button">수정</button>
                        <button class="comment-delete-button">삭제</button>
                    </div>
                </div>
            </article>
        `;
    });
}

commentButton.addEventListener("click", async function () {
    if (commentInput.value.trim() === "") {
        console.log("댓글을 입력해주세요.");
        return;
    }

    const response = await fetch(
        `http://localhost:8080/posts/${postId}/comments`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                content: commentInput.value,
                userId: Number(localStorage.getItem("userId"))
            }),
            credentials: "include"  
        }
    );

    if (!response.ok) {
        console.log(await response.text());
        return;
    }

    commentInput.value = "";

    loadComments();

    commentCountElement.textContent = Number(commentCountElement.textContent) + 1;
});

editButton.addEventListener("click", function () {
    location.href = `./post-edit.html?postId=${postId}`;
});

deleteButton.addEventListener("click", function () {
    deleteModal.style.display = "block";
});

cancelDeleteButton.addEventListener("click", function () {
    deleteModal.style.display = "none";
});

confirmDeleteButton.addEventListener("click", async function () {
    const response = await fetch(
        `http://localhost:8080/posts/${postId}`,
        {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                userId: Number(localStorage.getItem("userId"))
            })
            ,credentials: "include"
        }
    );

    if (!response.ok) {
        console.log(await response.text());
        return;
    }

    deleteModal.style.display = "none";
    alert("게시글이 삭제되었습니다.");
    location.href = "./posts.html";
});

likeButton.addEventListener("click", async function () {
    const response = await fetch(
        `http://localhost:8080/posts/${postId}/likes`,
        {
            method: liked ? "DELETE" : "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                userId: Number(localStorage.getItem("userId"))
            }),
            credentials: "include"
        }
    );

    if (!response.ok) {
        console.log(await response.text());
        return;
    }

    liked = !liked;

    if (liked) {
        likeButton.textContent = "♥";
        likeCountElement.textContent =
            Number(likeCountElement.textContent) + 1;
    } else {
        likeButton.textContent = "♡";
        likeCountElement.textContent =
            Number(likeCountElement.textContent) - 1;
    }
});

commentList.addEventListener("click", async function (event) {
    if (event.target.classList.contains("comment-edit-button")) {
        const commentCard = event.target.closest(".comment-card");

        const commentContent = commentCard.querySelector(".comment-content");
        const commentEditInput = commentCard.querySelector(".comment-edit-input");

        if (commentEditInput === null) {
            const currentContent = commentContent.textContent.trim();

            commentContent.outerHTML = `
                <textarea class="comment-edit-input">${currentContent}</textarea>
            `;

            event.target.textContent = "완료";
            return;
        }

        if (commentEditInput.value.trim() === "") {
            return;
        }

        const commentId = commentCard.dataset.id;

        const response = await fetch(
            `http://localhost:8080/posts/${postId}/comments/${commentId}`,
            {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    content: commentEditInput.value,
                    userId: Number(localStorage.getItem("userId"))
                }),
                credentials: "include"
            }
        );

        if (!response.ok) {
            console.log(await response.text());
            return;
        }

        loadComments();
    }

    if (event.target.classList.contains("comment-delete-button")) {
    const commentCard = event.target.closest(".comment-card");

    deleteCommentId = commentCard.dataset.id;

    commentDeleteModal.style.display = "block";
    }
});

cancelCommentDeleteButton.addEventListener("click", function () {
    commentDeleteModal.style.display = "none";
});

confirmCommentDeleteButton.addEventListener("click", async function () {
    const response = await fetch(
        `http://localhost:8080/posts/${postId}/comments/${deleteCommentId}`,
        {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                userId: Number(localStorage.getItem("userId"))
            }),
            credentials: "include"
        }
    );

    if (!response.ok) {
        console.log(await response.text());
        return;
    }

    commentDeleteModal.style.display = "none";
    deleteCommentId = null;

    loadComments();

    commentCountElement.textContent =
        Number(commentCountElement.textContent) - 1;
});

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
    await fetch("http://localhost:8080/users/logout", {
        method: "POST",
        credentials: "include"
    });

    localStorage.clear();
    location.href = "./login.html";
});