
import { _decorator, Component, Node, Vec3 } from 'cc';
const { ccclass, property } = _decorator;

export class PartPoint
{
    x:number = 0;
    y:number = 0;
};

export class PartJoint
{
    x:number =0;
    y:number = 0;
    id:string = "";
};

export class PartInfo
{
    spriteName:string ='';
    scale:number=0;
    fallSpeed:number = 0;
    moveSpeed:number = 0;
    startPoint:PartPoint;
    partJoints: PartJoint[] = [];
};

export class ShapeLevelInfo{
    levelName: string = '';
    timeLimited: number = 0;
    targetMacthedParticle: number = 0;
    minMoveX:number = 0;
    maxMoveX:number = 0;
    limitedLinePosY: number = 0;
    firstPartPoint:PartPoint;
    partInfo:PartInfo[] =[];
};

export default class ShapeLevel {
    private static _instance: ShapeLevel = null;

    static get instance() {
        if(ShapeLevel._instance == null) {
            ShapeLevel._instance = new ShapeLevel();
        }
        return ShapeLevel._instance;
    }
    
    LEVEL1:ShapeLevelInfo = {"levelName":"bambi","timeLimited": 50,"targetMacthedParticle":3,"minMoveX":40,"maxMoveX":50,"limitedLinePosY":-300,"firstPartPoint":{"x":-100,"y":-300},
                        "partInfo": [
                            {
                                "spriteName":"1","scale":1.5,"fallSpeed":2,"moveSpeed":10,"startPoint":{"x":0,"y":300},
                                "partJoints": [
                                    {"x":-20,"y":-250,"id":"2"},
                                    {"x":-20,"y":-250,"id":"5"}
                                ]
                            },
                            {
                                "spriteName":"2","scale":1.5,"fallSpeed":2,"moveSpeed":10,"startPoint":{"x":0,"y":300},
                                "partJoints": [
                                    {"x":-20,"y":-250,"id":"2"},
                                    {"x":-20,"y":-250,"id":"3"}
                                ]
                            },
                            {
                                "spriteName":"3","scale":1.5,"fallSpeed":2,"moveSpeed":10,"startPoint":{"x":0,"y":300},
                                "partJoints": [
                                    {"x":-20,"y":-250,"id":"4"},
                                    {"x":-20,"y":-250,"id":"5"}
                                ]
                            },
                            {
                                "spriteName":"4","scale":1.5,"fallSpeed":2,"moveSpeed":10,"startPoint":{"x":0,"y":300},
                                "partJoints": [
                                    {"x":-20,"y":-250,"id":"1"},
                                    {"x":-20,"y":-250,"id":"2"}
                                ]
                            },
                            {
                                "spriteName":"5","scale":1.5,"fallSpeed":2,"moveSpeed":10,"startPoint":{"x":0,"y":300},
                                "partJoints": [
                                    {"x":-20,"y":-250,"id":"1"},
                                    {"x":-20,"y":-250,"id":"2"}
                                ]
                            },
                        ],
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
