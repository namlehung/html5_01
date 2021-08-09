
import { _decorator, Component, Node } from 'cc';
import { PartInfo } from '../shape-level';
const { ccclass, property } = _decorator;

@ccclass('DlParticleEdit')
export class DlParticleEdit extends Component {
    // [1]
    // dummy = '';

    // [2]
    // @property
    // serializableDummy = 0;

    @property({type:cc.Prefab})
    prefabbuttonlevel: Prefab =null;

    listPart:PartInfo[] = [];
    selectedPartName:string = "";
    start () {
        // [3]
        
    }

    AddParticle()
    {

    }
    
    UpdateSelect(name:string)
    {
        this.selectedPartName = name;
        console.log("DlParticleEdit update button: " + name);
        this.spritesName.forEach(item =>{
            if(item != name)
            {
                this.node.getChildByName(item)?.getComponent("ButtonLevel").SetSelectedButton(false);
            }
        });
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
