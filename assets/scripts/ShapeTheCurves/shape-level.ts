
import { _decorator, Component, Node, Vec3, TiledUserNodeData } from 'cc';
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
    endPoint:PartPoint;
    partJoints: PartJoint[] = [];
    
    Clone():PartInfo
    {
        let partinfo = new PartInfo();
        partinfo.spriteName = this.spriteName;
        partinfo.scale = this.scale;
        partinfo.fallSpeed = this.fallSpeed;
        partinfo.moveSpeed = this.moveSpeed;
        partinfo.startPoint = new PartPoint();
        partinfo.startPoint.x = this.startPoint.x;
        partinfo.startPoint.y = this.startPoint.y;
        partinfo.endPoint = new PartPoint();
        partinfo.endPoint.x= this.endPoint.x;
        partinfo.endPoint.y = this.endPoint.y;
        partinfo.partJoints = [];
        for(let i = 0;i<this.partJoints.length;i++)
        {
            let partjoint = new PartJoint();
            partjoint.x = this.partJoints[i].x;
            partjoint.y = this.partJoints[i].y;
            partjoint.id = this.partJoints[i].id;
            partinfo.partJoints.push(partjoint);
        }
        return partinfo;
    }

    SetValue(partinfo:PartInfo)
    {
        this.spriteName = partinfo.spriteName;
        this.scale = partinfo.scale;
        this.fallSpeed = partinfo.fallSpeed;
        this.moveSpeed = partinfo.moveSpeed;
        this.startPoint.x = partinfo.startPoint.x;
        this.startPoint.y = partinfo.startPoint.y;
        this.endPoint.x = partinfo.endPoint.x;
        this.endPoint.y = partinfo.endPoint.y;
        this.partJoints = [];
        for(let i = 0;i<partinfo.partJoints.length;i++)
        {
            let partjoint = new PartJoint();
            partjoint.x = partinfo.partJoints[i].x;
            partjoint.y = partinfo.partJoints[i].y;
            partjoint.id = partinfo.partJoints[i].id;
            this.partJoints.push(partjoint);
        }
    }
};

export class ShapeLevelInfo{
    levelName: string = '';
    timeLimited: number = 0;
    targetMacthedParticle: number = 0;
    minMoveX:number = 0;
    maxMoveX:number = 0;
    limitedLinePosY: number = 0;
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
    
    LEVEL1:ShapeLevelInfo = {"levelName":"bambi","timeLimited": 50,"targetMacthedParticle":3,"minMoveX":40,"maxMoveX":50,"limitedLinePosY":-300,
                        "partInfo": [
                            {
                                "spriteName":"1","scale":1.5,"fallSpeed":2,"moveSpeed":10,"startPoint":{"x":0,"y":300},"endPoint":{"x":0,"y":300},
                                "partJoints": [
                                    {"x":-20,"y":-250,"id":"1;2"},
                                    {"x":-20,"y":-250,"id":"1;5"}
                                ]
                            },
                            {
                                "spriteName":"2","scale":1.5,"fallSpeed":2,"moveSpeed":10,"startPoint":{"x":0,"y":300},"endPoint":{"x":0,"y":300},
                                "partJoints": [
                                    {"x":-20,"y":-250,"id":"2;3"}
                                ]
                            },
                            {
                                "spriteName":"3","scale":1.5,"fallSpeed":2,"moveSpeed":10,"startPoint":{"x":0,"y":300},"endPoint":{"x":0,"y":300},
                                "partJoints": [
                                    {"x":-20,"y":-250,"id":"3;4"},
                                ]
                            },
                            {
                                "spriteName":"4","scale":1.5,"fallSpeed":2,"moveSpeed":10,"startPoint":{"x":0,"y":300},"endPoint":{"x":0,"y":300},
                                "partJoints": [
                                    {"x":-20,"y":-250,"id":"4;1"},
                                    {"x":-20,"y":-250,"id":"4;3"}
                                ]
                            },
                            {
                                "spriteName":"5","scale":1.5,"fallSpeed":2,"moveSpeed":10,"startPoint":{"x":0,"y":300},"endPoint":{"x":0,"y":300},
                                "partJoints": [
                                    {"x":-20,"y":-250,"id":"5;1"}
                                ]
                            },
                        ],
                    };
    LEVELDATA:ShapeLevelInfo[] = [this.LEVEL1];

    GetLevelInfos(index: number){
        let value = cc.sys.localStorage.getItem("SHAPETHECURVES_CURRENT_LEVEL");
        if(value && value.length > 0)
        {
            let levelinfos = JSON.parse(value);
            return levelinfos;
        }
        if(index < 0 || index >= this.LEVELDATA.length)
        {
            index = 0;
        }
        return this.LEVELDATA[index];
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
