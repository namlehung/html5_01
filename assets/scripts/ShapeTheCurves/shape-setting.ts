
import { _decorator, Component, Node } from 'cc';
const { ccclass, property } = _decorator;

export enum GAME_CONTROLL_TYPE
{
    DRAG = 0,
    TAP = 1,
}

@ccclass('ShapeSetting')
export default class ShapeSetting {
    // [1]
    // dummy = '';

    // [2]
    // @property
    // serializableDummy = 0;
    private gameControllType:GAME_CONTROLL_TYPE = GAME_CONTROLL_TYPE.DRAG;
    private settingSaveName: string = "shapethecurves_setting";
    private static _instance: ShapeSetting = null;
    static get instance()
    {
        if(ShapeSetting._instance == null)
        {
            ShapeSetting._instance = new ShapeSetting();
            ShapeSetting._instance.LoadSetting();
        }
        return ShapeSetting._instance;
    }

    GetGameControllType()
    {
        return this.gameControllType;
    }
    SetGameControllType(gctype:GAME_CONTROLL_TYPE)
    {
        this.gameControllType = gctype;
    }
    LoadSetting()
    {
        let value:string = cc.sys.localStorage.getItem(this.settingSaveName);
        if(value && value.length > 0)
        {
            let arraydata = value.split(";")
            this.gameControllType = Number.parseInt(arraydata[0]);
        }
        else
        {
            this.SetDefaultValue();
        }
    }
    SaveSetting()
    {
        let value = ""+this.gameControllType;
        cc.sys.localStorage.setItem(this.settingSaveName,value);
    }
    SetDefaultValue()
    {
        this.gameControllType = GAME_CONTROLL_TYPE.DRAG;
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
