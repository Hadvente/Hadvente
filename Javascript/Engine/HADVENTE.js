/*jshint esversion: 6 */ 

//HADVENTE 0.1 - Made by Caleb Holloway
//
//This file loads the HAE_GAME file, which represents the text adventure itself (written in .hae file format),
//and also starts the game_state_engine itself
//If I rewrite HADVENTE to have a start menu, that might have to be in here, since I need access
//to the story to get what belongs on the start menu (though I doubt I'm going to bother with a start menu)

function startHADVENTE(){
    
    get_HAE_GAME();
    if( !HAE_GAME ) return;

    checkUrlParms();

    ENGINE.initializeEngine();
}

var HAE_GAME;
function get_HAE_GAME(){
    
    var noTextFile = false;
    try {
        var unusedCheck = HAE;
    }catch(e) {
        noTextFile = true;
    }

    if ( noTextFile ) {
        var errorMessage = 'ERROR: No HAE file set in HTML file. As the HAE file defines the game, there is no game to currently be played!'; 
        console.error(errorMessage);
        document.body.innerHTML = errorMessage;
        return;
    }
    else {
        HAE_GAME = HAE;
        if( HAE_GAME.FN ){
            var errorMsg = 'ERROR: Cannot have key named FN, need key to be named functions'; 
            console.error(errorMsg);
            document.body.innerHTML = errorMsg;
        }
        HAE_GAME.FN = {};
        _.each(HAE_GAME.functions, function(_fnTypes){
            _.each(_fnTypes, function(_fn, _fn_name){
                if( HAE_GAME.FN[_fn_name] ){
                    console.error('function names cannot conflict even across function types:', _fn_name);
                }
                HAE_GAME.FN[_fn_name] = _fn;
            });
        });
        //HAE_GAME is an IMMUTABLE SINGLETON, this converts HAE_GAME into a read-only object
        Object.freeze(HAE_GAME);
    }
}

function get_HAE(){
    return HAE_GAME;
}
//I am temporarily putting this here while I design a system for HAE helper functions
function getCellLocation( _module_name ){
    if( !get_HAE()[_module_name] ){
        return '';
    }
    if( get_HAE()[_module_name].CELL === undefined ){
        H_Error('The module ' + _module_name + ' is missing a CELL value. If you want to temporarily hide the cell, use "NONE", "HIDDEN", or null.');
        return '';
    }
    if( get_HAE()[_module_name].CELL == 'NONE' || get_HAE()[_module_name].CELL == 'HIDDEN' || get_HAE()[_module_name].CELL === null ){
        return '';
    }
    return get_HAE()[_module_name].CELL;
}

var autoload = false;
var URLS = {};
function checkUrlParms(){
    var urlParmString = window.location.search;
    if( urlParmString.includes('log') ) URLS.isLogging = true;
    if( urlParmString.includes('autoload') ) URLS.autoload = true;
    if( urlParmString.includes('debug_cells') ) URLS.debug_cells = true;
    if(urlParmString.includes('outline')){
        $('body').addClass('debug_outline');
    }
    //it could make sense to always autoload save, since the
    //user should click restart if they want to go back to the beginning
}

function H_Log(_type, _log, _obj){
    if(!URLS.isLogging) return;
    if(_obj) console.log('TYPE: ' + _type + ' - ' + _log, _obj);
    else console.log('TYPE: ' + _type + ' - ' + _log);
}

function H_Log_Active(){
    return URLS.isLogging;
}

function H_Error(_log, _obj){
    if(_obj) console.error(_log, _obj);
    else console.error(_log);
}
