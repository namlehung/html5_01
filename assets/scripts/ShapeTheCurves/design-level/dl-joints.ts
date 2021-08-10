
import { _decorator, Component, Node } from 'cc';
import { PartJoint } from '../shape-level';
import DlParticleEdit from './dl-particle-edit';
const { ccclass, property } = _decorator;

@ccclass('DlJoints')
export class DlJoints extends Component {
    // [1]
    // dummy = '';

    // [2]
    // @property
    // serializableDummy = 0;

    @property({type:cc.Prefab})
    prefabbuttonlevel: Prefab =null;

    @property(Node)
    inputNode:Node = null;


    @property(Node)
    inputJointposx:Node = null;
    @property(Node)
    inputJointposy:Node = null;
    @property(Node)
    inputJointtarget:Node = null;

    listJoint:PartJoint[] = [];
    selectedJointName:string = "";
    currentCount:number = 1;
    start () {
        // [3]
        if(this.inputNode && this.selectedJointName=="")
        {
            this.inputNode.active = false;
        }
    }

    AddJoint()
    {
        this.selectedJointName = "joint" + this.currentCount;
        this.currentCount ++;
        let node = cc.instantiate(this.prefabbuttonlevel);
        node.getComponent("ButtonLevel").InitButton(this.selectedJointName,"DlJoints");
        node.name = this.selectedJointName;
        this.node.addChild(node);
        let joint = new PartJoint();
        joint.x = 0;
        joint.y = 0;
        joint.id = DlParticleEdit.instance.GetCurrentPartinfo().spriteName + ";";
        this.listJoint.push(joint);
        this.inputJointposx.getComponent("cc.EditBox").string = ""+joint.x;
        this.inputJointposy.getComponent("cc.EditBox").string = ""+joint.x;
        this.inputJointtarget.getComponent("cc.EditBox").string = joint.id;
        DlParticleEdit.instance.UpdateJointInfo(this.listJoint);
        this.inputNode.active = true;
    }

    UpdateSelect(name:string)
    {
        this.selectedJointName = name;
        console.log("DlJoints update button: " +  name);
        let index = 0;
        for(let i= 1;i<this.node.children.length;i++)
        {
            let child = this.node.children[i];
            if(child.name != name)
            {
                child.getComponent("ButtonLevel").SetSelectedButton(false);
            }
            else
            {
                index = i;
            }
        }
        let joint = this.listJoint[index -1];
        this.inputJointposx.getComponent("cc.EditBox").string = ""+joint.x;
        this.inputJointposy.getComponent("cc.EditBox").string = ""+joint.x;
        this.inputJointtarget.getComponent("cc.EditBox").string = joint.id;
        this.inputNode.active = true;
    }

    RemoveCurrent()
    {
        let name = this.selectedJointName;
        let index = 0;
        let i= 1;
        for(;i<this.node.children.length;i++)
        {
            let child = this.node.children[i];
            if(child.name == this.selectedJointName)
            {
                this.selectedJointName = "";
                this.inputNode.active = false;
                child.destroy();
                index = i-1;
                break;
            }
        }
    
        for(i=index;i<this.listJoint.length-1;i++)
        {
            this.listJoint[i].x = this.listJoint[i+1].x;
            this.listJoint[i].y = this.listJoint[i+1].y;
            this.listJoint[i].id = this.listJoint[i+1].id;
        }
        this.listJoint.pop();
        DlParticleEdit.instance.UpdateJointInfo(this.listJoint);
    }

    HideInputJoint()
    {
        this.inputNode.active = false;
    }

    ShowJointInfo()
    {
        this.listJoint = DlParticleEdit.instance.GetCurrentPartinfo().partJoints;
        this.selectedJointName = "";
        this.inputNode.active = false;
        this.currentCount = 0;

        let l = this.node.children.length-1;
        for(;l>=1;l--)
        {
            let child = this.node.children[l];
            child.removeFromParent();
            child.destroy();
        }
        for(let i = 0;i<this.listJoint.length;i++)
        {
            let name = "joint" + this.currentCount;
            let node = cc.instantiate(this.prefabbuttonlevel);
            node.getComponent("ButtonLevel").InitButton(name,"DlJoints");
            node.name = name;
            this.currentCount++;
            this.node.addChild(node);
        }
    }


    UpdateJointInfo(partjoints:PartJoint[])
    {
       this.listJoint = partjoints;
    }
    GetcurrentJointindex()
    {
        let index = 0;
        for(let i= 1;i<this.node.children.length;i++)
        {
            let child = this.node.children[i];
            if(child.name == this.selectedJointName)
            {
                index = i -1;
            }
        }
        return index;
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
