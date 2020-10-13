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

function initializeGameStateEngine(){
    initializeGameState(); //who owns gamedata?
    DIALOG.initialize();
    ACTIONS.initialize();
    MAP_GRID.initialize();
    initializeGameHtml(); //Right now the game has to make it's own start menu as a dialog scene, but I could rework this to have actual start menus

    _.delay(runGameUpdate, 50);
}

var GAME_STATE = {};
function initializeGameState(){
    ///one important consideration is how the save and load system works, as that system directly manipulates GAME_STATE
    ///It would make sense to me for GAME_STATE to be able to receive a new GAME_STATE object from the save-load file for loading
    ///Something that would be really nice is if runGameUpdate was all you had to call once GAME_STATE was overwritten
    ///Meaning there was nothing funky going on with the game state, GAME_STATE represents everything about the game
}
function get_GAME_STATE(){
    return GAME_STATE;
}

//import note, there is no way to do a "continue" currently, where the scene is updated to something belonging to the current position
var newScene = '';
function setNewScene(_newScene){
    newScene = _newScene;
}
function getNewScene(){
    return newScene || '';
}

//question: Are any actions NOT just scene changes? Because if you click an action, you at the very least have to
//set a new scene? Why wouldn't time pass, or at the very least why wouldn't "you picked up the object" be a scene?
//Even if the scene's string is just "<<[SET fn_object_get()]>>You picked up the object. <<[INCLUDE_LOCATION]>>"...
var actionsList = [];
function setNewActions(_new_actions){
    actionsList = _new_actions;
}
function getCurrentActions(){
    return actionsList;
}

var cells_disabled = false;
function disableCells(){
    cells_disabled = true;
}
function getCellsDisabled(){
    return !!cells_disabled;
}

var sceneLocked = false;
function setSceneLocked(_sceneLocked){
    sceneLocked = !!_sceneLocked;
}
function getSceneLocked(){
    return sceneLocked;
}

//All event handlers that cause game state updates should call this
//Inversely, it would be nice if nothing after initialization called this except the event handlers
function runGameUpdate(){
    H_Log('game updating');
    
    //required systems
    DIALOG.update_system();
    ACTIONS.update_system();
    
    //mods
    //Is there any way we could literally make this mods? Make it so the list of cells is in the HAE,
    //And literally have users be able to delete specific cell types if they so desire
    //Which means that the file that processes the cells logic also processes the HTML, the HTML stuff isn't insude game_view.js
    MAP_GRID.update_system(); //Location seems such a universal concept of adventure games that it might make sense to not have that be optional
    
    //html (required)
    updateScreen();

    newScene = '';
    cells_disabled = false;
}
