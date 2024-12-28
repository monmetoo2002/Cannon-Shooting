import { _decorator, Component, Node, Vec3, IPhysics2DContact, Collider2D, Contact2DType } from 'cc';
const { ccclass, property } = _decorator;
import { GameManager } from './GameManager';

@ccclass('Car')
export class Car extends Component {
    @property
    speed = 200;

    @property({ type: Node })
    target: Node = null;

    @property({ type: Node })
    gameManagerNode: Node = null;

    private gameManager: GameManager;

    setTarget(newTarget: Node) {
        this.target = newTarget;
    }

    start() {
        this.gameManager = this.gameManagerNode?.getComponent(GameManager) || null;

        const collider = this.getComponent(Collider2D);
        if (collider) {
            collider.on(Contact2DType.BEGIN_CONTACT, this.onBeginContact, this);
        }
    }

    onBeginContact(selfCollider: Collider2D, otherCollider: Collider2D, contact: IPhysics2DContact) {
        if (otherCollider.node.name === 'Bullet') {
            this.scheduleOnce(() => {
                if (this.gameManager) {
                    this.gameManager.getScore(1); 
                }
                this.node.destroy();
                otherCollider.node.destroy();
            }, 0.1);
        }
        
    }

    update(deltaTime: number) {
        if (!this.target) return;

        const direction = new Vec3();
        Vec3.subtract(direction, this.target.getWorldPosition(), this.node.getWorldPosition());
        direction.normalize();

        const movement = direction.multiplyScalar(this.speed * deltaTime);
        const newPosition = this.node.position.clone().add(movement);
        this.node.setPosition(newPosition);

        const angle = Math.atan2(direction.y, direction.x);
        const angleInDegrees = angle * (180 / Math.PI) + 180;  
        this.node.setRotationFromEuler(0, angleInDegrees, 0);

        if (this.node.position.x < -960) {
            this.node.destroy();
        }
    }
}
