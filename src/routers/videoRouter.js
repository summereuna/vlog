import express from "express";

import {watch, edit, remove, comments} from "../controllers/videoController";

const videoRouter = express.Router();

videoRouter.get("/watch", watch);
videoRouter.get("/edit", edit);
videoRouter.get("/remove", remove);
videoRouter.get("/comments", comments);

export default videoRouter;