
import { _decorator, Component,Vec3, Node } from 'cc';
const { ccclass, property } = _decorator;

export enum SHAPE_MOVE_TYPE{
    NONE = 0,
    MOVE_LEFT,
    MOVE_RIGHT,
    MOVE_DOWN
}
@ccclass('Shape')
export default class Shape extends Component {
    // [1]
    // dummy = '';

    // [2]
    // @property
    // serializableDummy = 0;

    rotateStatus: number = 0;
    targetPosY: number = 0;
    targetPosX: number = 0;
    normalSpeed: number = 3;
    moveTypeSpeed: number = 8;

    currentMoveType: SHAPE_MOVE_TYPE = SHAPE_MOVE_TYPE.NONE;
    isFinishMoving: boolean = false;
    enableFastMoveDown:boolean = false;

    start () {
        // [3]
    }

     update (deltaTime: number) {
    //     // [4]
        if(this.isFinishMoving == false)
        {
            let offsetNormal = new Vec3(0,-1*this.normalSpeed,0);
            if(this.enableFastMoveDown)
            {
                offsetNormal.y = -1*this.moveTypeSpeed;
            }
            if(this.currentMoveType == SHAPE_MOVE_TYPE.MOVE_LEFT)
            {
                offsetNormal.x = -1*this.moveTypeSpeed;
                if(offsetNormal.x + this.node.position.x <= this.targetPosX)
                {
                    offsetNormal.x = this.targetPosX - this.node.position.x;
                    this.currentMoveType = SHAPE_MOVE_TYPE.NONE;
                }
            }
            else if(this.currentMoveType == SHAPE_MOVE_TYPE.MOVE_RIGHT)
            {
                offsetNormal.x = 1*this.moveTypeSpeed;
                if(offsetNormal.x + this.node.position.x >= this.targetPosX)
                {
                    offsetNormal.x = this.targetPosX - this.node.position.x;
                    this.currentMoveType = SHAPE_MOVE_TYPE.NONE;
                }
            }
            offsetNormal.add(this.node.position);
            if(offsetNormal.y <= this.targetPosY)
            {
                offsetNormal.y = this.targetPosY;
                this.isFinishMoving = true;
            }

            this.node.setPosition(offsetNormal);
        }
     }

    MoveShape(mtype:SHAPE_MOVE_TYPE,posx: number)
    {
        if(mtype == SHAPE_MOVE_TYPE.MOVE_DOWN)
        {
            this.enableFastMoveDown = true;
            console.log("move down");
            return;
        }
        if(this.currentMoveType == SHAPE_MOVE_TYPE.NONE)
        {
            if(mtype == SHAPE_MOVE_TYPE.MOVE_LEFT)
            {
                console.log("move left");
                this.targetPosX = this.node.position.x - posx;
            }
            else if(mtype == SHAPE_MOVE_TYPE.MOVE_RIGHT)
            {
                this.targetPosX = this.node.position.x + posx;
                console.log("move right");
            }
            this.currentMoveType = mtype;
        }
    }

    DeleteShape()
    {
        this.destroy();
    }

    SetRotateStatus(rotate:number)
    {
        this.rotateStatus = (this.rotateStatus + rotate)%4;
    }

    InitShape(posy:number,normalspeed:number,movespeed:number)
    {
        this.targetPosY = posy;
        this.isFinishMoving = false;
        this.currentMoveType = SHAPE_MOVE_TYPE.NONE;
        this.normalSpeed = normalspeed;
        this.moveTypeSpeed = movespeed;
        this.enableFastMoveDown = false;
    }
   
    IsFinishMove()
    {
        return this.isFinishMoving;
    }
}

/**
 * [1] Class member could be defined like this.
 * [2] Use `property` decorator if your want the member to be serializable.
 * [3] Your initialization goes here.
 * [4] Your update function goes here.
 *
 * Learn more about scripting: https://docs.cocos.com/creator/3.0/manual/en/scripting/
 * Learn more about CCClass: https://docs.cocos.com/creator/3.0/manual/en/scripting/ccclass.html
 * Learn more about life-cycle callbacks: https://docs.cocos.com/creator/3.0/manual/en/scripting/life-cycle-callbacks.html
 */
