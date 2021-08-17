import Video from "../models/Video";

//promise
export const home = async (req, res) => {
  const videos = await Video.find({});
  console.log(videos);
  return res.render("home", { pageTitle: "Home", videos });
};

export const watch = async (req, res) => {
  //const id = req.params.id;
  const { id } = req.params;
  const video = await Video.findById(id);
  if (video) {
    return res.render("watch", { pageTitle: video.title, video });
  } //존재하지 않는 비디오 페이지로 접근할 경우 404 페이지 출력
  return res.render("404", { pageTitle: `Video not found.` });
};

//painting the Form
export const getEdit = (req, res) => {
  const { id } = req.params;
  return res.render("edit", { pageTitle: `Editing` });
};
//Saving the Changes
export const postEdit = (req, res) => {
  const { id } = req.params;
  const { title } = req.body;
  return res.redirect(`/videos/${id}`);
};

//나중에 활성화 시키자
//export const search = (req, res) => res.send("search");
//export const deleteVideo = (req, res) => res.send("Delete Video");
//export const upload = (req, res) => res.send("Upload Video");

export const getUpload = (req, res) => {
  return res.render("upload", { pageTitle: `Upload Video` });
};

export const postUpload = async (req, res) => {
  const { title, description, hashtags } = req.body;
  try {
    await Video.create({
      title: title,
      description: description,
      hashtags: hashtags.split(",").map((word) => `#${word}`),
    });
    return res.redirect("/");
  } catch (error) {
    return res.render("upload", {
      pageTitle: "Upload Video",
      errorMessage: error._message,
    });
  }
};
