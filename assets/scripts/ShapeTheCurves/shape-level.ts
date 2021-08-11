
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
    
    /*Clone():PartInfo
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
    }*/
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
    
    LEVEL1:ShapeLevelInfo = {
        "levelName": "bambi",
        "timeLimited": 50,
        "targetMacthedParticle": 0,
        "minMoveX": 40,
        "maxMoveX": 0,
        "limitedLinePosY": -210,
        "partInfo": [{
            "spriteName": "1",
            "scale": 1.5,
            "fallSpeed": 2,
            "moveSpeed": 10,
            "startPoint": {
                "x": 0,
                "y": 300
            },
            "endPoint": {
                "x": -147,
                "y": -136
            },
            "partJoints": [{
                "x": -148,
                "y": -87,
                "id": "1;5"
            }, {
                "x": -126,
                "y": -74,
                "id": "1;2"
            }]
        }, {
            "spriteName": "5",
            "scale": 1.5,
            "fallSpeed": 2,
            "moveSpeed": 10,
            "startPoint": {
                "x": 0,
                "y": 300
            },
            "endPoint": {
                "x": -121,
                "y": -30
            },
            "partJoints": [{
                "x": -93,
                "y": 26,
                "id": "5;6"
            }]
        }, {
            "spriteName": "6",
            "scale": 1.5,
            "fallSpeed": 2,
            "moveSpeed": 10,
            "startPoint": {
                "x": 0,
                "y": 300
            },
            "endPoint": {
                "x": -57,
                "y": 54
            },
            "partJoints": [{
                "x": -32,
                "y": 81,
                "id": "6;7"
            }]
        }, {
            "spriteName": "7",
            "scale": 1.5,
            "fallSpeed": 2,
            "moveSpeed": 10,
            "startPoint": {
                "x": 0,
                "y": 300
            },
            "endPoint": {
                "x": -35,
                "y": 118
            },
            "partJoints": [{
                "x": -4,
                "y": 141,
                "id": "7;8"
            }]
        }, {
            "spriteName": "8",
            "scale": 1.5,
            "fallSpeed": 2,
            "moveSpeed": 10,
            "startPoint": {
                "x": 0,
                "y": 300
            },
            "endPoint": {
                "x": 24,
                "y": 124
            },
            "partJoints": [{
                "x": 45,
                "y": 83,
                "id": "8;9"
            }]
        }, {
            "spriteName": "9",
            "scale": 1.5,
            "fallSpeed": 2,
            "moveSpeed": 10,
            "startPoint": {
                "x": 0,
                "y": 300
            },
            "endPoint": {
                "x": 36,
                "y": 40
            },
            "partJoints": [{
                "x": 33,
                "y": -4,
                "id": "9;10"
            }]
        }, {
            "spriteName": "10",
            "scale": 1.5,
            "fallSpeed": 2,
            "moveSpeed": 10,
            "startPoint": {
                "x": 0,
                "y": 300
            },
            "endPoint": {
                "x": 21,
                "y": -44
            },
            "partJoints": [{
                "x": -4,
                "y": -43,
                "id": "10;11"
            }, {
                "x": 42,
                "y": -85,
                "id": "10;4"
            }]
        }, {
            "spriteName": "2",
            "scale": 1.5,
            "fallSpeed": 2,
            "moveSpeed": 10,
            "startPoint": {
                "x": 0,
                "y": 300
            },
            "endPoint": {
                "x": -96,
                "y": -138
            },
            "partJoints": []
        }, {
            "spriteName": "11",
            "scale": 1.5,
            "fallSpeed": 2,
            "moveSpeed": 10,
            "startPoint": {
                "x": 0,
                "y": 300
            },
            "endPoint": {
                "x": -19,
                "y": -63
            },
            "partJoints": [{
                "x": -48,
                "y": -41,
                "id": "11;12"
            }, {
                "x": -20,
                "y": -86,
                "id": "11;2"
            }, {
                "x": 7,
                "y": -88,
                "id": "11;2"
            }]
        }, {
            "spriteName": "12",
            "scale": 1.5,
            "fallSpeed": 2,
            "moveSpeed": 10,
            "startPoint": {
                "x": 0,
                "y": 300
            },
            "endPoint": {
                "x": -75.5,
                "y": -62
            },
            "partJoints": []
        }, {
            "spriteName": "3",
            "scale": 1.5,
            "fallSpeed": 2,
            "moveSpeed": 10,
            "startPoint": {
                "x": 0,
                "y": 300
            },
            "endPoint": {
                "x": 12,
                "y": -147
            },
            "partJoints": []
        }, {
            "spriteName": "4",
            "scale": 1.5,
            "fallSpeed": 2,
            "moveSpeed": 10,
            "startPoint": {
                "x": 0,
                "y": 300
            },
            "endPoint": {
                "x": 58,
                "y": -139
            },
            "partJoints": []
        }]
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

    ClonePartInfo(inputPartInfo:PartInfo):PartInfo
    {
        let partinfo = new PartInfo();
        partinfo.spriteName = inputPartInfo.spriteName;
        partinfo.scale = inputPartInfo.scale;
        partinfo.fallSpeed = inputPartInfo.fallSpeed;
        partinfo.moveSpeed = inputPartInfo.moveSpeed;
        partinfo.startPoint = new PartPoint();
        partinfo.startPoint.x = inputPartInfo.startPoint.x;
        partinfo.startPoint.y = inputPartInfo.startPoint.y;
        partinfo.endPoint = new PartPoint();
        partinfo.endPoint.x= inputPartInfo.endPoint.x;
        partinfo.endPoint.y = inputPartInfo.endPoint.y;
        partinfo.partJoints = [];
        for(let i = 0;i<inputPartInfo.partJoints.length;i++)
        {
            let partjoint = new PartJoint();
            partjoint.x = inputPartInfo.partJoints[i].x;
            partjoint.y = inputPartInfo.partJoints[i].y;
            partjoint.id = inputPartInfo.partJoints[i].id;
            partinfo.partJoints.push(partjoint);
        }
        return partinfo;
    }

    CopyPartInfoValue(partinfo:PartInfo,outPartInfo:PartInfo)
    {
        outPartInfo.spriteName = partinfo.spriteName;
        outPartInfo.scale = partinfo.scale;
        outPartInfo.fallSpeed = partinfo.fallSpeed;
        outPartInfo.moveSpeed = partinfo.moveSpeed;
        outPartInfo.startPoint.x = partinfo.startPoint.x;
        outPartInfo.startPoint.y = partinfo.startPoint.y;
        outPartInfo.endPoint.x = partinfo.endPoint.x;
        outPartInfo.endPoint.y = partinfo.endPoint.y;
        outPartInfo.partJoints = [];
        for(let i = 0;i<partinfo.partJoints.length;i++)
        {
            let partjoint = new PartJoint();
            partjoint.x = partinfo.partJoints[i].x;
            partjoint.y = partinfo.partJoints[i].y;
            partjoint.id = partinfo.partJoints[i].id;
            outPartInfo.partJoints.push(partjoint);
        }
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
