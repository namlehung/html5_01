
import { _decorator, Component, Node, Vec2, Vec3, TERRAIN_HEIGHT_BASE, CCLoader, Size } from 'cc';
import { InputController } from '../../Controller/input-controller';
import ResourcesManager from '../../Manager/resource-manager';
import { PartInfo, PartJoint, PartPoint } from '../shape-level';
import DlExportleveljs from './dl-exportleveljs';
import { DlJoints } from './dl-joints';
const { ccclass, property } = _decorator;

@ccclass('DlParticleEdit')
export default class DlParticleEdit extends Component {
    // [1]
    // dummy = '';

    // [2]
    // @property
    // serializableDummy = 0;

    @property({type:cc.Prefab})
    prefabbuttonlevel: Prefab =null;

    @property(Node)
    inputNode:Node = null;

    @property({type:cc.Prefab})
    prefabParticleNode: Prefab =null;

    @property(Node)
    inputScaleNode:Node = null;
    @property(Node)
    inputfallSpeedNode:Node = null;
    @property(Node)
    inputmoveSpeedNode:Node = null;
    @property(Node)
    inputPosxNode:Node = null;
    @property(Node)
    inputPosyNode:Node = null;

    @property(Node)
    nodeJoint:Node= null;

    @property(Node)
    spritesNode:Node = null;

    inputController:InputController;

    listPart:PartInfo[] = [];
    selectedPartName:string = "";
    currentPartInfo:PartInfo[] = [];
    isNeedUpdateDisPlaySprite:boolean = false;
    isOnlyUpdateSpritePos:boolean = true;

    private static _instance:DlParticleEdit = null;
    static get instance(){
        return DlParticleEdit._instance;
    }
    
    onLoad()
    {
        DlParticleEdit._instance = this.node.getComponent("DlParticleEdit");
    }

    start () {
        // [3]
        if(this.inputNode && this.selectedPartName=="")
        {
            this.inputNode.active = false;
        }
        this.inputController = this.spritesNode.parent.getComponent("InputController");
        this.isNeedUpdateDisPlaySprite = true;
        this.isOnlyUpdateSpritePos = false;
    }

    update (deltaTime: number)
    {
        this.UpdateDisplaySprite();
        this.UpdateSpritePos();
    }

    AddParticle(name:string)
    {
        this.selectedPartName = name;
        let node = cc.instantiate(this.prefabbuttonlevel);
        node.getComponent("ButtonLevel").InitButton(name,"DlParticleEdit");
        node.name = name;
        this.node.addChild(node);
        let partinfo:PartInfo = new PartInfo();
        partinfo.startPoint = new PartPoint();
        partinfo.startPoint.x = 0;
        partinfo.startPoint.y = 300;
        partinfo.endPoint = new PartPoint();
        partinfo.endPoint.x = 0;
        partinfo.endPoint.y = 0;
        partinfo.spriteName = name;
        partinfo.scale = 1.5;
        partinfo.fallSpeed = 2;
        partinfo.moveSpeed = 10;
        this.currentPartInfo.push(partinfo);
        DlExportleveljs.instance.UpdatePartInfo(this.currentPartInfo);

        let node2:Node = cc.instantiate(this.prefabParticleNode);
        let sprite:Sprite = node2.getComponentInChildren('cc.Sprite');//node.addComponent('cc.Sprite') as Sprite;
        sprite._spriteFrame = ResourcesManager.instance.GetSprites(partinfo.spriteName);
        let spriteSize = new cc.Size(sprite._spriteFrame._rect.width,sprite._spriteFrame._rect.height);
        node2.children[0].setContentSize(spriteSize);
        node2.name = partinfo.spriteName;
        this.spritesNode.addChild(node2);
        node2.setPosition(partinfo.endPoint.x,partinfo.endPoint.y,0);
    }

    UpdateDisplaySprite()
    {
        if(this.isNeedUpdateDisPlaySprite)
        {
            if(ResourcesManager.instance.IsLoadedSpriteFolder(DlExportleveljs.instance.levelinfo.levelName))
            {
                this.isNeedUpdateDisPlaySprite = false;
                if(this.isOnlyUpdateSpritePos)
                {
                    for(let i = 0;i<this.spritesNode.children.length;i++)
                    {
                        let partinfo = this.currentPartInfo[i];
                        let node:Node = this.spritesNode.children[i];
                        node.setPosition(partinfo.endPoint.x,partinfo.endPoint.y,0);
                    }
                }
                else
                {
                    this.spritesNode.removeAllChildren();
                    for(let i = 0;i<this.currentPartInfo.length;i++)
                    {
                        let partinfo = this.currentPartInfo[i];
                        let node:Node = cc.instantiate(this.prefabParticleNode);
                        let sprite:Sprite = node.getComponentInChildren('cc.Sprite');//node.addComponent('cc.Sprite') as Sprite;
                        sprite._spriteFrame = ResourcesManager.instance.GetSprites(partinfo.spriteName);
                        let spriteSize = new cc.Size(sprite._spriteFrame._rect.width,sprite._spriteFrame._rect.height);
                        node.children[0].setContentSize(spriteSize);
                        node.name = partinfo.spriteName;
                        this.spritesNode.addChild(node);
                        node.setPosition(partinfo.endPoint.x,partinfo.endPoint.y,0);
                    }
                }
            }
        }
    }
    UpdateSpritePos()
    {
        if(this.inputController)
        {
            if(this.selectedPartName != "")
            {
                let postouchstart = this.inputController.GetPosTouchStart();

                let dljointts:DlJoints = this.nodeJoint.getComponent("DlJoints");
                let ismovehint:boolean = false;
                let hintnode = dljointts.GetHintNode();
                if(hintnode)
                {
                    let hintsize = hintnode.children[0].getContentSize();
                    hintsize.width *= hintnode.children[0].getScale().x;
                    hintsize.height *= hintnode.children[0].getScale().y;
                    if(postouchstart.x >= hintnode.position.x - hintsize.width/2
                        && postouchstart.x <= hintsize.width/2 + hintnode.position.x 
                        && postouchstart.y >= hintnode.position.y - hintsize.height/2
                        && postouchstart.y <= hintsize.height/2 + hintnode.position.y )
                        {
                            if(this.inputController.IsTouchMove())
                            {
                                let delta = this.inputController.GetMoveVector();
                                let newpos = hintnode.getPosition().add(new Vec3(delta.x,delta.y,0));
                                console.log("touch select sprite new pos: " + newpos);
                                this.inputController.SetTouchStartToMove();
                                hintnode.setPosition(newpos);
                                dljointts.UpdateCurrentJointPos(newpos);
                                ismovehint = true;
                            }
                        }
                }

                let child = null;
                for(let i = 0;i<this.spritesNode.children.length;i++)
                {
                    if(this.spritesNode.children[i].name == this.selectedPartName)
                    {
                        child = this.spritesNode.children[i];
                    }
                }
                if(child)
                {
                    if(ismovehint == false)
                    {
                        let childsize:Size = child?.children[0].getContentSize();
                        childsize.width *= child?.getScale().x;
                        childsize.height *= child?.getScale().y;
                        if(postouchstart.x >= child?.position.x - childsize.width/2
                            && postouchstart.x <= childsize.width/2 + child?.position.x 
                            && postouchstart.y >= child?.position.y - childsize.height/2
                            && postouchstart.y <= childsize.height/2 + child?.position.y )
                            {
                                if(this.inputController.IsTouchMove())
                                {
                                    let delta = this.inputController.GetMoveVector();
                                    let newpos = child?.getPosition().add(new Vec3(delta.x,delta.y,0));
                                    console.log("touch select sprite new pos: " + newpos);
                                    this.inputController.SetTouchStartToMove();
                                    child?.setPosition(newpos);
                                    let partinfo = this.GetCurrentPartinfo();
                                    if(partinfo)
                                    {
                                        partinfo.endPoint.x = newpos.x;
                                        partinfo.endPoint.y = newpos.y;
                                        this.UpdateCurrentPartinfo(partinfo);
                                        this.inputPosxNode.getComponent("cc.EditBox").string = "" + partinfo.endPoint.x;
                                        this.inputPosyNode.getComponent("cc.EditBox").string = "" + partinfo.endPoint.y;
                                    }
                                }
                            }
                    }
                }
            }
        }
        else
        {
            this.inputController = this.spritesNode.parent?.getChildByName("bg")?.getComponentInChildren("InputController");
        }
    }
    ShowParticleInfo(partinfos:PartInfo[])
    {
        for(let i =0;i<partinfos.length;i++)
        {
            let name = partinfos[i].spriteName;
            let node = cc.instantiate(this.prefabbuttonlevel);
            node.getComponent("ButtonLevel").InitButton(name,"DlParticleEdit");
            node.name = name;
            this.node.addChild(node);
        }
        this.isOnlyUpdateSpritePos = true;
        this.isOnlyUpdateSpritePos = false;
        this.currentPartInfo = partinfos;
    }
    GetCurrentPartinfo()
    {
        let partinfo = null;
        for(let i = 0;i<this.currentPartInfo.length;i++)
        {
            partinfo = this.currentPartInfo[i];
            if(partinfo.spriteName == this.selectedPartName)
            {
                break;
            }
        }
        return partinfo;
    }

    UpdateCurrentPartinfo(partinfo:PartInfo)
    {
        for(let i = 0;i<this.currentPartInfo.length;i++)
        {
            if(partinfo.spriteName == this.currentPartInfo[i].spriteName)
            {
                this.currentPartInfo[i].scale = partinfo.scale;
                this.currentPartInfo[i].endPoint.x = partinfo.endPoint.x;
                this.currentPartInfo[i].endPoint.y = partinfo.endPoint.y;
                this.currentPartInfo[i].fallSpeed = partinfo.fallSpeed;
                this.currentPartInfo[i].moveSpeed = partinfo.moveSpeed;
            }
        }
        this.nodeJoint.getComponent("DlJoints").UpdateJointInfo(partinfo.partJoints);
        this.isNeedUpdateDisPlaySprite  = true;
        this.isOnlyUpdateSpritePos = true;
        DlExportleveljs.instance.UpdatePartInfo(this.currentPartInfo);
    }
    UpdateJointInfo(partjoints:PartJoint[])
    {
        for(let i = 0;i<this.currentPartInfo.length;i++)
        {
            if(this.selectedPartName == this.currentPartInfo[i].spriteName)
            {
                this.currentPartInfo[i].partJoints = partjoints;
            }
        }
        DlExportleveljs.instance.UpdatePartInfo(this.currentPartInfo);
    }
    UpdateSelect(name:string)
    {
        this.selectedPartName = name;
        console.log("DlParticleEdit update button: " +  name);
        for(let i= 1;i<this.node.children.length;i++)
        {
            let child = this.node.children[i];
            if(child.name != name)
            {
                child.getComponent("ButtonLevel").SetSelectedButton(false);
            }
        }
        this.inputNode.active = true;
        this.UpdateDisplayCurrentPartinfo();
        this.nodeJoint.getComponent("DlJoints").ShowJointInfo();
    }

    UpdateDisplayCurrentPartinfo()
    {
        let partinfo:PartInfo = this.GetCurrentPartinfo();
        this.inputPosxNode.getComponent("cc.EditBox").string = "" + partinfo.endPoint.x;
        this.inputPosyNode.getComponent("cc.EditBox").string = "" + partinfo.endPoint.y;
        this.inputScaleNode.getComponent("cc.EditBox").string = "" + partinfo.scale;
        this.inputfallSpeedNode.getComponent("cc.EditBox").string = "" + partinfo.fallSpeed;
        this.inputmoveSpeedNode.getComponent("cc.EditBox").string = "" + partinfo.moveSpeed;
    }

    MoveCurrentUp()
    {
        let i= 1;
        for(;i<this.node.children.length;i++)
        {
            let child = this.node.children[i];
            if(child.name == this.selectedPartName)
            {
                if(i > 1)
                {
                    let temppos:Vec3 = new Vec3(child.position.x,child.position.y,child.position.z);
                    child.setPosition(new Vec3(this.node.children[i-1].position.x,this.node.children[i-1].position.y,this.node.children[i-1].position.z));
                    this.node.children[i-1].position =temppos;
                    let tempnode = this.node.children[i-1];
                    this.node.children[i-1] = this.node.children[i];
                    this.node.children[i] = tempnode;
                    break;
                }
            }
        }
        for(i= 0;i<this.currentPartInfo.length;i++)
        {
            if(this.currentPartInfo[i].spriteName == this.selectedPartName)
            {
                if(i>0)
                {
                    this.SwapPartInfo(i);
                }
            }
        }
    }
    MoveCurrentDown()
    {
        let i = 1;
        for(;i<this.node.children.length;i++)
        {
            let child = this.node.children[i];
            if(child.name == this.selectedPartName)
            {
                if(i + 1 <this.node.children.length)
                {
                    let temppos = new Vec3(child.position.x,child.position.y,child.position.z);
                    child.setPosition(new Vec3(this.node.children[i+1].position.x,this.node.children[i+1].position.y,this.node.children[i+1].position.z));
                    this.node.children[i+1].setPosition(temppos);
                    let tempnode = this.node.children[i+1];
                    this.node.children[i+1] = this.node.children[i];
                    this.node.children[i] = tempnode;
                    break;
                }
            }
        }
        for(i= 0;i<this.currentPartInfo.length;i++)
        {
            if(this.currentPartInfo[i].spriteName == this.selectedPartName)
            {
                if(i + 1 <this.currentPartInfo.length)
                {
                    this.SwapPartInfo(i+1);
                }
            }
        }
    }

    SwapPartInfo(index:number)
    {
        let parinfo = this.currentPartInfo[index].Clone();
        this.currentPartInfo[index].SetValue(this.currentPartInfo[index-1]);
        this.currentPartInfo[index-1].SetValue(parinfo);
    }

    RemoveCurrent()
    {
        let i= 1;
        let name = this.selectedPartName;
        for(;i<this.node.children.length;i++)
        {
            let child = this.node.children[i];
            if(child.name == this.selectedPartName)
            {
                this.selectedPartName = "";
                this.nodeJoint.getComponent("DlJoints").HideInputJoint();
                this.inputNode.active = false;
                child.destroy();
                break;
            }
        }

        for(i= 0;i<this.currentPartInfo.length;i++)
        {
            if(this.currentPartInfo[i].spriteName == name)
            {
                break;
            }
        }
        for(;i<this.currentPartInfo.length-1;i++)
        {
            this.currentPartInfo[i].SetValue(this.currentPartInfo[i+1]);
        }
        this.currentPartInfo.pop();
        for(i=0;i<this.spritesNode.children.length;i++)
        {
            let child = this.spritesNode.children[i];
            if(child.name == name)
            {
                child.removeFromParent();
                child.destroy();
                break;
            }
        }
    }

    GetCurrentJointIndex()
    {
        return this.nodeJoint.getComponent("DlJoints").GetcurrentJointindex();
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
