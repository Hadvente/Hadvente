/*jshint esversion: 6 */ 

/*
run_engine.js
This file loads and runs the engine
 */

(function(){
    ENGINE.initializeEngine = function(){
        STATE.initializeGameState();
        HISTORY.initializeHistory();
        SAVES.initializeSaveSystem();
        //initializeSettings(); //This asks for the settings from load_save_data, or makes a new default settings if there isn't one

        createModulesIfNeeded();
        checkFunctionListForModules();
        
        HAE_SCENE.initialize();

        _.each(MODULES, function(_module, _name){
            _module.initialize();
        });

        VIEW.initializeGameHtml(); //Right now the game has to make it's own start menu as a dialog scene, but I could rework this to have actual start menus

        initKeyPresses();

        if( autoload ) SAVES.load_save_file('AUTO');

        _.delay(ENGINE.runGameUpdate, 50);
    };

    //All event handlers that cause game state updates should call this
    //Inversely, it would be nice if nothing after initialization called this except the event handlers
    ENGINE.runGameUpdate = function( _no_history_update ){
        H_Log('ENGINE', 'about to update game, making autosave');

        if( !_no_history_update) HISTORY.history_update();
        
        HISTORY.log_history();

        pre_scene_update_modules();

        HAE_SCENE.update_scene();

        update_modules();

        VIEW.updateScreen();

        finished_draw_modules();

        STATE.finished_update();

        newScene = '';
        cells_disabled = false;
    };

    function pre_scene_update_modules(){

        H_Log('ENGINE', 'game preprocessing modules');

        _.each(MODULES, function(_module, _name){
            if(_module.optional_pre_scene_update) _module.optional_pre_scene_update();
        });
    }

    function update_modules(){

        H_Log('ENGINE', 'game updating modules');

        _.each(MODULES, function(_module, _name){
            _module.update_module();
        });
    }

    function finished_draw_modules(){

        H_Log('ENGINE', 'game finished drawing modules');

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


    var KeyPressFns = {};
    function initKeyPresses(){
        $(document).bind('keyup', function(e) {
            _.each(KeyPressFns, function(_fn){
                    _fn(e);
            });
        });
    }
    ENGINE.addKeyPress = function(_name, _fn){
        KeyPressFns[_name] = _fn;
    };
    ENGINE.removeKeyPress = function(_name){
        delete KeyPressFns[_name];
    };
}).call();
