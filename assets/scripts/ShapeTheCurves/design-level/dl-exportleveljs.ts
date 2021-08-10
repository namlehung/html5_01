
import { _decorator, Component, Node, CCLoader, TERRAIN_NORTH_INDEX } from 'cc';
import ShapeLevel, { PartInfo, ShapeLevelInfo } from '../shape-level';
import DlParticleEdit from './dl-particle-edit';
const { ccclass, property } = _decorator;

@ccclass('DlExportleveljs')
export default class DlExportleveljs extends Component {
    // [1]
    // dummy = '';

    // [2]
    // @property
    // serializableDummy = 0;
    @property(Node)
    inputtime:Node = null;
    @property(Node)
    inputminmovex:Node = null;
    @property(Node)
    inputmaxmovex:Node = null;
    @property(Node)
    inputlinelimited:Node = null;

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
        this.levelinfo = ShapeLevel.instance.GetLevelInfos(0);
    }

    start () {
        // [3]
        /*this.levelinfo = new ShapeLevelInfo();
        this.levelinfo.timeLimited = this.GetDefaultTime();
        this.levelinfo.minMoveX = this.GetDefaultMinMove();
        this.levelinfo.maxMoveX = this.GetDefaultMaxMove();
        this.levelinfo.limitedLinePosY = this.GetDefaultLineLimited();*/
        this.editBox = this.node.getComponentInChildren("cc.EditBox");
        this.isNeedUpdateDisplay = true;
        DlParticleEdit.instance.ShowParticleInfo(this.levelinfo.partInfo);
        this.inputtime.getComponent("cc.EditBox").string = "" + this.levelinfo.timeLimited;
        this.inputmaxmovex.getComponent("cc.EditBox").string = "" + this.levelinfo.maxMoveX;
        this.inputminmovex.getComponent("cc.EditBox").string = "" + this.levelinfo.minMoveX;
        this.inputlinelimited.getComponent("cc.EditBox").string = "" + this.levelinfo.limitedLinePosY;
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
        return this.levelinfo.timeLimited;
    }
    GetDefaultMinMove()
    {
        return this.levelinfo.minMoveX;
    }
    GetDefaultMaxMove()
    {
        return this.levelinfo.maxMoveX;
    }
    GetDefaultLineLimited()
    {
        return this.levelinfo.limitedLinePosY;
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

    PlayLevel()
    {
        //cc.sys.localStorage.setItem("SHAPETHECURVES_CURRENT_LEVEL",JSON.stringify(this.levelinfo));
        cc.director.loadScene("shapethecurves");
    }
    SaveLevel()
    {
        cc.sys.localStorage.setItem("SHAPETHECURVES_CURRENT_LEVEL",JSON.stringify(this.levelinfo));
        //cc.director.loadScene("shapethecurves");
    }

    DisplayLevelInfo()
    {
        let strdisplay =  JSON.stringify(this.levelinfo);
        this.editBox.string  = strdisplay;
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
