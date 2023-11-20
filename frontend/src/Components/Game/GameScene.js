import Phaser from 'phaser';
import ScoreLabel from './ScoreLabel';
import BombSpawner from './BombSpawner';
import skyAsset from '../../assets/sky.png';
import platformAsset from '../../assets/platform.png';
import starAsset from '../../assets/star.png';
import bombAsset from '../../assets/bomb.png';
import idleAsset from '../../assets/Samurai/Idle.png';
import walkAsset from '../../assets/Samurai/Walk.png';
import jumpAsset from '../../assets/Samurai/Jump.png';
import healthAsset from '../../assets/health.png';

const GROUND_KEY = 'ground';
const IDLE_KEY = 'idle';
const WALK_KEY = 'walk';
const JUMP_KEY = 'jump';
const STAR_KEY = 'star';
const BOMB_KEY = 'bomb';

class GameScene extends Phaser.Scene {
  constructor() {
    super('game-scene');
    this.player = undefined;
    this.cursors = undefined;
    this.scoreLabel = undefined;
    this.stars = undefined;
    this.bombSpawner = undefined;
    this.gameOver = false;
    this.health = 3;
  }

  preload() {
    this.load.image('sky', skyAsset);
    this.load.image(GROUND_KEY, platformAsset);
    this.load.image(STAR_KEY, starAsset);
    this.load.image(BOMB_KEY, bombAsset);
    this.load.image('health', healthAsset);

    this.load.spritesheet(IDLE_KEY, idleAsset, {
      frameWidth: 67,
      frameHeight: 74,
    });
    this.load.spritesheet(WALK_KEY, walkAsset, {
      frameWidth: 67,
      frameHeight: 74,
    });
    this.load.spritesheet(JUMP_KEY, jumpAsset, {
      frameWidth: 67,
      frameHeight: 74,
    });
  }

  create() {
    this.add.image(400, 300, 'sky');
    this.health = this.createHealth();
    const platforms = this.createPlatforms();
    this.player = this.createPlayer();
    this.stars = this.createStars();
    this.scoreLabel = this.createScoreLabel(16, 16, 0);
    this.bombSpawner = new BombSpawner(this, BOMB_KEY);
    const bombsGroup = this.bombSpawner.group;
    this.physics.add.collider(this.stars, platforms);
    this.physics.add.collider(this.player, platforms);
    this.physics.add.collider(bombsGroup, platforms);
    this.physics.add.collider(this.player, bombsGroup, this.hitBomb, null, this);
    this.physics.add.overlap(this.player, this.stars, this.collectStar, null, this);
    this.cursors = this.input.keyboard.createCursorKeys();

    /* The Collider takes two objects and tests for collision and performs separation against them.
    Note that we could call a callback in case of collision... */
  }

  update() {
    if (this.gameOver) {
      return;
    }

    if (this.cursors.left.isDown) {
      this.player.setVelocityX(-160);
      this.player.anims.play('left', true);
    } else if (this.cursors.right.isDown) {
      this.player.setVelocityX(160);
      this.player.anims.play('right', true);
    } else {
      this.player.setVelocityX(0);
      this.player.anims.play('turn', true);
    }

    if (this.cursors.up.isDown && this.player.body.touching.down) {
      this.player.setVelocityY(-330);
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
    const hp = this.add.image(70, 100,'health');
    this.add.text(40, 100, this.health.toString());
    return hp;
  }

  createPlayer() {
    const player = this.physics.add.sprite(100, 450, IDLE_KEY);
    player.setBounce(0.2);
    player.setCollideWorldBounds(true);
    /* The 'left' animation uses frames 0, 1, 2 and 3 and runs at 10 frames per second.
    The 'repeat -1' value tells the animation to loop.
    */
    this.anims.create({
      key: 'left',
      frames: this.anims.generateFrameNumbers(WALK_KEY, { start: 0, end: 8}),
      frameRate: 10,
      repeat: -1,
    });

    this.anims.create({
      key: 'turn',
      frames: this.anims.generateFrameNumbers(IDLE_KEY, { start: 0, end: 5 }),
      frameRate: 10,
      repeat: -1,
    });

    this.anims.create({
      key: 'right',
      frames: this.anims.generateFrameNumbers(WALK_KEY, { start: 0, end: 8 }),
      frameRate: 10,
      repeat: -1,
    });

    this.anims.create({
      key: 'up',
      frames: this.anims.generateFrameNumbers(JUMP_KEY, { start: 0, end: 8 }),
      frameRate: 10,
      repeat: -1,
    });

    return player;
  }

  createStars() {
    const stars = this.physics.add.group({
      key: STAR_KEY,
      repeat: 11,
      setXY: { x: 12, y: 0, stepX: 70 },
    });

    stars.children.iterate((child) => {
      child.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));
    });

    return stars;
  }

  collectStar(player, star) {
    star.disableBody(true, true);
    this.scoreLabel.add(10);
    if (this.stars.countActive(true) === 0) {
      //  A new batch of stars to collect
      this.stars.children.iterate((child) => {
        child.enableBody(true, child.x, 0, true, true);
      });
    }

    this.bombSpawner.spawn(player.x);
  }

  createScoreLabel(x, y, score) {
    const style = { fontSize: '32px', fill: '#000' };
    const label = new ScoreLabel(this, x, y, score, style);
    console.log('score:', label);
    this.add.existing(label);

    return label;
  }

  hitBomb(player) {
    if(this.health <=1){
      this.scoreLabel.setText(`GAME OVER : ( \nYour Score = ${this.scoreLabel.score}`);
      this.physics.pause();

      player.setTint(0xff0000);

      player.anims.play('turn');

      this.gameOver = true;
    }
    else{
      this.health -= 1;
    }
  }
}

export default GameScene;
