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

var isLogging = false;
var autoload = false;
function checkUrlParms(){
    var urlParmString = window.location.search;
    if( urlParmString.includes('log') ) isLogging = true;
    if( urlParmString.includes('autoload') ) autoload = true;
}

function H_Log(_type, _log, _obj){
    if(!isLogging) return;
    if(_obj) console.log('TYPE: ' + _type + ' - ' + _log, _obj);
    else console.log('TYPE: ' + _type + ' - ' + _log);
}

function H_Log_Active(){
    return isLogging;
}

function H_ERROR(_log, _obj){
    if(_obj) console.error(_log, _obj);
    else console.error(_log);
}
