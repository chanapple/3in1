/** 환경설정:모듈 불러오기 */
import express from "express";
import controller from './diary.controller.js';

/** 환경설정:라우터 설정 */
const router = express.Router();

/** 메인 라우터 */
router.get('/', controller.viewIndex)

/** 모듈 내보내기 */
export default router;