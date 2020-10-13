/*jshint esversion: 6 */ 

/*
game_state.js
 */

var GAME_STATE = {GAME__DATA: {}, CELL__DATA: {}, CURRENT_SCENE: ''};
function GET_GAME_DATA( _name ){
    return GAME_STATE.GAME__DATA; //Is this something we might want? Then functions inside the HAEScript receive the 3 parms (GAME_DATA, CELL_DATA, HAE)
}
function GET_CELL_DATA( _name ){
    return GAME_STATE.CELL__DATA[_name];
}

//Holds the functions that communicate with the Game State
var STATE = {};

STATE.initializeGameState = function(){
    ///one important consideration is how the save and load system works, as that system directly manipulates GAME_STATE
    ///It would make sense to me for GAME_STATE to be able to receive a new GAME_STATE object from the save-load file for loading
    ///Something that would be really nice is if runGameUpdate was all you had to call once GAME_STATE was overwritten
    ///Meaning there was nothing funky going on with the game state, GAME_STATE represents everything about the game

    GAME_STATE.CELL__DATA.DIALOG = {};
    GAME_STATE.CELL__DATA.ACTIONS = {};
    GAME_STATE.CELL__DATA.SCENE_LOCKED = false;
    _.each(MODULES, function(_module, _name){
        GAME_STATE.CELL__DATA[ _name ] = {};
    });
};

STATE.GET_STATE = function(){
    return GAME_STATE;
};
STATE.LOAD_STATE = function( _state ){
    GAME_STATE = _state;
};

//Random note: This doesn't mean anything to history since every scene sets this, But...
//SCENE_LOCKED is set to the currently displayed scene, yet CURRENT_SCENE is set to the upcoming scene. Probably meaningless, but maybe a bad design.
STATE.SET_SCENE_LOCKED = function(_sceneLocked){
    GAME_STATE.CELL__DATA.SCENE_LOCKED = !!_sceneLocked;
};
STATE.GET_SCENE_LOCKED = function(){
    return !!GAME_STATE.CELL__DATA.SCENE_LOCKED;
};
