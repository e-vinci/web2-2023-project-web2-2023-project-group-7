/* eslint-disable lines-between-class-members */
import Phaser from 'phaser';
import endGameBack from '../../assets/endBackground.jpg';
import restart from '../../assets/restart.png';


class EndGame extends Phaser.Scene {

    constructor ()
    {
        super('EndGame');
        this.ready = false;
    }
    preload (){
        
        this.load.image('endgame', endGameBack);
        this.load.image('restart', restart);
    }

    create ()
    {       
        this.add.image(400,300, 'endgame')
        const reset = this.add.image(400, 430, 'restart').setInteractive()
        console.log('interactivity done');
        const gameScene = this.scene.get('game-scene');
        console.log(gameScene);
        reset.on('pointerdown', () => {
            console.log('bouton on');
            this.scene.start('game-scene')
            console.log('gamescene scitch');
            console.log(gameScene);
            console.log(this);
        });
        
        
    }
    // eslint-disable-next-line class-methods-use-this
}
export default EndGame;
