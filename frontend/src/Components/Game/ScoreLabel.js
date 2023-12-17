import Phaser from 'phaser';

const formatScore = (score) => `Score: ${score}`;

export default class ScoreLabel extends Phaser.GameObjects.Text {
  constructor(scene, x, y, score, style) {
    super(scene, x, y, formatScore(score), style);
    console.log('inside class', this.text);
    this.score = score;
  }

  // change the score with a new value
  setScore(score) {
    this.score = score;
    this.updateScoreText();
  }

  // Adds points to the current score
  add(points) {
    this.setScore(this.score + points);
  }

  // Updates the displayed score text based on the current score value.
  updateScoreText() {
    this.setText(formatScore(this.score));
  }
}
