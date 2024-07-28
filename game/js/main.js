import {
	AUTO,
	Scale,
	Game,
	Math,
	Tilemaps
} from "/game/phaser/phaser.esm.min.js";

import playScene from "/game/js/playScene.js";
/** 게임 내 전체 월드 크기 */
const worldWidth = 8000;
const worldHeight = 6400;
/** 사용자에게 보이는 화면 크기 */
const displayWidth = 1200;
const displayHeight = 800;
/**  */
const config = {
	type: AUTO,
	scale: {
		parent: "gameview",
		mode: Scale.FIT,
		width: displayWidth,
		height: displayHeight
	},
	/** arcde라는 물리 엔진 추가, 중력을 300으로 설정 */
	physics: {
		default: "arcade",
		arcade: {
			gravity: {y: 300},
			debug: false
		}
	},
	scene: playScene,
	pixelArt: true
};

const game = new Game(config);
