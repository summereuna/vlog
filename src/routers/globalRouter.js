import express from "express";

import { home, search } from "../controllers/videoController";
import { join, login } from "../controllers/userController";

// create router
const globalRouter = express.Router();

globalRouter.get("/", home);
globalRouter.get("/join", join);
globalRouter.get("/login", login);
globalRouter.get("/search", search);

//export router -> default로 글로벌 라우터 익스포트 하기
export default globalRouter;
