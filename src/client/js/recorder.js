import { createFFmpeg, fetchFile } from "@ffmpeg/ffmpeg";

const actionBtn = document.getElementById("actionBtn");
const video = document.getElementById("preview");

//stream이라는 비어있는 let 변수 생성
let stream;
let recorder;
let videoFile;

//코드 정리(오타 방지위해 객체에 넣어 버림)
const files = {
  input: "recording.webm",
  output: "output.mp4",
  thumbnail: "thumbnail.jpg",
};

//앵커 반복되니까 함수로 만들자
//downloadFile(fileUrl, fileName)파일url과 파일이름을 아규먼트로 받자
const downloadFile = (fileUrl, fileName) => {
  const a = document.createElement("a");
  a.href = fileUrl;
  a.download = fileName;
  document.body.appendChild(a);
  a.click();
};

//다운로드할 수 있는 펑션
const handleDownload = async () => {
  //다운로드 버튼 누르면 다운되는 기능 없애고 다른 내용으로 바꾸기
  actionBtn.removeEventListener("click", handleDownload);
  actionBtn.innerText = "Transcoding...";
  //Transcoding되는 동안 버튼 희미~~하게 안보이게 하기
  actionBtn.disabled = true;
  //ffmpeg.wasm 사용하여 브라우저에서 비디오 인코딩
  const ffmpeg = createFFmpeg({
    //버전 에러 떠서 버전 업뎃하고 코어패스 적어줌
    corePath: "https://unpkg.com/@ffmpeg/core@0.10.0/dist/ffmpeg-core.js",
    log: true,
  });
  await ffmpeg.load();
  ffmpeg.FS("writeFile", files.input, await fetchFile(videoFile));
  //transcoding webm to mp4
  await ffmpeg.run("-i", files.input, "-r", "60", files.output);
  //making screenshot
  await ffmpeg.run(
    "-i",
    files.input,
    "-ss",
    "00:00:01",
    "-frames:v",
    "1",
    files.thumbnail
  );
  const mp4File = ffmpeg.FS("readFile", files.output);
  const thumbnailFile = ffmpeg.FS("readFile", files.thumbnail);
  const mp4Blob = new Blob([mp4File.buffer], { type: "video/mp4" });
  const thumbnailBlob = new Blob([thumbnailFile.buffer], { type: "image/jpg" });
  const mp4Url = URL.createObjectURL(mp4Blob);
  const thumbnailUrl = URL.createObjectURL(thumbnailBlob);
  //앵커 다운로드하는 함수
  downloadFile(mp4Url, "MyRecording.mp4");
  downloadFile(thumbnailUrl, "MyThumbnail.jpg");
  /*소스 파일 삭제*/
  ffmpeg.FS("unlink", files.input);
  //브라우저 느려지지 않게 다 생성하고 다운한 파일은 파일링크 해제하기
  ffmpeg.FS("unlink", files.output);
  ffmpeg.FS("unlink", files.thumbnail);
  //mp4Blob의 url인 mp4Url와 thumbnailBlob url인 thumbnailUrl 삭제
  URL.revokeObjectURL(mp4Url);
  URL.revokeObjectURL(thumbnailUrl);
  //webm blob url인 videoFile url 삭제
  URL.revokeObjectURL(videoFile);
  //Transcoding 끝나면 버튼 다시 보이게 하고 레코드 다시 시작할 수 있게하기
  actionBtn.disabled = false;
  actionBtn.innerText = "Record Again!";
  actionBtn.addEventListener("click", handleStart);
};

//start 버튼 누르면 스트림 녹화하기
const handleStart = () => {
  actionBtn.innerText = "Recording";
  actionBtn.disabled = true;
  actionBtn.removeEventListener("click", handleStart);
  recorder = new MediaRecorder(stream, { mimeType: "video/webm" });
  recorder.ondataavailable = (event) => {
    videoFile = URL.createObjectURL(event.data);
    video.srcObject = null;
    video.src = videoFile;
    video.loop = true;
    video.play();
    actionBtn.innerText = "Download";
    actionBtn.disabled = false;
    actionBtn.addEventListener("click", handleDownload);
  };
  recorder.start();
  setTimeout(() => {
    recorder.stop();
  }, 5000);
};

//미리보기
const init = async () => {
  stream = await navigator.mediaDevices.getUserMedia({
    audio: false,
    video: true,
    video: {
      width: 1024,
      height: 576,
    },
  });
  video.srcObject = stream;
  video.play();
};

init();

actionBtn.addEventListener("click", handleStart);
