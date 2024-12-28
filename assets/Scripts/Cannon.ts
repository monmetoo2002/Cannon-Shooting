// Cannon.ts
import { _decorator, Component, IPhysics2DContact, Collider2D, Contact2DType, Node, Vec3, systemEvent, SystemEventType, EventMouse, math, Camera, Prefab, instantiate } from 'cc';
import { Bullet } from './Bullet';
import { GameManager } from './GameManager';
import { GameOver } from './GameOver';
const { ccclass, property } = _decorator;

@ccclass('Cannon')
export class Cannon extends Component {
    @property(Prefab)
    bulletPrefab: Prefab = null;

    @property(Node)
    barrel: Node = null;

    @property(Node)
    gameManagerNode: Node = null;

    @property(Node)
    gameOverUINode: Node = null;
    
    start() {
        const collider = this.getComponent(Collider2D);
        if (collider) {
            collider.on(Contact2DType.BEGIN_CONTACT, this.onBeginContact, this);
        }
    }

    onBeginContact(selfCollider: Collider2D, otherCollider: Collider2D, contact: IPhysics2DContact) {
        if (otherCollider.node.name === 'Car') {
            // Dừng trò chơi và hiển thị màn hình Game Over
            this.scheduleOnce(() => {
                const gameManager = this.gameManagerNode?.getComponent(GameManager);
                const gameOver = this.gameOverUINode?.getComponent(GameOver);
                
                if (gameManager && gameOver) {
                    gameManager.stopGame(); // Dừng trò chơi
                    const score = gameManager.getScoreValue(); // Lấy điểm
                    gameOver.showGameOver(score); // Hiển thị Game Over UI
                }
                this.node.destroy(); // Xóa Cannon
                otherCollider.node.destroy(); // Xóa Car
            }, 0.1);
        }
    }
    
    private isMouseDown: boolean = false;
    
    private spawnBullet(direction: Vec3) {
        if (!this.barrel || !this.bulletPrefab) {
            console.error('Barrel or bullet is missing');
            return;
        }

        let bullet = instantiate(this.bulletPrefab);
        const barrelWorldPos = this.barrel.getWorldPosition();
        this.node.parent.addChild(bullet);
        bullet.setWorldPosition(barrelWorldPos);

        const bulletComponent = bullet.getComponent(Bullet);
        if (bulletComponent) {
            bulletComponent.direction = direction.clone();
            bulletComponent.speed = 1000;
        }
    }
    
    private handleMouseMove(event: EventMouse) {
        const camera = this.node.scene?.getComponentInChildren(Camera);
        if (!camera || !this.barrel) return;

        const mousePositionScreen = new Vec3(event.getLocationX(), event.getLocationY(), 0);
        const mousePositionWorld = new Vec3();
        camera.screenToWorld(mousePositionScreen, mousePositionWorld);

        const barrelWorldPos = this.barrel.getWorldPosition();
        const direction = new Vec3();
        Vec3.subtract(direction, mousePositionWorld, barrelWorldPos);
        direction.normalize();

        const angle = Math.atan2(direction.y, direction.x);
        const angleD = math.toDegree(angle);
        this.node.setRotationFromEuler(0, 0, angleD);
    }

    private handleMouseDown(event: EventMouse) {
        if (event.getButton() !== EventMouse.BUTTON_LEFT) return;
        
        const camera = this.node.scene?.getComponentInChildren(Camera);
        if (!camera || !this.barrel) return;

        const mousePositionScreen = new Vec3(event.getLocationX(), event.getLocationY(), 0);
        const mousePositionWorld = new Vec3();
        camera.screenToWorld(mousePositionScreen, mousePositionWorld);

        const barrelWorldPos = this.barrel.getWorldPosition();
        const direction = new Vec3();
        Vec3.subtract(direction, mousePositionWorld, barrelWorldPos);
        direction.normalize();
 
        this.spawnBullet(direction);
    }

    onLoad() {
        if (!this.barrel) {
            return;
        }

        systemEvent.on(SystemEventType.MOUSE_MOVE, this.handleMouseMove, this);
        systemEvent.on(SystemEventType.MOUSE_DOWN, this.handleMouseDown, this);
    }

    onDestroy() {
        systemEvent.off(SystemEventType.MOUSE_MOVE, this.handleMouseMove, this);
        systemEvent.off(SystemEventType.MOUSE_DOWN, this.handleMouseDown, this);
    }
}