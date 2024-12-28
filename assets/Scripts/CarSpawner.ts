import { _decorator, Component, Node, Prefab, instantiate, Vec3, director } from 'cc';
import { Car } from './Car';
const { ccclass, property } = _decorator;

@ccclass('CarSpawner')
export class CarSpawner extends Component {
    @property(Prefab)
    carPrefab: Prefab = null;

    @property(Node)
    cannon: Node = null;

    @property(Node)
    spawnNode: Node = null;

    @property(Node)
    gameManagerNode: Node = null; // Thêm tham chiếu đến GameManager

    @property
    spawnInterval: number = 5;

    private timer: number = 0;

    update(deltaTime: number) {
        this.timer += deltaTime;

        if (this.timer >= this.spawnInterval) {
            this.spawnCar();
            this.timer = 0;
        }
    }

    private spawnCar() {
        if (!this.carPrefab || !this.cannon || !this.spawnNode) {
            return;
        }

        const car = instantiate(this.carPrefab);
        car.setPosition(this.spawnNode.getPosition());
        this.node.parent.addChild(car);

        const carComponent = car.getComponent(Car);
        if (carComponent) {
            carComponent.setTarget(this.cannon);
            carComponent.gameManagerNode = this.gameManagerNode;
        }
    }
}
