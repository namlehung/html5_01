
import { _decorator, Component, Node, EditBox } from 'cc';
import { PartInfo } from '../shape-level';
import DlExportleveljs from './dl-exportleveljs';
import DlParticleEdit from './dl-particle-edit';
const { ccclass, property } = _decorator;

@ccclass('Editboxinputvalue')
export class Editboxinputvalue extends Component {
    // [1]
    // dummy = '';

    // [2]
    // @property
    // serializableDummy = 0;

    editBox: EditBox;
    start () {
        // [3]
        this.editBox = this.node.getComponentInChildren("cc.EditBox");
    }

    // update (deltaTime: number) {
    //     // [4]
    // }

    onTextChange(event:any, customEventData:string)
    {
        let value;
        let stringvalue = this.editBox.string;
        if(stringvalue == "")
        {
            return;
        }
        if(customEventData=="minmovex")
        {
            value = Number.parseFloat(stringvalue);
            DlExportleveljs.instance.UpdateMinMove(value);
        }
        else if(customEventData== "maxmovex")
        {
            value = Number.parseFloat(stringvalue);
            DlExportleveljs.instance.UpdateMaxMove(value);
        }
        else if(customEventData== "time")
        {
            value = Number.parseFloat(stringvalue);
            DlExportleveljs.instance.UpdateTime(value);
        }
        else if(customEventData== "linelimited")
        {
            value = Number.parseFloat(stringvalue);
            DlExportleveljs.instance.UpdateLineLimited(value);
        }
        else if(customEventData=="fallspeed")
        {
            value = Number.parseFloat(stringvalue);
            let parinfo:PartInfo = DlParticleEdit.instance.GetCurrentPartinfo();
            parinfo.fallSpeed = value;
            DlParticleEdit.instance.UpdateCurrentPartinfo(parinfo);
        }
        else if(customEventData=="movespeed")
        {
            value = Number.parseFloat(stringvalue);
            let parinfo:PartInfo = DlParticleEdit.instance.GetCurrentPartinfo();
            parinfo.moveSpeed = value;
            DlParticleEdit.instance.UpdateCurrentPartinfo(parinfo);
        }
        else if(customEventData=="scale")
        {
            value = Number.parseFloat(stringvalue);
            let parinfo:PartInfo = DlParticleEdit.instance.GetCurrentPartinfo();
            parinfo.scale = value;
            DlParticleEdit.instance.UpdateCurrentPartinfo(parinfo);
        }
        else if(customEventData=="partposx")
        {
            value = Number.parseFloat(stringvalue);
            let parinfo:PartInfo = DlParticleEdit.instance.GetCurrentPartinfo();
            parinfo.endPoint.x = value;
            DlParticleEdit.instance.UpdateCurrentPartinfo(parinfo);
        }
        else if(customEventData=="partposy")
        {
            value = Number.parseFloat(stringvalue);
            let parinfo:PartInfo = DlParticleEdit.instance.GetCurrentPartinfo();
            parinfo.endPoint.y = value;
            DlParticleEdit.instance.UpdateCurrentPartinfo(parinfo);
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
