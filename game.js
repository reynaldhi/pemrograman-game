// Scene Menu Utama
class MainMenu extends Phaser.Scene {
    constructor() {
        super('MainMenu');
    }
    
    preload() {
        this.load.image('background', '/assets/images/bg-menu.png');
        this.load.audio('menuMusic', '/assets/sounds/menu.ogg');
    }
    
    create() {
        // Tambahkan background
        const bg = this.add.image(0, 0, 'background')
                    .setOrigin(0, 0)
                    .setDisplaySize(800, 600); 
        
        // Judul game
        this.add.text(400, 100, 'Space Explorer', { 
            fontSize: '48px', 
            fill: '#fff',
            fontFamily: 'Arial',
            stroke: '#000',
            strokeThickness: 4
        }).setOrigin(0.5);
        
        // Tombol Start
        const startButton = this.add.text(400, 250, 'Start Game', { 
            fontSize: '32px', 
            fill: '#0f0',
            backgroundColor: '#333',
            padding: { x: 20, y: 10 }
        })
        .setOrigin(0.5)
        .setInteractive();
        
        startButton.on('pointerdown', () => {
            this.scene.start('Level1');
        });
        
        startButton.on('pointerover', () => startButton.setStyle({ fill: '#0ff' }));
        startButton.on('pointerout', () => startButton.setStyle({ fill: '#0f0' }));
        
        // Tombol Instruksi (posisi y = 320)
        const instructionsButton = this.add.text(400, 320, 'Instructions', {
            fontSize: '32px',
            fill: '#ff0',
            backgroundColor: '#333',
            padding: { x: 20, y: 10 }
        })
        .setOrigin(0.5)
        .setInteractive();
        
        instructionsButton.on('pointerdown', () => {
            this.scene.start('Instructions');
        });
        instructionsButton.on('pointerover', () => instructionsButton.setStyle({ fill: '#0ff' }));
        instructionsButton.on('pointerout', () => instructionsButton.setStyle({ fill: '#ff0' }));

        // Tombol Keluar (posisi y = 390)
        const exitButton = this.add.text(400, 390, 'Exit', {
            fontSize: '32px',
            fill: '#f00',
            backgroundColor: '#333',
            padding: { x: 20, y: 10 }
        })
        .setOrigin(0.5)
        .setInteractive();
        
        exitButton.on('pointerdown', () => {
            window.close();
        });
        exitButton.on('pointerover', () => exitButton.setStyle({ fill: '#0ff'}));
        exitButton.on('pointerout', () => exitButton.setStyle({ fill: '#f00'}));
        
        // Mainkan musik menu
        this.sound.play('menuMusic', { loop: true });
    }
}

// Scene Instruksi
class Instructions extends Phaser.Scene {
    constructor() {
        super('Instructions');
    }
    
    create() {
        this.add.text(100, 100, 'Instruksi Permainan:\n\n- Gunakan tombol panah untuk bergerak\n- Lompat dengan spasi\n- Kumpulkan semua kristal\n- Hindari meteor dan alien\n- Kamu memiliki 3 nyawa', 
            { fontSize: '24px', fill: '#fff' });
        
        const backButton = this.add.text(400, 500, 'Kembali ke Menu', { fontSize: '24px', fill: '#0ff' })
            .setOrigin(0.5)
            .setInteractive();
            
        backButton.on('pointerdown', () => {
            this.scene.start('MainMenu');
        });
    }
}

// Level 1
class Level1 extends Phaser.Scene {
    constructor() {
        super('Level1');
        this.score = 0;
        this.lives = 3;
    }
    
    preload() {
        this.load.image('crystal', 'assets/images/blue_crystal.png');
        this.load.image('meteor', 'assets/images/meteor.png');
        this.load.spritesheet('player', 'https://labs.phaser.io/assets/sprites/dude.png', {
            frameWidth: 32,
            frameHeight: 48
        });
        this.load.image('sky', 'assets/images/bg-lvl1.png');
        this.load.audio('hitSound', 'assets/sounds/hit-meteor.ogg');
        this.load.audio('collectSound', 'assets/sounds/collect-crystal.ogg');
    }
    
    create() {
        // Background
        this.add.image(400, 300, 'sky').setScale(4).setDepth(0);
        
        // Platform
        this.platforms = this.physics.add.staticGroup();
        
        // Player setup
        this.player = this.physics.add.sprite(100, 450, 'player');
        this.player.setBounce(0.2);
        this.player.setCollideWorldBounds(true);
        
        // Animations
        this.anims.create({
            key: 'left',
            frames: this.anims.generateFrameNumbers('player', { start: 0, end: 3 }),
            frameRate: 10,
            repeat: -1
        });
        
        this.anims.create({
            key: 'turn',
            frames: [{ key: 'player', frame: 4 }],
            frameRate: 20
        });
        
        this.anims.create({
            key: 'right',
            frames: this.anims.generateFrameNumbers('player', { start: 5, end: 8 }),
            frameRate: 10,
            repeat: -1
        });
        
        // Crystals
        this.crystals = this.physics.add.group().setDepth(2);
        this.crystalsCollected = 0;
        this.crystalsRequired = 10; // Target kristal untuk menang
        
        // Spawn crystals continuously
        this.crystalSpawnTimer = this.time.addEvent({
            delay: 800,
            callback: this.spawnCrystal,
            callbackScope: this,
            loop: true
        });
        
        // Meteors as obstacles
        this.meteors = this.physics.add.group().setDepth(2);
        this.time.addEvent({
            delay: 1500,
            callback: this.spawnMeteor,
            callbackScope: this,
            loop: true
        });
        
        // Collisions
        this.physics.add.collider(this.player, this.platforms);
        this.physics.add.collider(this.crystals, this.platforms, (crystal) => {
            crystal.destroy(); // Destroy crystals when they hit ground
        });
        this.physics.add.collider(this.meteors, this.platforms, (meteor) => {
            meteor.destroy(); // Destroy meteors when they hit ground
        });
        
        // Overlaps
        this.hitSound = this.sound.add('hitSound', { volume: 0.7 });
        this.collectSound = this.sound.add('collectSound', { volume: 0.7 });
        
        this.physics.add.overlap(this.player, this.crystals, (player, crystal) => {
            this.collectSound.play();
            crystal.destroy();
            this.crystalsCollected++;
            this.score += 10;
            
            if (this.crystalsCollected >= this.crystalsRequired) {
                // Pause game
                this.physics.pause();
                this.scene.launch('LevelCompletePopup', {
                    title: 'Level 1 Complete!',
                    buttonText: 'Continue to Level 2',
                    score: this.score,
                    nextLevel: 'Level2',
                    currentLevel: 'Level1'
                });
            }
            
        });
        
        this.physics.add.overlap(this.player, this.meteors, (player, meteor) => {
            this.hitSound.play();
            meteor.destroy();
            this.lives--;
            
            if (this.lives <= 0) {
                this.scene.start('GameOver', {
                    score: this.score
                });
            }
        });
        
        // Controls
        this.cursors = this.input.keyboard.createCursorKeys();
        
        // UI
        this.scoreText = this.add.text(16, 16, `Score: ${this.score}`, { 
            fontSize: '32px', 
            fill: '#fff',
            fontFamily: 'Arial',
            stroke: '#000',
            strokeThickness: 4
        });
        
        this.livesText = this.add.text(600, 16, `Lives: ${this.lives}`, {
            fontSize: '32px',
            fill: '#f00',
            fontFamily: 'Arial',
            stroke: '#000',
            strokeThickness: 4
        });
        
        this.collectText = this.add.text(300, 16, `Crystals: ${this.crystalsCollected}/${this.crystalsRequired}`, {
            fontSize: '24px',
            fill: '#0f0',
            fontFamily: 'Arial',
            stroke: '#000',
            strokeThickness: 3
        });
    }
    
    spawnCrystal() {
        const crystal = this.crystals.create(
            Phaser.Math.Between(50, 750),
            -50, // Start above screen
            'crystal'
        );
        
        crystal.setVelocityY(Phaser.Math.Between(100, 200));
        crystal.setAngularVelocity(Phaser.Math.Between(-30, 30));
    }
    
    spawnMeteor() {
        const meteor = this.meteors.create(
            Phaser.Math.Between(50, 750),
            -100, // Start above screen
            'meteor'
        );
        
        meteor.setVelocityY(Phaser.Math.Between(200, 300));
        meteor.setAngularVelocity(Phaser.Math.Between(-50, 50));
        meteor.setScale(Phaser.Math.FloatBetween(0.8, 1.2));
    }
    
    update() {
        // Update UI
        this.scoreText.setText(`Score: ${this.score}`);
        this.livesText.setText(`Lives: ${this.lives}`);
        this.collectText.setText(`Crystals: ${this.crystalsCollected}/${this.crystalsRequired}`);
        
        // Player movement
        if (this.cursors.left.isDown) {
            this.player.setVelocityX(-200);
            this.player.anims.play('left', true);
        } else if (this.cursors.right.isDown) {
            this.player.setVelocityX(200);
            this.player.anims.play('right', true);
        } else {
            this.player.setVelocityX(0);
            this.player.anims.play('turn');
        }
        
        if (this.cursors.up.isDown && this.player.body.touching.down) {
            this.player.setVelocityY(-350);
        }
    }
}

// Level 2 (mirip dengan Level1 tapi dengan tantangan berbeda)
class Level2 extends Phaser.Scene {
    constructor() {
        super('Level2');
        this.score = 0;
        this.lives = 3;
    }
    
    preload() {
        this.load.image('crystal2', 'assets/images/green_crystal.png');
        this.load.image('meteor2', 'assets/images/meteor-lvl2.png');
        this.load.spritesheet('player', 'https://labs.phaser.io/assets/sprites/dude.png', {
            frameWidth: 32,
            frameHeight: 48
        });
        this.load.image('backgorund', 'assets/images/bg-lvl2.png');
        this.load.audio('hitSound', 'assets/sounds/hit-meteor.ogg');
        this.load.audio('collectSound', 'assets/sounds/collect-crystal.ogg');
    }
    
    create() {
        // Background
        this.add.image(400, 300, 'backgorund').setScale(4).setDepth(0);
        
        // Platform
        this.platforms = this.physics.add.staticGroup();
        
        // Player setup
        this.player = this.physics.add.sprite(100, 450, 'player');
        this.player.setBounce(0.2);
        this.player.setCollideWorldBounds(true);
        
        // Animations
        this.anims.create({
            key: 'left',
            frames: this.anims.generateFrameNumbers('player', { start: 0, end: 3 }),
            frameRate: 10,
            repeat: -1
        });
        
        this.anims.create({
            key: 'turn',
            frames: [{ key: 'player', frame: 4 }],
            frameRate: 20
        });
        
        this.anims.create({
            key: 'right',
            frames: this.anims.generateFrameNumbers('player', { start: 5, end: 8 }),
            frameRate: 10,
            repeat: -1
        });
        
        // Crystals
        this.crystals = this.physics.add.group().setDepth(2);
        this.crystalsCollected = 0;
        this.crystalsRequired = 20; // Target kristal untuk menang
        
        // Spawn crystals continuously
        this.crystalSpawnTimer = this.time.addEvent({
            delay: 1000,
            callback: this.spawnCrystal,
            callbackScope: this,
            loop: true
        });
        
        // Meteors as obstacles
        this.meteors = this.physics.add.group().setDepth(2);
        this.time.addEvent({
            delay: 1500,
            callback: this.spawnMeteor,
            callbackScope: this,
            loop: true
        });
        
        // Collisions
        this.physics.add.collider(this.player, this.platforms);
        this.physics.add.collider(this.crystals, this.platforms, (crystal) => {
            crystal.destroy(); // Destroy crystals when they hit ground
        });
        this.physics.add.collider(this.meteors, this.platforms, (meteor) => {
            meteor.destroy(); // Destroy meteors when they hit ground
        });
        
        // Overlaps
        this.hitSound = this.sound.add('hitSound', { volume: 0.7 });
        this.collectSound = this.sound.add('collectSound', { volume: 0.7 });
        
        this.physics.add.overlap(this.player, this.crystals, (player, crystal) => {
            this.collectSound.play();
            crystal.destroy();
            this.crystalsCollected++;
            this.score += 10;
            
            if (this.crystalsCollected >= this.crystalsRequired) {
                // Pause game
                this.physics.pause();
                this.scene.launch('LevelCompletePopup', {
                    title: 'Congratulations!',
                    buttonText: 'Finish Game',
                    score: this.score,
                    nextLevel: null,
                    currentLevel: 'Level2'
                });
            }
        });
        
        this.physics.add.overlap(this.player, this.meteors, (player, meteor) => {
            this.hitSound.play();
            meteor.destroy();
            this.lives--;
            
            if (this.lives <= 0) {
                this.scene.start('GameOver', {
                    score: this.score
                });
            }
        });
        
        // Controls
        this.cursors = this.input.keyboard.createCursorKeys();
        
        // UI
        this.scoreText = this.add.text(16, 16, `Score: ${this.score}`, { 
            fontSize: '32px', 
            fill: '#fff',
            fontFamily: 'Arial',
            stroke: '#000',
            strokeThickness: 4
        });
        
        this.livesText = this.add.text(600, 16, `Lives: ${this.lives}`, {
            fontSize: '32px',
            fill: '#f00',
            fontFamily: 'Arial',
            stroke: '#000',
            strokeThickness: 4
        });
        
        this.collectText = this.add.text(300, 16, `Crystals: ${this.crystalsCollected}/${this.crystalsRequired}`, {
            fontSize: '24px',
            fill: '#0f0',
            fontFamily: 'Arial',
            stroke: '#000',
            strokeThickness: 3
        });
    }
    
    spawnCrystal() {
        const crystal = this.crystals.create(
            Phaser.Math.Between(50, 750),
            -50, // Start above screen
            'crystal2'
        );
        
        crystal.setVelocityY(Phaser.Math.Between(100, 200));
        crystal.setAngularVelocity(Phaser.Math.Between(-30, 30));
    }
    
    spawnMeteor() {
        const meteor = this.meteors.create(
            Phaser.Math.Between(50, 750),
            -100, // Start above screen
            'meteor2'
        );
        
        meteor.setVelocityY(Phaser.Math.Between(200, 300));
        meteor.setAngularVelocity(Phaser.Math.Between(-50, 50));
        meteor.setScale(Phaser.Math.FloatBetween(0.8, 1.2));
    }
    
    update() {
        // Update UI
        this.scoreText.setText(`Score: ${this.score}`);
        this.livesText.setText(`Lives: ${this.lives}`);
        this.collectText.setText(`Crystals: ${this.crystalsCollected}/${this.crystalsRequired}`);
        
        // Player movement
        if (this.cursors.left.isDown) {
            this.player.setVelocityX(-200);
            this.player.anims.play('left', true);
        } else if (this.cursors.right.isDown) {
            this.player.setVelocityX(200);
            this.player.anims.play('right', true);
        } else {
            this.player.setVelocityX(0);
            this.player.anims.play('turn');
        }
        
        if (this.cursors.up.isDown && this.player.body.touching.down) {
            this.player.setVelocityY(-350);
        }
    }
}

// Scene Game Over
class GameOver extends Phaser.Scene {
    constructor() {
        super('GameOver');
    }
    
    create(data) {
        // Hentikan semua suara
        this.sound.stopAll();
        
        this.add.text(400, 200, 'Game Over', { fontSize: '64px', fill: '#f00' }).setOrigin(0.5);
        this.add.text(400, 300, `Final Score: ${data.score}`, { fontSize: '32px', fill: '#fff' }).setOrigin(0.5);
        
        const restartButton = this.add.text(400, 400, 'Main Lagi', { 
            fontSize: '32px', 
            fill: '#0f0',
            backgroundColor: '#333',
            padding: { x: 20, y: 10 }
        })
        .setOrigin(0.5)
        .setInteractive();
            
        restartButton.on('pointerdown', () => {
            // Hentikan scene Level yang mungkin masih aktif
            this.scene.stop('Level1');
            this.scene.stop('Level2');
            // Mulai MainMenu
            this.scene.start('MainMenu');
        });
        
        // Efek hover tombol
        restartButton.on('pointerover', () => restartButton.setStyle({ fill: '#0ff' }));
        restartButton.on('pointerout', () => restartButton.setStyle({ fill: '#0f0' }));
    }
}

// Scene untuk popup level completion
class LevelCompletePopup extends Phaser.Scene {
    constructor() {
        super('LevelCompletePopup');
    }

    create(data) {
        // Dark overlay
        this.overlay = this.add.rectangle(0, 0, 800, 600, 0x000000, 0.7)
            .setOrigin(0)
            .setInteractive();

        // Popup container
        this.popup = this.add.container(400, 300);

        // Popup background
        const bg = this.add.graphics()
            .fillStyle(0x333333, 1)
            .fillRoundedRect(-200, -150, 400, 300, 16);
        this.popup.add(bg);

        // Title text
        const title = this.add.text(0, -100, data.title, {
            fontSize: '32px',
            fill: '#fff',
            fontFamily: 'Arial'
        }).setOrigin(0.5);
        this.popup.add(title);

        // Score text
        const scoreText = this.add.text(0, -50, `Score: ${data.score}`, {
            fontSize: '24px',
            fill: '#fff'
        }).setOrigin(0.5);
        this.popup.add(scoreText);

        // Main button (untuk next level atau finish game)
        const mainButton = this.add.text(0, 20, data.buttonText, {
            fontSize: '24px',
            fill: '#0f0',
            backgroundColor: '#222',
            padding: { x: 20, y: 10 }
        })
        .setOrigin(0.5)
        .setInteractive();
        this.popup.add(mainButton);

        mainButton.on('pointerdown', () => {
            // Hentikan popup dan scene level yang aktif
            this.scene.stop();
            this.scene.stop(data.currentLevel); // Hentikan scene level
            
            if (data.nextLevel) {
                this.scene.start(data.nextLevel);
            } else {
                this.scene.start('MainMenu');
            }
        });

        // Exit button (opsional)
        const exitButton = this.add.text(0, 70, 'Exit to Menu', {
            fontSize: '24px',
            fill: '#f00',
            backgroundColor: '#222',
            padding: { x: 20, y: 10 }
        })
        .setOrigin(0.5)
        .setInteractive();
        this.popup.add(exitButton);

        exitButton.on('pointerdown', () => {
            this.scene.stop();
            this.scene.stop(data.currentLevel); // Hentikan scene level
            this.scene.start('MainMenu');
        });
        
        // Efek hover tombol
        mainButton.on('pointerover', () => mainButton.setStyle({ fill: '#0ff' }));
        mainButton.on('pointerout', () => mainButton.setStyle({ fill: '#0f0' }));
        exitButton.on('pointerover', () => exitButton.setStyle({ fill: '#ff0' }));
        exitButton.on('pointerout', () => exitButton.setStyle({ fill: '#f00' }));
    }
}

// Konfigurasi game
const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 300 },
            debug: false
        }
    },
    scene: [MainMenu, Instructions, Level1, Level2, GameOver, LevelCompletePopup]
};

// Inisialisasi game
const game = new Phaser.Game(config);