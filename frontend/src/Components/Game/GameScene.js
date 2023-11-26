import Phaser from 'phaser';
import ScoreLabel from './ScoreLabel';

import skyAsset from '../../assets/sky.png';
import platformAsset from '../../assets/platform.png';
import idleAsset from '../../assets/Samurai/Idle.png';
import walkAsset from '../../assets/Samurai/Walk.png';
import jumpAsset from '../../assets/Samurai/Jump.png';
import healthAsset from '../../assets/health.png';
import attackAsset from '../../assets/Samurai/Attack_1.png';

const GROUND_KEY = 'ground';
const IDLE_KEY = 'idle';
const WALK_KEY = 'walk';
const JUMP_KEY = 'jump';
const ATTACK_KEY = 'attack'
let info;

class GameScene extends Phaser.Scene {
  constructor() {
    super('game-scene');
    this.player = undefined;
    this.bot = undefined;
    this.cursors = undefined;
    this.scoreLabel = undefined;
    this.gameOver = false;
    this.playerHealth = 10;
    this.botHealth = 2;
    this.previousBotHealth = this.botHealth;
    this.previousCollisionTime = 0;
    this.interval = 3000;
    this.isCollisionDone = false;
  }

  preload() {
    this.load.image('sky', skyAsset);
    this.load.image(GROUND_KEY, platformAsset);
    this.load.image('health', healthAsset);

    this.load.spritesheet(IDLE_KEY, idleAsset, {
      frameWidth: 128,
      frameHeight: 128,
    });
    this.load.spritesheet(WALK_KEY, walkAsset, {
      frameWidth: 128,
      frameHeight: 128,
    });
    this.load.spritesheet(JUMP_KEY, jumpAsset, {
      frameWidth: 128,
      frameHeight: 128,
    });
    this.load.spritesheet(ATTACK_KEY, attackAsset, {
      frameWidth: 128,
      frameHeight: 128,
    });
  }

  create() {
    this.add.image(400, 300, 'sky');
    this.createHealth();
    const platforms = this.createPlatforms();
    this.player = this.createPlayer();
    this.bot = this.createBot();
    this.scoreLabel = this.createScoreLabel(16, 16, 0);

    this.physics.add.collider(this.player, platforms);
    this.physics.add.collider(this.bot, platforms);
    
    this.cursors = this.input.keyboard.createCursorKeys();

    this.physics.world.setBoundsCollision(true, true, true, true);

    this.debugShowBody = true;
    
    /* The Collider takes two objects and tests for collision and performs separation against them.
    Note that we could call a callback in case of collision... */
  }

  update() {
    if (this.gameOver) {
      return;
    }

    this.physics.world.wrap(this.bot, 0, false);

    if (this.physics.overlap(this.player, this.bot)) {
      this.handlePlayerBotCollision();
    }
    
    if (this.cursors.left.isDown) {
      this.player.setVelocityX(-300);
      this.player.anims.play('left', true);
      this.player.flipX = true;
    } else if (this.cursors.right.isDown) {
      this.player.setVelocityX(300);
      this.player.anims.play('right', true);
      this.player.flipX = false;
    } else if(!this.physics.overlap(this.player, this.bot)){
      this.player.setVelocityX(0);
      this.player.anims.play('turn', true);
    }

    if (this.cursors.up.isDown && this.player.body.touching.down) {
      this.player.setVelocityY(-400);
    }

  }

  createPlatforms() {
    const platforms = this.physics.add.staticGroup();

    platforms
      .create(400, 568, GROUND_KEY)
      .setScale(2)
      .refreshBody();

    platforms.create(600, 400, GROUND_KEY);
    platforms.create(50, 250, GROUND_KEY);
    platforms.create(750, 220, GROUND_KEY);
    return platforms;
  }

  createHealth(){
    const hp = this.add.image(40, 100,'health');
    info = this.add.text(60, 100, this.playerHealth);
    return hp;
  }

  createBot() {
    const bot = this.physics.add.sprite(600, 470, IDLE_KEY);
    bot.setBounce(0.2);
    bot.body.setSize(67,74,true).setOffset(20, 54);

    this.anims.create({
      key: 'avance',
      frames: this.anims.generateFrameNumbers(WALK_KEY, { start: 0, end: 8}),
      frameRate: 20,
      repeat: -1,
    });
    
    this.anims.create({
      key: 'attack',
      frames: this.anims.generateFrameNumbers(ATTACK_KEY, { start: 0, end: 8}),
      frameRate: 5,
      repeat: 0,
    });

    bot.setVelocityX(-200);
    bot.flipX = true;
    this.time.addEvent({
      delay: 50,
      loop: true,
      callback: () => {
        if(bot.body.velocity.x < 0) {
          bot.anims.play('avance', true);
        } else if(!this.physics.overlap(this.bot, this.player)) {
          bot.setVelocityX(-200);
        } else if (this.physics.overlap(this.bot, this.player)) {
          this.handlePlayerBotCollision();
        } else {
          bot.anims.play('turn', true);
        }
      }
    });

    bot.setCollideWorldBounds(true);
    bot.body.onWorldBounds = true;
 

    this.physics.world.on('worldbounds', (body) => {
      if(body.gameObject === bot) {
        bot.anims.play('turn', true);
        bot.setVelocityX(0);
      }
    })

    return bot;
  }

  createPlayer() {
    const player = this.physics.add.sprite(140, 470, IDLE_KEY);
    player.setBounce(0.2);
    player.body.setSize(67,74,true).setOffset(20,54);
    /* The 'left' animation uses frames 0, 1, 2 and 3 and runs at 10 frames per second.
    The 'repeat -1' value tells the animation to loop.
    */
    this.anims.create({
      key: 'left',
      frames: this.anims.generateFrameNumbers(WALK_KEY, { start: 0, end: 8 }),
      frameRate: 20,
      repeat: -1,
    });

    this.anims.create({
      key: 'turn',
      frames: this.anims.generateFrameNumbers(IDLE_KEY, { start: 0, end: 5 }),
      frameRate: 20,
      repeat: -1,
    });

    this.anims.create({
      key: 'right',
      frames: this.anims.generateFrameNumbers(WALK_KEY, { start: 0, end: 8 }),
      frameRate: 20,
      repeat: -1,
    });

    this.anims.create({
      key: 'attack',
      frames: this.anims.generateFrameNumbers(ATTACK_KEY, { start: 0, end: 8}),
      frameRate: 5,
      repeat: 0,
    });

    player.setCollideWorldBounds(true);
    player.body.onWorldBounds = true;

    return player;
  }

  handlePlayerBotCollision() {
    
    const timer = this.time.now;
    // Use an interval that lets the animation to be done only once every time and deducting the health only after that
    if(timer - this.previousCollisionTime > this.interval){
      this.isCollisionDone = false;
      this.previousCollisionTime = timer;
      // Detect if animation has already been done during the interval, if yes, don't repeat and wait next time;
      if(!this.isCollisionDone){
        this.bot.setVelocityX(0);
        this.player.setVelocityX(0);
        this.player.anims.play('attack');
        this.bot.anims.play('attack');
        
        this.time.addEvent({
          delay: 1,
          callback: () => {
            this.pertePV();
            this.isCollisionDone = true;
          }
        })

      }
    }
  }

  pertePV(){
    this.botHealth -= 1;
    this.playerHealth -= 1;
    this.scoreLabel.add(100);

    if(this.playerHealth <1){
      this.player.disableBody(true, true);
      this.scoreLabel.setText(`GAME OVER : ( \nYour Score = ${this.scoreLabel.score}`);

      this.player.setTint(0xff0000);

      this.gameOver = true;
      
    } else if(this.botHealth <1){
      this.bot.disableBody(true, true);
      
      setTimeout(() => {
        this.bot.enableBody(true, 600, 470, true, true);
        // increments bot health by 1 each time it respawns making it harder
        this.botHealth = this.previousBotHealth + 1;
        this.previousBotHealth = this.botHealth;
      }, 2000);
    }
    info.setText(this.playerHealth);
  }


  createScoreLabel(x, y, score) {
    const style = { fontSize: '32px', fill: '#000' };
    const label = new ScoreLabel(this, x, y, score, style);
    console.log('score:', label);
    this.add.existing(label);

    return label;
  }

}

export default GameScene;
