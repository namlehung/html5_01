
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
             let nodepos:Vec3 = this.node.position;
             let lineposy = ShapeManager.instance.GetLimitedLinePosy();
             let nearpos = this.GetNearestTarget(0);

            if(nodepos.y <= lineposy - this.spriteHalfSize.height)
            {
                nodepos.y = lineposy - this.spriteHalfSize.height;
                this.isFinishMoving = true;
                this.CheckMacthParticle();
            }
    
            if(ShapeManager.instance.IsFirstPart() == false)
            {
                let delta = ShapeManager.instance.GetDeltaPartPosX();
                if((nodepos.x - delta - this.spriteHalfSize.width == nearpos.x ||  nodepos.x - delta + this.spriteHalfSize.width == nearpos.x) &&
                    nodepos.y + this.spriteHalfSize.height <= nearpos.y)
                {
                    nodepos.y = lineposy - this.spriteHalfSize.height;
                    this.isFinishMoving = true;
                    this.CheckMacthParticle();
                }
            }
    
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
                let nearpos = this.GetNearestTarget(9999);
                let delta = Math.abs(nearpos.x - this.node.position.x);
                
                if(mtype == PARTICLE_MOVE_TYPE.MOVE_LEFT)
                {
                    console.log("move left");
                    if(this.node.position.x <= nearpos.x  || delta > this.maxMoveX)
                    {
                        delta = this.minMoveX;
                    }
                    
                    this.targetMoveX = this.node.position.x - delta - this.spriteHalfSize.width;
                }
                else if(mtype == PARTICLE_MOVE_TYPE.MOVE_RIGHT)
                {
                    console.log("move right");
                    if(this.node.position.x >= nearpos.x  || delta > this.maxMoveX)
                    {
                        delta = this.minMoveX;
                    }
                    
                    this.targetMoveX = this.node.position.x + delta - this.spriteHalfSize.width;
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
    
        CheckMacthParticle()
        {
            if(ShapeManager.instance.IsFirstPart() == false)
            {
               
                ShapeManager.instance.CheckMatchedParticle(this.partInfo.spriteName);
            }
            else
            {

            }
            
        }
        GetNearestTarget(defaultvalue:number)
        {
            let index = 0;
            let delta = ShapeManager.instance.GetDeltaPartPosX();
            let arrayPos = ShapeManager.instance.GetReadyJointPos();
            if(arrayPos.length == 0)
            {
                return new Vec2(-9999,ShapeManager.instance.GetLimitedLinePosy());
            }
            let x = arrayPos[index].x + delta;
            let temp = Math.sqrt((this.node.position.x - x)*(this.node.position.x - x) + (this.node.position.y - arrayPos[index].y)*(this.node.position.y - arrayPos[index].y));
            if(temp == 0)
                temp = defaultvalue;
            for(let i = 1;i<arrayPos.length;i++)
            {
                x = arrayPos[i].x + delta;
                let temp2 =  Math.sqrt((this.node.position.x - x)*(this.node.position.x - x) + (this.node.position.y - arrayPos[i].y)*(this.node.position.y - arrayPos[i].y));
                if(temp2 == 0)
                    temp2 = defaultvalue;
                if(temp >  temp2)
                {
                    temp = temp2;
                    index = i;
                }
            }
            return new Vec2(arrayPos[index].x,arrayPos[index].y);
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
    