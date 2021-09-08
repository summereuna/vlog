//DB와 Video 모델을 import 해주고, 우리 application 작동시켜 주는 파일
import "dotenv/config";
import "./db";
import "./models/Video";
import "./models/User";

import app from "./server";

const PORT = 4000;

const handleListening = () =>
  console.log(`✅ Server listening on port http://localhost:${PORT} 🚀`);

app.listen(PORT, handleListening);
