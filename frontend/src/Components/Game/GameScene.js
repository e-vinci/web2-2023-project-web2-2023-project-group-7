/* eslint-disable prefer-const */
/* eslint-disable no-plusplus */
/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
/* eslint-disable no-useless-return */
/* eslint-disable class-methods-use-this */
/* eslint-disable lines-between-class-members */
import Phaser from 'phaser';
import ScoreLabel from './ScoreLabel';
import Knight from  './Knight';
import Bot from './Bot';

import skyAsset from '../../assets/bosque_tenebre.jpg';
import platformAsset from '../../assets/platform.png';
import idleAsset from '../../assets/Samurai/Idle.png';
import walkAsset from '../../assets/Samurai/Walk.png';
import jumpAsset from '../../assets/Samurai/Jump.png';
import healthAsset from '../../assets/health.png';
import attack1Asset from '../../assets/Samurai/Attack_1.png';
import attack2Asset from '../../assets/Samurai/Attack_2.png';
import attack3Asset from '../../assets/Samurai/Attack_3.png';
import knightpng from '../../assets/knight.png';
import knightjson from '../../assets/knight.json';
import knight1 from '../../assets/knight1.png';
import magepng from '../../assets/mage.png';
import magejson from '../../assets/mage.json'
import mage1 from '../../assets/mage1.png'
import firejson from '../../assets/fire.json'
import firepng from '../../assets/fire.png'

const GROUND_KEY = 'ground';
const IDLE_KEY = 'idle';
const WALK_KEY = 'walk';
const JUMP_KEY = 'jump';
const ATTACK1_KEY = 'attack1'
const ATTACK2_KEY = 'attack2'
const ATTACK3_KEY = 'attack3'
let gold;
let info
let nbRequired
let currentAttack = 'attack1'
let enemy = [];
let allies = [];
let nombreAllies;
let nombreEnemy;

let lastTimeInvocation = 0;

class GameScene extends Phaser.Scene {
  constructor() {
    super('game-scene');
    this.player = undefined;
    this.bot = undefined;
    this.knight = undefined;
    this.cursors = undefined;
    this.scoreLabel = undefined;
    this.gameOver = false;
    this.playerHealth = 20;
    this.botHealth = 2;
    this.playerDamage = 1;
    this.botDamage = 1;
    this.previousBotHealth = this.botHealth;
    this.previousCollisionTime = 0;
    this.interval = 1000;
    this.isCollisionDone = false;
    this.alliesCollisionDone = false;
    this.enemy= [];
    this.allies= [];
    this.gold = 0;
    this.nombreAllies=0;
    this.nombreEnemy=0;
    this.lastTimeInvocation = 0;
  }

  preload() {
    this.load.image('sky', skyAsset);
    this.load.image(GROUND_KEY, platformAsset);
    this.load.image('health', healthAsset);
    this.load.atlas('knight', knightpng, knightjson);
    this.load.image('knight1', knight1);
    this.load.atlas('mage', magepng, magejson);
    this.load.image('mage1', mage1)
    this.load.atlas('fire', firepng, firejson);

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
    this.add.image(400, 300, 'sky');
    
    const platforms = this.createPlatforms();
    this.createBot = this.createBot();

    this.scoreLabel = this.createScoreLabel(16, 16, 0);

    this.physics.add.collider(this.player, platforms);
    this.physics.add.collider(this.bot, platforms);
    this.physics.add.collider(this.knight, platforms);
    this.physics.add.collider(this.mage, platforms);

    this.cursors = this.input.keyboard.createCursorKeys();

    this.physics.world.setBoundsCollision(true, true, true, true);

    this.debugShowBody = true;

    this.makeAnim();
    this.championkngiht = this.championSelectKngiht();
    // eslint-disable-next-line no-new
    this.createBot = this.time.addEvent({delay:2000, loop:true, callback: () => {  this.createBot()}, callbackScope:this})
    
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
      return;
    }
    if (this.knight) {
      this.knight.update(time, delta);
    }
    if ((this.bot))

    for(let i=allies.length-1;i>=0;i--){
      for(let j=allies.length-2;j>=0;j--){
        if (this.physics.overlap(i,j)){
          this.alliesCollisionDone=true;
          this.alliesColission(j,i);
          j.anims.play('idle', true)
        }
      }
    }
    if (this.physics.overlap(this.alliesColission))
    
    
  

    this.physics.world.wrap(this.bot, 0, false);

    

  }
  createBot(){
    const bot = new Bot(this, 600, 400);
    this.enemy.push(bot);
    this.nombreEnemy++;
  }
  createKnight(){
    const knight = new Knight(this, 50,400);
    this.allies.push(knight)
    nombreAllies++;
  }

  createPlatforms() {
    const platforms = this.physics.add.staticGroup();

    platforms
      .create(400, 568, GROUND_KEY)
      .setScale(2)
      .refreshBody();

    
    return platforms;
  }



  handleHealth(){

    this.botHealth -= this.playerDamage;
    this.playerHealth -= this.botDamage;
    this.scoreLabel.add(100);

    if(this.playerHealth <= 0){
      this.player.disableBody(true, true);
      this.scoreLabel.setText(`GAME OVER : ( \nYour Score = ${this.scoreLabel.score}`);

      this.player.setTint(0xff0000);

      this.gameOver = true;
      
    } else if(this.botHealth <1){
      this.bot.disableBody(true, true);
      this.scoreLabel.add(this.previousBotHealth);
      
      setTimeout(() => {
        this.bot.enableBody(true, 600, 470, true, true);
        // increments bot health by 1 each time it respawns making it harder
        this.botHealth = this.previousBotHealth + 1;
        this.playerHealth += 20;

        this.previousBotHealth = this.botHealth;
      }, 2000);
    }
    nbRequired.setText(this.botHealth/this.playerDamage);
    info.setText(this.playerHealth);
  }


  createScoreLabel(x, y, score) {
    const style = { fontSize: '32px', fill: '#000' };
    const label = new ScoreLabel(this, x, y, score, style);
    console.log('score:', label);
    this.add.existing(label);

    return label;
  }

  championSelectKngiht(){
    const knightChampion = this.add.image(300,100, 'knight1');
    
    let timer = this.time.now;
    if (timer - lastTimeInvocation >= 2000){
      knightChampion.setInteractive();
      knightChampion.on('pointerdown',() => {
        this.createKnight();
        lastTimeInvocation = this.time.now()});
    }
    
    const borderWidth = 4;
    const borderColor = 0xff0000;
   
    const borderGraphics = this.add.graphics();
    borderGraphics.lineStyle(borderWidth, borderColor);
    const bounds = knightChampion.getBounds();
    
    borderGraphics.strokeRect(bounds.x - borderWidth / 2, bounds.y - borderWidth / 2, bounds.width + borderWidth, bounds.height + borderWidth);

    return knightChampion;
  }
 

  alliesColission(obj1, obj2){
    const timer = this.time.now;
    if (obj1 !== allies[nombreAllies-1] && obj2 !== allies[nombreAllies-2] ){
      obj1.setVelocityX(0);
      obj2.setVelocityX(0);
    }
  }
  fightChamp(){
    const allierFighter = allies[nombreAllies-1];
    const enemyFighter = thid.bot;
    this.time.addEvent({
      delay: 50,
      loop: true,
      callback: () => {
        if (this.physics.overlap(this.bot, this.knight)) {
          bot.setVelocityX(0);
          bot.anims.play('idle', true);
        }else if(bot.body.velocity.x < 0) {
          bot.anims.play('walk', true);
        } else if(!this.physics.overlap(this.bot, this.player)) {
          bot.setVelocityX(-50); 
        } else if (this.physics.overlap(this.bot, this.player)) {
          this.handlePlayerBotCollision();
        } else {
          bot.anims.play('turn', true);
        }
      }
    });
    
  }

  makeAnim(){
    // KNIGHT
    this.anims.create({
      key: 'attack',
      frames : this.anims.generateFrameNames('knight', {prefix:"1_atk_", start:1, end:11, zeroPad:1, suffix:'.png' }),
      frameRate: 10, repeat:0
    });
    this.anims.create({
      key: 'run',
      frames : this.anims.generateFrameNames('knight', { prefix:"run_",start:1, end:8, zeroPad:1,suffix:'.png' }),
      frameRate: 12, repeat:-1
    });
    this.anims.create({
      key: 'idle',
      frames : this.anims.generateFrameNames('knight', {prefix:"idle_",start:1, end:8, zeroPad:1, suffix:'.png' }),
      frameRate: 8, repeat:-1
    });
    this.anims.create({
      key: 'attack2',
      frames : this.anims.generateFrameNames('knight', {prefix:"sp_atk_", start:1, end:18, zeroPad:1, suffix:'.png' }),
      frameRate: 10, repeat:0
    });

    // MAGE
    this.anims.create({
      key: 'idle',
      frames: this.anims.generateFrameNames('mage', {prefix:"idle", start:1, end:14, zeroPad:1, suffix:'.png'}),
      frameRate: 10, repeat:-1
    });
    this.anims.create({
      key: 'death',
      frames: this.anims.generateFrameNames('mage', {prefix:"death", start:1, end:10, zeroPad:1, suffix:'.png'}),
      frameRate: 10, repeat:-1
    });
    this.anims.create({
      key: 'attack',
      frames: this.anims.generateFrameNames('mage', {prefix:"attack", start:1, end:7, zeroPad:1, suffix:'.png'}),
      frameRate: 10, repeat:-1
    });
    this.anims.create({
      key: 'run',
      frames: this.anims.generateFrameNames('mage', {prefix:"run", start:1, end:8, zeroPad:1, suffix:'.png'}),
      frameRate: 10, repeat:-1
    });
   // FIRE
    this.anims.create({
      key: 'fire',
      frames: this.anims.generateFrameNames('fire', {prefix:"fire", start:1, end:9, zeroPad:1, suffix:'.png'}),
      frameRate: 10, repeat:-1
    });
    this.anims.create({
      key: 'fire_extra',
      frames: this.anims.generateFrameNames('fire', {prefix:"fire_extra", start:1, end:9, zeroPad:1, suffix:'.png'}),
      frameRate: 10, repeat:-1
    });
    

    
  };

}


export default GameScene;
