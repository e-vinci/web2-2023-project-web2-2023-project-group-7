/* eslint-disable no-underscore-dangle */


export default class EnemySpawner {
  /**
   * @param {Phaser.Scene} scene
   */
  constructor(scene) {
    this.scene = scene;
    
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
