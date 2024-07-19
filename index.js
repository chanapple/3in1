/** 환경설정:모듈 불러오기 */
import express from "express";
import path from "path";
import env from "dotenv";

import {createServer} from "http"; //http 모듈 불러오기.
import {Server} from "socket.io"; //socket.io 라이브러리 불러오기.

/** 환경설정:각자 팀 파일 불러오기 */
import gameRouter from "./game/game.js";
import diaryRouter from "./diary/diary.js";
import photoRouter from "./photo/photo.js";

/** 환경설정:환경 변수 불러오기(.env) */
env.config();

/** 환경설정:포트 설정과 익스프레스 설정 */
const port = process.env.PORT; //포트 번호 가져오기.
const app = express(); //Express 애플리케이션 인스턴스(객체)를 생성
//http.createServer()는 http 모듈에 포함된 메서드임.
//HTTP 서버 인스턴스를 생성 -> Express 애플리케이션이 HTTP 서버에서 요청을 처리
const httpServer = createServer(app);

/** 환경설정:상수 경로 설정 */
const __dirname = path.resolve();
app.set("port", port); //가져온 포트 번호를 express 인스턴스인 app의 포트번호로 설정.

/** 메인 라우터 */
app.get("/", (req, res) => {
	res.sendFile(path.join(__dirname, "/index.html"));
});

/** 각자 팀 라우터 */
app.use("/game", gameRouter);
app.use("/diary", diaryRouter);
app.use("/photo", photoRouter);

const io = new Server(httpServer, {
	// 허용할 출처(origin)를 "http://localhost:" + port로 지정
	cors: {
		origin: "http://localhost:" + port
	}
});

//socket.io 연결
io.on("connection", socket => {
	console.log("A user connected");

	//그림을 그리면
	socket.on("draw", data => {
		console.log("Draw data received:", data);
		// 그린 그림 객체를 모두에게 브로드캐스트함.
		// 서버에서 draw 이벤트가 발생시킴.
		socket.broadcast.emit("draw", data);
		console.log(
			"그림 객체 데이터를 브로드캐스트함. main.js에 있는 draw 콜백함수 실행하라함."
		);
	});

	//연결을 끊는다면
	socket.on("disconnect", () => {
		console.log("A user disconnected");
	});
});

/** 시스템 시작 */
console.log(port + "포트, 경로: " + __dirname);
httpServer.listen(port);
