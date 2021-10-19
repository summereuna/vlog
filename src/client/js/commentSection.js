const videoContainer = document.getElementById("videoContainer");
const form = document.getElementById("commentForm");

const handleSubmit = (event) => {
  event.preventDefault();
  const textarea = form.querySelector("textarea");
  const text = textarea.value;
  const videoId = videoContainer.dataset.id;
  //사용자가 댓글에 아무것도 입력하지 않으면 request를 안 보내도 되기 때문에
  if (text === "") {
    return;
  }
  fetch(`/api/videos/${videoId}/comment`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ text }),
  });
};

if (form) {
  form.addEventListener("submit", handleSubmit);
}
