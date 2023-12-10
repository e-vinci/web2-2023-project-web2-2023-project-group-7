/* eslint-disable no-plusplus */
/* eslint-disable lines-between-class-members */
import Phaser from 'phaser';
import HealthBar from './HealthBar'


class Knight extends Phaser.GameObjects.Sprite{
    constructor(scene, x,y){
        super(scene, x,y, 'knight');
        
        scene.add.existing(this);
        scene.physics.add.existing(this);

        this.dmg = 25;
        this.on('animationcomplete', this.animComplete, this);
        this.alive = true;
        this.enemies = scene.enemies;
        this.nbrEnemies = scene.nbrEnemies;
        this.allies = scene.allies;
        this.nbrAllies = scene.nbrAllies;
        this.myScene = scene;
        this.debug = true;
        const hx = x; 
        this.hp = new HealthBar(scene,x-hx, y-110,this);
        this.damageTimeroforknight = scene.time.addEvent({delay:1500, loop:true, callback:() => this.damage(), callbackScope:true});
       
        
    }
    preUpdate (time, delta){
        super.preUpdate(time, delta);
        this.myScene.physics.add.Sprite(this.x,this.y)
        if(!this || !this.body) return;
        this.myScene.physics.world.wrap(this, 0, true);
        
        // eslint-disable-next-line no-plusplus
        this.play('run', true);
        this.body.setVelocityX(20)
        

        
    }
    animComplete (animation){
        if (animation.key === 'attack'){
            this.play('attack', true)
        }
        if (animation.key === 'run'){
            this.play('run', true)
        }
        if (animation.key === 'idle'){
            this.play('idle', true)
        }
        
        
    }
    damage(amount){
        if (this.hp.decrease(amount)){
            this.alive = false;
            this.play("dead");
        }
    }
    update(){
        
        if (this.myScene.physics.overlap(this, this.enemies[this.nbrEnemies-1])){
            this.handleCollision(this.enemies(this.nbrEnemies-1))
        }
        for(let i = 0; i<this.nbrAllies; i++){
            if (this.allies[i] === this && this !== this.enemies[this.nbrEnemies-1] && this.myScene.physics.overlap(this, this.enemies[i])){
                this.stop();
            }
        }
    }

    handleCollision (enemy) {
        this.damageTimeroforknight = this.scene.time.addEvent({
            delay:1500,
            loop:true, callback:  () => {
                // eslint-disable-next-line no-unused-expressions
                this.anims.play('attack', true);
                this.damage(enemy.dmg);
                this.setVelocityX(0);
            }, 
            callbackScope:true});
    }
    stop(){
        this.setVelocityX(0);
        this.play('idle', true);
    }   

   
    
}
export default Knight;
