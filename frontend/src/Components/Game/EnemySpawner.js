/* eslint-disable no-underscore-dangle */


export default class EnemySpawner {
  /**
   * @param {Phaser.Scene} scene
   */
  constructor(scene,hp) {
    this.scene = scene;
    this.hp = hp;
    
    this._group = this.scene.physics.add.group();
  }

  get group() {
    return this._group;
  }

  spawn(botReceived) {
    this.bot = botReceived;

    return this.bot;
  }
}
