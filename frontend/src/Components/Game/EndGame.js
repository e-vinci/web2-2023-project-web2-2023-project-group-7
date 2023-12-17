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

    create (){       
        // Display end background
        this.add.image(400,300, 'endgame')

        // Create and set up restart button
        const reset = this.add.image(400, 430, 'restart').setInteractive()
        console.log('interactivity done');

        // Retrieve the 'game-scene' instance
        const gameScene = this.scene.get('game-scene');
        console.log(gameScene);

        // Event listener for restart button click
        reset.on('pointerdown', () => {
            console.log('bouton on');
            // Start the 'game-scene'
            this.scene.start('game-scene')
            console.log('gamescene scitch');
            console.log(gameScene);
            console.log(this);
        });
    }
}
export default EndGame;
