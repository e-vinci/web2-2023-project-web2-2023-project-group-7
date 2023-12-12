/* eslint-disable prefer-const */
/* eslint-disable no-plusplus */
/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
/* eslint-disable no-useless-return */
/* eslint-disable class-methods-use-this */
/* eslint-disable lines-between-class-members */
import Phaser from 'phaser';
import ScoreLabel from './ScoreLabel';
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
    const platforms = this.createPlatforms();
    this.enemySpawn = new EnemySpawner(this);
    this.platforms = platforms;
    this.createBot();
    this.createKnight()

    this.scoreLabel = this.createScoreLabel(16, 16, 0);

    this.physics.world.setBoundsCollision(true, true, true, true);

    this.debugShowBody = true;

    this.makeAnim();
    

    
    this.championknight = this.championSelectKngiht();
    // eslint-disable-next-line no-new
    if (nbrEnemies<10){
    this.createBotEvent = this.time.addEvent({delay:12000, loop:true, callback: () => { this.createBot(); }, callbackScope:this});
    }
    


  }
  

  update() {
    if (this.gameOver) {
      return;
    }
    const lastEnemy = this.enemies[nbrEnemies - 1];
    const lastAlly = this.allies[nbrAllies - 1];

    if (lastEnemy && lastEnemy.body && lastAlly && lastAlly.body) {
      if (this.physics.overlap(lastEnemy, lastAlly)) {
        lastAlly.body.setVelocityX(0);
        lastEnemy.body.setVelocityX(0)
        const damageEvent = this.time.addEvent({
          delay: 1500, // toutes les 2 secondes
          loop: true,
          callback: () => {
              lastEnemy.anims.play('botattack', true)
              lastAlly.anims.play('attack', true)
              lastEnemy.hp -= 20;
              lastAlly.hp -= 25;
              if (lastAlly.hp <= 0 ) {
                  lastAlly.anims.play('death', true)
              }
              if ( lastEnemy.hp <= 0){
                lastEnemy.anims.play('botdeath', true)
              }
              
          },
          callbackScope: this
      });
      }
    }

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
    const bot = this.physics.add.sprite(600,470,'bot').setBounce(0).setCollideWorldBounds(true);
    bot.hp = 100;
    bot.setGravityY(150)
    this.physics.add.collider(bot, this.platforms);
    this.enemies.push(bot);
    nbrEnemies++;
    console.log('Creating bot. Number of enemies:', nbrEnemies);
    bot.flipX = true;
    bot.setVelocityX(-50);
    bot.body.setSize(50, 0, 50, 5);
    
  this.enemies.forEach(bad => {
    if (bot !== bad) {
        this.physics.add.collider(bot, bad, (thisBot, otherBot) => {
          if (bot.x < otherBot.x) {
            // Le bot est à gauche de l'autre bot, arrêtez-le
            otherBot.body.setVelocityX(0);
            otherBot.anims.play('botidle', true)
        }
        });
    }
});
this.allies.forEach(good => {
    this.physics.add.collider(bot, good, (thisBot, otherGood) => {
        thisBot.body.setVelocityX(0);
        thisBot.anims.play('botattack', true);
        otherGood.body.setVelocityX(0);
        otherGood.anims.play('attack',true);
    });
});


    return bot;
  }
  createKnight() {
    const knight = this.physics.add.sprite(50,470,'knight').setBounce(0).setCollideWorldBounds(true);
    knight.hp = 100;
    knight.setGravityY(150)
    this.physics.add.collider(knight, this.platforms);
    this.allies.push(knight);
    nbrAllies++;
    knight.setVelocityX(50)
    knight.body.setSize(50, 0, 50, 5);
    this.allies.forEach(good => {
      if (knight !== good) {
          this.physics.add.collider(knight, good, (thisknight, otherKnight) => {
            if (knight.x > otherKnight.x) {
              // Le bot est à gauche de l'autre bot, arrêtez-le
              otherKnight.body.setVelocityX(0);
              otherKnight.anims.play('idle', true)
          }
          });
      }
  });
  this.enemies.forEach(bad => {
      this.physics.add.collider(knight, bad, (thisKnight, otherBad) => {
          thisKnight.body.setVelocityX(0);
          thisKnight.anims.play('attack', true);
          otherBad.body.setVelocityX(0);
          otherBad.anims.play('botattack',true);
      });
  });
    
    return knight;
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
    
    knightChampion.setInteractive();
      knightChampion.on('pointerdown',() => {
      this.createKnight();
      console.log('knight creat');});
        
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
