import express from "express";

import { trending } from "../controllers/videoController";
import { join } from "../controllers/userController";


// create router
const globalRouter = express.Router();

//configure router
const trending = (req, res) => res.send("Home");
const join = (req, res) => res.send("Join");
//const handleLogin = (req, res) => res.send("Login");
//const handleSearch = (req, res) => res.send("Search");

globalRouter.get("/", trending);
globalRouter.get("/join", join);
//globalRouter.get("/login", handleLogin);
//globalRouter.get("/search", handleSearch);

//export router -> default로 글로벌 라우터 익스포트 하기
export default globalRouter;
//누구든 globalRouter.js를 import하면, globalRouter 자체를 import 할 수 있게됨
//프로젝트에 있는 모든 파일은 분리된 모듈이기 때문에 무언가를 바깥에 공유하기 위해서는 익스포트를 해줘야 함
