
import { _decorator, Component, Node,Vec2, CCLoader, Label, Vec3, Sprite, Prefab, Size } from 'cc';
import GameManager, { GAME_STATE } from '../Manager/game-manager';
import { InputController } from '../Controller/input-controller';
import ResourcesManager from '../Manager/resource-manager';
import ShapeLevel, {  PartInfo, PartJoint, ShapeLevelInfo } from './shape-level';
import Particle, {PARTICLE_MOVE_TYPE} from './particle';
import ShapeDebugInfo from './shape-debug-info';
import ShapeSetting, { GAME_CONTROLL_TYPE } from './shape-setting';

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
        this.currentIndex = -1;
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
        let pos = new Vec3(this.arrayJoint[this.currentIndex].x,this.arrayJoint[this.currentIndex].y,0);
        return pos;
    }
    CheckMatchedTarget(spritename:string):boolean
    {
        let index = this.arrayJoint[this.currentIndex].id.indexOf(";");
        for(let i=0;i<this.arrayStatus.length;i++)
        {
            if(this.arrayStatus[i]== 1)
            {
                let matchedname = this.arrayJoint[this.currentIndex].id.substring(index+1);
                if(matchedname == spritename)
                {
                    this.arrayStatus[i] = 2;
                    return true;
                }
            }
        }
        return false;
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
        let i = this.currentIndex+1;
        for(;i<this.arrayStatus.length;i++)
        {
            if(this.arrayStatus[i]== 1)
            {
                this.currentIndex = i;
                return true;
            }
        }
        for(i = 0;i<this.currentIndex;i++)
        {
            if(this.arrayStatus[i]== 1)
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
    minDragToMove: Vec2 = new Vec2(120,120);

    shapeNode:Node = null;
    currentParticleNode: Node = null;
    shapeHintNode: Node = null;
    currentJoint:ShapeJointInfo = null;

    currentIndexShape: number = 0;
    deltaPartPosX: number = 0;
    deltaPartPosY: number = 0;
    numberMatchedPart:number = 0;
    isWrongPart:boolean = false;

    textResult: string = 'FAILED';

    isWaitingParticleDeleted:boolean = false;
    GameScreenSize:cc.Size = new Size(480,854);

    moveParticleStack:PARTICLE_MOVE_TYPE[] = [];
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
        this.inputController.SetTouchSize(new Size(480,700));
        this.inputController.SetDeltaTimeTouch([0.5,0.7,0.9,1.0,1.2,1.4]);
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
                    if(ResourcesManager.instance.IsLoadedSpriteFolder(this.currentLevelInfo.levelName) && ResourcesManager.instance.IsLoadedPrefabFolder("Effects"))
                    {
                        this.isLevelLoading = false;
                        
                        GameManager.instance.SwitchState(GAME_STATE.STATE_ACTION_PHASE);
                        let nodebgsprite:Node = GameManager.instance.GetAPNode().getChildByName('background-level').getChildByName("bg");
                        let bgsprite = nodebgsprite.getComponent("cc.Sprite");
                        if(bgsprite)
                        {
                            bgsprite._spriteFrame = ResourcesManager.instance.GetSprites("bg");
                            //nodebgsprite.setContentSize(this.GameScreenSize);
                        }
                        
                        this.shapeHintNode = cc.instantiate(ResourcesManager.instance.GetPrefabs("particle-hint"));
                        this.shapeNode.addChild(this.shapeHintNode);
                        this.shapeHintNode.setPosition(-9999,-9999,0);
                        this.UpdateDebugDisplay();
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
                   this.UpdateMoveParticle();
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
        let movetype = PARTICLE_MOVE_TYPE.NONE;
        if(ShapeSetting.instance.GetGameControllType() == GAME_CONTROLL_TYPE.DRAG)
        {
            let deltamove = this.inputController.GetMoveVector();
            if(Math.abs(deltamove.x) > this.minDragToMove.x || Math.abs(deltamove.y) > this.minDragToMove.y)
            {
            // console.log("deltamove: " + deltamove);
                if(Math.abs(deltamove.x) > Math.abs(deltamove.y))
                {
                    if( deltamove.x > 0 )
                    {
                        //console.log("move right");
                        movetype = PARTICLE_MOVE_TYPE.MOVE_RIGHT;
                    }
                    else
                    {
                        //console.log("move left");
                        movetype = PARTICLE_MOVE_TYPE.MOVE_LEFT;
                    }
                }
                else
                {
                    if( deltamove.y < 0 )
                    {
                        //console.log("move down");
                        movetype = PARTICLE_MOVE_TYPE.MOVE_DOWN;
                    }
                
                }
                this.inputController.SetTouchStartToMove();
                
            }
        }
        else if(ShapeSetting.instance.GetGameControllType() == GAME_CONTROLL_TYPE.TAP)
        {
            if(this.inputController.IsTouchOnDeltaTime())
            {
                let pos = this.inputController.GetPosTouchStart();
                if(pos.y > -100)
                {
                    if(pos.x > 0)
                    {
                        movetype = PARTICLE_MOVE_TYPE.MOVE_RIGHT;
                    }
                    else
                    {
                        movetype = PARTICLE_MOVE_TYPE.MOVE_LEFT;
                    }
                }
                else
                {
                    movetype = PARTICLE_MOVE_TYPE.MOVE_DOWN;
                }
            }
        }
        this.MoveParticle(movetype);
    }

    MoveParticle(mtype:PARTICLE_MOVE_TYPE)
    {
        if(mtype == PARTICLE_MOVE_TYPE.NONE)
        {
            return;
        }
        this.moveParticleStack.push(mtype);
    }
    UpdateMoveParticle()
    {
        if(this.currentParticleNode)
        {
            if(this.moveParticleStack.length > 0)
            {
                let partts:Particle = this.currentParticleNode.getComponent("Particle");
                if(partts.IsPartMoving() == false)
                {
                    console.log("move particle");
                    let mtype = this.moveParticleStack.shift();
                    partts.MoveParticle(mtype);
                }
                 
            }
        }
    }
    UpdateGenerateShap()
    {
        if((this.isWrongPart) || this.currentIndexShape > this.currentLevelInfo.partInfo.length || GameManager.instance.GetTimeInAP() > this.currentLevelInfo.timeLimited)
        {
            if(this.isWrongPart && ShapeDebugInfo.instance.IsEnable() && ShapeDebugInfo.instance.IsIgnoreMatchedPart() 
            && this.currentIndexShape <= this.currentLevelInfo.partInfo.length
            && GameManager.instance.GetTimeInAP() <= this.currentLevelInfo.timeLimited)
            {
                //console.log("debug ignore check matched part");
            }
            else
            {
                GameManager.instance.SwitchState(GAME_STATE.STATE_GAME_RESULT);
                let bg = GameManager.instance.GetResultNode();
                let bgsprite = bg.getChildByName('background')?.getComponentInChildren('cc.Sprite');
                bgsprite._spriteFrame = ResourcesManager.instance.GetSprites('bg');
                
                if(this.isWrongPart == false)//this.numberMatchedPart == this.currentLevelInfo.targetMacthedParticle)
                {
                    this.textResult = 'Congratulation!';
                }
                this.moveParticleStack=[];
                return;
            }
        }
        //else
        {
            if(this.currentParticleNode == null && this.isWaitingParticleDeleted == false)
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
                let nodesprite = node.children[0];
                let sprite:Sprite = nodesprite.getComponent('cc.Sprite');//node.addComponent('cc.Sprite') as Sprite;
                sprite._spriteFrame = ResourcesManager.instance.GetSprites(partinfo.spriteName);
                let spriteSize = new cc.Size(sprite._spriteFrame._rect.width,sprite._spriteFrame._rect.height);
                nodesprite.setContentSize(spriteSize);
                if(ShapeDebugInfo.instance.IsEnable() && ShapeDebugInfo.instance.IsShowPartDebugLine())
                {
                    if(nodesprite.children.length>0)
                    {
                        nodesprite.children[0].active = true;
                        nodesprite.children[0].children[0].setPosition(1 - spriteSize.width/2,0,0);
                        nodesprite.children[0].children[1].setPosition(spriteSize.width/2 - 1,0,0);
                    }
                }
                this.shapeNode.addChild(node);
                node.setScale(partinfo.scale,partinfo.scale,partinfo.scale);
                node.setPosition(partinfo.startPoint.x,partinfo.startPoint.y,0);

                spriteSize.width = spriteSize.width*partinfo.scale;
                spriteSize.height = spriteSize.height*partinfo.scale;
                partts.InitParticle(partinfo,this.currentLevelInfo.minMoveX,this.currentLevelInfo.maxMoveX,spriteSize);

                this.UpdateShapeJoint();

                this.currentIndexShape++;
                this.currentParticleNode = node;
                this.isWrongPart = false;

                
                console.log("add shape " + this.currentIndexShape);
            }
            else
            {
                if(this.isWaitingParticleDeleted == false)
                {
                    let partts:Particle = this.currentParticleNode.getComponent('Particle');
                    
                    if(partts.IsFinishMove())
                    {
                        if(this.IsFirstPart())
                        {
                            this.deltaPartPosX = this.currentParticleNode.position.x - this.currentLevelInfo.partInfo[0].endPoint.x;
                            this.deltaPartPosY = this.currentParticleNode.position.y - this.currentLevelInfo.partInfo[0].endPoint.y;
                        }
                        if(ShapeDebugInfo.instance.IsEnable() && ShapeDebugInfo.instance.IsShowPartDebugLine())
                        {
                            let nodesprite = this.currentParticleNode.children[0];
                            if(nodesprite.children.length>0)
                            {
                                nodesprite.children[0].active = false;
                            }
                        }
                        this.currentParticleNode = null;
                        this.moveParticleStack = [];
                    }
                }
            }
        }
    }

    UpdateShapeJoint()
    {
        if(this.currentIndexShape < 1)
        {
            this.shapeHintNode.setPosition(-9999,-9999,0);
        }
        else
        {
            let partjoints:PartJoint[] = this.currentLevelInfo.partInfo[this.currentIndexShape-1].partJoints;
            this.currentJoint.UpdateStatus(partjoints);
            this.SwapShapeHint();
            //let pos = this.currentJoint.GetCurrentJointPos();
            //this.shapeHintNode.setPosition(pos.x + this.deltaPartPosX,pos.y + this.deltaPartPosY,0);
        }
    }
    SwapShapeHint()
    {
        if(this.currentJoint.GoNextJoint())
        {
            let pos = this.currentJoint.GetCurrentJointPos();
            this.shapeHintNode.setPosition(pos.x + this.deltaPartPosX,pos.y+this.deltaPartPosY,0);
        }
    }
    FinishedWaitParticleDeleted()
    {
        ShapeManager.instance.isWaitingParticleDeleted = false;
    }
    DeleteShape()
    {
        if(this.currentParticleNode)
        {
            this.isWaitingParticleDeleted = true;
            let prefabexplosion = ResourcesManager.instance.GetPrefabs("particle-explosion");
            if(prefabexplosion)
            {
                let nodeexplosion = cc.instantiate(prefabexplosion);
                this.shapeNode.addChild(nodeexplosion);
                nodeexplosion.setPosition(this.currentParticleNode.position);
                nodeexplosion.getComponentInChildren("DestroysEffect")?.AddCallBack(this.FinishedWaitParticleDeleted);
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
        this.isWrongPart = false;
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

    CheckMatchedParticle(spriteName:string):boolean
    {
        if(this.IsFirstPart() || this.currentJoint.CheckMatchedTarget(spriteName))
        {
            console.log('this shape is matched');
            this.numberMatchedPart ++;
            return true;
        }
        //else
        {
            this.isWrongPart = true;
            return false;
        }
    }

    UpdateDebugDisplay()
    {
       let node:Node =  GameManager.instance.GetAPNode().getChildByName('background-level').getChildByName("linelimited");
       if(node)
       {
           node.setPosition(0,this.currentLevelInfo.limitedLinePosY,0);
           if( ShapeDebugInfo.instance.IsShowLinitedLine() == true && ShapeDebugInfo.instance.IsEnable())
            {
                node.active = true;
            }
            else
            {
                node.active = false;
            }
       }
       if(ShapeDebugInfo.instance.IsEnable())
       {
           if(this.currentParticleNode)
           {
                let nodesprite = this.currentParticleNode.children[0];
                if(nodesprite.children.length>0)
                {
                    nodesprite.children[0].active = ShapeDebugInfo.instance.IsShowPartDebugLine();
                }
            }
       }
    }
    UpdateDebugInfo(event: any,customdata:string)
    {
        let debugnode = GameManager.instance.GetIGMNode().getChildByName("debug");
        if(customdata == "partline")
        {
            if(debugnode)
            {
               ShapeDebugInfo.instance.SetShowPartLine(debugnode.getChildByName("TogglepartLine")?.getComponent("cc.Toggle").isChecked);
            }
        }
        else if(customdata == "linelimited")
        {
            if(debugnode)
            {
               ShapeDebugInfo.instance.SetShowLineLimited(debugnode.getChildByName("Toggleline")?.getComponent("cc.Toggle").isChecked);
            }
        }
        else if(customdata == "ignorematched")
        {
            if(debugnode)
            {
               ShapeDebugInfo.instance.SetIgnoreMatched(debugnode.getChildByName("Toggleingorematchedpart")?.getComponent("cc.Toggle").isChecked);
            }
        }
    }
    OnSettingToggleTouch(event:any)
    {
        if(event.node.name == "drag")
        {
            console.log("setting drag to move");
            ShapeSetting.instance.SetGameControllType(GAME_CONTROLL_TYPE.DRAG);
            ShapeSetting.instance.SaveSetting();
        }
        else  if(event.node.name == "tap")
        {
            console.log("setting tap to move");
            ShapeSetting.instance.SetGameControllType(GAME_CONTROLL_TYPE.TAP);
            ShapeSetting.instance.SaveSetting();
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
    GetDeltaPartPosY()
    {
        return this.deltaPartPosY;
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
        let nodeIGM = GameManager.instance.GetIGMNode();
        let debugnode = nodeIGM.getChildByName("debug");
        if(debugnode)
        {
            debugnode.active = ShapeDebugInfo.instance.IsEnable();
        }
        let togglenode:Node = nodeIGM.getChildByName("tapcontroll").getChildByName("controllgroup");
        if(ShapeSetting.instance.GetGameControllType()==GAME_CONTROLL_TYPE.TAP)
        {
            togglenode.getChildByName("drag").getComponent("cc.Toggle").isChecked = false;
            togglenode.getChildByName("tap").getComponent("cc.Toggle").isChecked = true;
        }
        GameManager.instance.PauseGame();
    }

    ResumeGame()
    {
        this.UpdateDebugDisplay();
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
