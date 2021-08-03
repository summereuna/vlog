import express from "express";

import { trending, search } from "../controllers/videoController";
import { join, login } from "../controllers/userController";


// create router
const globalRouter = express.Router();

globalRouter.get("/", trending);
globalRouter.get("/join", join);
globalRouter.get("/login", login);
globalRouter.get("/search", search);

//export router -> default로 글로벌 라우터 익스포트 하기
export default globalRouter;
