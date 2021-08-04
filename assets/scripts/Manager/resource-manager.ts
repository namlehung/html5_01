
import { _decorator, Component, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('Typescript')
export default class ResourcesManager {
    // [1]
    // dummy = '';

    // [2]
    // @property
    // serializableDummy = 0;

    private static _instance: ResourcesManager = null;

    static get instance() {
        if(ResourcesManager._instance == null) {
            ResourcesManager._instance = new ResourcesManager();
        }
        return ResourcesManager._instance;
    }

    isLoadFinished:boolean = false;
    private arraySprite: {[key:string]:cc.SpriteFrame} = {};

    ReleaseSprite(){
        for(let key in this.arraySprite)
        {
            cc.console.log("----release Sprite: " + key)
            cc.assetManager.releaseAsset(this.arraySprite[key]);
        }
    }

    LoadSpritFolder(folderNamePath:string)
    {
        this.isLoadFinished =false;
        this.ReleaseSprite();
        cc.resources.loadDir(folderNamePath, (err, assets) =>{
            cc.log('-------------LoadSpritFolder: ' + folderNamePath);
            if(assets){
                assets.forEach(item =>{
                    if(item instanceof cc.SpriteFrame)
                    {
                        cc.log('-------------LoadSpritFolder: '+ item._name);
                        this.arraySprite[item._name.toLowerCase()] = item;
                    }
                });
            }
            this.isLoadFinished = true;
        });
    }

    GetSprites(): any{
        return this.arraySprite;
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
