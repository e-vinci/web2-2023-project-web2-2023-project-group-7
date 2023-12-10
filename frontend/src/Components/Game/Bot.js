/* eslint-disable lines-between-class-members */
import Phaser from 'phaser';
import HealthBar from './HealthBar'


class bot extends Phaser.GameObjects.Sprite{
    constructor(scene, x,y){
        super(scene, x,y, 'bot');
        scene.add.existing(this);
        this.dmg = 25;
        this.on('animationcomplete', this.animComplete, this);
        this.alive = true;
        this.enemies = scene.enemies;
        this.nbrEnemies = scene.nbrEnemies;
        this.allies = scene.allies;
        this.nbrAllies = scene.nbrAllies;
        this.myScene = scene;
        const hx = x; 
        this.hp = new HealthBar(scene,x-hx, y-110,this);
        this.damageTimeroforBot = scene.time.addEvent({delay:1500, loop:true, callback:this.damage(), callbackScope:true});
    }
    preUpdate (time, delta){
        super.preUpdate(time, delta);
        if(!this || !this.body) return;
        this.play('run', true);
        this.setVelocity(50);

        
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
    checkCollisionWithEnemies() {
        
        const isColliding = this.myScene.physics.overlap(this, this.allies[this.nbrAllies-1], this.handleCollision, null, this);
        if (isColliding) {
                this.handleCollision(this.allies[this.nbrAllies-1]);
        }
        
    }

    handleCollision (enemy) {
        this.damageTimeroforBot = this.scene.time.addEvent({
            delay:1500, 
            loop:true, callback:  () => {
                // eslint-disable-next-line no-unused-expressions
                this.anims.play('attack', true);
                this.damage(enemy.dmg);
                this.setVelocity(0);
            }, 
            callbackScope:true});
    }
    checkCollisionWithAllies(){
        if (this.nbrEnemies>1){
            this.allies.forEach(ally => {
                const isSomeoneBefore = this.myScene.physics.overlap(this, ally,this.stop, null ,this)
                if (isSomeoneBefore){
                    this.stop();
                }
            });
        }
    }
    stop(){
        this.setVelocity(0);
        this.play('idle', true);
    }   

   
    
}
export default bot;