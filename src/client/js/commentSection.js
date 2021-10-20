const videoContainer = document.getElementById("videoContainer");
const form = document.getElementById("commentForm");
const deleteBtn = document.querySelector(".video__comment-delete");

const deleteComment = (id) => {
  const deleteList = document.querySelector(`.video__comment[data-id="${id}"]`);
  deleteList.remove();
};

const addComment = (text, id) => {
  const videoComments = document.querySelector(".video__comments ul");
  const newComment = document.createElement("li");
  newComment.className = "video__comment";
  newComment.dataset.id = id;
  const divContent = document.createElement("div");
  divContent.className = "video__comment-content";
  const icon = document.createElement("i");
  icon.className = "fas fa-comment";
  const span = document.createElement("span");
  span.innerText = ` ${text}`;
  const iconDelete = document.createElement("i");
  iconDelete.className = "video__comment-delete fas fa-trash-alt";
  iconDelete.addEventListener("click", handleDelete);
  divContent.appendChild(icon);
  divContent.appendChild(span);
  newComment.appendChild(divContent);
  newComment.appendChild(iconDelete);
  videoComments.prepend(newComment);
};

const handleSubmit = async (event) => {
  event.preventDefault();
  const textarea = form.querySelector("textarea");
  const text = textarea.value;
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
    textarea.value = "";
    const { newCommentId } = await response.json();
    addComment(text, newCommentId);
  }
};

const handleDelete = async (event) => {
  const commentList = event.target.parentElement;
  const commentId = commentList.dataset.id;
  const response = await fetch(`/api/comments/${commentId}`, {
    method: "DELETE",
  });
  if (response.status === 200) {
    deleteComment(commentId);
  }
};

if (form) {
  form.addEventListener("submit", handleSubmit);
}

if (deleteBtn) {
  deleteBtn.addEventListener("click", handleDelete);
}
