//비디오 첫 화면: 트렌딩 비디오 페이지
const videos = [
  {
    title: "First Video",
    rating: 5,
    comments: 2,
    createdAt: "2 minutes ago",
    views: 59,
    id: 1,
  },
  {
    title: "Second Video",
    rating: 5,
    comments: 2,
    createdAt: "2 minutes ago",
    views: 59,
    id: 2,
  },
  {
    title: "Third Video",
    rating: 5,
    comments: 2,
    createdAt: "2 minutes ago",
    views: 1,
    id: 3,
  },
];

export const trending = (req, res) => {
  return res.render("home", { pageTitle: "Home", videos });
};
export const watch = (req, res) => {
  //const id = req.params.id;
  const { id } = req.params;
  const video = videos[id - 1];
  return res.render("watch", { pageTitle: `Watching: ${video.title}`, video });
};

//painting the Form
export const getEdit = (req, res) => {
  const { id } = req.params;
  const video = videos[id - 1];
  return res.render("edit", { pageTitle: `Editing: ${video.title}`, video });
};
//Saving the Changes
export const postEdit = (req, res) => {
  const { id } = req.params;
  const { title } = req.body;
  videos[id - 1].title = title;
  return res.redirect(`/videos/${id}`);
};

export const search = (req, res) => res.send("search");
export const deleteVideo = (req, res) => res.send("Delete Video");
export const upload = (req, res) => res.send("Upload Video");

//export default 변수명;: 한 변수만 가능
//import 변수명 from "파일 위치";

//export 변수명;: 여러 변수 익스포트 가능
////import {변수명} from "파일 위치";
