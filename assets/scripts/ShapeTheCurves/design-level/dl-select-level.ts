
import { _decorator, Component, Node, Prefab, CCLoader } from 'cc';
import ResourcesManager from '../../Manager/resource-manager';
const { ccclass, property } = _decorator;

@ccclass('DlSelectLevel')
export class DlSelectLevel extends Component {
    // [1]
    // dummy = '';

    // [2]
    // @property
    // serializableDummy = 0;

    @property({type:cc.Prefab})
    prefabbuttonlevel: Prefab =null;

    @property(Node)
    selectSpriteNode: Node = null;

    isLoadSprite:boolean = false;

    levels:string[] = ["bambi"];
    start () {
        // [3]
        
        this.levels.forEach(item =>{
            let node = cc.instantiate(this.prefabbuttonlevel);
            node.getComponent("ButtonLevel").InitButton(item,"DlSelectLevel");
            node.name = item;
            this.node.addChild(node);
        });
       
    }

    UpdateSelect(name:string)
    {
        console.log("DlSelectLevel update button: " + name);
        this.levels.forEach(item =>{
            if(item != name)
            {
                this.node.getChildByName(item)?.getComponent("ButtonLevel").SetSelectedButton(false);
            }
        });
        this.isLoadSprite = true;
        ResourcesManager.instance.LoadSpritFolder("Textures/ShapeTheCurves/levels/"+name,true);
    }

    update (deltaTime: number) {
    //     // [4]
        if(this.isLoadSprite)
        {
            if(ResourcesManager.instance.isLoadFinished)
            {
                this.isLoadSprite = false;
                if(this.selectSpriteNode)
                {
                    this.selectSpriteNode.getComponent("DlSelectSprite").Init();
                }
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
