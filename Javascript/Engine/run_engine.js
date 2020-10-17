/*jshint esversion: 6 */ 

/*
run_engine.js
This file loads and runs HADVENTE.
It also facillitates the communication between modules
There are multiple modules to take care of:
dialog
map
game_view
 */

function initializeEngine(){
    STATE.initializeGameState();
    initializeHistory();
    initializeSaveSystem();
    //initializeSettings(); //This asks for the settings from load_save_data, or makes a new default settings if there isn't one

    createModulesIfNeeded();
    checkFunctionListForModules();
    
    //initialize required cells
    HAE_PROCESSOR.initialize();

    //NAME.initialize();
    //MENU.initialize();

    _.each(MODULES, function(_module, _name){
        _module.initialize();
    });

    initializeGameHtml(); //Right now the game has to make it's own start menu as a dialog scene, but I could rework this to have actual start menus

    if( autoload && has_save_file('AUTO') ) STATE.LOAD_STATE( get_save_file('AUTO') );

    _.delay(runGameUpdate, 50);
}

//All event handlers that cause game state updates should call this
//Inversely, it would be nice if nothing after initialization called this except the event handlers
function runGameUpdate(){
    H_Log('about to update game, making autosave');

    history_update();

    pre_scene_update_modules();

    HAE_PROCESSOR.update_scene();

    update_modules();

    updateScreen();

    finished_draw_modules();

    newScene = '';
    cells_disabled = false;
}

function pre_scene_update_modules(){

    H_Log('game preprocessing modules');

    _.each(MODULES, function(_module, _name){
        if(_module.optional_pre_scene_update) _module.optional_pre_scene_update();
    });
}

function update_modules(){

    H_Log('game updating modules');

    _.each(MODULES, function(_module, _name){
        _module.update_module();
    });
}

function finished_draw_modules(){

    H_Log('game finished drawing modules');

    _.each(MODULES, function(_module, _name){
        _module.finished_draw();
    });
}

function createModulesIfNeeded(){
    _.each(MODULES, function(_module, _name){
        if( _.isFunction(_module) ) MODULES[_name] = _module();
        if( !_.isObject( MODULES[_name] ) ){
            console.error('WARNING: The module ' + _name + ' is not an object or a function that returns an object');
        }
    });
}

function checkFunctionListForModules(){
    _.each(MODULES, function(_module, _name){
        checkFunctionListForSingleModule(_module, _name);
    });
}

var requiredFunctions = ['initialize', 'update_module', 'init_HTML', 'update_HTML', 'finished_draw', 'restart_module'];
function checkFunctionListForSingleModule(_module, _name){
    _.each(requiredFunctions, function(_fn){
        if( !_module[_fn] ){
            console.error('WARNING: The module ' + _name + ' is missing the function\n\n"' + _fn + '"\n\n' +
                                'Each module must have these public functions:\n    ' + requiredFunctions.join('\n    '));
        }
    });
}
