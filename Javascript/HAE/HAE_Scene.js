/*jshint esversion: 6 */ 

/*
HAE_Processor.js
This file deals with processing the individual commands of the system
It could have a system where you pass in a list of types and a function that those are associated with
So, then, inside the individual modules that add new types, you can call it like:
HAE_PROCESSOR.AddCommand(['FN', 'FUNCTION'], function(_value){});
*/

var HAE_SCENE = (function () {

    var SCENE_FNs = {};

    SCENE_FNs.initialize = function(){
    };

    SCENE_FNs.SET_NEW_SCENE = function(_newScene){
        //NOTICE: No one should call SET_NEW_SCENE with the expectation for things to happen before the scene starts
        STATE.GET_STATE().CURRENT_SCENE = _newScene;
        ENGINE.runGameUpdate();
    };

    var dialogHTML = '';
    SCENE_FNs.getDialog = function(){
        return dialogHTML;
    };

    var hasNewDialog = false;
    SCENE_FNs.hasNewDialog = function(){
        return hasNewDialog;
    };

    SCENE_FNs.update_scene = function(){
        hasNewDialog = false;

        var newScene = STATE.GET_STATE().CURRENT_SCENE;

        if(newScene){
            var parsedScene = HAE_PROCESSOR.PROCESS_SCENE( newScene );
            if(parsedScene){
                dialogHTML = parsedScene.html;
                hasNewDialog = true;
                STATE.SET_SCENE_DATA( parsedScene.SCENE_DATA );
            }
            else{
                STATE.SET_SCENE_DATA( {} );

                if(STATE.GET_STATE().CURRENT_SCENE == 'START'){
                    console.error('You cannot have a valid game without a scene named "START"!');
                }
                else{
                    console.error('Your game references the scene "' + STATE.GET_STATE().CURRENT_SCENE +
                                        '" but it does not exist to be parsed!');
                }
            }
        }
        else{
            //PROBLEM: WHAT IF SOMEONE WANTS TO DO A GUI UPDATE THAT DOES NOT INVOLVE CHANGING OR PARSING DIALOG AT ALL?
            //I could see a scene deciding it needs to happen multiple times in a row with IF statements, so I can't check for no change
            //maybe the modules should call a function like HAE_SCENE.useSameDialog()? Or maybe it's a special case for SET_NEW_SCENE()?
            //Or maybe the "recalculate scene" is a special action? So the inverse of the above line
            console.error('Someone set the current scene value to an empty string!');
        }
    };
    
    //Returns public functions into the variable
    return SCENE_FNs;
})();
