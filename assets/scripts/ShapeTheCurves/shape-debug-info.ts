
import { _decorator, Component, Node } from 'cc';
import { ShapeLevelInfo } from './shape-level';
const { ccclass, property } = _decorator;

@ccclass('ShapeDebugInfo')
export default class ShapeDebugInfo {
    // [1]
    // dummy = '';

    // [2]
    // @property
    // serializableDummy = 0;

   private static _instance:ShapeDebugInfo = null;
    static get instance()
    {
        if(ShapeDebugInfo._instance == null)
        {
            ShapeDebugInfo._instance = new ShapeDebugInfo();
        }
        return ShapeDebugInfo._instance;
    }

    private isEnable:boolean = !true;
    private isShowLimitLine:boolean = true;
    private isShowPartDebugLine:boolean = true;
    private isIgnoreMatchedPart:boolean = false;

    IsShowLinitedLine():boolean
    {
        return this.isShowLimitLine;
    }
    IsEnable():boolean
    {
        return this.isEnable;
    }
    IsShowPartDebugLine():boolean
    {
        return this.isShowPartDebugLine;
    }
    IsIgnoreMatchedPart()
    {
        return this.isIgnoreMatchedPart;
    }

    SetEnable(value:boolean)
    {
        this.isEnable = value;
    }

    SetShowLineLimited(value:boolean)
    {
        this.isShowLimitLine = value;
    }
    SetShowPartLine(value:boolean)
    {
        this.isShowPartDebugLine = value;
    }
    SetIgnoreMatched(value:boolean)
    {
        this.isIgnoreMatchedPart = value;
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
