
import { _decorator, Component, Node, Vec3 } from 'cc';
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

    @property(Node)
    hintNode:Node = null;

    listJoint:PartJoint[] = [];
    selectedJointName:string = "";
    currentCount:number = 1;
    start () {
        // [3]
        if(this.inputNode && this.selectedJointName=="")
        {
            this.inputNode.active = false;
            this.hintNode.setPosition(-9999,0,0);
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
        this.inputJointposy.getComponent("cc.EditBox").string = ""+joint.y;
        this.inputJointtarget.getComponent("cc.EditBox").string = joint.id;
        DlParticleEdit.instance.UpdateJointInfo(this.listJoint);
        this.inputNode.active = true;
        this.hintNode.setPosition(joint.x,joint.y,0);
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
        this.inputJointposy.getComponent("cc.EditBox").string = ""+joint.y;
        this.inputJointtarget.getComponent("cc.EditBox").string = joint.id;
        this.inputNode.active = true;
        this.hintNode.setPosition(joint.x,joint.y,0);
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
                this.hintNode.setPosition(-9999,0,0);
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
        this.hintNode.setPosition(-9999,0,0);
    }

    ShowJointInfo()
    {
        this.listJoint = DlParticleEdit.instance.GetCurrentPartinfo().partJoints;
        this.selectedJointName = "";
        this.inputNode.active = false;
        this.hintNode.setPosition(-9999,0,0);
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
       let index = this.GetcurrentJointindex();
        if(index>=0){
            this.hintNode.setPosition(this.listJoint[index].x,this.listJoint[index].y,0);
        }
    }
    GetcurrentJointindex()
    {
        let index = -1;
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
    UnselectCurrentJoint()
    {
        this.selectedJointName = "";
        this.inputNode.active = false;
        this.hintNode.setPosition(-9999,0,0);
    }
    GetHintNode():Node
    {
        if(this.selectedJointName=="")
        {
            return null;
        }
        return this.hintNode;
    }
    UpdateCurrentJointPos(pos:Vec3)
    {
        this.inputJointposx.getComponent("cc.EditBox").string = ""+pos.x;
        this.inputJointposy.getComponent("cc.EditBox").string = ""+pos.y;
        let index = this.GetcurrentJointindex();
        if(index>=0){
            this.listJoint[index].x = pos.x;
            this.listJoint[index].y = pos.y;
        }
        DlParticleEdit.instance.UpdateJointInfo(this.listJoint);
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
