
import { _decorator, Component, Node, Vec2, CCLoader, Vec3 } from 'cc';
import GameManager from '../Manager/game-manager';
const { ccclass, property } = _decorator;

@ccclass('InputController')
export class InputController extends Component {
    // [1]
    // dummy = '';

    // [2]
    // @property
    // serializableDummy = 0;

    private posTouchStart:Vec2 =new Vec2();
    private posTouchMove:Vec2 = new Vec2();
    private posTouchEnd:Vec2 = new Vec2();
    
    private isTouchMove: boolean = false;
    private isTouchEnd: boolean = true;
    private isTouchStart: boolean = false;
    
    timeDoubleTap:number = 0.35;

    touchSize: cc.Size = new cc.Size();
    canvasSize: cc.Size = new  cc.Size();
    canvasAnchor: Vec2 = new Vec2();

    nodePosition: Vec3 = new Vec3();

    timePreTouchStart: number = 0;
    timeCurrentTouchStart: number = 0;
    
    start () {
        // [3]
        let rootnode = cc.find('Canvas');
        this.canvasSize = rootnode.getContentSize();
        this.canvasAnchor = rootnode.getAnchorPoint();
        this.touchSize = this.node.getContentSize();
        this.touchSize.width *= this.node.getScale().x;
        this.touchSize.height *= this.node.getScale().y;

        console.log("node size: " + this.touchSize + " canvas size: " + this.canvasSize);
        this.node.on(cc.Node.EventType.TOUCH_START,this.onTouchStart,this);
        this.node.on(cc.Node.EventType.TOUCH_MOVE,this.onTouchMove,this);
        this.node.on(cc.Node.EventType.TOUCH_END,this.onTouchEnd,this);
    }

    update (deltaTime: number) {
         // [4]
    }

    SetTouchSize(tsize:cc.Size)
    {
        this.touchSize = tsize;
    }

    onTouchStart(event: cc.Event.EventTouch){
        let pos:Vec2 = this.GetRealPosTouch(event.getLocation());
        //console.log("-on touch start: " + event.getLocation() + " real pos: " + pos);
        if(this.IsOutTouchArea(pos))
        {
            return;
        }
        this.timePreTouchStart = this.timeCurrentTouchStart;
        this.timeCurrentTouchStart = GameManager.instance?.GetCurrentTime();
        this.isTouchStart = true;
        this.isTouchEnd = false;
        this.posTouchStart = pos;
        //console.log("-----------touch start: " + this.posTouchStart );//+ " t1: " + this.timePreTouchStart + " t2: " + this.timeCurrentTouchStart);
    }
    onTouchEnd(event: cc.Event.EventTouch){
        
        let pos:Vec2 = this.GetRealPosTouch(event.getLocation());
    
        this.isTouchMove = false;
        this.isTouchEnd = true;
        this.isTouchStart =false;
        if(this.IsOutTouchArea(pos))
        {
            return;
        }
        this.posTouchEnd = pos;
        //console.log("-----------touch end: " + this.posTouchEnd );
    }
    onTouchMove(event: cc.Event.EventTouch){
        let pos:Vec2 = this.GetRealPosTouch(event.getLocation());
        if(this.IsOutTouchArea(pos))
        {
            this.isTouchEnd = true;
            this.isTouchMove = false;
        }
        else
        {
            this.posTouchMove = pos;
            this.isTouchEnd = false;
            this.isTouchMove = true;
            //console.log("-----------touch move: " + this.posTouchMove);
        }
    }

    IsTouchEnd():boolean
    {
        return this.isTouchEnd;
    }

    IsTouchMove():boolean
    {
        return this.isTouchMove;
    }

    GetMoveVector():Vec2
    {
        let result: Vec2 = new Vec2(0,0);
        if(this.isTouchMove || this.isTouchEnd)
        {
            result.x = this.posTouchMove.x - this.posTouchStart.x;
            result.y = this.posTouchMove.y - this.posTouchStart.y;
        }
        return result;
    }

    private IsOutTouchArea(pos:Vec2):boolean
    {
        let worldpos  = this.node.worldPosition;
        if(pos.x <-this.touchSize.width/2
            || pos.x >this.touchSize.width/2)
        {
            return true;
        }
        if(pos.y <  - this.touchSize.height/2
            || pos.y > this.touchSize.height/2)
        {
             return true;
        }
        return false;
    }

    private GetRealPosTouch(pos:Vec2):Vec2
    {
        let result: Vec2 = new Vec2(pos.x,pos.y);
        if(this.canvasAnchor.x == 0.5)
        {
            result.x -= this.node.worldPosition.x;
        }
        if(this.canvasAnchor.y == 0.5)
        {
            result.y -= this.node.worldPosition.y;
        }
        return result;
    }

    IsDoubleTouch():boolean
    {
        if(this.timeCurrentTouchStart != this.timePreTouchStart)
        {
            let delta = (this.timeCurrentTouchStart-this.timePreTouchStart);
            return  delta< this.timeDoubleTap;
        }
        return false;
    }

    GetPosTouchStart():Vec2{
        return this.posTouchStart;
    }
    GetPosTouchMove():Vec2{
        return this.posTouchMove;
    }
    GetPosTouchEnd():Vec2{
        return this.posTouchEnd;
    }
    SetTouchStartToMove(){
        this.posTouchStart = this.posTouchMove;
        //console.log("posstart: " + this.posTouchStart)
    }
    SetNodePosition(pos:Vec3){
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
