
import { _decorator, Component, Node,Vec2, CCLoader, Label, Vec3, Sprite, Prefab } from 'cc';
import GameManager, { GAME_STATE } from '../Manager/game-manager';
import { InputController } from '../Controller/input-controller';
import ResourcesManager from '../Manager/resource-manager';
import ShapeLevel, {  PartInfo, PartJoint, ShapeLevelInfo } from './shape-level';
import Particle, {PARTICLE_MOVE_TYPE} from './particle';

const { ccclass, property } = _decorator;

export class ShapeJointInfo
{
    arrayJoint:PartJoint[] = [];
    arrayStatus: number[] = [];//0: watting 1: ready; 2: is jointed
    currentIndex: number = 0;

    Init(currentlevel:ShapeLevelInfo)
    {
        let length = 0;
        let i = 0,k=0;
        for(;i<currentlevel.partInfo.length;i++)
        {
            length += currentlevel.partInfo[i].partJoints.length;
        }
        this.arrayJoint = new Array(length);
        this.arrayStatus = new Array(length);
        for(i=0;i<currentlevel.partInfo.length;i++)
        {
            let partjoints = currentlevel.partInfo[i].partJoints;
            for(let j=0;j<partjoints.length;j++)
            {
                this.arrayStatus[k] = 0;
                this.arrayJoint[k] = new PartJoint();
                this.arrayJoint[k].id = partjoints[j].id;
                this.arrayJoint[k].x = partjoints[j].x;
                this.arrayJoint[k].y = partjoints[j].y;
                k++;
            }
        }
        this.currentIndex = 0;
    }
    UpdateStatus(partjoints:PartJoint[])
    {
        for(let i = 0;i<this.arrayStatus.length;i++)
        {
            for(let j=0;j<partjoints.length;j++)
            {
                if(this.arrayJoint[i].id == partjoints[j].id)
                {
                    this.arrayStatus[i] = 1;
                }
            }
        }
    }
    ResetStatus()
    {
        for(let i = 0;i<this.arrayStatus.length;i++)
        {
            this.arrayStatus[i] = 0;
        }
    }
    GetCurrentJointPos()
    {
        return new Vec3(this.arrayJoint[this.currentIndex].x,this.arrayJoint[this.currentIndex].y,0);
    }
    GetCurrentTargetSpriteName()
    {
        let id = this.arrayJoint[this.currentIndex].id.indexOf(";");
        if(id>0)
        {
            return this.arrayJoint[this.currentIndex].id.substring(id);
        }
        return "";
    }
    GetReadyJoint()
    {
        let l = 0,i = 0;
        for(;i<this.arrayStatus.length;i++)
        {
            if(this.arrayStatus[i]== 1)
            {
                l++;
            }
        }
        let arrayPos:Vec2[] = new Array(l);
        l=0;
        for(i=0;i<this.arrayStatus.length;i++)
        {
            if(this.arrayStatus[i]== 1)
            {
                arrayPos[l++] = new Vec2(this.arrayJoint[i].x,this.arrayJoint[i].y);
            }
        }
        return arrayPos;
    }
    GoNextJoint()
    {
        for(let i = 0;i<this.arrayStatus.length;i++)
        {
            if(this.currentIndex != i && this.arrayStatus[i]== 1)
            {
                this.currentIndex = i;
                return true;
            }
        }
        return false;
    }
};

@ccclass('ShapeManager')
export default class ShapeManager extends Component {
    // [1]
    // dummy = '';

    // [2]
    // @property
    // serializableDummy = 0;

    currentLevelindex:number = 0;
    currentLevelInfo:ShapeLevelInfo = null;
    isLevelLoading: boolean = false;
    
    @property(cc.Node)
    timePlayNode: Node = null;

    @property(cc.Prefab)
    prefabParticle: Prefab = null;

    timeLevelRemaining: number = 0;
    timeLevelLabel: Label = null;

    inputController:InputController = null;
    minMove: Vec2 = new Vec2(120,120);

    shapeNode:Node = null;
    currentParticleNode: Node = null;
    shapeHintNode: Node = null;
    currentJoint:ShapeJointInfo = null;

    currentIndexShape: number = 0;
    deltaPartPosX: number = 0;
    numberMatchedPart:number = 0;

    textResult: string = 'FAILED';

    private static _instance: ShapeManager = null;
    static get instance()
    {
        return ShapeManager._instance;
    }
    onLoad()
    {
        ShapeManager._instance = this.node.getComponent("ShapeManager");
    }
    start () {
        // [3]
        if(this.timePlayNode)
        {
            this.timeLevelLabel = this.timePlayNode.getComponent("cc.Label");
        }
        this.inputController = this.node.parent.getComponent("InputController");
        if(this.currentLevelindex >= ShapeLevel.instance.LEVELDATA.length)
            this.currentLevelindex = 0;
        this.shapeNode = GameManager.instance.GetAPNode().getChildByName("shape");
        if(this.shapeNode == null)
        {
            this.shapeNode = new Node('shape');
            GameManager.instance.GetAPNode().addChild(this.shapeNode);
        }
        ResourcesManager.instance.LoadPrefabsFolder("Prefabs/ShapeTheCurves/Effects",false);
        this.LoadLevel(this.currentLevelindex);
    }

     update (deltaTime: number) {
    //     // [4]

        let currentstate = GameManager.instance.GetCurrentState();
        switch(currentstate)
        {
            case GAME_STATE.STATE_LOADING:
                if(this.isLevelLoading)
                {
                    if(ResourcesManager.instance.isLoadFinished)
                    {
                        this.isLevelLoading = false;
                        
                        GameManager.instance.SwitchState(GAME_STATE.STATE_ACTION_PHASE);
                        let bgsprite = GameManager.instance.GetAPNode().getChildByName('background-level').getComponentInChildren("cc.Sprite");
                        if(bgsprite)
                        {
                            bgsprite._spriteFrame = ResourcesManager.instance.GetSprites("bg");
                        }
                        
                        this.shapeHintNode = cc.instantiate(ResourcesManager.instance.GetPrefabs("particle-hint"));
                        this.shapeNode.addChild(this.shapeHintNode);
                        this.shapeHintNode.setPosition(-9999,-9999,0);
                    }
                }
                break;
            case GAME_STATE.STATE_ACTION_PHASE:
                {
                   if(this.timeLevelLabel)
                   {
                        this.timeLevelLabel.string = "" + Math.round(this.timeLevelRemaining);
                    }
                   this.timeLevelRemaining = this.currentLevelInfo.timeLimited -  GameManager.instance.GetTimeInAP();
                   this.UpdateTouch();
                   this.UpdateGenerateShap();
                }
                break;
            case GAME_STATE.STATE_GAME_RESULT:
                {
                    let Rtextresult = GameManager.instance.GetResultNode().getChildByName('txt-result')?.getComponent('cc.RichText');
                    if(Rtextresult)
                    {
                        let ctime = GameManager.instance.GetCurrentTime();
                        if(ctime - Math.round(ctime) > 0.25)
                        {
                            Rtextresult.string = '<color=#00ff00>' + this.textResult + '</color>';
                        }
                        else
                        {
                            Rtextresult.string = '<color=#ff0000>' + this.textResult + '</color>';
                        }
                    }
                }
                break;
        }
        
     }

     LoadLevel(level:number)
     {
        GameManager.instance.SwitchState(GAME_STATE.STATE_LOADING);
        this.shapeNode.removeAllChildren();
        this.isLevelLoading = true;
        this.currentParticleNode = null;
        this.currentIndexShape = 0;
        this.textResult = 'FAILED';

        this.currentLevelInfo = ShapeLevel.instance.GetLevelInfos(this.currentLevelindex);
        ResourcesManager.instance.LoadSpritFolder("Textures/ShapeTheCurves/levels/"+this.currentLevelInfo.levelName,true);
        this.timeLevelRemaining = this.currentLevelInfo.timeLimited;
        if(this.currentJoint == null)
        {
            this.currentJoint = new ShapeJointInfo();
        }
        this.currentJoint.Init(this.currentLevelInfo);
        this.numberMatchedPart = 0;
     }

     UpdateTouch()
     {
        let deltamove = this.inputController.GetMoveVector();
        if(Math.abs(deltamove.x) > this.minMove.x || Math.abs(deltamove.y) > this.minMove.y)
        {
           // console.log("deltamove: " + deltamove);
           if(Math.abs(deltamove.x) > Math.abs(deltamove.y))
           {
                if( deltamove.x > 0 )
                {
                    //console.log("move right");
                    this.MoveParticle(PARTICLE_MOVE_TYPE.MOVE_RIGHT);
                }
                else
                {
                    //console.log("move left");
                    this.MoveParticle(PARTICLE_MOVE_TYPE.MOVE_LEFT);
                }
           }
           else
           {
                if( deltamove.y < 0 )
                {
                    //console.log("move down");
                    this.MoveParticle(PARTICLE_MOVE_TYPE.MOVE_DOWN);
                }
            
           }
           this.inputController.SetTouchStartToMove();
            
        }
    }

    MoveParticle(mtype:PARTICLE_MOVE_TYPE)
    {
        if(this.currentParticleNode)
        {
            let partts:Particle = this.currentParticleNode.getComponent("Particle");
            partts.MoveParticle(mtype);
        }
    }
    
    UpdateGenerateShap()
    {
        if(this.currentIndexShape > this.currentLevelInfo.partInfo.length || GameManager.instance.GetTimeInAP() > this.currentLevelInfo.timeLimited)
        {
            GameManager.instance.SwitchState(GAME_STATE.STATE_GAME_RESULT);
            let bg = GameManager.instance.GetResultNode();
            let bgsprite = bg.getChildByName('background')?.getComponentInChildren('cc.Sprite');
            bgsprite._spriteFrame = ResourcesManager.instance.GetSprites('bg');
            
            if(this.numberMatchedPart == this.currentLevelInfo.targetMacthedParticle)
            {
                this.textResult = 'Congratulation!';
            }
        }
        else
        {
            if(this.currentParticleNode == null)
            {
                if(this.currentIndexShape>=this.currentLevelInfo.partInfo.length)
                {
                    this.currentIndexShape++;
                    return;
                }
                let partinfo:PartInfo = this.currentLevelInfo.partInfo[this.currentIndexShape];
                //let node = new Node();
                let node:Node = cc.instantiate(this.prefabParticle);
                let partts:Particle = node.getComponent('Particle');//node.addComponent('Shape') as Shape;
                let sprite:Sprite = node.getComponentInChildren('cc.Sprite');//node.addComponent('cc.Sprite') as Sprite;
                sprite._spriteFrame = ResourcesManager.instance.GetSprites(partinfo.spriteName);
                let spriteSize = new cc.Size(sprite._spriteFrame._rect.width,sprite._spriteFrame._rect.height);
                node.children[0].setContentSize(spriteSize);
                this.shapeNode.addChild(node);
                node.setScale(partinfo.scale,partinfo.scale,partinfo.scale);
                node.setPosition(partinfo.startPoint.x,partinfo.startPoint.y,0);
                
                partts.InitParticle(partinfo,this.currentLevelInfo.minMoveX,this.currentLevelInfo.maxMoveX,spriteSize);
                this.currentIndexShape++;
                this.currentParticleNode = node;

                this.UpdateShapeJoint();
                console.log("add shape " + this.currentIndexShape);
            }
            else
            {
                let partts:Particle = this.currentParticleNode.getComponent('Particle');
                
                if(partts.IsFinishMove())
                {
                    if(this.IsFirstPart())
                    {
                        this.deltaPartPosX = this.currentParticleNode.position.x - this.currentParticleNode.position.x;
                    }
                    this.currentParticleNode = null;
                }
            }
        }
    }

    UpdateShapeJoint()
    {
        if(this.currentIndexShape <= 1)
        {
            this.shapeHintNode.setPosition(-9999,-9999,0);
        }
        else
        {
            let partjoints:PartJoint[] = this.currentLevelInfo.partInfo[this.currentIndexShape-1].partJoints;
            this.currentJoint.UpdateStatus(partjoints);
            this.shapeHintNode.setPosition(this.currentJoint.GetCurrentJointPos());
        }
    }
    SwapShapeHint()
    {
        if(this.currentJoint.GoNextJoint())
        {
            this.shapeHintNode.setPosition(this.currentJoint.GetCurrentJointPos());
        }
    }

    DeleteShape()
    {
        if(this.currentParticleNode)
        {
            let prefabexplosion = ResourcesManager.instance.GetPrefabs("particle-explosion");
            if(prefabexplosion)
            {
                let nodeexplosion = cc.instantiate(prefabexplosion);
                this.shapeNode.addChild(nodeexplosion);
                nodeexplosion.setPosition(this.currentParticleNode.position);
            }
            this.currentParticleNode.removeFromParent();
            this.currentParticleNode.getComponent("Particle").DeleteShape();
            this.currentParticleNode = null;
        }
    }

    RestartLevel()
    {
        this.shapeNode.removeAllChildren();
        this.currentParticleNode = null;
        this.currentIndexShape = 0;
        this.textResult = 'FAILED';
        GameManager.instance.ResetTimeInGame();
        GameManager.instance.SwitchState(GAME_STATE.STATE_ACTION_PHASE);
        
        this.shapeHintNode = cc.instantiate(ResourcesManager.instance.GetPrefabs("particle-hint"));
        this.shapeNode.addChild(this.shapeHintNode);
        this.shapeHintNode.setPosition(-9999,-9999,0);
        this.numberMatchedPart = 0;
        this.currentJoint.ResetStatus();
    }

    CheckMatchedParticle(spriteName:string)
    {
        if(this.currentJoint.GetCurrentTargetSpriteName() == spriteName)
        {
            console.log('this shape is matched');
            this.numberMatchedPart ++;
        }
    }
    IsFirstPart()
    {
        return (this.currentIndexShape==1);
    }
    GetDeltaPartPosX()
    {
        return this.deltaPartPosX;
    }
    GetLimitedLinePosy()
    {
        return this.currentLevelInfo.limitedLinePosY;
    }
    GetReadyJointPos()
    {
        return this.currentJoint.GetReadyJoint();
    }
    PauseGame()
    {
        GameManager.instance.PauseGame();
    }

    ResumeGame()
    {
        GameManager.instance.ResumeGame();
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
