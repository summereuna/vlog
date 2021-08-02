//비디오 첫 화면: 트렌딩 비디오 페이지
export const trending = (req, res) => res.send("Home page Videos");

export const watch = (req, res) => res.send("Watch Video");
export const edit = (req, res) => res.send("Edit Video");
export const remove= (req, res) => res.send("Remove Video");
export const comments = (req, res) => res.send("Comment on a Video");

//export default 변수명;: 한 변수만 가능
//import 변수명 from "파일 위치";

//export 변수명;: 여러 변수 익스포트 가능 
////import {변수명} from "파일 위치";