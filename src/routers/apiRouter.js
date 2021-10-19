import express from "express";
import { registerView, createComment } from "../controllers/videoController";
const apiRouter = express.Router();

//유저가 영상 볼 때 마다 조회수 기록
apiRouter.post("/videos/:id([0-9a-f]{24})/view", registerView);
//댓글
apiRouter.post("/videos/:id([0-9a-f]{24})/comment", createComment);

export default apiRouter;
