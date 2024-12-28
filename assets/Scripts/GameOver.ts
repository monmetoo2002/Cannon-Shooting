import { _decorator, Component, Node, Label, director } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('GameOver')
export class GameOver extends Component {
    @property(Label)
    scoreLabel: Label = null;

    @property(Node)
    restartButton: Node = null;

    @property(Node)
    menuButton: Node = null;

    showGameOver(score: number) {
        this.node.active = true;

        if (this.scoreLabel) {
            this.scoreLabel.string = `Score: ${score}`; 
        }
        this.restartButton.active = true;
        this.menuButton.active = true;
    }

    onRestart() {
        director.loadScene(director.getScene().name); 
    }

    onMenu() {
        director.loadScene('Menu'); 
    }
}
