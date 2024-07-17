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
			key: "drop",
			frames: this.anims.generateFrameNumbers("knight", {start: 65, end: 66}),
			frameRate: 12,
			repeat: -1
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
		/** 키보드의 화살표 키를 입력 받음 */
		const cursors = this.input.keyboard.createCursorKeys();
		/** 사용자가 왼쪽 키를 눌렸는지 확인 */
		if (cursors.left.isDown) {
			/** 캐릭터가 왼족을 바라봄 */
			this.player.setFlipX(true);
			/** 캐릭터가 왼쪽으로 260의 속도로 움직임 */
			this.player.setVelocityX(-260);
			/** 캐릭터가 바닥에 닿아 있는지 확인 */
			if (this.player.body.touching.down) {
				/** 캐릭터가 바닥에 닿아 있으면 걷는 애니메이션 재생 */
				this.player.anims.play("walk", true);
			}
		}
		/** 사용자가 오른쪽 키를 눌렀는지 확인 */
		else if (cursors.right.isDown) {
			/** 캐릭터가 오른쪽을 바라봄 */
			this.player.setFlipX(false);
			/** 캐릭터가 오른쪽으로 260의 속도로 윰직임 */
			this.player.setVelocityX(260);
			/** 캐릭터가 바닥에 닿아 있는지 확인 */
			if (this.player.body.touching.down) {
				/** 캐릭터가 바닥에 닿아 있으면 걷는 애니메이션 재생 */
				this.player.anims.play("walk", true);
			}
		}
		/** 캐릭터가 바닥에 닿아 있는지 확인 */
		else if (this.player.body.touching.down) {
			/** 아무런 키의 입력을 받지 않으면 x축의 속도가 0으로 캐릭터기 움직이지 않음 */
			this.player.setVelocityX(0);
			/** 캐릭터의 기본 애니메시연 재생 */
			this.player.anims.play("idle", true);
		}
		/** 위쪽 키를 눌렀는지, 캐릭터가 바닥에 닿아 있는지 확인*/
		if (cursors.up.isDown && this.player.body.touching.down) {
			/** 캐릭터가 위쪽으로 330의 속도로 움직임 */
			this.player.setVelocityY(-330);
			/** 캐릭터가 점프하는 애니메이션 재생 */
			this.player.anims.play("jump");
		}
		else if (!this.player.body.touching.down) {
			if (this.player.body.velocity.y > 0) {
				this.player.anims.play("drop", true);
			}
		}
	}
}

export default play;
