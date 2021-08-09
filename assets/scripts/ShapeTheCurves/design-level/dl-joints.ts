
import { _decorator, Component, Node } from 'cc';
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

    listPart:PartInfo[] = [];
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
    }

    UpdateSelect(name:string)
    {
        this.selectedJointName = name;
        console.log("DlJoints update button: " +  name);
        for(let i= 1;i<this.node.children.length;i++)
        {
            let child = this.node.children[i];
            if(child.name != name)
            {
                child.getComponent("ButtonLevel").SetSelectedButton(false);
            }
        }
        this.inputNode.active = true;
    }

    RemoveCurrent()
    {
        for(let i= 1;i<this.node.children.length;i++)
        {
            let child = this.node.children[i];
            if(child.name == this.selectedJointName)
            {
                this.selectedJointName = "";
                this.inputNode.active = false;
                child.destroy();
                break;
            }
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
