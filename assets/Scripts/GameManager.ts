import { _decorator, Component, Label, director } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('GameManager')
export class GameManager extends Component {
    @property(Label)
    scoreLabel: Label = null;

    private score: number = 0;
    private gameOver: boolean = false;

    start() {
        this.updateScoreLabel();
    }

    getScore(points: number) {
        if (this.gameOver) return; // Nếu trò chơi đã kết thúc, không cộng điểm thêm
        this.score += points;
        this.updateScoreLabel();
    }

    stopGame() {
        this.gameOver = true; // Đánh dấu trò chơi đã kết thúc
    }

    getScoreValue() {
        return this.score;
    }

    private updateScoreLabel() {
        if (this.scoreLabel) {
            this.scoreLabel.string = `Score: ${this.score}`;
        }
    }
}
