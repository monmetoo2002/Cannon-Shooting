import { _decorator, Component, Vec3, IPhysics2DContact, Collider2D, Contact2DType } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('Bullet')
export class Bullet extends Component {
    public direction: Vec3 = new Vec3(0, 1, 0);

    @property 
    public speed: number = 2000;

    @property
    public gravity: number = -980; // Gia tốc trọng trường (cm/s^2)
    
    private velocity: Vec3;

    start() {
        this.velocity = this.direction.clone().multiplyScalar(this.speed);

        const collider = this.getComponent(Collider2D);
        if (collider) {
            collider.on(Contact2DType.BEGIN_CONTACT, this.onBeginContact, this);
        }
    }

    onBeginContact(selfCollider: Collider2D, otherCollider: Collider2D, contact: IPhysics2DContact) {
        if (otherCollider.node.name === 'Car') {
            this.scheduleOnce(() => {
                this.node.destroy();
                otherCollider.node.destroy();
            }, 0.1); // Lên lịch phá hủy sau 0.1 giây
        }
    }

    update(deltaTime: number) {
        this.velocity.y += this.gravity * deltaTime;

        const movement = this.velocity.clone().multiplyScalar(deltaTime);
        const newPosition = this.node.position.clone().add(movement);
        this.node.setPosition(newPosition);


        if (Math.abs(newPosition.x) > 1000 || Math.abs(newPosition.y) > 1000) {
            this.node.destroy();
        }
    }
}
