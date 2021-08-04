
import { _decorator, Component, Node, Vec3, VerticalTextAlignment, CCLoader, Quat, toRadian } from 'cc';
const { ccclass, property } = _decorator;

export enum ROTATE_TYPE{
    NONE="",
    x = 'x',
    xa = 'x\'',
    y = 'y',
    ya = 'y\'',
    U = 'U',
    Ua = 'U\'',
    u = 'u',
    ua = 'u\'',
    D = 'D',
    Da = 'D\'',
    d = 'd',
    da = 'd\'',
    R = 'R',
    Ra = 'R\'',
    r = 'r',
    ra = 'r\'',
    L = 'L',
    La = 'L\'',
    l = 'l',
    la = 'l\'',
    B = 'B',
    Ba = 'B\'',
    b = 'b',
    ba = 'b\'',
    F = 'F',
    Fa ='F\'',
    f = 'f',
    fa = 'f\'',
    M = 'M',
    Ma = 'M\'',
    E = 'E',
    Ea = 'E\'',
    S = 'S',
    Sa = 'S\''
};

@ccclass('RotateController')
export default class RotateController extends Component {
    // [1]
    // dummy = '';

    // [2]
    // @property
    // serializableDummy = 0;

    timeRotateStart: number = 0;
    isRotate: boolean = false;
    timeRotate:number = 1;
    rorateAxis: Vec3 = new Vec3();
    rotateAngle: number = 90;

    targetAngle: Vec3 = new Vec3();
    targetQuat: Quat = new Quat();

    start () {
        // [3]
        this.timeRotateStart = 0;
        //this.rotateAngle = 90;
        //this.timeRotate = 1;
    }

    update (deltaTime: number) {
         // [4]
        if(this.isRotate)
        {
            this.timeRotateStart += deltaTime;

            if(this.timeRotateStart >= this.timeRotate)
            {
                this.isRotate = false;
                
                this.node.setRotation(this.targetQuat);
            }
            else
            {
                let tempQuat = new Quat();
                Quat.fromAxisAngle(tempQuat,this.rorateAxis,(this.rotateAngle/this.timeRotate)*deltaTime *(3.14159265/180));
                let nodeQuat = new Quat();
                let outQuat = new Quat();
                this.node.getRotation(nodeQuat);
                Quat.multiply(outQuat,tempQuat,nodeQuat);
                this.node.setRotation(outQuat);

            }
        }
    }
    DoRotate(type:ROTATE_TYPE):boolean
    {
        if(this.isRotate)
        {
            return false;
        }
        switch(type)
        {
            case ROTATE_TYPE.x:
            case ROTATE_TYPE.Ma:
            case ROTATE_TYPE.R:
            case ROTATE_TYPE.r:
            case ROTATE_TYPE.La:
            case ROTATE_TYPE.la:
                this.rorateAxis = new Vec3(-1,0,0);
                break;
            case ROTATE_TYPE.xa:
            case ROTATE_TYPE.M:
            case ROTATE_TYPE.Ra:
            case ROTATE_TYPE.ra:
            case ROTATE_TYPE.L:
            case ROTATE_TYPE.l:
                this.rorateAxis = new Vec3(1,0,0);
                break;
            case ROTATE_TYPE.y:
            case ROTATE_TYPE.U:
            case ROTATE_TYPE.u:
            case ROTATE_TYPE.Da:
            case ROTATE_TYPE.da:
            case ROTATE_TYPE.Ea:
                this.rorateAxis = new Vec3(0,-1,0);
                break;
            case ROTATE_TYPE.ya:
            case ROTATE_TYPE.Ua:
            case ROTATE_TYPE.ua:
            case ROTATE_TYPE.D:
            case ROTATE_TYPE.d:
            case ROTATE_TYPE.E:
                this.rorateAxis = new Vec3(0,1,0);
                break;
            case ROTATE_TYPE.F:
            case ROTATE_TYPE.f:
            case ROTATE_TYPE.Ba:
                this.rorateAxis = new Vec3(0,0,-1);
                break;
            case ROTATE_TYPE.Fa:
            case ROTATE_TYPE.fa:
            case ROTATE_TYPE.B:
                this.rorateAxis = new Vec3(0,0,1);
                break;
        }
        this.isRotate = true;
        this.timeRotateStart = 0;


        let tempQuat = new Quat();
        Quat.fromAxisAngle(tempQuat,this.rorateAxis,this.rotateAngle *(3.14159265/180));
        let nodeQuat = new Quat();
        this.node.getRotation(nodeQuat);
        Quat.multiply(this.targetQuat,tempQuat,nodeQuat);
        /*let cubeTs = this.node.getComponent("Cube");
        if(cubeTs != null)
            console.log("rotate : " + type + " i: " + cubeTs.GetCubeInfo().posi + " j: " + cubeTs.GetCubeInfo().posj + " k: " + cubeTs.GetCubeInfo().posk + " name: " + this.node.name);*/
        return true;
    }

    SetTimeRotate(time:number)
    {
        this.timeRotate = time;
    }

    RotateAround(axis:Vec3,angle:number)
    {
        let tempQuat = new Quat();
        Quat.fromAxisAngle(tempQuat,axis,angle *(3.14159265/180));
        let nodeQuat = new Quat();
        let outQuat = new Quat();
        this.node.getRotation(nodeQuat);
        Quat.multiply(outQuat,tempQuat,nodeQuat);
        this.node.setRotation(outQuat);
    }
    
    IsRotating():boolean
    {
        return this.isRotate;
    }

    SetRotateAngle(angle:number)
    {
        this.rotateAngle = angle;
    }
    RotateToAngle(angle:number,axis:Vec3)
    {
        if(angle == 0 )
            return;
        let tempQuat = new Quat();
        let outQuat = new Quat();
        Quat.fromAxisAngle(tempQuat,axis,angle *(3.14159265/180));
        let nodeQuat = new Quat();
        this.node.getRotation(nodeQuat);
        Quat.multiply(outQuat,tempQuat,nodeQuat);
        this.node.setRotation(outQuat);
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
