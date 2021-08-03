//비디오 첫 화면: 트렌딩 비디오 페이지
export const trending = (req, res) => res.send("Home page Videos");
export const search = (req, res) => res.send("Search");

export const see = (req, res) => res.send("See Video");
export const edit = (req, res) => res.send("Edit Video");
export const deleteVideo= (req, res) => res.send("Delete Video");
export const upload = (req, res) => res.send("Upload Video");

//export default 변수명;: 한 변수만 가능
//import 변수명 from "파일 위치";

//export 변수명;: 여러 변수 익스포트 가능 
////import {변수명} from "파일 위치";