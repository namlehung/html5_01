
import { _decorator, Component, Node } from 'cc';
import ResourcesManager from '../../Manager/resource-manager';
import DlParticleEdit from './dl-particle-edit';
const { ccclass, property } = _decorator;

@ccclass('DlSelectSprite')
export class DlSelectSprite extends Component {
    // [1]
    // dummy = '';

    // [2]
    // @property
    // serializableDummy = 0;

    @property({type:cc.Prefab})
    prefabbuttonlevel: Prefab =null;

    spritesName:string[] = [];
    start () {
        // [3]
    }

    Init()
    {
        this.spritesName = ResourcesManager.instance.GetArraySpriteName();
        let label = this.node.getChildByName("Label")?.getComponent("cc.Label");
        label.string = "select sprite";
        this.spritesName.forEach(item =>{
            let node = cc.instantiate(this.prefabbuttonlevel);
            node.getComponent("ButtonLevel").InitButton(item,"DlSelectSprite");
            node.name = item;
            this.node.addChild(node);
        });
       
    }

    UpdateSelect(name:string)
    {
        console.log("DlSelectSprite update button: " + name);
        this.spritesName.forEach(item =>{
            if(item != name)
            {
                this.node.getChildByName(item)?.getComponent("ButtonLevel").SetSelectedButton(false);
            }
        });
        DlParticleEdit.instance.AddParticle(name);
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
