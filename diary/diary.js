/** 환경설정:모듈 불러오기 */
import express from "express";
import controller from "./diary.controller.js";
import path from "path";

/** 환경설정:상수 경로 설정 */
const __dirname = path.resolve();

/** 환경설정:라우터 설정 */
const router = express.Router();

/** 메인 라우터 */
router.get("/", controller.viewIndex);
router.get("/draw", controller.viewDraw);

router.use("/css", express.static(path.join(__dirname, "/diary/css")));
router.use("/image", express.static(path.join(__dirname, "/diary/image")));

/** 모듈 내보내기 */
export default router;
