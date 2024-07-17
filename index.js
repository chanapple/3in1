/** 환경설정:모듈 불러오기 */
import express from "express";
import path from "path";
import env from "dotenv";

import {createServer} from "http";
import {Server} from "socket.io";

/** 환경설정:각자 팀 파일 불러오기 */
import gameRouter from "./game/game.js";
import diaryRouter from "./diary/diary.js";
import photoRouter from "./photo/photo.js";

/** 환경설정:환경 변수 불러오기(.env) */
env.config();

/** 환경설정:포트 설정과 익스프레스 설정 */
const port = process.env.PORT;
const app = express();
const httpServer = createServer(app);

/** 환경설정:상수 경로 설정 */
const __dirname = path.resolve();
app.set("port", port);
/** 메인 라우터 */
app.get("/", (req, res) => {
	res.sendFile(path.join(__dirname, "/index.html"));
});

/** 각자 팀 라우터 */
app.use("/game", gameRouter);
app.use("/diary", diaryRouter);
app.use("/photo", photoRouter);

const io = new Server(httpServer, {
	cors: {
		origin: "http://localhost:" + port
	}
});
io.on("connection", socket => {
	console.log("a user connected");
	players[socket.id] = {
		//rotation: 0,
		x: 4100,
		y: 3100,
		playerId: socket.id
		//team: Math.floor(Math.random() * 2) == 0 ? "red" : "blue"
	};
	// send the players object to the new player
	socket.emit("currentPlayers", players);
	// update all other players of the new player
	socket.broadcast.emit("newPlayer", players[socket.id]);

	socket.on("disconnect", function () {
		console.log("user disconnected");
		// remove this player from our players object
		delete players[socket.id];
		// emit a message to all players to remove this player
		io.emit("playerdisconnect", socket.id);
	});
	// when a player moves, update the player data
	socket.on("playerMovement", function (movementData) {
		players[socket.id].x = movementData.x;
		players[socket.id].y = movementData.y;
		// emit a message to all players about the player that moved
		socket.broadcast.emit("playerMoved", players[socket.id]);
	});
});
var players = {};

/** 시스템 시작 */
httpServer.listen(port);
console.log(port + "포트, 경로: " + __dirname);
