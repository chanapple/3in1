import {
	AUTO,
	Scale,
	Game,
	Math,
	Tilemaps
} from "/game/phaser/phaser.esm.min.js";

import playScene from "/game/js/playScene.js";

const worldWidth = 8000;
const worldHeight = 6400;
const displayWidth = 1200;
const displayHeight = 800;

const config = {
	type: AUTO,
	scale: {
		parent: "gameview",
		mode: Scale.FIT,
		width: displayWidth,
		height: displayHeight
	},
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
