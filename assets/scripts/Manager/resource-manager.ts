
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
    arrayLoadedSpriteFolder: {[key:string]:boolean} = {};
    arrayLoadedPrefabFolder: {[key:string]:boolean} = {};
    private arraySprite: {[key:string]:cc.SpriteFrame} = {};
    private arrayPrefab: {[key:string]:cc.Prefab} = {};
    

    ReleaseSprite(data:any,arrayloaded:any,foldername:string){
        for(let key in data)
        {
            cc.log("----release Sprite: " + key)
            cc.assetManager.releaseAsset(data[key]);
        }
        arrayloaded[foldername] = false;
    }
    IsLoadedSpriteFolder(name:string)
    {
        if(this.arrayLoadedSpriteFolder[name])
        {
           return this.arrayLoadedSpriteFolder[name];
        }
        return false;
    }
    IsLoadedPrefabFolder(name:string)
    {
        if(this.arrayLoadedPrefabFolder[name])
        {
           return this.arrayLoadedPrefabFolder[name];
        }
        return false;
    }
    LoadSpritFolder(folderNamePath:string,isReleaseResource: boolean)
    {
        this.isLoadFinished =false;
        let foldername = folderNamePath.substring(folderNamePath.lastIndexOf("/")+1);
        if(this.IsLoadedSpriteFolder(foldername))
        {
            this.isLoadFinished =true;
            return;
        }
        if(isReleaseResource)
        {
            this.ReleaseSprite(this.arraySprite,this.arrayLoadedSpriteFolder,foldername);
        }
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
            let name = folderNamePath.substring(folderNamePath.lastIndexOf("/")+1);
            this.arrayLoadedSpriteFolder[name] = true;
        });
    }

    LoadPrefabsFolder(folderNamePath:string,isReleaseResource: boolean)
    {
        this.isLoadFinished =false;
        let foldername = folderNamePath.substring(folderNamePath.lastIndexOf("/")+1);
        if(isReleaseResource)
        {
            this.ReleaseSprite(this.arrayPrefab,this.arrayLoadedPrefabFolder,foldername);
        }
        cc.resources.loadDir(folderNamePath,(err,assets)=>{
            //cc.log('-------------loadResDir Prefabs-------------------');
            if(assets){
                assets.forEach(item =>{
                    cc.log('-------------load Prefabs: '+ item.data._name);
                   if(item instanceof cc.Prefab)
                   { 
                    this.arrayPrefab[item.data._name.toLowerCase()] = item;
                   }
                });
                let name = folderNamePath.substring(folderNamePath.lastIndexOf("/")+1);
                this.arrayLoadedPrefabFolder[name] = true;
            }
        });
    }

    GetSprites(name:string): any{
        return this.arraySprite[name];
    }
    GetPrefabs(name:string): any{
        return this.arrayPrefab[name];
    }
    GetArraySpriteName()
    {
        let arraySpriteName:string[] = [];
        for(let key in this.arraySprite)
        {
            arraySpriteName.push(key);
        }
        return arraySpriteName;
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
