
import { _decorator, Component, Node,Vec2, CCLoader, Label, Vec3, Sprite, Prefab } from 'cc';
import GameManager, { GAME_STATE } from '../Manager/game-manager';
import { InputController } from '../Controller/input-controller';
import ResourcesManager from '../Manager/resource-manager';
import ShapeLevel, { ShapeInfo, ShapeLevelInfo } from './shape-level';
import Shape, {SHAPE_MOVE_TYPE} from './shape';
import RotateController, { ROTATE_TYPE } from '../Controller/rotate-controller';
const { ccclass, property } = _decorator;

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

    @property(cc.Node)
    backgroudNode:Node = null;

    @property(cc.Prefab)
    prefabShape: Prefab = null;

    timeLevelRemaining: number = 0;
    timeLevelLabel: Label = null;

    inputController:InputController = null;
    minMove: Vec2 = new Vec2(120,120);

    shapesNode:Node = null;
    currentShapeNode: Node = null;
    shapeNodeStarPos: Vec3 = new Vec3(0,300,0);
    shapeNodeTargetY: number = -300;
    shapeMoveX: number = 30;
    currentIndexShape: number = 0;

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
        this.shapesNode = GameManager.instance.GetAPNode().getChildByName("shapes");
        if(this.shapesNode == null)
        {
            this.shapesNode = new Node('shapes');
            GameManager.instance.GetAPNode().addChild(this.shapesNode);
        }
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
                        if(this.backgroudNode)
                        {
                            let bgsprite = this.backgroudNode.getComponentInChildren("cc.Sprite");
                            if(bgsprite)
                            {
                                bgsprite._spriteFrame = ResourcesManager.instance.GetSprites()["bg"];
                            }
                        }
                        GameManager.instance.SwitchState(GAME_STATE.STATE_ACTION_PHASE);
                    }
                }
                break;
            case GAME_STATE.STATE_ACTION_PHASE:
                {
                   if(this.timeLevelLabel)
                   {
                        this.timeLevelLabel.string = "" + Math.round(this.timeLevelRemaining);
                    }
                   this.timeLevelRemaining = this.currentLevelInfo.timeFinish -  GameManager.instance.GetTimeInAP();
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
        this.shapesNode.removeAllChildren();
        this.isLevelLoading = true;
        this.currentShapeNode = null;
        this.currentIndexShape = 0;
        this.currentLevelInfo = ShapeLevel.instance.LEVELDATA[this.currentLevelindex];
        ResourcesManager.instance.LoadSpritFolder("Textures/ShapeTheCurves/levels/"+this.currentLevelInfo.levelName);
        this.timeLevelRemaining = this.currentLevelInfo.timeFinish;
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
                    this.MoveShape(SHAPE_MOVE_TYPE.MOVE_RIGHT);
                }
                else
                {
                    //console.log("move left");
                    this.MoveShape(SHAPE_MOVE_TYPE.MOVE_LEFT);
                }
           }
           else
           {
                if( deltamove.y < 0 )
                {
                    //console.log("move down");
                    this.MoveShape(SHAPE_MOVE_TYPE.MOVE_DOWN);
                }
            
           }
           this.inputController.SetTouchStartToMove();
            
        }
    }

    MoveShape(mtype:SHAPE_MOVE_TYPE)
    {
        if(this.currentShapeNode)
        {
            let shapets = this.currentShapeNode.getComponent("Shape");
            shapets.MoveShape(mtype,this.shapeMoveX);
        }
    }
    
    UpdateGenerateShap()
    {
        if(this.currentIndexShape >= this.currentLevelInfo.shapeInfo.length || GameManager.instance.GetTimeInAP() > this.currentLevelInfo.timeFinish)
        {
            GameManager.instance.SwitchState(GAME_STATE.STATE_GAME_RESULT);
            let bg = GameManager.instance.GetResultNode();
            let bgsprite = bg.getChildByName('background')?.getComponentInChildren('cc.Sprite');
            bgsprite._spriteFrame = ResourcesManager.instance.GetSprites()['bg'];
        }
        else
        {
            let shapeinfo:ShapeInfo = this.currentLevelInfo.shapeInfo[this.currentIndexShape];
            if(this.currentShapeNode == null)
            {
                //let node = new Node();
                let node = cc.instantiate(this.prefabShape);
                let shapets:Shape = node.getComponent('Shape');//node.addComponent('Shape') as Shape;
                let rotatecontroller:RotateController = node.getComponent('RotateController');//node.addComponent('RotateController') as RotateController;
                let sprite:Sprite = node.getComponentInChildren('cc.Sprite');//node.addComponent('cc.Sprite') as Sprite;
                sprite._spriteFrame = ResourcesManager.instance.GetSprites()[shapeinfo.spriteName];
                this.shapesNode.addChild(node);
                node.setPosition(this.shapeNodeStarPos);
                node.setScale(new Vec3(shapeinfo.scale,shapeinfo.scale,shapeinfo.scale));
                rotatecontroller.SetTimeRotate(0.2);
                let rotate = shapeinfo.rotate>=0?shapeinfo.rotate:((Math.random()*10)%4);
                rotatecontroller.RotateToAngle(rotate*90,new Vec3(0,0,-1));
                shapets.SetRotateStatus(rotate);
                shapets.InitShape(this.shapeNodeTargetY,this.currentLevelInfo.normalSpeed,this.currentLevelInfo.moveSpeed);
                this.currentIndexShape++;
                this.currentShapeNode = node;
                console.log("add shape " + this.currentIndexShape);
            }
            else
            {
                let shapets:Shape = this.currentShapeNode.getComponent('Shape');
                if(shapets.IsFinishMove())
                {
                    this.currentShapeNode = null;
                }
            }
        }
    }
    RotateShape()
    {
        if(this.currentShapeNode)
        {
            let rotatecontroller:RotateController = this.currentShapeNode.getComponent('RotateController');
            if(rotatecontroller)
            {
                //rotatecontroller.SetTimeRotate(0.2);
                rotatecontroller.DoRotate(ROTATE_TYPE.F);
            }
        }
    }
    DeleteShape()
    {
        if(this.currentShapeNode)
        {
            this.currentShapeNode.removeFromParent();
            this.currentShapeNode.getComponent("Shape").DeleteShape();
            this.currentShapeNode = null;
        }
    }

    RestartLevel()
    {
        this.shapesNode.removeAllChildren();
        this.currentShapeNode = null;
        this.currentIndexShape = 0;
        GameManager.instance.ResetTimeInGame();
        GameManager.instance.SwitchState(GAME_STATE.STATE_ACTION_PHASE);
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
