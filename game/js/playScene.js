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

		this.worldWidth = 8000;
		this.worldHeight = 6400;
		this.displayWidth = 1200;
		this.displayHeight = 800;

		this.stars;
		this.player;
		this.cursors;
		this.score = 0;
		this.scoreText;

		this.isJumping = false;
	}

	mapBuilder(mapWidth, mapHeight, step, groundBlock) {
		var groundHeight = mapHeight / 2;
		for (let x = 0; x <= mapWidth; x += step) {
			groundBlock.create(x, groundHeight, "map", 0).setScale(2).setOrigin(0, 0);
			for (let y = groundHeight + 32; y <= mapHeight; y += step) {
				groundBlock
					.create(x, y, "map", 16)
					.setScale(2)
					.setOrigin(0, 0)
					.setInteractive();
			}
		}
	}

	preload() {
		this.load.image("sky", "assets/sky.png");
		this.load.image("ground", "assets/platform.png");
		this.load.image("star", "assets/star.png");
		this.load.image("bomb", "assets/bomb.png");
		this.load.spritesheet("knight", "assets/sprites/adventurer.png", {
			frameWidth: 50,
			frameHeight: 37
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

		this.player = this.physics.add.sprite(4000, 3100, "knight").setScale(2.5);
		this.player.setBounce(0.2);

		this.anims.create({
			key: "walk",
			frames: this.anims.generateFrameNumbers("knight", {start: 26, end: 31}),
			frameRate: 12,
			repeat: -1
		});

		this.anims.create({
			key: "jump",
			frames: this.anims.generateFrameNumbers("knight", {start: 39, end: 42}),
			frameRate: 12
		});

		this.anims.create({
			key: "idle",
			frames: this.anims.generateFrameNumbers("knight", {start: 0, end: 3}),
			frameRate: 3,
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

		groundBlock.on("pointerdown", function (params) {});
	}

	update() {
		const cursors = this.input.keyboard.createCursorKeys();
		if (cursors.left.isDown) {
			this.player.setFlipX(true);
			this.player.setVelocityX(-260);
			if (this.player.body.touching.down) {
				this.player.anims.play("walk", true);
			}
		} else if (cursors.right.isDown) {
			this.player.setFlipX(false);
			this.player.setVelocityX(260);
			if (this.player.body.touching.down) {
				this.player.anims.play("walk", true);
			}
		} else if (this.player.body.touching.down) {
			this.player.setVelocityX(0);
			this.player.anims.play("idle", true);
		}

		if (cursors.up.isDown && this.player.body.touching.down) {
			this.player.setVelocityY(-330);
			this.player.anims.play("jump");
		}
	}
}

export default play;
