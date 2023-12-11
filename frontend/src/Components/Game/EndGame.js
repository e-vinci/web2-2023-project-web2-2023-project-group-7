/* eslint-disable lines-between-class-members */
import Phaser from 'phaser';
import endGameBack from '../../assets/endBackground.jpg';
import restart from '../../assets/restart.png';


class EndGame extends Phaser.Scene {

    constructor ()
    {
        super('EndGame');
        
    }
    preload (){
        
        this.load.image('endgame', endGameBack);
        this.load.image('restart', restart);
    }

    create ()
    {       
        this.add.image(400,300, 'endgame')
        const reset = this.add.image(400, 430, 'restart');
        reset.setInteractive();
        reset.on('pointerdown', this.restartGame.bind(this))
        
    }
    // eslint-disable-next-line class-methods-use-this
    restartGame(){
        window.location.href = '/game';
    }
}
export default EndGame;
