
import { _decorator, Component, Node } from 'cc';
import DlParticleEdit from './dl-particle-edit';
const { ccclass, property } = _decorator;

@ccclass('DlParticleNode')
export class DlParticleNode extends Component {
    // [1]
    // dummy = '';

    // [2]
    // @property
    // serializableDummy = 0;

    rectNode:Node = null;
    isSelected:boolean = false;
    start () {
        // [3]
    }

    UpdateSelected(isselected:boolean)
    {
        this.isSelected = isselected;
        if(this.rectNode == null)
        {
            this.rectNode = this.node.children[0].children[0];
            let sizew = this.node.children[0].getComponent("cc.Sprite")._spriteFrame._rect.width;
            let sizeh = this.node.children[0].getComponent("cc.Sprite")._spriteFrame._rect.height;

            this.rectNode.children[0].setContentSize(1,sizeh);
            this.rectNode.children[0].setPosition(-sizew/2,0,0);

            this.rectNode.children[1].setContentSize(1,sizeh);
            this.rectNode.children[1].setPosition(sizew/2,0,0);
            
            this.rectNode.children[2].setContentSize(sizew,1);
            this.rectNode.children[2].setPosition(0,-sizeh/2,0);

            this.rectNode.children[3].setContentSize(sizew,1);
            this.rectNode.children[3].setPosition(0,sizeh/2,0);
        }
        this.rectNode.active = this.isSelected;
    }
    update (deltaTime: number) {
    //     // [4]
        if(DlParticleEdit.instance.selectedPartName == this.node.name)
        {
            this.UpdateSelected(true);
        }
        else
        {
            this.UpdateSelected(false);
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
