/* eslint-disable lines-between-class-members */
import Phaser from 'phaser';
import ScoreLabel from './ScoreLabel';
import EnemySpawner from './EnemySpawner';
import skyAsset from '../../assets/bosque_tenebre.jpg';
import platformAsset from '../../assets/platform.png';
import healthAsset from '../../assets/health.png';

import idleAsset from '../../assets/Samurai/Idle.png';
import walkAsset from '../../assets/Samurai/Walk.png';
import jumpAsset from '../../assets/Samurai/Jump.png';
import attack1Asset from '../../assets/Samurai/Attack_1.png';
import attack2Asset from '../../assets/Samurai/Attack_2.png';
import attack3Asset from '../../assets/Samurai/Attack_3.png';
import { sentScore } from '../../utils/connection';

const GROUND_KEY = 'ground';
const IDLE_KEY = 'idle';
const WALK_KEY = 'walk';
const JUMP_KEY = 'jump';
const ATTACK1_KEY = 'attack1'
const ATTACK2_KEY = 'attack2'
const ATTACK3_KEY = 'attack3'
let info
let nbRequired
let currentAttack = 'attack1'

class GameScene extends Phaser.Scene {
  constructor() {
    super('game-scene');
    this.player = undefined;
    this.bot = undefined;
    this.bots = [];
    this.enemySpawn = undefined;
    this.cursors = undefined;
    this.scoreLabel = undefined;
    this.gameOver = false;
    // player stats
    this.playerHealth = 20;
    this.playerMaxHealth = 100;
    this.playerDamage = 1;
    // bot stats
    this.botMaxHealth = 5;
    this.botMaxDamage = 3;
    this.botHealth = Phaser.Math.Between(2, this.botMaxHealth);
    this.botDamage = Phaser.Math.Between(1, this.botMaxDamage);
    this.previousBotHealth = this.botHealth;
    
    this.previousCollisionTime = 0;
    this.interval = 1000;
    this.isCollisionDone = false;
    this.healthBonus = undefined;
    this.isCollected = false;
  }

  preload() {
    this.load.image('obscurity', skyAsset);
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
    this.load.spritesheet(ATTACK1_KEY, attack1Asset, {
      frameWidth: 128,
      frameHeight: 128,
    });
    this.load.spritesheet(ATTACK2_KEY, attack2Asset, {
      frameWidth: 128,
      frameHeight: 128,
    });
    this.load.spritesheet(ATTACK3_KEY, attack3Asset, {
      frameWidth: 128,
      frameHeight: 128,
    });
  }

  create() {
    this.add.image(400, 300, 'obscurity');
    this.createHealth();
    this.platforms = this.createPlatforms();
    this.player = this.createPlayer();
    this.enemySpawn = new EnemySpawner(this);
    this.bot = this.createBot();

    for(let i = 0; i<3; i+=1){
      this.bots.push(this.bot);
    }

    this.healthBonus = this.createHealthBonus()

    this.scoreLabel = this.createScoreLabel(16, 16, 0);

    this.physics.add.collider(this.player, this.platforms);
    this.physics.add.collider(this.bot, this.platforms);    
    
    this.cursors = this.input.keyboard.createCursorKeys();

    this.physics.world.setBoundsCollision(true, true, true, true);

    this.debugShowBody = true;

    
    /* The Collider takes two objects and tests for collision and performs separation against them.
    Note that we could call a callback in case of collision... */

    // create all animations

    this.anims.create({
      key: 'walk',
      frames: this.anims.generateFrameNumbers(WALK_KEY, { start: 0, end: 8}),
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
      key: 'attack1',
      frames: this.anims.generateFrameNumbers(ATTACK1_KEY, { start: 0, end: 8}),
      frameRate: 20,
      repeat: 0,
    });

    this.anims.create({
      key: 'attack2',
      frames: this.anims.generateFrameNumbers(ATTACK2_KEY, { start: 0, end: 8}),
      frameRate: 20,
      repeat: 0,
    });

    this.anims.create({
      key: 'attack3',
      frames: this.anims.generateFrameNumbers(ATTACK3_KEY, { start: 0, end: 8}),
      frameRate: 20,
      repeat: 0,
    });

  }

  update() {
    if (this.gameOver) {
      this.endGame();
    } else {

    this.physics.world.wrap(this.bot, 0, false);

    if (this.physics.overlap(this.player, this.bot)) {
      this.handlePlayerBotCollision();
    }
    
    if (this.cursors.left.isDown) {
      this.player.setVelocityX(-300);
      this.player.anims.play('walk', true);
      this.player.flipX = true;
    } else if (this.cursors.right.isDown) {
      this.player.setVelocityX(300);
      this.player.anims.play('walk', true);
      this.player.flipX = false;
    } else if(!this.physics.overlap(this.player, this.bot)){
      this.player.setVelocityX(0);
      this.player.anims.play('turn', true);
    }

    if (this.cursors.up.isDown && this.player.body.touching.down) {
      this.player.setVelocityY(-400);
    }
  }
  }

  createPlatforms() {
    const platforms = this.physics.add.staticGroup();

    platforms
      .create(400, 620, GROUND_KEY)
      .setScale(2)
      .refreshBody();

    platforms.create(200,400,GROUND_KEY);
    
    return platforms;
  }

  createHealth(){
    const hp = this.add.image(40, 100,'health');
    info = this.add.text(60, 100, `${this.playerHealth}/${this.playerMaxHealth}`);
    this.add.text(60,120, 'nb hits required:');
    nbRequired = this.add.text(225,120, this.botHealth/this.playerDamage);
    return hp;
  }
  

  createBot() {
    const bot = this.physics.add.sprite(600, 470, IDLE_KEY);
    bot.enableBody(true, 600, 470, true, true);
    bot.setBounce(0.2);
    bot.body.setSize(67,74,true).setOffset(20, 54);
    bot.setVelocityX(-200);
    bot.flipX = true;

    this.time.addEvent({
      delay: 50,
      loop: true,
      callback: () => {
        if (this.physics.overlap(bot, this.player)) {
          this.handlePlayerBotCollision();
        } else if(bot.body.position.x === this.player.body.position.x){
          bot.anims.play('turn', true);
          bot.setVelocityX(0);
        } else if(bot.body.position.x < this.player.body.position.x - 10){
          bot.anims.play('walk', true);
          bot.setVelocityX(100);
          bot.flipX = false;
        } else if(bot.body.position.x > this.player.body.position.x + 10){
          bot.anims.play('walk', true);
          bot.setVelocityX(-100);
          bot.flipX = true;
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
    });

    return bot;
  }

  createPlayer() {
    const player = this.physics.add.sprite(140, 470, IDLE_KEY);
    player.setBounce(0.2);
    player.body.setSize(67,74,true).setOffset(20,54);
    /* The 'left' animation uses frames 0, 1, 2 and 3 and runs at 10 frames per second.
    The 'repeat -1' value tells the animation to loop.
    */

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
        if(this.bot.body.position.x < this.player.body.position.x){
          this.bot.flipX = false;
          this.player.flipX = true;
        } else {
          this.bot.flipX = true;
          this.player.flipX = false;
        }
        if(currentAttack === 'attack1'){
          this.player.anims.play('attack1');
          currentAttack = 'attack2'
        } else if (currentAttack === 'attack2'){
          this.player.anims.play('attack2');
          currentAttack = 'attack3'
        } else {
          this.player.anims.play('attack3')
          currentAttack = 'attack1'
        }

        this.bot.anims.play('attack1');
        
        this.time.addEvent({
          delay: 280,
          callback: () => {
            this.handleHealth();
            this.isCollisionDone = true;
          }
        })

      }
    }
  }

  handleHealth(){

    this.botHealth -= this.playerDamage;
    this.playerHealth -= this.botDamage;
    this.scoreLabel.add(100);

    if(this.playerHealth <= 0){
      this.player.disableBody(true, true);
      this.scoreLabel.setText(`GAME OVER : ( \nYour Score = ${this.scoreLabel.score}`);

      this.player.setTint(0xff0000);
      if(localStorage.getItem('project.usrnm')!== null ){sentScore(localStorage.getItem('project.usrnm'),this.scoreLabel.score)}
      
      // loic 
      this.gameOver = true;
      
    } else if(this.botHealth <1){
      this.bot.disableBody(true, true);
      this.scoreLabel.add(this.previousBotHealth);
      this.enemySpawn.spawn(this.bot);

      if(!this.isCollected){
        this.playerDamage += 3;
        this.botMaxHealth += 5;
      } else{
        this.botMaxDamage += 5;
        this.isCollected = false;
      }

      setTimeout(() => {
        this.bot.enableBody(true, 600, 470, true, true);
        // increments bot health by 1 each time it respawns making it harder
        this.botHealth = Phaser.Math.Between(5, this.botMaxHealth);
        this.botDamage = Phaser.Math.Between(2, this.botMaxDamage);
        this.previousBotHealth = this.botHealth;

      }, Phaser.Math.Between(100,3000));
      
    }
    nbRequired.setText(this.botHealth/this.playerDamage);
    info.setText(`${this.playerHealth}/${this.playerMaxHealth}`);  }

  createHealthBonus(){
    
    this.time.addEvent({
      delay: Phaser.Math.Between(2000,20000),
      callback: () => {
        const x = this.player.x + Phaser.Math.Between(-200,200);
        const y = this.player.y - 200;
        const healthBonus = this.physics.add.sprite(x, y, 'health');

        this.physics.add.overlap(this.player, healthBonus, () => {
          this.collectHealthBonus(5);
          healthBonus.destroy();
        });

        healthBonus.setGravityY(300);
        healthBonus.setBounce(0.8);

        healthBonus.setCollideWorldBounds(true);
        healthBonus.body.onWorldBounds = true;
        
        this.physics.add.collider(healthBonus, this.platforms);
      },
      loop: true,
    });
  }

  collectHealthBonus(qty) {
    this.playerHealth += qty;
    if(this.playerHealth > this.playerMaxHealth) {
      this.playerHealth = this.playerMaxHealth;
    }
    this.isCollected = true;
    info.setText(`${this.playerHealth}/${this.playerMaxHealth}`);
  }


  createScoreLabel(x, y, score) {
    const style = { fontSize: '32px', fill: '#000' };
    const label = new ScoreLabel(this, x, y, score, style);
    console.log('score:', label);
    this.add.existing(label);

    return label;
  }
  endGame(){
    return this.scene.start('EndGame',{gameover : this.gameOver });
  }

}

export default GameScene;
