/* eslint-disable prefer-const */
/* eslint-disable no-plusplus */
/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
/* eslint-disable no-useless-return */
/* eslint-disable class-methods-use-this */
/* eslint-disable lines-between-class-members */
import Phaser from 'phaser';
import ScoreLabel from './ScoreLabel';

import Knight from  './knight';
import Bot from './Bot';
import EnemySpawner from './EnemySpawner';

import skyAsset from '../../assets/bosque_tenebre.jpg';
import platformAsset from '../../assets/platform.png';
import healthAsset from '../../assets/health.png';
import knightpng from '../../assets/knight.png';
import knightjson from '../../assets/knight.json';
import knight1 from '../../assets/knight1.png';
import botPng from '../../assets/bot.png'
import botJson from '../../assets/bot.json'

const GROUND_KEY = 'ground';
let gold;
let enemy = [];
let allies = [];
let nbrAllies;
let nbrEnemies;


let lastTimeInvocation = 0;

class GameScene extends Phaser.Scene {
  constructor() {
    super('game-scene');
    this.scoreLabel = undefined;
    this.gameOver = false;
    this.bot = undefined;
    this.knight = undefined;
    // player stats
    this.knightrHealth = 10;
    this.knightDamage = 3;
    // bot stats
    this.botHealth = 10;
    this.botDamage = 3;
    
    this.previousBotHealth = this.botHealth;

    
    this.previousCollisionTime = 0;
    this.interval = 1000;
    this.enemies= [];
    this.allies= [];
    this.gold = 0;
    this.nbrAllies=0;
    this.nbrEnemies=0;
    this.lastTimeInvocation = 0;
    
  }

  preload() {
    this.load.image('sky', skyAsset);
    this.load.image(GROUND_KEY, platformAsset);
    this.load.image('health', healthAsset);
    this.load.atlas('knight', knightpng, knightjson);
    this.load.image('knight1', knight1);
    this.load.atlas('bot', botPng, botJson);


    
  }

  create() {
    this.add.image(400, 300, 'sky');
    this.physics.world.gravity.y = 150;
    const platforms = this.createPlatforms();
    this.debug = true;
    this.platforms = platforms;
    this.knight = this.createKnight();
    
    this.enemySpawn = new EnemySpawner(this);
    this.bot = this.createBot();

    this.physics.add.collider(this.knight, this.platforms);
    this.physics.add.collider(this.bot, this.platforms);   
    this.scoreLabel = this.createScoreLabel(16, 16, 0);

    this.physics.world.setBoundsCollision(true, true, true, true);

    this.debugShowBody = true;

    this.makeAnim();
    this.championSelectKngiht();
    this.createBot();
    this.createKnight();
    this.fight();
    this.alliesCollider();
    this.enemiesCollider();
    this.championknight = this.championSelectKngiht();
    // eslint-disable-next-line no-new
    this.createBotEvent = this.time.addEvent({delay:12000, loop:true, callback: () => { this.createBot(); }, callbackScope:this});
    


  }

  update() {
    if (this.gameOver) {
      return;
    }
    if(this.createBotEvent){
      
      this.nbrEnemies++;
    }
    if (this.championknight){
      this.nbrAllies++;
    }
    for(let i=0; i<nbrAllies-1; i++){
      if (this.physics.collide(allies[i], allies[i+1])){
        this.alliesCollider(allies[i])
      }
    }
    for(let i=0; i<nbrEnemies-1; i++){
      if (this.physics.collide(this.enemies[i], this.enemies[i+1])){
        this.enemiesCollider(this.enemies[i])
      }
    }
    if (this.body .physics.overlap(this.allies[nbrAllies-1], this.enemies[nbrEnemies-1])){
      this.fight(this.allies[nbrAllies-1], this.enemies[nbrEnemies-1])
    }
    // eslint-disable-next-line consistent-return
    if(this.championSelectKngiht)return this.championSelectKngiht;
  }

  
  

  createPlatforms() {
    const platforms = this.physics.add.staticGroup();

    platforms
      .create(400, 568, GROUND_KEY)
      .setScale(2)
      .refreshBody();

    
    return platforms;
  }
  createBot() {
    const bot = this.physics.add.sprite(600, 470, 'botidle');
    bot.enableBody(true, 600, 470, true, true);
    bot.setBounce(0.2);
    bot.body.setSize(67,74,true).setOffset(20, 54);
    bot.setVelocityX(-200);
    bot.flipX = true;
    this.enemies.push(bot);
    this.nbrEnemies++;
    

    bot.setCollideWorldBounds(true);
    bot.body.onWorldBounds = true;

    return bot;
  }
  createKnight() {
    const knight = this.physics.add.sprite(20, 470, 'idle');
    bot.enableBody(true, 600, 470, true, true);
    bot.setBounce(0.2);
    bot.body.setSize(67,74,true).setOffset(20, 54);
    bot.setVelocityX(-50);
    bot.flipX = false;
    this.allies.push(knight);
    this.nbrAllies++;

    bot.setCollideWorldBounds(true);
    bot.body.onWorldBounds = true;

    return knight;
  }


  
  fight(obj1,obj2){
    obj1.body.setVelocityX(0)
    obj1.anims.play('attack', true)
    obj1.damage(obj2.dmg)
    obj2.body.setVelocityX(0)
    obj2.anims.play('botattack', true)
    obj2.damage(obj1.dmg)

  }
  alliesCollider(obj1){
    obj1.body.setVelocityX(0)
    obj1.anims.play('idle', true)
    
  }
  enemiesCollider(obj1){
    obj1.body.setVelocityX(0)
    obj1.anims.play('botidle', true)
    
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
    console.log('Champion selected');
    
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
    
    // BOT
    this.anims.create({
      key: 'botrun',
      frames: this.anims.generateFrameNames('bot', {prefix: "run_", start:1, end:8, zeroPad:1, suffix:".png"}),
      frameRate:12, repeat:-1
    });
    this.anims.create({
      key: 'botidle',
      frames: this.anims.generateFrameNames('bot', {prefix: "idle_", start:1, end:6, zeroPad:1, suffix:".png"}),
      frameRate:10, repeat:-1
    });
    this.anims.create({
      key: 'botattack',
      frames: this.anims.generateFrameNames('bot', {prefix: "1_atk_", start:1, end:6, zeroPad:1, suffix:".png"}),
      frameRate:10, repeat:-1
    });
    this.anims.create({
      key: 'botdeath',
      frames: this.anims.generateFrameNames('bot', {prefix: "death_", start:1, end:18, zeroPad:1, suffix:".png"}),
      frameRate:10, repeat:-1
    });
    
  };

}


export default GameScene;
