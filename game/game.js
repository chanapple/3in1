/** 환경설정:모듈 불러오기 */
import express from "express";
import controller from "./game.controller.js";
import path from "path";

/** 환경설정:상수 경로 설정 */
const __dirname = path.resolve();
const __gamedirname = path.join(__dirname, "/game");

/** 환경설정:라우터 설정 */
const router = express.Router();

/** 메인 라우터 */
/** 메인 페이지 */
router.get("/", controller.viewIndex);
/** 페이저 경로 지정 */
router.use(
	"/phaser",
	express.static(path.join(__dirname, "/node_modules/phaser/dist"))
);
/** 에셋 경로 지정 */
router.use("/assets", express.static(path.join(__dirname, "/game/assets")));
/** 모듈 내보내기 */
export default router;
