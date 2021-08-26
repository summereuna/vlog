import express from "express";

import { home, search } from "../controllers/videoController";
import { join, login } from "../controllers/userController";

// create router
const rootRouter = express.Router();

rootRouter.get("/", home);
rootRouter.get("/join", join);
rootRouter.get("/login", login);
rootRouter.get("/search", search);

//export router -> default로 루트 라우터 익스포트 하기
export default rootRouter;
