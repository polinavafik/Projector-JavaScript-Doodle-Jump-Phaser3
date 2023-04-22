const config = {
	type: Phaser.AUTO,
	width: 640,
	height: window.innerHeight,
	physics: {
		default: 'arcade',
		arcade: {
			gravity: { y: 300 },
			debug: true,
		},
	},
	scene: {
		preload: preload,
		create: create,
		update: update,
	},
}

window.addEventListener(
	'resize',
	function () {
		game.scale.resize(config.width, window.innerHeight)
	},
	false,
)

const game = new Phaser.Game(config)
let player
let platforms
let enemies
let ball

let leftKey
let rightKey
let spacebar

let gameOverDistance = 0
let gameOver = false



let score = 0
let scoreText
let scoreMax

function preload() {
	this.load.image('background_img', 'assets/background.png')
	this.load.image('playerSprite', 'assets/player.png')
	this.load.image('playerJumpSprite', 'assets/player_jump.png')
	this.load.image('playerLeftSprite', 'assets/player_left_jump.png')
	this.load.image('playerRightSprite', 'assets/player_right_jump.png')
	this.load.image('platform', 'assets/game-tiles.png')
	this.load.image('enemy', 'assets/enemy_default.png')
	this.load.spritesheet('enemyAnims', 'assets/enemy.png', { frameWidth: 161, frameHeight: 95 })
	this.load.image('ball', 'assets/Parsnip.png')
}

function create() {
	this.add.image(0, 0, 'background_img').setOrigin(0, 0).setScrollFactor(0)
	scoreText = this.add
		.text(20, 60, 'score: 0', { fontSize: '32px', fill: '#fff' })
		.setScrollFactor(0)
		.setDepth(5)
	scoreMax = this.add
		.text(20, 20, `Max Score: ${localStorage.getItem('maxScore')}`, { fontSize: '32px', fill: '#fff' })
		.setScrollFactor(0)
		.setDepth(5)

	this.anims.create({
		key: 'jump',
		frames: [{ key: 'playerJumpSprite' }, { key: 'playerSprite' }],
		frameRate: 10,
		repeat: 0
	});

	this.anims.create({
		key: 'left',
		frames: [{ key: 'playerLeftSprite' }],
		frameRate: 10,
		repeat: -1
	});
	this.anims.create({
		key: 'right',
		frames: [{ key: 'playerRightSprite' }],
		frameRate: 10,
		repeat: -1
	});
	this.anims.create({
		key: 'turn',
		frames: [{ key: 'playerSprite' }],
		frameRate: 20
	});
	this.anims.create({
		key: 'enemy',
		frames: 'enemyAnims',
		frameRate: 10,
		repeat: -1,
		yoyo: true,
	})

	createPlayer(this.physics)
	createPlatforms(this.physics)
	createEnemies(this.physics)
	createBall(this.physics)

	this.physics.add.collider(player, platforms, (playerObj, platformObj) => {
		if (platformObj.body.touching.up && playerObj.body.touching.down) {
			player.setVelocityY(-550)
			player.anims.play('jump', true)
		}
	})

	this.physics.add.collider(platforms, platforms, collider => {
		collider.x = Phaser.Math.Between(0, 640)
		collider.refreshBody()
	})


	this.physics.add.collider(player, enemies, (_, enemy) => {
		this.physics.pause()
		enemy.anims.stop()
		gameOver = true
	})

	this.physics.add.collider(platforms, enemies, collider => {
		collider.x = Phaser.Math.Between(0, 640)
		collider.refreshBody()
	})

	this.physics.add.collider(player, ball, (playerObj, ballObj) => {
		if (ballObj.body.touching && playerObj.body.touching) {
			ballObj.disableBody(true, true)
			score += 100
			scoreText.setText('Score: ' + score)
			player.setVelocityY(-1000)
			player.anims.play('jump', true)
		}
	})

	this.physics.add.collider(platforms, ball, collider => {
		collider.x = Phaser.Math.Between(0, 640)
		collider.refreshBody()
	})

	this.physics.add.collider(enemies, ball, collider => {
		collider.x = Phaser.Math.Between(0, 640)
		collider.refreshBody()
	})

	this.cameras.main.startFollow(player, false, 0, 1)

	createKeys(this.input.keyboard)
}

function update() {
	if (gameOver) return
	checkMovement()
	checkBall()
	newPlatforms()
	newEnemies()
	newSnack()
	checkIfFall(this.physics)
	updateScore()
}

function createPlayer(physics) {
	player = physics.add.sprite(325, -100, 'playerSprite')
	player.setBounce(0, 1)
	player.setVelocityY(-300)
	player.body.setSize(56, 90)
	player.body.setOffset(-2, 0)
	player.setDepth(10)
}

function createPlatforms(physics) {
	platforms = physics.add.staticGroup()
	platforms.create(325, 0, 'platform')
	platforms.create(Phaser.Math.Between(0, 640), -200, 'platform')
	platforms.create(Phaser.Math.Between(0, 640), -400, 'platform')
	platforms.create(Phaser.Math.Between(0, 640), -600, 'platform')
	platforms.create(Phaser.Math.Between(0, 640), -800, 'platform')
	platforms.create(Phaser.Math.Between(0, 640), -1000, 'platform')
	platforms.create(Phaser.Math.Between(0, 640), -1200, 'platform')
	platforms.create(Phaser.Math.Between(0, 640), -1400, 'platform')
	platforms.create(Phaser.Math.Between(0, 640), -1600, 'platform')
	platforms.create(Phaser.Math.Between(0, 640), -1800, 'platform')
	platforms.create(Phaser.Math.Between(0, 640), -2000, 'platform')
	platforms.create(Phaser.Math.Between(0, 640), -2200, 'platform')
	platforms.create(Phaser.Math.Between(0, 640), -2400, 'platform')
	platforms.children.iterate(function (platform) {
		platform.body.checkCollision.down = false
		platform.body.checkCollision.left = false
		platform.body.checkCollision.right = false
	})
}

function createEnemies(physics) {
	enemies = physics.add.group()
	enemies.create(Phaser.Math.Between(0, 640), Phaser.Math.Between(-1350, -1800), 'enemy')
	enemies.children.iterate(function (enemy) {
		enemy.body.setSize(60, 60)
		enemy.body.setOffset(50, 10)
		enemy.body.setAllowGravity(false)
		enemy.anims.play('enemy')
	})
}

function createBall(physics) {
	ball = physics.add.group()
	ball.create(Phaser.Math.Between(0, 640), Phaser.Math.Between(-450, -980), 'ball')
	ball.children.iterate(function (balls) {
		balls.body.setSize(30, 30)
		balls.body.setAllowGravity(false)
	})
}


function createKeys(keyboard) {
	leftKey = keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT, true, true)
	rightKey = keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT, true, true)
	spacebar = keyboard.adrightKey(Phaser.Input.Keyboard.KeyCodes.SPACE)
}

function checkMovement() {
	if (leftKey.isDown && !rightKey.isDown) {
		player.setVelocityX(-350)
		player.anims.play('left', true)
		if (player.x < 15) {
			player.x = 615
		}
	}
	if (rightKey.isDown && !leftKey.isDown) {
		player.setVelocityX(350)
		player.anims.play('right', true)
		if (player.x > 615) {
			player.x = 25
		}
	}
	if (!leftKey.isDown && !rightKey.isDown) {
		player.setVelocityX(0)
		player.anims.play('turn', true)
	}
}



function newPlatforms() {
	let minY = 0
	platforms.children.iterate(function (platform) {
		if (platform.y < minY) minY = platform.y
	})
	platforms.children.iterate(function (platform) {
		if (platform.y > player.y && player.body.center.distance(platform.body.center) > 700) {
			platform.x = Phaser.Math.Between(0, 640)
			platform.y = minY - 200
			platform.refreshBody()
		}
	})
}

function newEnemies() {
	enemies.children.iterate(function (enemy) {
		if (enemy.y > player.y && player.body.center.distance(enemy.body.center) > 700) {
			enemy.x = Phaser.Math.Between(0, 640)
			enemy.y = enemy.y - Phaser.Math.Between(1600, 2000)
			enemy.enableBody(true, enemy.x, enemy.y, true, true)
		}
	})
}

function newSnack() {
	ball.children.iterate(function (ball) {
		if (ball.y > player.y && player.body.center.distance(ball.body.center) > 700) {
			ball.x = Phaser.Math.Between(0, 640)
			ball.y = ball.y - Phaser.Math.Between(1600, 2000)
			ball.enableBody(true, ball.x, ball.y, true, true)
		}
	})
}


function checkIfFall(physics) {
	if (player.body.y > gameOverDistance) {
		physics.pause()
		gameOver = true
	} else if (player.body.y * -1 - gameOverDistance * -1 > 700) {
		gameOverDistance = player.body.y + 700
	}
}

function updateScore() {
	if (player.y * -1 > score) {
		score += 10
		scoreText.setText('Score: ' + score)
	}
	storeMaxScore()

}

function storeMaxScore() {
	if (localStorage.getItem('maxScore') < score) {
		localStorage.setItem('maxScore', score)
		scoreMax.setText(`Max Score: ${localStorage.getItem('maxScore')}`)
	}
}












