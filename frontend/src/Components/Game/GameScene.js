/* eslint-disable lines-between-class-members */
import Phaser from 'phaser';
import ScoreLabel from './ScoreLabel';
import skyAsset from '../../assets/bosque_tenebre.jpg';
import platformAsset from '../../assets/platform.png';
import healthAsset from '../../assets/health.png';
import mysteryAsset from '../../assets/mystery.png';

import idleAsset from '../../assets/Samurai/Idle.png';
import walkAsset from '../../assets/Samurai/Walk.png';
import attack1Asset from '../../assets/Samurai/Attack_1.png';
import attack2Asset from '../../assets/Samurai/Attack_2.png';
import attack3Asset from '../../assets/Samurai/Attack_3.png';

import idleZMAsset from '../../assets/Zombie Man/Idle.png';
import walkZMAsset from '../../assets/Zombie Man/Walk.png';
import attack1ZMAsset from '../../assets/Zombie Man/Attack_1.png';
import attack2ZMAsset from '../../assets/Zombie Man/Attack_2.png';
import attack3ZMAsset from '../../assets/Zombie Man/Attack_3.png';

import idleZWAsset from '../../assets/Zombie Woman/Idle.png';
import walkZWAsset from '../../assets/Zombie Woman/Walk.png';
import attack1ZWAsset from '../../assets/Zombie Woman/Attack_1.png';
import attack2ZWAsset from '../../assets/Zombie Woman/Attack_2.png';
import attack3ZWAsset from '../../assets/Zombie Woman/Attack_3.png';

import { sentScore } from '../../utils/connection';

const GROUND_KEY = 'ground';
const IDLE_KEY = 'idle';
const WALK_KEY = 'walk';
const ATTACK1_KEY = 'attack1'
const ATTACK2_KEY = 'attack2'
const ATTACK3_KEY = 'attack3'
// ZM stands for zombie man
const IDLEZM_KEY = 'idleZM';
const WALKZM_KEY = 'walkZM';
const ATTACK1ZM_KEY = 'attack1ZM'
const ATTACK2ZM_KEY = 'attack2ZM'
const ATTACK3ZM_KEY = 'attack3ZM'
// ZW stands for zombie woman
const IDLEZW_KEY = 'idleZW';
const WALKZW_KEY = 'walkZW';
const ATTACK1ZW_KEY = 'attack1ZW'
const ATTACK2ZW_KEY = 'attack2ZW'
const ATTACK3ZW_KEY = 'attack3ZW'

let info
let mysteryInfo
let currentAttack = 'attack1'
let zCurrentAttack = 'attack1Z'

class GameScene extends Phaser.Scene {
  constructor() {
    super('game-scene');
    this.player = undefined;
    this.bot = undefined;
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
    this.isCollected = false;
    this.idleTime = 0;
    this.isZombieMan = false;
  }

  preload() {
    this.load.image('obscurity', skyAsset);
    this.load.image(GROUND_KEY, platformAsset);
    this.load.image('health', healthAsset);
    this.load.image('mystery', mysteryAsset);

    this.load.spritesheet(IDLE_KEY, idleAsset, {
      frameWidth: 128,
      frameHeight: 128,
    });
    this.load.spritesheet(WALK_KEY, walkAsset, {
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

    this.load.spritesheet(IDLEZM_KEY, idleZMAsset, {
      frameWidth: 96,
      frameHeight: 96,
    });
    this.load.spritesheet(WALKZM_KEY, walkZMAsset, {
      frameWidth: 96,
      frameHeight: 96,
    });
    this.load.spritesheet(ATTACK1ZM_KEY, attack1ZMAsset, {
      frameWidth: 96,
      frameHeight: 96,
    });
    this.load.spritesheet(ATTACK2ZM_KEY, attack2ZMAsset, {
      frameWidth: 96,
      frameHeight: 96,
    });
    this.load.spritesheet(ATTACK3ZM_KEY, attack3ZMAsset, {
      frameWidth: 96,
      frameHeight: 96,
    });

    this.load.spritesheet(IDLEZW_KEY, idleZWAsset, {
      frameWidth: 96,
      frameHeight: 96,
    });
    this.load.spritesheet(WALKZW_KEY, walkZWAsset, {
      frameWidth: 96,
      frameHeight: 96,
    });
    this.load.spritesheet(ATTACK1ZW_KEY, attack1ZWAsset, {
      frameWidth: 96,
      frameHeight: 96,
    });
    this.load.spritesheet(ATTACK2ZW_KEY, attack2ZWAsset, {
      frameWidth: 96,
      frameHeight: 96,
    });
    this.load.spritesheet(ATTACK3ZW_KEY, attack3ZWAsset, {
      frameWidth: 96,
      frameHeight: 96,
    });

  }

  create() {
    this.add.image(400, 300, 'obscurity');
    this.createHealth();
    this.createMystery();
    this.platforms = this.createPlatforms();
    this.player = this.createPlayer();
    this.bot = this.createBot();

    this.createHealthBonus()
    this.createMysteryBonus();

    this.scoreLabel = this.createScoreLabel(16, 16, 0);

    this.physics.add.collider(this.player, this.platforms);
    this.physics.add.collider(this.bot, this.platforms);    
    
    this.cursors = this.input.keyboard.createCursorKeys();

    this.physics.world.setBoundsCollision(true, true, true, true);
  
    /* The Collider takes two objects and tests for collision and performs separation against them.
    Note that we could call a callback in case of collision... */

    // create all animations
    this.createAnims();
    this.reset();
  }

  reset(){
    if (this.scene) {
      this.events.on('resetData', async () => {
        console.log('creat game');
        this.player.setPosition(140, 470);
        this.player.setVelocity(0, 0);
        this.gameOver = false;
            
        // reset game data
        this.bot.setPosition(600, 470);
        this.bot.setVelocityX(-200);
        this.playerHealth = 20;
        this.playerMaxHealth = 100;
        this.playerDamage = 1;
        this.botMaxHealth = 5;
        this.botMaxDamage = 3;
        await this.scene.restart();
        this.scoreLabel.setScore(0);
        info.setText(`${this.playerHealth}/${this.playerMaxHealth}`);
        
        console.log('game reset finsh');
        this.events.emit('ready');
        console.log('envoyer ready');
        console.log('game reset finish');
        this.scene.start('EndGame');
      }, this)
    }
  }

  update() {
    if (this.gameOver){
      console.log('game is over');    
      
      // Check if this.events is defined before emitting the event
      if (this.events) {
        this.events.emit('resetData');
        console.log('reset data envoyé');
        
    } else {
        console.error('Cannot access events: events is undefined.');
    }
      this.events.on('ready' , () => {
        console.log('before jumping end gamescene');
        
      })
    }
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
      this.player.anims.play('idle', true);
    }

    if (this.cursors.up.isDown && this.player.body.touching.down) {
      this.player.setVelocityY(-400);
    
    }
  }
  jumpToSceneEndGame(){
    this.scene.start('EndGame');
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
    return hp;
  }
  
  createMystery(){
    const mysteryText = this.add.text(60,120, 'Mystery:');
    mysteryInfo = this.add.text(140,120, 'Aucun mystery récupéré');
    return mysteryText;
  }

  createBot() {
    let botSprite
    if(this.isZombieMan) {
      botSprite = this.physics.add.sprite(600, 470, IDLEZM_KEY);
    }else {
      botSprite = this.physics.add.sprite(600, 470, IDLEZW_KEY);
    }
    const bot = botSprite;
    bot.enableBody(true, 600, 470, true, true);
    bot.setBounce(0.2);
    bot.body.setSize(67,74,true).setOffset(20, 24);
    bot.setVelocityX(-200);
    bot.flipX = true;
  
    this.time.addEvent({
      delay: 50,
      loop: true,
      callback: () => {
        if(!this.gameOver){
          if (this.physics.overlap(bot, this.player)) {
            this.handlePlayerBotCollision();
          } else if(bot.body.position.x === this.player.body.position.x){
            if(this.isZombieMan){
            bot.anims.play('idleZM', true);
            } else {bot.anims.play('idleZW', true);}
            bot.setVelocityX(0);
          } else if(bot.body.position.x < this.player.body.position.x - 10){
            if(this.isZombieMan){
              bot.anims.play('walkZM', true);
              } else {bot.anims.play('walkZW', true);}
            bot.setVelocityX(100);
            bot.flipX = false;
          } else if(bot.body.position.x > this.player.body.position.x + 10){
            if(this.isZombieMan){
              bot.anims.play('walkZM', true);
              } else {bot.anims.play('walkZW', true);}
            bot.setVelocityX(-100);
            bot.flipX = true;
          } else if(this.isZombieMan){
            bot.anims.play('idleZM', true);
            } else {bot.anims.play('idleZW', true);
          }
        } else {
          bot.setVelocityX(0);
          bot.anims.stop();
        }
      }});

    bot.setCollideWorldBounds(true);
    bot.body.onWorldBounds = true;

    this.physics.world.on('worldbounds', (body) => {
      if(body.gameObject === bot) {
        if(this.isZombieMan){
          bot.anims.play('idleZM', true);
          } else {bot.anims.play('idleZW', true);}
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
        // Change direction bot and player looks at depending on their position at the moment the collision has been made
        if(this.bot.body.position.x < this.player.body.position.x){
          this.bot.flipX = false;
          this.player.flipX = true;
        } else {
          this.bot.flipX = true;
          this.player.flipX = false;
        }
        // Change attack for player so it doesn't always do the same one each time
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

        if(zCurrentAttack === 'attack1z'){
          zCurrentAttack = 'attack2z'
          if(this.isZombieMan){
            this.bot.anims.play('attack1ZM');
          } else {this.bot.anims.play('attack1ZW');
          }
        } else if (zCurrentAttack === 'attack2z') {
          zCurrentAttack = 'attack3z'
          if(this.isZombieMan){
            this.bot.anims.play('attack2ZM');
          } else {this.bot.anims.play('attack2ZW');
          }
        } else {
          zCurrentAttack = 'attack1z'
          if(this.isZombieMan){
            this.bot.anims.play('attack3ZM');
          } else {this.bot.anims.play('attack3ZW');
          }
        }       
        
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

      if(!this.isCollected){
        this.playerMaxHealth += 10;
        this.playerDamage += 2;
        this.botMaxHealth += 5;
      } else{
        this.botMaxDamage += 3;
        this.isCollected = false;
      }

      if(this.isZombieMan){
        this.isZombieMan = false;
      } else {this.isZombieMan = true;
      }
      zCurrentAttack = 'attack1z';

      setTimeout(() => {
        this.bot.enableBody(true, 600, 470, true, true);
        // increments bot health by 1 each time it respawns making it harder
        this.botHealth = Phaser.Math.Between(5, this.botMaxHealth);
        this.botDamage = Phaser.Math.Between(2, this.botMaxDamage);
        this.previousBotHealth = this.botHealth;

      }, Phaser.Math.Between(100,3000));
      
    }
    info.setText(`${this.playerHealth}/${this.playerMaxHealth}`);  
  }

  createHealthBonus(){
    this.time.addEvent({
      delay: Phaser.Math.Between(5000,30000),
      loop: true,
      callback: () => {
        if(!this.gameOver){
          const x = this.player.x + Phaser.Math.Between(-200,200);
          const y = this.player.y - 200;
          const healthBonus = this.physics.add.sprite(x, y, 'health');

          this.physics.add.overlap(this.player, healthBonus, () => {
            this.collectHealthBonus(this.playerMaxHealth*0.1);
            healthBonus.destroy();
          });

          healthBonus.setGravityY(300);
          healthBonus.setBounce(0.8);

          healthBonus.setCollideWorldBounds(true);
          healthBonus.body.onWorldBounds = true;
          
          this.physics.add.collider(healthBonus, this.platforms);
        }
      },
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

  createMysteryBonus(){
    this.time.addEvent({
      delay: Phaser.Math.Between(30000,120000),
      loop: true,
      callback: () => {
        if(!this.gameOver){
          const x = this.player.x + Phaser.Math.Between(-200,200);
          const y = this.player.y - 200;
          const mystery = this.physics.add.sprite(x, y, 'mystery');

          this.physics.add.overlap(this.player, mystery, () => {
            this.collectMysteryBonus();
            mystery.destroy();
          });

          mystery.setGravityY(300);
          mystery.setBounce(0.8);

          mystery.setCollideWorldBounds(true);
          mystery.body.onWorldBounds = true;
          
          this.physics.add.collider(mystery, this.platforms);
        }
      },
    });
  }

  collectMysteryBonus() {
    const randomGeneratedNumber = Phaser.Math.Between(1,6);

    if(randomGeneratedNumber === 1){
      this.playerMaxHealth *= 10;
      this.playerHealth = this.playerMaxHealth;
      mysteryInfo.setText('Points de vies du joueur multiplié par dix et regen complet')
    } else if (randomGeneratedNumber === 2){
      this.playerMaxHealth /= 2;
      this.playerDamage = 2;
      mysteryInfo.setText('Points de vies du joueur divisé par 2, dégats réinitialisé a 2')
    } else if (randomGeneratedNumber === 3){
      this.playerHealth = this.playerMaxHealth;
      this.botMaxDamage -= 5;
      mysteryInfo.setText('Points de vies régénérés, dégats max du zombie réduits de 5')
    } else if (randomGeneratedNumber === 4){
      this.playerHealth = 1;
      this.playerDamage = 1;
      mysteryInfo.setText('Points de vies et dégats réinitialisés a 1')
    } else if (randomGeneratedNumber === 5){
      this.playerDamage *= 2;
      this.botMaxHealth /= 2;
      mysteryInfo.setText('Dégats du joueur multiplié par deux, points de vies max du zombie divisé par 2')
    } else {
      this.botMaxDamage += this.playerMaxHealth*0.1;
      mysteryInfo.setText('le zombie fait désormais au maximum ses anciens dégats max additionné a 10% des points de vies du joueur')
    }
    
    info.setText(`${this.playerHealth}/${this.playerMaxHealth}`);
  }

  createAnims(){
    this.anims.create({
      key: 'walk',
      frames: this.anims.generateFrameNumbers(WALK_KEY, { start: 0, end: 8}),
      frameRate: 20,
      repeat: -1,
    });

    this.anims.create({
      key: 'idle',
      frames: this.anims.generateFrameNumbers(IDLE_KEY, { start: 0, end: 5 }),
      frameRate: 20,
      repeat: -1,
    });

    this.anims.create({
      key: 'attack1',
      frames: this.anims.generateFrameNumbers(ATTACK1_KEY, { start: 0, end: 3}),
      frameRate: 20,
      repeat: 0,
    });

    this.anims.create({
      key: 'attack2',
      frames: this.anims.generateFrameNumbers(ATTACK2_KEY, { start: 0, end: 4}),
      frameRate: 20,
      repeat: 0,
    });

    this.anims.create({
      key: 'attack3',
      frames: this.anims.generateFrameNumbers(ATTACK3_KEY, { start: 0, end: 3}),
      frameRate: 20,
      repeat: 0,
    });

    this.anims.create({
      key: 'walkZM',
      frames: this.anims.generateFrameNumbers(WALKZM_KEY, { start: 0, end: 7}),
      frameRate: 20,
      repeat: -1,
    });

    this.anims.create({
      key: 'idleZM',
      frames: this.anims.generateFrameNumbers(IDLEZM_KEY, { start: 0, end: 7}),
      frameRate: 20,
      repeat: -1,
    });

    this.anims.create({
      key: 'attack1ZM',
      frames: this.anims.generateFrameNumbers(ATTACK1ZM_KEY, { start: 0, end: 4}),
      frameRate: 20,
      repeat: 0,
    });

    this.anims.create({
      key: 'attack2ZM',
      frames: this.anims.generateFrameNumbers(ATTACK2ZM_KEY, { start: 0, end: 3}),
      frameRate: 20,
      repeat: 0,
    });

    this.anims.create({
      key: 'attack3ZM',
      frames: this.anims.generateFrameNumbers(ATTACK3ZM_KEY, { start: 0, end: 4}),
      frameRate: 20,
      repeat: 0,
    });

    this.anims.create({
      key: 'walkZW',
      frames: this.anims.generateFrameNumbers(WALKZW_KEY, { start: 0, end: 6}),
      frameRate: 20,
      repeat: -1,
    });

    this.anims.create({
      key: 'idleZW',
      frames: this.anims.generateFrameNumbers(IDLEZW_KEY, { start: 0, end: 4}),
      frameRate: 20,
      repeat: -1,
    });

    this.anims.create({
      key: 'attack1ZW',
      frames: this.anims.generateFrameNumbers(ATTACK1ZW_KEY, { start: 0, end: 3}),
      frameRate: 20,
      repeat: 0,
    });

    this.anims.create({
      key: 'attack2ZW',
      frames: this.anims.generateFrameNumbers(ATTACK2ZW_KEY, { start: 0, end: 3}),
      frameRate: 20,
      repeat: 0,
    });

    this.anims.create({
      key: 'attack3ZW',
      frames: this.anims.generateFrameNumbers(ATTACK3ZW_KEY, { start: 0, end: 3}),
      frameRate: 20,
      repeat: 0,
    });
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
