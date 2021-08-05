
import { _decorator, Component, Node, Vec3 } from 'cc';
const { ccclass, property } = _decorator;

export class ShapePoint
{
    x:number =0;
    y:number = 0;
    r:number = 0;//0  normal, -1 : random rotate (0->270), 1: rotate 90, 2: rotate 180, 3: rotate 270
};

export class ShapeInfo
{
    spriteName:string ='';
    scale:number=0;
    fallSpeed:number = 0;
    moveSpeed:number = 0;
    startPoint:ShapePoint;
    targetPoint:ShapePoint;
    hintPoint:ShapePoint;
};

export class ShapeLevelInfo{
    levelName: string = '';
    timeFinish: number = 0;
    minMoveX:number = 0;
    maxMoveX:number = 0;
    shapeInfo:ShapeInfo[] =[];
};

export default class ShapeLevel {
    private static _instance: ShapeLevel = null;

    static get instance() {
        if(ShapeLevel._instance == null) {
            ShapeLevel._instance = new ShapeLevel();
        }
        return ShapeLevel._instance;
    }
    
    LEVEL1:ShapeLevelInfo = {"levelName":"bambi","timeFinish": 50,"minMoveX":40,"maxMoveX":50,
                        "shapeInfo": [
                            {"spriteName":"1","scale":2,"fallSpeed":2,"moveSpeed":10,"startPoint":{"x":0,"y":300,"r":0},"targetPoint":{"x":-80,"y":-300,"r":0},"hintPoint":{"x":-80,"y":-300,"r":0}},
                            {"spriteName":"2","scale":2,"fallSpeed":2,"moveSpeed":10,"startPoint":{"x":0,"y":300,"r":0},"targetPoint":{"x":-37,"y":-300,"r":-1},"hintPoint":{"x":-9999,"y":-9999,"r":0}},
                            {"spriteName":"3","scale":2,"fallSpeed":2,"moveSpeed":10,"startPoint":{"x":0,"y":300,"r":1},"targetPoint":{"x":0,"y":-300,"r":0},"hintPoint":{"x":0,"y":-300,"r":0}},
                            {"spriteName":"4","scale":2,"fallSpeed":2,"moveSpeed":10,"startPoint":{"x":0,"y":300,"r":-1},"targetPoint":{"x":87,"y":-300,"r":0},"hintPoint":{"x":87,"y":-300,"r":0}},
                            {"spriteName":"5","scale":2,"fallSpeed":2,"moveSpeed":10,"startPoint":{"x":0,"y":300,"r":2},"targetPoint":{"x":127,"y":-300,"r":0},"hintPoint":{"x":127,"y":-300,"r":0}},
                            //{"spriteName":"6","scale":2,"fallSpeed":2,"moveSpeed":10,"startPoint":{"x":0,"y":300,"r":-1},"targetPoint":{"x":-80,"y":-300,"r":-1},"hintPoint":{"x":-80,"y":-9999,"r":0}},
                            //{"spriteName":"7","scale":2,"fallSpeed":2,"moveSpeed":10,"startPoint":{"x":0,"y":300,"r":3},"targetPoint":{"x":-105,"y":-300,"r":0},"hintPoint":{"x":-105,"y":-300,"r":0}},
                            //{"spriteName":"8","scale":2,"fallSpeed":2,"moveSpeed":10,"startPoint":{"x":0,"y":300,"r":1},"targetPoint":{"x":0,"y":-300,"r":0},"hintPoint":{"x":0,"y":-300,"r":0}},
                            //{"spriteName":"9","scale":2,"fallSpeed":2,"moveSpeed":10,"startPoint":{"x":0,"y":300,"r":-1},"targetPoint":{"x":-35,"y":-300,"r":0},"hintPoint":{"x":-35,"y":-300,"r":0}},
                            //{"spriteName":"10","scale":2,"fallSpeed":2,"moveSpeed":10,"startPoint":{"x":0,"y":300,"r":-1},"targetPoint":{"x":-121,"y":-300,"r":0},"hintPoint":{"x":-121,"y":-300,"r":0}}
                        ]
                    };
    LEVELDATA:ShapeLevelInfo[] = [this.LEVEL1];
   
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
