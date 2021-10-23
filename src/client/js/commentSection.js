const videoContainer = document.getElementById("videoContainer");
const form = document.getElementById("commentForm");
const deleteBtns = document.querySelectorAll(".video__comment-delete");

const addComment = (text, id, ownerAvatarUrl, ownerName, createdAt) => {
  const videoComments = document.querySelector(".video__comments-list ul");
  const newComment = document.createElement("li");
  newComment.className = "video__comment";
  newComment.dataset.id = id;
  const divContent = document.createElement("div");
  divContent.className = "video__comment-content";
  //
  const divUserAvatar = document.createElement("div");
  divUserAvatar.className = "video__comment-content__user-avatar";
  const imgAvatar = document.createElement("img");
  imgAvatar.className = "header__avatar";
  //imgAvatar.src = `/${ownerAvatarUrl}`;
  console.log(userAvatarUrl);
  //
  const divCommentMain = document.createElement("div");
  divCommentMain.className = "video__comment-content__main";
  const divCommentMainInfo = document.createElement("div");
  divCommentMainInfo.className = "video__comment-content__main-info";
  const commentUsername = document.createElement("div");
  commentUsername.innerText = ` ${ownerName}`;
  const commentCreatedAt = document.createElement("span");
  commentCreatedAt.innerText = ` ${createdAt.toLocaleDateString({
    year: "numeric",
    month: "long",
    day: "numeric",
  })}`;
  const span = document.createElement("span");
  span.innerText = ` ${text}`;
  //
  const iconDelete = document.createElement("i");
  iconDelete.className = "video__comment-delete fas fa-trash-alt";
  iconDelete.addEventListener("click", handleDelete);
  divCommentMainInfo.appendChild(commentUsername);
  divCommentMainInfo.appendChild(commentCreatedAt);
  //
  divUserAvatar.appendChild(imgAvatar);
  divCommentMain.appendChild(divCommentMainInfo);
  divCommentMain.appendChild(span);
  //
  divContent.appendChild(divUserAvatar);
  divContent.appendChild(divCommentMain);
  divContent.appendChild(iconDelete);
  //
  newComment.appendChild(divContent);
  newComment.appendChild(iconDelete);
  videoComments.prepend(newComment);
};

const handleSubmit = async (event) => {
  event.preventDefault();
  const input = form.querySelector("input");
  const text = input.value;
  const videoId = videoContainer.dataset.id;
  if (text === "") {
    return;
  }
  const response = await fetch(`/api/videos/${videoId}/comment`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ text }),
  });
  if (response.status === 201) {
    input.value = "";
    const { newCommentId } = await response.json();
    addComment(text, newCommentId, ownerAvatarUrl, ownerName, createdAt);
  }
};

const handleDelete = async (event) => {
  const commentList = event.path[2];
  const commentId = commentList.dataset.id;
  const response = await fetch(`/api/comments/${commentId}`, {
    method: "DELETE",
  });
  if (response.status === 200) {
    const deleteList = document.querySelector(
      `.video__comment[data-id="${commentId}"]`
    );
    deleteList.remove();
  }
};

if (form) {
  form.addEventListener("submit", handleSubmit);
}

if (deleteBtns) {
  deleteBtns.forEach((list) => list.addEventListener("click", handleDelete));
}
