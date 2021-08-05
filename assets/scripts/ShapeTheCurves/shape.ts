
import { _decorator, Component,Vec3, Node } from 'cc';
import { ShapeInfo } from './shape-level';
import ShapeManager from './shape-manager';
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
    shapInfo:ShapeInfo = null;
    targetMoveX: number = 0;
    minMoveX: number = 30;
    maxMoveX: number = 40;

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
            let offsetNormal = new Vec3(0,-1*this.shapInfo.fallSpeed,0);
            if(this.enableFastMoveDown)
            {
                offsetNormal.y = -1*this.shapInfo.moveSpeed;
            }
            if(this.currentMoveType == SHAPE_MOVE_TYPE.MOVE_LEFT)
            {
                offsetNormal.x = -1*this.shapInfo.moveSpeed;
                if(offsetNormal.x + this.node.position.x <= this.targetMoveX)
                {
                    offsetNormal.x = this.targetMoveX - this.node.position.x;
                    this.currentMoveType = SHAPE_MOVE_TYPE.NONE;
                }
            }
            else if(this.currentMoveType == SHAPE_MOVE_TYPE.MOVE_RIGHT)
            {
                offsetNormal.x = 1*this.shapInfo.moveSpeed;
                if(offsetNormal.x + this.node.position.x >= this.targetMoveX)
                {
                    offsetNormal.x = this.targetMoveX - this.node.position.x;
                    this.currentMoveType = SHAPE_MOVE_TYPE.NONE;
                }
            }
            offsetNormal.add(this.node.position);
            if(offsetNormal.y <= this.shapInfo.targetPoint.y)
            {
                offsetNormal.y = this.shapInfo.targetPoint.y;
                this.isFinishMoving = true;
                this.CheckCorrectShape();
            }

            this.node.setPosition(offsetNormal);
        }
     }

    MoveShape(mtype:SHAPE_MOVE_TYPE)
    {
        if(mtype == SHAPE_MOVE_TYPE.MOVE_DOWN)
        {
            this.enableFastMoveDown = true;
            console.log("move down");
            return;
        }
        if(this.currentMoveType == SHAPE_MOVE_TYPE.NONE)
        {
            let delta = Math.abs(this.shapInfo.targetPoint.x - this.node.position.x);
            
            if(mtype == SHAPE_MOVE_TYPE.MOVE_LEFT)
            {
                console.log("move left");
                if(this.node.position.x <= this.shapInfo.targetPoint.x  || delta > this.maxMoveX)
                {
                    delta = this.minMoveX;
                }
                
                this.targetMoveX = this.node.position.x - delta;
            }
            else if(mtype == SHAPE_MOVE_TYPE.MOVE_RIGHT)
            {
                console.log("move right");
                if(this.node.position.x >= this.shapInfo.targetPoint.x  || delta > this.maxMoveX)
                {
                    delta = this.minMoveX;
                }
                
                this.targetMoveX = this.node.position.x + delta;
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

    UpdateRotateStatus()
    {
        this.rotateStatus = (this.rotateStatus + 1)%4;
    }

    InitShape(shapinfo:ShapeInfo,minmove:number,maxmove:number)
    {
        this.shapInfo = shapinfo;
        this.isFinishMoving = false;
        this.currentMoveType = SHAPE_MOVE_TYPE.NONE;
        this.enableFastMoveDown = false;
        this.minMoveX = minmove;
        this.maxMoveX = maxmove;
        this.rotateStatus = shapinfo.startPoint.r;
    }
   
    IsFinishMove()
    {
        return this.isFinishMoving;
    }

    CheckCorrectShape()
    {
        if(this.shapInfo.targetPoint.r >=0)
        {
            console.log("rotate Status: " + this.rotateStatus + " tr: " + this.shapInfo.targetPoint.r + " x: " + this.node.position.x +" tx: " + this.shapInfo.targetPoint.x);
            if(this.node.position.x == this.shapInfo.targetPoint.x && this.rotateStatus == this.shapInfo.targetPoint.r)
            {
                ShapeManager.instance.MatchedShape();
            }
        }
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
