import Phaser from 'phaser';

class knight extends Phaser.GameObjects.Sprite{
    constructor(scene, x,y, hp){
        super(scene, x,y);
        this.hp = hp;
        this.setTexture('knight');
        this.setPosition(x,y);
        scene.add.existing(this);
        this.on('animationcomplete', this.animComplete, this);
        this.alive = true;
    }
}