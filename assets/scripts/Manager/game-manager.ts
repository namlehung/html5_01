
import { _decorator, Component, Node, Game } from 'cc';
const { ccclass, property } = _decorator;

export enum GAME_STATE{
    STATE_LOADING = 0,
    STATE_ACTION_PHASE,
    STATE_SELECT_LEVEL,
    STATE_GAME_RESULT,
    STATE_IGM,
    STATE_MM,
}

@ccclass('GameManager')
export default class GameManager extends Component{

    private currentState: GAME_STATE = GAME_STATE.STATE_LOADING;
    private preState: GAME_STATE = GAME_STATE.STATE_LOADING;
    private timeInGame:number = 0;
    private timeTotal: number =0;

    private static _instance: GameManager = null;
    static get instance()
    {
        return GameManager._instance;
    }

    nodeGameState: Node[] = [];

    onLoad()
    {
        GameManager._instance = this.node.getComponent('GameManager');
        this.nodeGameState = new Array(6);
        this.nodeGameState[GAME_STATE.STATE_LOADING] = this.node.getChildByName("loading");
        this.nodeGameState[GAME_STATE.STATE_ACTION_PHASE] = this.node.getChildByName("ap");
        this.nodeGameState[GAME_STATE.STATE_GAME_RESULT] = this.node.getChildByName("game-result");
        this.nodeGameState[GAME_STATE.STATE_IGM] = this.node.getChildByName("igm");
        this.nodeGameState[GAME_STATE.STATE_MM] = this.node.getChildByName("mm");
        this.nodeGameState[GAME_STATE.STATE_SELECT_LEVEL] = this.node.getChildByName("select-level");
    }

    start () {
        // [3]
        this.ResetState();
        this.timeInGame = 0;
    }

     update (deltaTime: number) {
    //     // [4]
        if(this.currentState == GAME_STATE.STATE_ACTION_PHASE)
        {
            this.timeInGame += deltaTime;
        }
        this.timeTotal += deltaTime;
     }

    ResetState(){
        this.preState = GAME_STATE.STATE_LOADING;
        this.currentState = GAME_STATE.STATE_LOADING;
        this.nodeGameState.forEach(elemt => {
            if(elemt)
            {
                elemt.active = false;
            }
        });
        this.nodeGameState[this.currentState].active = true;
    }

    SwitchState(state: GAME_STATE){
        this.preState = this.currentState;
        this.currentState = state;
        this.nodeGameState.forEach(elemt => {
            if(elemt)
            {
                elemt.active = false;
            }
        });
        this.nodeGameState[this.currentState].active = true;
    }
    
    GetCurrentState(){
        return this.currentState;
    }
    GetPreState(){
        return this.preState;
    }
    GetTimeInAP(){
        return this.timeInGame;
    }
    GetCurrentTime(){
        return this.timeTotal;
    }

    GetAPNode(){
        return this.nodeGameState[GAME_STATE.STATE_ACTION_PHASE];
    }
    GetResultNode(){
        return this.nodeGameState[GAME_STATE.STATE_GAME_RESULT];
    }
    GetIGMNode(){
        return this.nodeGameState[GAME_STATE.STATE_IGM];
    }
    ResetTimeInGame()
    {
        this.timeInGame = 0;
    }

    PauseGame(){
        this.SwitchState(GAME_STATE.STATE_IGM);
    }
    ResumeGame(){
        this.SwitchState(GAME_STATE.STATE_ACTION_PHASE);
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
