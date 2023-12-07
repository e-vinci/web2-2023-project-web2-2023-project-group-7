/* eslint-disable lines-between-class-members */
import Phaser from 'phaser';
import HealthBar from './HealthBar'


class Knight extends Phaser.GameObjects.Sprite{
    constructor(scene, x,y){
        super(scene, x,y, 'knight');
        
        scene.add.existing(this);
        this.setCollideWorldBounds(true);
        scene.physics.world.enable(this)
        this.body.onWorldBounds = true;
        this.dmg = 25;
        this.on('animationcomplete', this.animComplete, this);
        this.alive = true;
        const hx = 110; 
        this.hp = new HealthBar(scene,x-hx, y-110,this);
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
        if (animation.key === 'Attack')
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
    attack(bot){
        bot.damage(this.dmg);
    }

    update(){
        const hasAllyAhead = this.checkCollisionWithAllies();
        const hasEnemyAhead = this.checkCollisionWithEnemies();

        if (hasAllyAhead) {
            this.body.velocity.x = 0;
            this.play('idle', true);
        } else if (hasEnemyAhead) {
            this.play('attack', true);
        } else {
            this.body.velocity.x = 50;
            this.play('run', true);
    }

    
    }

    checkCollisionWithEnemies(obj){
        obj.damage(this.dmg);
                  

    }
}
export default Knight;