/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
/* eslint-disable no-useless-return */
/* eslint-disable class-methods-use-this */
/* eslint-disable lines-between-class-members */
import Phaser from 'phaser';
import ScoreLabel from './ScoreLabel';

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
let info
let nbRequired
let currentAttack = 'attack1'
const enemy = [];
const allies = [];
const listChapion = [];

class GameScene extends Phaser.Scene {
  constructor() {
    super('game-scene');
    this.player = undefined;
    this.bot = undefined;
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
    this.enemy= [];
    this.allies= [];
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
    this.createHealth();
    const platforms = this.createPlatforms();
    this.player = this.createPlayer();
    this.bot = this.createBot();
    // this.knight = this.createKnight();
    this.mage = this.createMage();

    this.scoreLabel = this.createScoreLabel(16, 16, 0);

    this.physics.add.collider(this.player, platforms);
    this.physics.add.collider(this.bot, platforms);
    // this.physics.add.collider(this.knight, platforms);
    this.physics.add.collider(this.mage, platforms);
    // this.knight.group = this.physics.add.group();
    this.bot.group = this.physics.add.group();
    this.mage.group = this.physics.add.group();

    // this.physics.add.collider(this.knight.group, this.platforms);
    this.physics.add.collider(this.bot.group, this.platforms);
    this.physics.add.collider(allies, platforms)
    this.cursors = this.input.keyboard.createCursorKeys();

    this.physics.world.setBoundsCollision(true, true, true, true);

    this.debugShowBody = true;

    this.makeAnim();
    this.championkngiht = this.championSelectKngiht();
    this.championMage = this.champSelectMaga();
    
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
  

    this.physics.world.wrap(this.bot, 0, false);



    if (this.physics.overlap(this.player, this.bot)) {
      this.handlePlayerBotCollision();
    }
    // if (this.physics.overlap(this.knight, this.bot)) {
    //  console.log('Knight collides with Bot');
    // }
    if (this.physics.overlap(this.mage, this.bot)) {
      console.log('Mage collides with Bot');
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

  createPlatforms() {
    const platforms = this.physics.add.staticGroup();

    platforms
      .create(400, 568, GROUND_KEY)
      .setScale(2)
      .refreshBody();

    
    return platforms;
  }

  createHealth(){
    const hp = this.add.image(40, 100,'health');
    info = this.add.text(60, 100, this.playerHealth);
    this.add.text(60,120, 'nb hits required:');
    nbRequired = this.add.text(225,120, this.botHealth/this.playerDamage);
    return hp;
  }

  createBot() {
    const bot = this.physics.add.sprite(600, 470, IDLE_KEY);
    bot.setBounce(0.2);
    bot.body.setSize(67,74,true).setOffset(20, 54);

    // bot.setVelocityX(-200);
    bot.flipX = true;

    bot.group = this.physics.add.group();
    bot.group.add(bot);

    this.physics.add.collider(bot.group, this.platforms);
    this.enemy.push(this.bot)
    

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

    player.group = this.physics.add.group();
    player.group.add(bot);

    this.physics.add.collider(player.group, this.platforms);
    allies.push(player)
    

    this.time.addEvent({
      delay: 50,
      loop: true,
      callback: () => {
        if (this.physics.overlap(this.player, this.knight)) {
          player.setVelocityX(0);
          player.anims.play('idle', true);
        }else if(player.body.velocity.x < 0) {
          player.anims.play('walk', true);
        } else if(!this.physics.overlap(this.player, this.bot)) {
          player.setVelocityX(-50); 
        } else if (this.physics.overlap(this.bot, this.player)) {
          this.handlePlayerBotCollision();
        } else {
          player.anims.play('turn', true);
        }
      }
    });

    player.setCollideWorldBounds(true);
    player.body.onWorldBounds = true;
    allies.push(this.player);
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

  createKnight(){
    
    const knight = this.physics.add.sprite(50, 400, 'knight');
    knight.play('idle');
    knight.setBounce(0.2);
    knight.body.setSize(60,50,true).setOffset(110,80)
    
    knight.type= 'knight'
    this.physics.world.debug.body(knight);
  
    knight.group = this.physics.add.group();
    knight.group.add(knight);
    allies.push(knight.group);

    this.physics.add.collider(knight.group, this.platforms);
    
    this.time.addEvent({
      delay: 50,
      loop: true,
      callback: () => {
        if (this.physics.overlap(knight, this.player)){
          knight.setVelocityX(0);
          knight.anims.play('idle',true)
        } else {
          // eslint-disable-next-line no-lonely-if
          if(this.physics.overlap(knight, this.bot)){
          knight.setVelocityX(0);
          knight.anims.play('attack1',true);
        }else{
          knight.setVelocityX(50);
          knight.anims.play('run', true)
        }}
        allies.forEach((allyGroup) => {
          this.physics.world.collide(knight.group, allyGroup, (k1, k2) => {
            const directionk1 = k1.body.velocity.x > 0 ? 'right' : 'left';
            const directionk2 = k2.body.velocity.x > 0 ? 'right' : 'left';
            if (directionk1 !== directionk2) {
              k1.setVelocityX(0);
              k1.anims.play('idle', true);
            }
          });
        });
      }
    });

    knight.setCollideWorldBounds(true);
    knight.body.onWorldBounds = true;
   
    return knight;
  }

  createMage(){
    const mage = this.physics.add.sprite(100,400, 'mage')
    mage.play('idle')
    mage.setBounce(0.2);
    // mage.body.setSize(60,50,true).setOffset(110,80)

    mage.group = this.physics.add.group();
    mage.group.add(mage);
    allies.push(mage.group);
    this.physics.add.collider(mage.group, this.platforms);

    this.time.addEvent({
      delay: 50,
      loop: true,
      callback: () => {
        if (this.physics.overlap(mage, this.player)){
          mage.setVelocityX(0);
          mage.anims.play('idle',true)
        } else {
          // eslint-disable-next-line no-lonely-if
          if(this.physics.overlap(mage, this.bot)){
          mage.setVelocityX(0);
          mage.anims.play('attack',true);
        }else{
          mage.setVelocityX(50);
          mage.anims.play('run', true)
        }}
      }
    });

    mage.setCollideWorldBounds(true);
    mage.body.onWorldBounds = true;
    this.add.existing(mage)

    return mage;
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

  championSelectKngiht(){
   
    const knightChampion = this.add.image(300,100, 'knight1');
    knightChampion.setInteractive();
    knightChampion.on('pointerdown', this.createKnight, this);
    const borderWidth = 4;
    const borderColor = 0xff0000;
   
    const borderGraphics = this.add.graphics();
    borderGraphics.lineStyle(borderWidth, borderColor);
    const bounds = knightChampion.getBounds();
    
    borderGraphics.strokeRect(bounds.x - borderWidth / 2, bounds.y - borderWidth / 2, bounds.width + borderWidth, bounds.height + borderWidth);

    listChapion.push(knightChampion); 

    

    

   
    

    

    return listChapion;
  }
  champSelectMaga(){
    const mageChampion = this.add.image(400,90 , 'mage1');
    mageChampion.setInteractive();
    mageChampion.on('pointerdown', this.createMage, this);
    const borderWidth = 4;
    const borderColor = 0xff0000;
    const borderGraphics = this.add.graphics();
    borderGraphics.lineStyle(borderWidth, borderColor);
    const boundsMage = mageChampion.getBounds();
    borderGraphics.strokeRect(boundsMage.x - borderWidth / 2, boundsMage.y - borderWidth / 2, boundsMage.width + borderWidth, boundsMage.height + borderWidth);
    listChapion.push(mageChampion);
  }

  alliesEnemiesColission(){
    
  }

}


export default GameScene;
