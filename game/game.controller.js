/** 환경설정:모듈 불러오기 */
import path from 'path';

/** 환경설정:상수 경로 설정 */
const __dirname = path.resolve();
const __gamedirname = path.join(__dirname, '/game');

/** 메인 모듈 */
function viewIndex(req, res){
    res.sendFile(path.join(__gamedirname, '/index.html'));
}

/** 모듈 내보내기 */
export default {viewIndex}