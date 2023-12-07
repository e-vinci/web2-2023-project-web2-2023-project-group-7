/* eslint-disable lines-between-class-members */
import Phaser from 'phaser';
import HealthBar from './HealthBar'


class Bot extends Phaser.GameObjects.Sprite{
    constructor(scene, x,y){
        super(scene, x,y, 'knight');
        
        scene.add.existing(this);
        scene.physics.world.enable(this);
        this.body.onWorldBounds = true;
        this.dmg = 25;
        this.on('animationcomplete', this.animComplete, this);
        this.alive = true;
        const hx = 600; 
        this.hp = new HealthBar(scene,x-hx, y-110 );
        this.timer = scene.time.addEvent({ delay: Phaser.Math.Between(1000, 3000), callback: this.attack, callbackScope: this });
        this.damageTimer = scene.time.addEvent({delay:1000, loop:true, callback:this.checkCollisionWithEnemies, callbackScope:true});
    }
    preUpdate (time, delta){
        super.preUpdate(time, delta);
        const isCollidingWithAllies = this.checkCollisionWithAllies();
        if (isCollidingWithAllies) {
            this.body.velocity.x = 0;
        } else {
            this.body.velocity.x = 50;
        }
    }
    animComplete (animation){
        if (animation.key === 'Attack1')
        {
            this.play('Idle');
        }
    }
    damage(amount){
        if (this.hp.decrease(amount)){
            this.alive = false;
            this.play("dead");
        }
    }
    // eslint-disable-next-line class-methods-use-this
    attack(player){
        player.damage(this.dmg);
    }

    update(){
        const hasAllyAhead = this.checkCollisionWithAllies();
        const hasEnemyAhead = this.checkCollisionWithEnemies();

        if (hasAllyAhead) {
            this.setVelocityX(0);
            this.play('idle', true);
        } else if (hasEnemyAhead) {
            this.play('attack', true);
        } else {
            this.setVelocityX(50);
            this.play('run', true);
    }

    
    }

    checkCollisionWithEnemies(obj){
        obj.damage(this.dmg);
    }
    checkCollisionWithAllies(){
        this.body.velocity.x = 0;
    }
}
export default Bot;