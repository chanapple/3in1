import {
	AUTO,
	Scale,
	Game,
	Math as PhaserMath,
	Tilemaps,
	Scene
} from "/game/phaser/phaser.esm.min.js";

class play extends Scene {
	constructor() {
		super({key: "playScene"});
		this.stars;
		this.player;
		this.cursors;
		this.score = 0;
		this.scoreText;
		this.worldWidth = 8000;
		this.worldHeight = 6400;
		this.displayWidth = 1200;
		this.displayHeight = 800;
	}

	mapBuilder(mapWidth, mapHeight, step, groundBlock) {
		var groundHeight = mapHeight / 2;
		for (let x = 0; x <= mapWidth; x += step) {
			groundBlock.create(x, groundHeight, "map", 0).setScale(2).setOrigin(0, 0);
			for (let y = groundHeight + 32; y <= mapHeight; y += step) {
				groundBlock.create(x, y, "map", 16).setScale(2).setOrigin(0, 0);
			}
		}
	}

	preload() {
		this.load.image("sky", "assets/sky.png");
		this.load.image("ground", "assets/platform.png");
		this.load.image("star", "assets/star.png");
		this.load.image("bomb", "assets/bomb.png");
		this.load.spritesheet("dude", "assets/dude.png", {
			frameWidth: 32,
			frameHeight: 48
		});
		this.load.spritesheet("map", "assets/sprites/world_tileset.png", {
			frameWidth: 16,
			frameHeight: 16
		});
	}

	create() {
		this.add.image(4000, 3200, "sky").setScale(11);

		const groundBlock = this.physics.add.staticGroup();

		// 맵 빌드 메서드 호출
		this.mapBuilder(this.worldWidth, this.worldHeight, 32, groundBlock);

		// 그룹의 물리 속성 갱신
		groundBlock.refresh();

		this.player = this.physics.add.sprite(4000, 3168, "dude");
		this.player.setBounce(0.2);

		this.anims.create({
			key: "left",
			frames: this.anims.generateFrameNumbers("dude", {start: 0, end: 3}),
			frameRate: 10,
			repeat: -1
		});

		this.anims.create({
			key: "turn",
			frames: [{key: "dude", frame: 4}],
			frameRate: 20
		});

		this.anims.create({
			key: "right",
			frames: this.anims.generateFrameNumbers("dude", {start: 5, end: 8}),
			frameRate: 10,
			repeat: -1
		});

		this.scoreText = this.add.text(16, 16, "score: 0", {
			fontSize: "32px",
			fill: "#000"
		});

		this.physics.add.collider(groundBlock, this.player);

		this.cameras.main.setBounds(0, 0, this.worldWidth, this.worldHeight);
		this.cameras.main.startFollow(this.player);
		
		// 마우스 컨텍스트 메뉴 비활성화
        this.input.mouse.disableContextMenu();
	}

	update() {
		const cursors = this.input.keyboard.createCursorKeys();
		if (cursors.left.isDown) {
			this.player.setVelocityX(-260);
			this.player.anims.play("left", true);
		} else if (cursors.right.isDown) {
			this.player.setVelocityX(260);
			this.player.anims.play("right", true);
		} else {
			this.player.setVelocityX(0);
			this.player.anims.play("turn");
		}

		if (cursors.up.isDown && this.player.body.touching.down) {
			this.player.setVelocityY(-330);
		}
	}
}

export default play;
