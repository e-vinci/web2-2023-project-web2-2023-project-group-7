/* eslint-disable lines-between-class-members */
import Phaser from 'phaser';
import endGameBack from '../../assets/endBackground.jpg';
import restart from '../../assets/restart.png';


class EndGame extends Phaser.Scene {

    constructor ()
    {
        super({ key: 'EndGame', active: true });
        
    }
    preload (){
        
        this.load.image('endgame', endGameBack);
        this.load.image('restart', restart);
    }

    create (data)
    {
        // eslint-disable-next-line no-unused-vars
        const {gameover} = data;
        this.add.image(300,400, 'endgame')
        const reset = this.add.image(300, 350, 'restart');
        reset.setInteractive();
        reset.on('pointerdown', () => {
            this.scene.scene('game-scene');
        })
    }
}
export default EndGame;
