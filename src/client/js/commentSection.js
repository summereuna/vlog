const videoContainer = document.getElementById("videoContainer");
const form = document.getElementById("commentForm");
const deleteBtns = document.querySelectorAll(".video__comment-delete");

const addComment = (id, text, owner, avatarUrl, createdAt) => {
  const ul = document.querySelector(".video__comments-list ul");
  const li = document.createElement("li");
  li.className = "video__comment";
  li.dataset.id = id;

  const li_div = document.createElement("div");
  li_div.className = "video__comment-content";

  const li_div_user = document.createElement("div");
  li_div_user.className = "video__comment-content__user-avatar";

  const li_div_user_avatar = document.createElement("img");
  li_div_user_avatar.className = "avatar_default-img avatar-m";
  li_div_user_avatar.src = `${avatarUrl}`;
  li_div_user_avatar.crossOrigin = "anonymous";

  const li_div_comment = document.createElement("div");
  li_div_comment.className = "video__comment-content__main";
  const li_div_comment_info = document.createElement("div");
  li_div_comment_info.className = "video__comment-content__main-info";
  const li_div_comment_info_name = document.createElement("h4");
  li_div_comment_info_name.innerText = `${owner}`;
  const li_div_comment_info_time = document.createElement("span");
  li_div_comment_info_time.innerText = new Date(
    `${createdAt}`
  ).toLocaleDateString({ year: "numeric", month: "long", day: "numeric" });
  const li_div_comment_text = document.createElement("span");
  li_div_comment_text.innerText = ` ${text}`;
  const iconDelete = document.createElement("i");
  iconDelete.className = "video__comment-delete fas fa-trash-alt";
  iconDelete.addEventListener("click", handleDelete);
  li_div_comment_info.appendChild(li_div_comment_info_name);
  li_div_comment_info.appendChild(li_div_comment_info_time);
  li_div_user.appendChild(li_div_user_avatar);
  li_div_comment.appendChild(li_div_comment_info);
  li_div_comment.appendChild(li_div_comment_text);
  li_div.appendChild(li_div_user);
  li_div.appendChild(li_div_comment);
  li_div.appendChild(iconDelete);
  li.appendChild(li_div);
  ul.prepend(li);
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
    const { newCommentId, text, owner, avatarUrl, createdAt } =
      await response.json();
    addComment(newCommentId, text, owner, avatarUrl, createdAt);
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
