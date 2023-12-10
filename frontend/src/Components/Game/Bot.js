/* eslint-disable no-plusplus */
/* eslint-disable lines-between-class-members */
import Phaser from 'phaser';
import HealthBar from './HealthBar'


class bot extends Phaser.GameObjects.Sprite{
    constructor(scene, x,y){
        super(scene, x,y, 'bot');
        
        scene.add.existing(this);
        scene.physics.add.existing(this);
        scene.physics.world.enable(this);
        this.body.setCollideWorldBounds(true);

        this.dmg = 25;
        this.on('animationcomplete', this.animComplete, this);
        this.alive = true;
        this.enemies = scene.enemies;
        this.nbrEnemies = scene.nbrEnemies;
        this.allies = scene.allies;
        this.nbrAllies = scene.nbrAllies;
        this.myScene = this.scene;
        const hx = x; 
        this.hp = new HealthBar(scene,x-hx, y-110,this);
        this.damageTimeroforBot = scene.time.addEvent({delay:1500, loop:true, callback:this.damage(), callbackScope:true});
    
    }
    preUpdate (time, delta){
        super.preUpdate(time, delta);
        if(!this || !this.body) return;
        this.myScene.physics.world.wrap(this, 0, true);
        this.flipX = true;
        if (this.body) {
            // Exemple de mouvement vers la droite
            this.body.setVelocityX(- 20);
            this.play('botrun', true)
    
            // Vous pouvez également décommenter cette ligne pour voir le corps du bot
            // console.log(this.body);
        }
        
    }
    animComplete (animation){
        if (animation.key === 'botattack'){
            this.play('botattack', true)
        }
        if (animation.key === 'botrun'){
            this.play('botrun', true)
        }
        if (animation.key === 'botidle'){
            this.play('botidle', true)
        }
        
        
    }
    damage(amount){
        if (this.hp.decrease(amount)){
            this.alive = false;
            this.play("botdead", true);
        }
    }
    update(){
        
        if (this.myScene.physics.collider(this, this.allies[this.nbrEnemies-1])){
            this.handleCollision(this.enemies(this.nbrEnemies-1))
        }
        for(let i = 0; i<this.nbrEnemies; i++){
            if (this.nbrEnemies[i] === this && this !== this.allies[this.nbrAllies-1] && this.myScene.physics.collider(this, this.allies[i])){
                this.stop();
            }
        }
    }
    

    handleCollision (enemy) {
        this.damageTimeroforBot = this.scene.time.addEvent({
            delay:1500, 
            loop:true, callback:  () => {
                // eslint-disable-next-line no-unused-expressions
                this.anims.play('botattack', true);
                this.damage(enemy.dmg);
                this.setVelocity(0);
            }, 
            callbackScope:true});
    }
    
    stop(){
        this.setVelocity(0);
        this.play('botidle', true);
    }   

   
    
}
export default bot;
