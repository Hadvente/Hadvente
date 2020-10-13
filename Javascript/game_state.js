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

    checkFunctionListForModules();
    
    //initialize required cells
    DIALOG.initialize();
    ACTIONS.initialize();
    //NAME.initialize();
    //MENU.initialize();

    _.each(MODULES, function(_module, _name){
        _module.initialize();
    });

    initializeAllModules();

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
    DIALOG.update_module();
    ACTIONS.update_module();
    
    //mods
    _.each(MODULES, function(_module, _name){
        _module.update_module();
    });

    //html (required)
    updateScreen();

    _.each(MODULES, function(_module, _name){
        _module.finished_draw();
    });

    newScene = '';
    cells_disabled = false;
}

var moduleList = {};
function addModuleToHADVANTE(_module){
    var name = _module.NAME;
    if( !name ){
        console.error('The module must have a key "NAME"');
    }
    if(moduleList[name]){
        console.error('We have multiple modules with the name ' + name);
    }
    moduleList[name] = _module;
}

function initializeAllModules(){
    _.each(moduleList, function(_module, _module_name){
        _module.initialize();
    });
}

function checkFunctionListForModules(){
    var requiredFunctions = ['initialize', 'update_module', 'init_HTML', 'update_HTML', 'finished_draw'];

    _.each(MODULES, function(_module, _name){
        _.each(requiredFunctions, function(_fn){
            if( !_module[_fn] ){
                console.error('WARNING: The module ' + _name + ' is missing the function\n\n"' + _fn + '"\n\n' +
                                    'Each module must have these public functions:\n    ' + requiredFunctions.join('\n    '));
            }
        });
    });
}
