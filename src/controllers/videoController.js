import { Model } from "mongoose";
import Video from "../models/Video";

//promise
export const home = async (req, res) => {
  const videos = await Video.find({}).sort({ createdAt: "desc" });
  return res.render("home", { pageTitle: "Home", videos });
};

export const watch = async (req, res) => {
  //const id = req.params.id;
  const { id } = req.params;
  const video = await Video.findById(id);
  if (!video) {
    ////존재하지 않는 비디오 페이지로 접근할 경우 404 페이지 출력
    return res.status(404).render("404", { pageTitle: `Video not found.` });
  }
  return res.render("watch", { pageTitle: video.title, video });
};

//painting the Form
export const getEdit = async (req, res) => {
  const { id } = req.params;
  const video = await Video.findById(id);
  if (!video) {
    return res.status(404).render("404", { pageTitle: `Video not found.` });
  }
  return res.render("videos/edit", { pageTitle: `Edit ${video.title}`, video });
};
//Saving the Changes
//video는 데이터베이스에서 검색한 영상 오브젝트
//Video는 비디오모델
export const postEdit = async (req, res) => {
  const { id } = req.params;
  const { title, description, hashtags } = req.body;
  const video = await Video.exists({ _id: id });
  if (!video) {
    return res.status(404).render("404", { pageTitle: `Video not found.` });
  }
  await Video.findByIdAndUpdate(id, {
    title,
    description,
    hashtags: Video.formatHashtags(hashtags),
  });
  return res.redirect(`/videos/${id}`);
};

export const getUpload = (req, res) => {
  return res.render("videos/upload", { pageTitle: `Upload Video` });
};

export const postUpload = async (req, res) => {
  const { path: fileUrl } = req.file;
  const { title, description, hashtags } = req.body;
  try {
    await Video.create({
      title,
      description,
      fileUrl,
      hashtags: Video.formatHashtags(hashtags),
    });
    return res.redirect("/");
  } catch (error) {
    return res.status(400).render("videos/upload", {
      pageTitle: "Upload Video",
      errorMessage: error._message,
    });
  }
};

export const deleteVideo = async (req, res) => {
  const { id } = req.params;
  await Video.findByIdAndDelete(id);
  return res.redirect("/");
};

export const search = async (req, res) => {
  const { keyword } = req.query;
  let videos = [];
  if (keyword) {
    videos = await Video.find({
      title: {
        $regex: new RegExp(keyword, "i"),
      },
    });
  }
  return res.render("search", { pageTitle: "Search", videos });
};
