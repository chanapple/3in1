/** 환경설정:모듈 불러오기 */
import express from "express";
import path from "path";
import env from "dotenv";

/** 환경설정:각자 팀 파일 불러오기 */
import gameRouter from "./game/game.js";
import diaryRouter from "./diary/diary.js";
import photoRouter from "./photo/photo.js";

/** 환경설정:환경 변수 불러오기(.env) */
env.config();

/** 환경설정:포트 설정과 익스프레스 설정 */
const port = process.env.PORT;
const app = express();

/** 환경설정:상수 경로 설정 */
const __dirname = path.resolve();

/** 메인 라우터 */
app.get("/", (req, res) => {
	res.sendFile(path.join(__dirname, "/index.html"));
});

/** 각자 팀 라우터 */
app.use("/game", gameRouter);
app.use("/diary", diaryRouter);
app.use("/photo", photoRouter);

/** 시스템 시작 */
console.log(port + "포트, 경로: " + __dirname);
app.listen(port);
