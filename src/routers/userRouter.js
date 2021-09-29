import express from "express";

import {
  logout,
  getEdit,
  postEdit,
  startGithubLogin,
  finishGithubLogin,
  getChangePassword,
  postChangePassword,
  //see,
} from "../controllers/userController";
import {
  protectorMiddleware,
  publicOnlyMiddleware,
  avatarUpload,
} from "../middlewares";

const userRouter = express.Router();

//로그인 한 사람들만 로그아웃페이지로 갈 수 있어야 하니까 미들웨어 추가해주기
userRouter.get("/logout", protectorMiddleware, logout);
//어떤 http 메소드를 사용하든 모두 이 미들웨어 사용하려면 express의 all()함수 이용해서 미들웨어 넣어주면 된다.
userRouter
  .route("/edit")
  .all(protectorMiddleware)
  .get(getEdit)
  .post(avatarUpload.single("avatar"), postEdit);

userRouter
  .route("/change-password")
  .all(protectorMiddleware)
  .get(getChangePassword)
  .post(postChangePassword);

/*로그인 안한 사람들이 사용하는 페이지: 로그인 되어 있으면 이 페이지에 올 수 없도록 미들웨어 넣기*/
userRouter.get("/github/start", publicOnlyMiddleware, startGithubLogin);
userRouter.get("/github/finish", publicOnlyMiddleware, finishGithubLogin);

//userRouter.get("/:id", see);

export default userRouter;
