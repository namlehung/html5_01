
import { _decorator, Component, Node, Vec2, Vec3, TERRAIN_HEIGHT_BASE } from 'cc';
import { PartInfo, PartJoint, PartPoint } from '../shape-level';
import DlExportleveljs from './dl-exportleveljs';
const { ccclass, property } = _decorator;

@ccclass('DlParticleEdit')
export default class DlParticleEdit extends Component {
    // [1]
    // dummy = '';

    // [2]
    // @property
    // serializableDummy = 0;

    @property({type:cc.Prefab})
    prefabbuttonlevel: Prefab =null;

    @property(Node)
    inputNode:Node = null;

    @property({type:cc.Prefab})
    prefabParticleNode: Prefab =null;

    @property(Node)
    inputScaleNode:Node = null;
    @property(Node)
    inputfallSpeedNode:Node = null;
    @property(Node)
    inputmoveSpeedNode:Node = null;
    @property(Node)
    inputPosxNode:Node = null;
    @property(Node)
    inputPosyNode:Node = null;

    @property(Node)
    nodeJoint:Node= null;


    listPart:PartInfo[] = [];
    selectedPartName:string = "";
    currentPartInfo:PartInfo[] = [];

    private static _instance:DlParticleEdit = null;
    static get instance(){
        return DlParticleEdit._instance;
    }
    
    onLoad()
    {
        DlParticleEdit._instance = this.node.getComponent("DlParticleEdit");
    }

    start () {
        // [3]
        if(this.inputNode && this.selectedPartName=="")
        {
            this.inputNode.active = false;
        }
    }

    AddParticle(name:string)
    {
        this.selectedPartName = name;
        let node = cc.instantiate(this.prefabbuttonlevel);
        node.getComponent("ButtonLevel").InitButton(name,"DlParticleEdit");
        node.name = name;
        this.node.addChild(node);
        let partinfo:PartInfo = new PartInfo();
        partinfo.startPoint = new PartPoint();
        partinfo.startPoint.x = 0;
        partinfo.startPoint.y = 300;
        partinfo.endPoint = new PartPoint();
        partinfo.endPoint.x = 0;
        partinfo.endPoint.y = 0;
        partinfo.spriteName = name;
        partinfo.scale = 1.5;
        partinfo.fallSpeed = 2;
        partinfo.moveSpeed = 10;
        this.currentPartInfo.push(partinfo);
        DlExportleveljs.instance.UpdatePartInfo(this.currentPartInfo);
    }

    ShowParticleInfo(partinfos:PartInfo[])
    {
        for(let i =0;i<partinfos.length;i++)
        {
            let name = partinfos[i].spriteName;
            let node = cc.instantiate(this.prefabbuttonlevel);
            node.getComponent("ButtonLevel").InitButton(name,"DlParticleEdit");
            node.name = name;
            this.node.addChild(node);
        }
        this.currentPartInfo = partinfos;
    }
    GetCurrentPartinfo()
    {
        let partinfo = null;
        for(let i = 0;i<this.currentPartInfo.length;i++)
        {
            partinfo = this.currentPartInfo[i];
            if(partinfo.spriteName == this.selectedPartName)
            {
                break;
            }
        }
        return partinfo;
    }

    UpdateCurrentPartinfo(partinfo:PartInfo)
    {
        for(let i = 0;i<this.currentPartInfo.length;i++)
        {
            if(partinfo.spriteName == this.currentPartInfo[i].spriteName)
            {
                this.currentPartInfo[i].scale = partinfo.scale;
                this.currentPartInfo[i].endPoint.x = partinfo.endPoint.x;
                this.currentPartInfo[i].endPoint.y = partinfo.endPoint.y;
                this.currentPartInfo[i].fallSpeed = partinfo.fallSpeed;
                this.currentPartInfo[i].moveSpeed = partinfo.moveSpeed;
            }
        }
        this.nodeJoint.getComponent("DlJoints").UpdateJointInfo(partinfo.partJoints);
        DlExportleveljs.instance.UpdatePartInfo(this.currentPartInfo);
    }
    UpdateJointInfo(partjoints:PartJoint[])
    {
        for(let i = 0;i<this.currentPartInfo.length;i++)
        {
            if(this.selectedPartName == this.currentPartInfo[i].spriteName)
            {
                this.currentPartInfo[i].partJoints = partjoints;
            }
        }
        DlExportleveljs.instance.UpdatePartInfo(this.currentPartInfo);
    }
    UpdateSelect(name:string)
    {
        this.selectedPartName = name;
        console.log("DlParticleEdit update button: " +  name);
        for(let i= 1;i<this.node.children.length;i++)
        {
            let child = this.node.children[i];
            if(child.name != name)
            {
                child.getComponent("ButtonLevel").SetSelectedButton(false);
            }
        }
        this.inputNode.active = true;
        this.UpdateDisplayCurrentPartinfo();
        this.nodeJoint.getComponent("DlJoints").ShowJointInfo();
    }

    UpdateDisplayCurrentPartinfo()
    {
        let partinfo:PartInfo = this.GetCurrentPartinfo();
        this.inputPosxNode.getComponent("cc.EditBox").string = "" + partinfo.endPoint.x;
        this.inputPosyNode.getComponent("cc.EditBox").string = "" + partinfo.endPoint.y;
        this.inputScaleNode.getComponent("cc.EditBox").string = "" + partinfo.scale;
        this.inputfallSpeedNode.getComponent("cc.EditBox").string = "" + partinfo.fallSpeed;
        this.inputmoveSpeedNode.getComponent("cc.EditBox").string = "" + partinfo.moveSpeed;
    }

    MoveCurrentUp()
    {
        let i= 1;
        for(;i<this.node.children.length;i++)
        {
            let child = this.node.children[i];
            if(child.name == this.selectedPartName)
            {
                if(i > 1)
                {
                    let temppos:Vec3 = new Vec3(child.position.x,child.position.y,child.position.z);
                    child.setPosition(new Vec3(this.node.children[i-1].position.x,this.node.children[i-1].position.y,this.node.children[i-1].position.z));
                    this.node.children[i-1].position =temppos;
                    let tempnode = this.node.children[i-1];
                    this.node.children[i-1] = this.node.children[i];
                    this.node.children[i] = tempnode;
                    break;
                }
            }
        }
        for(i= 0;i<this.currentPartInfo.length;i++)
        {
            if(this.currentPartInfo[i].spriteName == this.selectedPartName)
            {
                if(i>0)
                {
                    this.SwapPartInfo(i);
                }
            }
        }
    }
    MoveCurrentDown()
    {
        let i = 1;
        for(;i<this.node.children.length;i++)
        {
            let child = this.node.children[i];
            if(child.name == this.selectedPartName)
            {
                if(i + 1 <this.node.children.length)
                {
                    let temppos = new Vec3(child.position.x,child.position.y,child.position.z);
                    child.setPosition(new Vec3(this.node.children[i+1].position.x,this.node.children[i+1].position.y,this.node.children[i+1].position.z));
                    this.node.children[i+1].setPosition(temppos);
                    let tempnode = this.node.children[i+1];
                    this.node.children[i+1] = this.node.children[i];
                    this.node.children[i] = tempnode;
                    break;
                }
            }
        }
        for(i= 0;i<this.currentPartInfo.length;i++)
        {
            if(this.currentPartInfo[i].spriteName == this.selectedPartName)
            {
                if(i + 1 <this.currentPartInfo.length)
                {
                    this.SwapPartInfo(i+1);
                }
            }
        }
    }

    SwapPartInfo(index:number)
    {
        let parinfo = this.currentPartInfo[index].Clone();
        this.currentPartInfo[index].SetValue(this.currentPartInfo[index-1]);
        this.currentPartInfo[index-1].SetValue(parinfo);
    }

    RemoveCurrent()
    {
        let i= 1;
        let name = this.selectedPartName;
        for(;i<this.node.children.length;i++)
        {
            let child = this.node.children[i];
            if(child.name == this.selectedPartName)
            {
                this.selectedPartName = "";
                this.nodeJoint.getComponent("DlJoints").HideInputJoint();
                this.inputNode.active = false;
                child.destroy();
                break;
            }
        }

        for(i= 0;i<this.currentPartInfo.length;i++)
        {
            if(this.currentPartInfo[i].spriteName == name)
            {
                break;
            }
        }
        for(;i<this.currentPartInfo.length-1;i++)
        {
            this.currentPartInfo[i].SetValue(this.currentPartInfo[i+1]);
        }
        this.currentPartInfo.pop();
    }

    GetCurrentJointIndex()
    {
        return this.nodeJoint.getComponent("DlJoints").GetcurrentJointindex();
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
