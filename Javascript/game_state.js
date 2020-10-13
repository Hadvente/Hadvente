/*jshint esversion: 6 */ 

/*
game_state.js
This file loads and runs HADVENTE.
It also facillitates the communication between modules
There are multiple modules to take care of:
dialog
map
game_view
 */

var GAME_STATE = {};
function initializeGameState(){
    ///one important consideration is how the save and load system works, as that system directly manipulates GAME_STATE
    ///It would make sense to me for GAME_STATE to be able to receive a new GAME_STATE object from the save-load file for loading
    ///Something that would be really nice is if runGameUpdate was all you had to call once GAME_STATE was overwritten
    ///Meaning there was nothing funky going on with the game state, GAME_STATE represents everything about the game
    
    INIT_ALL_CELL_DATA();
}
function GET_GAME_STATE(){
    return GAME_STATE;
}

function INIT_ALL_CELL_DATA(){
    GAME_STATE.CELL__DATA = {}; //CELL__DATA IS SOMETHING CELLS USE, IT SHOULD NEVER BE OVERWRITTEN BY THE HAE GAME
    GAME_STATE.CELL__DATA.DIALOG = {};
    GAME_STATE.CELL__DATA.ACTIONS = {};
    GAME_STATE.CELL__DATA.SCENE_LOCKED = false;
    _.each(MODULES, function(_module, _name){
        GAME_STATE.CELL__DATA[ _name ] = {};
    });
}
function GET_CELL_DATA( _name ){
    return GAME_STATE.CELL__DATA[_name];
}


//Random note: This doesn't mean anything to history since every scene sets this
//But.. SCENE_LOCKED is set to the currently displayed scene, yet DIALOG.CURRENT_SCENE is set to the upcoming scene.
function SET_SCENE_LOCKED(_sceneLocked){
    GAME_STATE.CELL__DATA.SCENE_LOCKED = !!_sceneLocked;
}
function GET_SCENE_LOCKED(){
    return !!GAME_STATE.CELL__DATA.SCENE_LOCKED;
}