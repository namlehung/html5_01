
import { _decorator, Component, Node, CCLoader, TERRAIN_NORTH_INDEX } from 'cc';
import { PartInfo, ShapeLevelInfo } from '../shape-level';
const { ccclass, property } = _decorator;

@ccclass('DlExportleveljs')
export default class DlExportleveljs extends Component {
    // [1]
    // dummy = '';

    // [2]
    // @property
    // serializableDummy = 0;

    levelinfo: ShapeLevelInfo;
    editBox: cc.EditBox;
    isNeedUpdateDisplay: boolean = false;

    private static _instance:DlExportleveljs = null;
    static get instance(){
        return DlExportleveljs._instance;
    }
    
    onLoad()
    {
        DlExportleveljs._instance = this.node.getComponent("DlExportleveljs");
    }

    start () {
        // [3]
        this.levelinfo = new ShapeLevelInfo();
        this.levelinfo.timeLimited = this.GetDefaultTime();
        this.levelinfo.minMoveX = this.GetDefaultMinMove();
        this.levelinfo.maxMoveX = this.GetDefaultMaxMove();
        this.levelinfo.limitedLinePosY = this.GetDefaultLineLimited();
        this.editBox = this.node.getComponentInChildren("cc.EditBox");
    }

    update (deltaTime: number) {
    //     // [4]
        if(this.isNeedUpdateDisplay)
        {
            this.DisplayLevelInfo();
        }
    }

    GetDefaultTime()
    {
        return 50;
    }
    GetDefaultMinMove()
    {
        return 40;
    }
    GetDefaultMaxMove()
    {
        return 50;
    }
    GetDefaultLineLimited()
    {
        return -300;
    }
    SetLevelName(name:string)
    {
        this.levelinfo.levelName = name;
        this.levelinfo.partInfo =  [];
        this.isNeedUpdateDisplay = true;
    }
    UpdateTime(time:number)
    {
        this.levelinfo.timeLimited = time;
        this.isNeedUpdateDisplay = true;
    }
    UpdateMinMove(minmove:number)
    {
        this.levelinfo.minMoveX = minmove;
        this.isNeedUpdateDisplay = true;
    }
    UpdateMaxMove(maxmove:number)
    {
        this.levelinfo.maxMoveX = maxmove;
        this.isNeedUpdateDisplay = true;
    }
    UpdateLineLimited(linelimited:number)
    {
        this.levelinfo.limitedLinePosY = linelimited;
        this.isNeedUpdateDisplay = true;
    }
    UpdatePartInfo(partinfos:PartInfo[])
    {
        this.levelinfo.partInfo = partinfos;
        this.isNeedUpdateDisplay = true;
    }

    SaveAndPlayLevel()
    {
        cc.sys.localStorage.setItem("SHAPETHECURVES_CURRENT_LEVEL",JSON.stringify(this.levelinfo));
        cc.director.loadScene("shapethecurves");
    }

    DisplayLevelInfo()
    {
        this.editBox.string  = JSON.stringify(this.levelinfo);
        /*let labelnode:Node = this.node.children[0].getChildByName("TEXT_LABEL");
        if(labelnode)
        {
            let label:cc.Label = labelnode.getComponent("cc.Label");
            label.string = JSON.stringify(this.levelinfo);
            label.EnableWrapText = true;
        }*/
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
