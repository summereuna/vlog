//express와 server의 설정에 관련된 코드만 처리하는 파일
import express from "express";
import morgan from "morgan";
import session from "express-session";
import MongoStore from "connect-mongo";

import rootRouter from "./routers/rootRouter";
import videoRouter from "./routers/videoRouter";
import userRouter from "./routers/userRouter";
import { localsMiddleware } from "./middlewares";

const app = express();
const logger = morgan("dev");

app.set("view engine", "pug");
app.set("views", process.cwd() + "/src/views");

app.use(logger);
//express application이 form의 value들을 이해할 수 있게 하고 JS로 변형시켜줌
app.use(express.urlencoded({ extended: true }));

//express-session 미들웨어: router 보다 먼저 초기화해줘야함
app.use(
  session({
    secret: process.env.COOKIE_SECRET,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({ mongoUrl: process.env.DB_URL }),
  })
);

//로컬미들웨어: 세션미들웨어 뒤에 나와야 세션을 받을 수 있음
//그리고 라우터 보다는 앞에 적어야 퍼그 템플릿에서 전역변수 사용가능
app.use(localsMiddleware);

app.use("/", rootRouter);
app.use("/videos", videoRouter);
app.use("/users", userRouter);

export default app;
