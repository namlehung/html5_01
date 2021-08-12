
import { _decorator, Component,Vec3, Node, Vec2, CCLoader } from 'cc';
import { PartInfo } from './shape-level';
import ShapeManager from './shape-manager';
const { ccclass, property } = _decorator;

export enum PARTICLE_MOVE_TYPE{
    NONE = 0,
    MOVE_LEFT,
    MOVE_RIGHT,
    MOVE_DOWN
}

@ccclass('Particle')
export default class Particle extends Component {

    
        // [1]
        // dummy = '';
    
        // [2]
        // @property
        // serializableDummy = 0;
    
        partInfo:PartInfo = null;
        targetMoveX: number = 0;
        minMoveX: number = 30;
        maxMoveX: number = 40;
    
        currentMoveType: PARTICLE_MOVE_TYPE = PARTICLE_MOVE_TYPE.NONE;
        isFinishMoving: boolean = false;
        enableFastMoveDown:boolean = false;
        spriteHalfSize:cc.Size = new cc.Size(0,0);
        isPartMoveOverPosY:boolean = false;

        start () {
            // [3]
        }
    
         update (deltaTime: number) {
        //     // [4]
            if(this.isFinishMoving == false)
            {
                let offsetNormal = new Vec3(0,-1*this.partInfo.fallSpeed,0);
                if(this.enableFastMoveDown)
                {
                    offsetNormal.y = -1*this.partInfo.moveSpeed;
                }
                if(this.currentMoveType == PARTICLE_MOVE_TYPE.MOVE_LEFT)
                {
                    offsetNormal.x = -1*this.partInfo.moveSpeed;
                    if(offsetNormal.x + this.node.position.x <= this.targetMoveX)
                    {
                        offsetNormal.x = this.targetMoveX - this.node.position.x;
                        this.currentMoveType = PARTICLE_MOVE_TYPE.NONE;
                    }
                }
                else if(this.currentMoveType == PARTICLE_MOVE_TYPE.MOVE_RIGHT)
                {
                    offsetNormal.x = 1*this.partInfo.moveSpeed;
                    if(offsetNormal.x + this.node.position.x >= this.targetMoveX)
                    {
                        offsetNormal.x = this.targetMoveX - this.node.position.x;
                        this.currentMoveType = PARTICLE_MOVE_TYPE.NONE;
                    }
                }
                offsetNormal.add(this.node.position);
                this.node.setPosition(offsetNormal);
                this.CheckFinishMove();
            }
         }
    
         CheckFinishMove()
         {
            let nodepos:Vec3 = new Vec3 (this.node.position.x,this.node.position.y,this.node.position.z);
            let lineposy = ShapeManager.instance.GetLimitedLinePosy();
            let deltax = ShapeManager.instance.GetDeltaPartPosX();
            

            if(nodepos.y  <= this.partInfo.endPoint.y && this.isPartMoveOverPosY == false)
            {
                this.isPartMoveOverPosY = true;
                if(ShapeManager.instance.IsFirstPart())
                {
                    nodepos.y = this.partInfo.endPoint.y;
                    this.isFinishMoving = true;
                    ShapeManager.instance.CheckMatchedParticle(this.partInfo.spriteName);
                    this.node.setPosition(nodepos);
                    return;
                }
                let offx = nodepos.x - this.partInfo.endPoint.x;
                console.log("check finish move : " + offx);
                if( offx == deltax)
                {
                    nodepos.y = this.partInfo.endPoint.y;
                    this.isFinishMoving = true;
                    ShapeManager.instance.CheckMatchedParticle(this.partInfo.spriteName);
                    this.node.setPosition(nodepos);
                    return;
                }
            }

            if(nodepos.y <= lineposy)
            {
                this.isFinishMoving = true;
                ShapeManager.instance.CheckMatchedParticle("");
            }
    
            /*let delta = ShapeManager.instance.GetDeltaPartPosX();
            if((nodepos.x - delta - this.spriteHalfSize.width == nearpos.x ||  nodepos.x - delta + this.spriteHalfSize.width == nearpos.x) &&
                nodepos.y <= this.partInfo.endPoint.y)
            {
                nodepos.y = this.partInfo.endPoint.y;
                this.isFinishMoving = true;
            }*/
    
         }
    
        MoveParticle(mtype:PARTICLE_MOVE_TYPE)
        {
            if(mtype == PARTICLE_MOVE_TYPE.MOVE_DOWN)
            {
                this.enableFastMoveDown = true;
                console.log("move down");
                return;
            }
            if(this.currentMoveType == PARTICLE_MOVE_TYPE.NONE)
            {
                let deltax = ShapeManager.instance.GetDeltaPartPosX();
                let nearposx = this.partInfo.endPoint.x + deltax;
                let delta = Math.abs(nearposx - this.node.position.x);
                
                if(mtype == PARTICLE_MOVE_TYPE.MOVE_LEFT)
                {
                    if(this.node.position.x <= nearposx  || delta > this.maxMoveX)
                    {
                        delta = this.minMoveX;
                    }
                    console.log("move left: " + delta + " ep " + nearposx + " posx: " + this.node.position.x +" dx " + deltax);
                    this.targetMoveX = this.node.position.x - delta;// - this.spriteHalfSize.width;
                }
                else if(mtype == PARTICLE_MOVE_TYPE.MOVE_RIGHT)
                {
                    
                    if(this.node.position.x >= nearposx  || delta > this.maxMoveX)
                    {
                        delta = this.minMoveX;
                    }
                    console.log("move right: " + delta + " ep " + nearposx + " posx: " + this.node.position.x +" dx " + deltax);
                    this.targetMoveX = this.node.position.x + delta ;//- this.spriteHalfSize.width;
                }
                this.currentMoveType = mtype;
            }
        }
    
        DeleteShape()
        {
            this.destroy();
        }
    
        InitParticle(partinfo:PartInfo,minmove:number,maxmove:number,spritesize:cc.Size)
        {
            this.isPartMoveOverPosY = false;
            this.partInfo = partinfo;
            this.isFinishMoving = false;
            this.currentMoveType = PARTICLE_MOVE_TYPE.NONE;
            this.enableFastMoveDown = false;
            this.minMoveX = minmove;
            this.maxMoveX = maxmove;
            this.spriteHalfSize.width = spritesize.width/2;
            this.spriteHalfSize.height = spritesize.height/2;
        }
       
        IsFinishMove()
        {
            return this.isFinishMoving;
        }
    
        IsPartMoving():boolean
        {
            if(this.currentMoveType == PARTICLE_MOVE_TYPE.NONE)
                return false;
            return true;
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
    