
import { _decorator, Component, Node } from 'cc';
const { ccclass, property } = _decorator;


export class ShapeInfo
{
    spriteName:string ='';
    scale:number=0;
    rotate:number=0;//0  normal, -1 : random rotate (0->270), 1: rotate 90, 2: rotate 180, 3: rotate 270
};

export class ShapeLevelInfo{
    levelName: string = '';
    timeFinish: number = 0;
    spriteNameFinished: string = '';
    normalSpeed:number = 0;
    moveSpeed:number = 0;
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
    
    LEVEL1:ShapeLevelInfo = {"levelName":"bambi","timeFinish" : 50,"normalSpeed":2,"moveSpeed":10,
                        "shapeInfo": [
                            {"spriteName":"1","scale":2,"rotate":0},
                            {"spriteName":"2","scale":2,"rotate":0},
                            {"spriteName":"3","scale":2,"rotate":1},
                            {"spriteName":"4","scale":2,"rotate":-1},
                            {"spriteName":"5","scale":2,"rotate":2},
                            {"spriteName":"6","scale":2,"rotate":-1},
                            {"spriteName":"7","scale":2,"rotate":3},
                            {"spriteName":"8","scale":2,"rotate":1},
                            {"spriteName":"9","scale":2,"rotate":-1},
                            {"spriteName":"10","scale":2,"rotate":-1}
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
