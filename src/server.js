//express와 server의 설정에 관련된 코드만 처리하는 파일

import express from "express";
import morgan from "morgan";

import rootRouter from "./routers/rootRouter";
import videoRouter from "./routers/videoRouter";
import userRouter from "./routers/userRouter";

const app = express();
const logger = morgan("dev");

app.set("view engine", "pug");
app.set("views", process.cwd() + "/src/views");

app.use(logger);
app.use(express.urlencoded({ extended: true }));
//express application이 form의 value들을 이해할 수 있게 하고 JS로 변형시켜줌
app.use("/", rootRouter);
app.use("/videos", videoRouter);
app.use("/users", userRouter);

export default app;
