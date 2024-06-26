//비디오
const video = document.querySelector("video");
//비디오 플레이어 버튼
const playBtn = document.getElementById("play");
const playBtnIcon = playBtn.querySelector("i");
const muteBtn = document.getElementById("mute");
const muteBtnIcon = muteBtn.querySelector("i");
const volumeRange = document.getElementById("volume");
const currentTime = document.getElementById("currentTime");
const totalTime = document.getElementById("totalTime");
const timeline = document.getElementById("timeline");
const fullScreenBtn = document.getElementById("fullScreen");
const fullScreenIcon = fullScreenBtn.querySelector("i");
const videoContainer = document.getElementById("videoContainer");
const videoControls = document.getElementById("videoControls");
const inputSearch = document.getElementById("input-search");
const inputComment = document.getElementById("input-comment");

//전역변수 설정
let controlsTimeout = null;
let controlsMovementTimeout = null;
let volumeValue = 0.5;
video.volume = volumeValue;

//펑션
const handlePlayClick = (e) => {
  if (video.paused) {
    video.play();
  } else {
    video.pause();
  }
  playBtnIcon.classList = video.paused ? "fas fa-play" : "fas fa-pause";
};

const handleMute = (e) => {
  if (video.muted) {
    video.muted = false;
  } else {
    video.muted = true;
  }
  muteBtnIcon.classList = video.muted
    ? "fas fa-volume-mute"
    : "fas fa-volume-up";
  volumeRange.value = video.muted ? 0 : volumeValue;
};

const handleVolumeChange = (event) => {
  const {
    target: { value },
  } = event;
  if (video.muted) {
    video.muted = false;
    muteBtnIcon.classList = video.muted
      ? "fas fa-volume-mute"
      : "fas fa-volume-up";
  }
  volumeValue = value;
  video.volume = value;
};

//시간 포맷하는 함수 만들기
//seconds를 받아서 new Date(seconds)를 반환하는 함수
const formatTime = (seconds) =>
  new Date(seconds * 1000).toISOString().substr(14, 5);

const handleLoadedMetaData = () => {
  totalTime.innerText = formatTime(Math.floor(video.duration));
  timeline.max = Math.floor(video.duration);
};

const handleTimeUpdate = () => {
  currentTime.innerText = formatTime(Math.floor(video.currentTime));
  timeline.value = Math.floor(video.currentTime);
};

const handleTimelineChange = (event) => {
  const {
    target: { value },
  } = event;
  video.currentTime = value;
};

const handleFullScreen = () => {
  const fullscreen = document.fullscreenElement;
  if (fullscreen) {
    document.exitFullscreen();
    fullScreenIcon.classList = "fas fa-expand";
  } else {
    videoContainer.requestFullscreen();
    fullScreenIcon.classList = "fas fa-compress";
  }
};

const hideControls = () => videoControls.classList.remove("showing");

//(상기) 이 핸들러는 마우스무브 될 때마다 아래 내용이 호출되는 핸들러임!
const handleMouseMove = () => {
  if (controlsTimeout) {
    clearTimeout(controlsTimeout);
    controlsTimeout = null;
  }
  if (controlsMovementTimeout) {
    clearTimeout(controlsMovementTimeout);
    controlsMovementTimeout = null;
  }
  videoControls.classList.add("showing");
  controlsMovementTimeout = setTimeout(hideControls, 3000);
};

const handleMouseLeave = () => {
  controlsTimeout = setTimeout(hideControls, 3000);
};

const handleExitFullscreen = () => {
  if (!document.fullscreenElement) {
    fullScreenIcon.classList = "fas fa-expand";
  }
};

const handleKeyCheck = (event) => {
  let { keyCode } = event;
  const fullscreen = document.fullscreenElement;
  if (keyCode === 70 && !fullscreen) {
    videoContainer.requestFullscreen();
    fullScreenIcon.classList = "fas fa-compress";
  } else if (keyCode === 27 && fullscreen) {
    handleExitFullscreen();
  } else if (keyCode === 32) {
    event.preventDefault();
    handlePlayClick();
  } else if (keyCode === 77) {
    handleMute();
  } else if (keyCode === 37) {
    event.preventDefault();
    video.currentTime -= 5;
  } else if (keyCode === 39) {
    event.preventDefault();
    video.currentTime += 5;
  }
};

const handleAddKeyCheck = () => {
  if (!inputComment) {
    inputSearch.removeEventListener("focus", handleRemoveKeyCheck);
    document.addEventListener("keydown", handleKeyCheck);
    inputSearch.addEventListener("focus", handleRemoveKeyCheck);
  }
  inputComment.removeEventListener("focus", handleRemoveKeyCheck);
  inputSearch.removeEventListener("focus", handleRemoveKeyCheck);
  document.addEventListener("keydown", handleKeyCheck);
  inputComment.addEventListener("focus", handleRemoveKeyCheck);
  inputSearch.addEventListener("focus", handleRemoveKeyCheck);
};

const handleRemoveKeyCheck = () => {
  if (!inputComment) {
    document.removeEventListener("keydown", handleKeyCheck);
    inputSearch.addEventListener("blur", handleAddKeyCheck);
  }
  document.removeEventListener("keydown", handleKeyCheck);
  inputComment.addEventListener("blur", handleAddKeyCheck);
  inputSearch.addEventListener("blur", handleAddKeyCheck);
};

const handleEnded = () => {
  const { id } = videoContainer.dataset;
  fetch(`/api/videos/${id}/view`, {
    method: "POST",
  });
};

const init = () => {
  if (video.played) {
    playBtnIcon.classList = "fas fa-pause";
  }
};

init();

//이벤트 리스너
playBtn.addEventListener("click", handlePlayClick);
muteBtn.addEventListener("click", handleMute);
volumeRange.addEventListener("input", handleVolumeChange);
video.addEventListener("loadeddata", handleLoadedMetaData);
video.addEventListener("timeupdate", handleTimeUpdate);
video.addEventListener("ended", handleEnded);
videoContainer.addEventListener("mousemove", handleMouseMove);
videoContainer.addEventListener("mouseleave", handleMouseLeave);
timeline.addEventListener("input", handleTimelineChange);
fullScreenBtn.addEventListener("click", handleFullScreen);
document.addEventListener("keydown", handleKeyCheck);
if (inputComment) {
  inputComment.addEventListener("focus", handleRemoveKeyCheck);
}
inputSearch.addEventListener("focus", handleRemoveKeyCheck);
videoContainer.addEventListener("fullscreenchange", handleExitFullscreen);
video.addEventListener("click", handlePlayClick);

if (video.readyState == 4) {
  handleLoadedMetaData();
}
