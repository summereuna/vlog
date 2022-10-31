import { Model } from "mongoose";
import Video from "../models/Video";
import Comment from "../models/Comment";
import User from "../models/User";
import { async } from "regenerator-runtime";

//promise
export const home = async (req, res) => {
  const videos = await Video.find({})
    .sort({ createdAt: "desc" })
    .populate("owner");
  return res.render("home", { pageTitle: "홈", videos });
};

export const watch = async (req, res) => {
  const videos = await Video.find({})
    .sort({ createdAt: "desc" })
    .populate("owner");
  const { id } = req.params;
  const video = await Video.findById(id)
    .populate("owner")
    .populate({
      path: "comments",
      populate: {
        path: "owner",
        model: "User",
      },
    });
  if (!video) {
    return res
      .status(404)
      .render("404", { pageTitle: `비디오를 찾을 수 없습니다.` });
  }
  return res.render("watch", { pageTitle: video.title, video, videos });
};

export const getEdit = async (req, res) => {
  const { id } = req.params;
  const {
    user: { _id },
  } = req.session;
  const video = await Video.findById(id);
  if (!video) {
    return res
      .status(404)
      .render("404", { pageTitle: `비디오를 찾을 수 없습니다.` });
  }
  if (String(video.owner) !== String(_id)) {
    req.flash("error", "승인되지 않은 접근입니다.");
    return res.status(403).redirect("/");
  }
  return res.render("videos/edit", {
    pageTitle: `${video.title} 수정`,
    video,
  });
};

//Saving the Changes
//video는 데이터베이스에서 검색한 영상 오브젝트
//Video는 비디오모델
export const postEdit = async (req, res) => {
  const {
    user: { _id },
  } = req.session;
  const { id } = req.params;
  const { title, description, hashtags } = req.body;
  //exists에서 findById로 변경
  const video = await Video.findById({ _id: id });
  if (!video) {
    return res
      .status(404)
      .render("404", { pageTitle: `비디오를 찾을 수 없습니다.` });
  }
  if (String(video.owner) !== String(_id)) {
    req.flash("error", "승인되지 않은 접근입니다.");
    return res.status(403).redirect("/");
  }
  await Video.findByIdAndUpdate(id, {
    title,
    description,
    hashtags: Video.formatHashtags(hashtags),
  });
  req.flash("success", "동영상 정보가 수정되었습니다.");
  return res.redirect(`/videos/${id}`);
};

export const getUpload = (req, res) => {
  return res.render("videos/upload", { pageTitle: `동영상 업로드` });
};

export const postUpload = async (req, res) => {
  const {
    user: { _id },
  } = req.session;
  const { video, thumbnail } = req.files;
  const { title, description, hashtags } = req.body;

  //🚀 Heroku 사용 중인지 확인하는 변수 추가
  const isHeroku = process.env.NODE_ENV === "production";

  try {
    const newVideo = await Video.create({
      title,
      description,
      //localhost일 때는 uploads 폴더를 사용하고, heroku에서는 s3multer AWS를 사용
      fileUrl: isHeroku ? video[0].location : video[0].path,
      thumbnailUrl: isHeroku ? thumbnail[0].location : thumbnail[0].path,
      hashtags: Video.formatHashtags(hashtags),
      owner: _id,
    });
    const user = await User.findById(_id);
    user.videos.push(newVideo._id);
    user.save();
    return res.redirect("/");
  } catch (error) {
    return res.status(400).render("videos/upload", {
      pageTitle: "동영상 업로드",
      errorMessage: error._message,
    });
  }
};

export const deleteVideo = async (req, res) => {
  const { id } = req.params;
  const {
    user: { _id },
  } = req.session;
  const video = await Video.findById(id);
  if (String(video.owner) !== String(_id)) {
    return res.status(403).redirect("/");
  }
  req.flash("success", "동영상이 삭제 되었습니다.");
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
    }).populate("owner");
  }
  return res.render("search", { pageTitle: "검색", videos });
};

//조회수
export const registerView = async (req, res) => {
  const { id } = req.params;
  const video = await Video.findById(id);
  if (!video) {
    return res.sendStatus(404);
  }
  video.meta.views = video.meta.views + 1;
  await video.save();
  return res.sendStatus(200);
};

//댓글
export const createComment = async (req, res) => {
  const {
    session: { user },
    body: { text },
    params: { id },
  } = req;
  const video = await Video.findById(id);
  const userInfo = await User.findById(user._id);
  if (!video || !user) {
    return res.sendStatus(404);
  }
  const comment = await Comment.create({
    text,
    owner: user._id,
    video: id,
  });
  video.comments.push(comment._id);
  video.save();
  userInfo.comments.push(comment._id);
  userInfo.save();
  const newComment = await Comment.findById(comment._id)
    .populate("video")
    .populate("owner");
  return res.status(201).json({
    newCommentId: comment._id,
    text: newComment.text,
    owner: newComment.owner.name,
    avatarUrl: newComment.owner.avatarUrl,
    createdAt: newComment.createdAt,
  });
};

export const deleteComment = async (req, res) => {
  const {
    params: { id },
    session: { user },
  } = req;
  const checkComment = await Comment.findById(id);
  if (String(user._id) !== String(checkComment.owner)) {
    return res.sendStatus(404);
  }
  await Comment.findByIdAndDelete(id);
  return res.sendStatus(200);
};
