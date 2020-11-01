/*jshint esversion: 6 */ 

/*
game_state.js
 */

//Holds the functions that communicate with the Game State
(function(){

    var GAME_STATE = {};

    STATE.initializeGameState = function(){
        ///one important consideration is how the save and load system works, as that system directly manipulates GAME_STATE
        ///It would make sense to me for GAME_STATE to be able to receive a new GAME_STATE object from the save-load file for loading
        ///NOTE: Game State must represent your entire save file
        ///You cannot save any info OUTSIDE the save file! Make sure that that doesn't happen or your save will break!
        GAME_STATE = {GAME_DATA: {}, CELL_DATA: {}, SCENE_DATA: {}, META_DATA: {}, CURRENT_SCENE: ''};

        STATE.GET_STATE().CURRENT_SCENE = 'START'; //The Game_state creator sets this value, because having anyone else set it would break autosave load
        _.each(MODULES, function(_module, _name){
            GAME_STATE.CELL_DATA[ _name ] = {};
        });
        GAME_STATE.META_DATA.scene_count = 0;
        GAME_STATE.META_DATA.created = Date.now();
    };

    STATE.GET_GAME_DATA = function(){
        return GAME_STATE.GAME_DATA;
    };
    STATE.GET_CELL_DATA = function(_name){
        return GAME_STATE.CELL_DATA[_name];
    };
    STATE.GET_SCENE_DATA = function(){
        return GAME_STATE.SCENE_DATA || {};
    };
    STATE.SET_SCENE_DATA = function( _scene_data_obj ){
        GAME_STATE.SCENE_DATA = _scene_data_obj || {};
    };


    STATE.GET_STATE = function(){
        return GAME_STATE;
    };
    STATE.LOAD_STATE = function( _state, _no_history ){
        GAME_STATE = _state;
        _.each(MODULES, function(_module, _name){
            _module.restart_module();
        });
        ENGINE.runGameUpdate(_no_history);
    };

    STATE.finished_update = function(){
        GAME_STATE.META_DATA.scene_count++;
    };
}).call();
