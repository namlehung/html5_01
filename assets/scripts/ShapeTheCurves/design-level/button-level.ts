
import { _decorator, Component, Node, Button, EventHandler } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('ButtonLevel')
export class ButtonLevel extends Component {
    // [1]
    // dummy = '';

    // [2]
    // @property
    // serializableDummy = 0;

    updateSelectClassName:string = "";
    isButtonSelected: boolean = false;
    start () {
        // [3]
    }

    InitButton(name:string,updateclassname:string)
    {
        this.updateSelectClassName = updateclassname;
        this.node.getComponentInChildren("cc.Label").string = name;
        let button:Button = this.node.getComponent("cc.Button");
        const clickEventhandler = new EventHandler();
        clickEventhandler.target = this.node;
        clickEventhandler.component = "ButtonLevel";
        clickEventhandler.handler = "OnClickButton";
        clickEventhandler.customEventData=name;
        button.clickEvents.push(clickEventhandler);
    }

    OnClickButton(event: Event,customEventData:string)
    {
        if(this.isButtonSelected == false)
        {
            console.log("click on button: " + customEventData);
            this.isButtonSelected = true;
            this.SetSelectedButton(true);
            if(this.node.parent)
            {
                let parentUpdateClass = this.node.parent.getComponent(this.updateSelectClassName);
                if(parentUpdateClass)
                {
                    parentUpdateClass.UpdateSelect(customEventData);
                }
            }
        }
    }

    SetSelectedButton(isSelected:boolean)
    {
        let button:Button = this.node.getComponent("cc.Button");
        this.isButtonSelected = isSelected;
        button.interactable = !isSelected;
    }
    // update (deltaTime: number) {
    //     // [4]
    // }
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
