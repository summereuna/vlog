import { createFFmpeg, fetchFile } from "@ffmpeg/ffmpeg";

const startBtn = document.getElementById("startBtn");
const video = document.getElementById("preview");

//stream이라는 비어있는 let 변수 생성
let stream;
let recorder;
let videoFile;

//다운로드할 수 있는 펑션
const handleDownload = async () => {
  //ffmpeg.wasm 사용하여 브라우저에서 비디오 인코딩
  const ffmpeg = createFFmpeg({
    //버전 에러 떠서 버전 업뎃하고 코어패스 적어줌
    corePath: "https://unpkg.com/@ffmpeg/core@0.10.0/dist/ffmpeg-core.js",
    log: true,
  });
  await ffmpeg.load();
  ffmpeg.FS("writeFile", "recording.webm", await fetchFile(videoFile));
  await ffmpeg.run("-i", "recording.webm", "-r", "60", "output.mp4");
  const mp4File = ffmpeg.FS("readFile", "output.mp4");
  const mp4Blob = new Blob([mp4File.buffer], { type: "video/mp4" });
  const mp4Url = URL.createObjectURL(mp4Blob);
  //앵커
  const a = document.createElement("a");
  a.href = mp4Url;
  a.download = "My Recording.mp4";
  document.body.appendChild(a);
  a.click();
};

//버튼 누르면 스트림 녹화 멈추기
const handleStop = () => {
  startBtn.innerText = "Download Recording";
  startBtn.removeEventListener("click", handleStop);
  startBtn.addEventListener("click", handleDownload);
  recorder.stop();
};

//start 버튼 누르면 스트림 녹화하기
const handleStart = () => {
  startBtn.innerText = "Stop Recording";
  startBtn.removeEventListener("click", handleStart);
  startBtn.addEventListener("click", handleStop);
  recorder = new MediaRecorder(stream, { mimeType: "video/webm" });
  recorder.ondataavailable = (event) => {
    videoFile = URL.createObjectURL(event.data);
    console.log(videoFile);
    video.srcObject = null;
    video.src = videoFile;
    video.loop = true;
    video.play();
  };
  recorder.start();
};

//미리보기
const init = async () => {
  stream = await navigator.mediaDevices.getUserMedia({
    audio: true,
    video: true,
  });
  video.srcObject = stream;
  video.play();
};

init();

startBtn.addEventListener("click", handleStart);
