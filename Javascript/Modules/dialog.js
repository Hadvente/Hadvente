/*jshint esversion: 6 */ 

/*
dialog.js
This could be the biggest file in the system
What it does is interprets both HAE_GAME and GAME_STATE and convert it into the html string that will
appear in the main dialog box. It also will find the set of action buttons
*/

var DIALOG = (function () {
    
    var DIALOG_FNs = {};

    /*

    ooooooooo.   ooooo     ooo oooooooooo.  ooooo        ooooo   .oooooo.   
    `888   `Y88. `888'     `8' `888'   `Y8b `888'        `888'  d8P'  `Y8b  
     888   .d88'  888       8   888     888  888          888  888          
     888ooo88P'   888       8   888oooo888'  888          888  888          
     888          888       8   888    `88b  888          888  888          
     888          `88.    .8'   888    .88P  888       o  888  `88b    ooo  
    o888o           `YbodP'    o888bood8P'  o888ooooood8 o888o  `Y8bood8P'  

    */
   
    var hasNewDialog = false;
    var dialogHTML = '';
    DIALOG_FNs.initialize = function(){
        //I have no idea what dialog would need to initiate, shouldn't it just read from things
        //and not actually manipulate anything else?
        
        STATE.GET_STATE().CURRENT_SCENE = 'START';

        //Actually, one really good use for the initialize:
        //Convert the human-readable info in get_HAE() into code-readable data structures
    };
    DIALOG_FNs.update_module = function(){
        var newScene = STATE.GET_STATE().CURRENT_SCENE;

        if(newScene){
            var parsedScene = parseScene(newScene);
            if(parsedScene){
                dialogHTML = parsedScene.html;
                hasNewDialog = true;
                ACTIONS.SET_NEW_ACTIONS(parsedScene.actions);
                STATE.SET_SCENE_LOCKED(parsedScene && parsedScene.sceneLocked);
            }
            else{
                ACTIONS.SET_NEW_ACTIONS([]);
                STATE.SET_SCENE_LOCKED(false);

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
            // if(STATE.GET_STATE().CURRENT_SCENE == '<<NONE>>'){
            //     return;
            //     //THE SCENE SHOULD NOT BE UPDATED?
            //     //Actually this is a horrible way to do it
            //     //I could see a scene deciding it needs to happen multiple times in a row with IF statements, so I can't check for no change
            //     //maybe the modules should call a function like DIALOG.useSameDialog()? Or maybe it's a special case for SET_NEW_SCENE()?
            //     //Or maybe the "recalculate scene" is a special action? So the inverse of the above line
            // }
            console.error('Someone set the current scene value to an empty string!');
        }
    };
    DIALOG_FNs.hasNewDialog = function(){
        return hasNewDialog;
    };
    DIALOG_FNs.getDialogHtml = function(){
        return dialogHTML;
    };

    DIALOG_FNs.SET_NEW_SCENE = function(_newScene){

        //NOTICE: No one should call SET_NEW_SCENE with the expectation for things to happen before the scene starts
        
        STATE.GET_STATE().CURRENT_SCENE = _newScene;
        runGameUpdate();
    };

    DIALOG_FNs.finished_draw = function(){
        //does nothing for now
        hasNewDialog = false;
    };

    DIALOG_FNs.restart_module = function(){
        //This is called when the game_state is modified by the save system
        //Anything that must be modified when a save is loaded should happen here
    };

    /*
    
    ooooo   ooooo ooooooooooooo ooo        ooooo ooooo        
    `888'   `888' 8'   888   `8 `88.       .888' `888'        
     888     888       888       888b     d'888   888         
     888ooooo888       888       8 Y88. .P  888   888         
     888     888       888       8  `888'   888   888         
     888     888       888       8    Y     888   888       o 
    o888o   o888o     o888o     o8o        o888o o888ooooood8 
    
     */
    
    var $Dialog = {};
    DIALOG_FNs.init_HTML = function(_$Cell){
        _$Cell.append(`<div id="MainDialogContainer">
            <div id="MainDialogScrollbar">
                <div id="MainDialogTextHolder" class="standard_font">
                </div>
            </div>
        </div>`);
        $Dialog = $('#MainDialogTextHolder');
    };

    DIALOG_FNs.update_HTML = function(){
        if(DIALOG.hasNewDialog()){
            $Dialog.html(DIALOG.getDialogHtml());
        }
    };
    /*
    
    ooooooooo.   ooooooooo.   ooooo oooooo     oooo       .o.       ooooooooooooo oooooooooooo 
    `888   `Y88. `888   `Y88. `888'  `888.     .8'       .888.      8'   888   `8 `888'     `8 
     888   .d88'  888   .d88'  888    `888.   .8'       .8"888.          888       888         
     888ooo88P'   888ooo88P'   888     `888. .8'       .8' `888.         888       888oooo8    
     888          888`88b.     888      `888.8'       .88ooo8888.        888       888    "    
     888          888  `88b.   888       `888'       .8'     `888.       888       888       o 
    o888o        o888o  o888o o888o       `8'       o88o     o8888o     o888o     o888ooooood8 

     */
    
    var parseScene = function(_string){
        var sceneText = get_HAE().text[_string];
        if(!sceneText){
            console.error('Scene passed in that does not exist:', _string);
            return '';
        }
        var parsedScene = HAE_PARSER.parseHAE(sceneText);

        var processedHAEScript = processHAEScript(parsedScene);

        return processedHAEScript;
    };

    /*

    ooooooooo.   ooooooooo.     .oooooo.     .oooooo.   oooooooooooo  .oooooo..o  .oooooo..o 
    `888   `Y88. `888   `Y88.  d8P'  `Y8b   d8P'  `Y8b  `888'     `8 d8P'    `Y8 d8P'    `Y8 
     888   .d88'  888   .d88' 888      888 888           888         Y88bo.      Y88bo.      
     888ooo88P'   888ooo88P'  888      888 888           888oooo8     `"Y8888o.   `"Y8888o.  
     888          888`88b.    888      888 888           888    "         `"Y88b      `"Y88b 
     888          888  `88b.  `88b    d88' `88b    ooo   888       o oo     .d8P oo     .d8P 
    o888o        o888o  o888o  `Y8bood8P'   `Y8bood8P'  o888ooooood8 8""88888P'  8""88888P'  
                                                                                             
     */

    //This has side effects BY DESIGN
    //Processing an HAEScript will modify values of your game
    //Do not process an HAEScript unless you want to modify the system
    var processHAEScript = function(_parsedArr){
        var html = '';
        var actions = [];
        var sceneLocked = false;

        //Random note: this format is not good. I need to think of a better way to make the command list easily modifiable and extensible.
        _.each(_parsedArr, function(_command){
            if( _.isArray(_command) ){
                //This part is logic control!
                //loop over array and figure out which if/elseif/else is valid
                //_.find will quit once something is true
                _.find(_command, function(_logic){
                    var contents;
                    if(_logic.type !== 'ELSE'){
                        //This is an IF or ELSEIF
                        //ELSE statements should always run if nothing else was hit, so we don't check if they're valid
                        var isValid = processIfStatement(_logic.value);
                        if( !isValid ) return;
                    }
                    contents = processHAEScript(_logic.list);
                    html += contents.html;
                    actions = actions.concat(contents.actions);
                    sceneLocked = sceneLocked || contents.sceneLocked;
                    return true;
                });
                return;
            }
            if(_command.type == 'DISABLE_CELLS'){
                sceneLocked = true;
                return;
            }
            if(_command.type == 'FN' || _command.type == 'FUNCTION'){
                processFunctionStatement( _command.value );
                return;
            }
            if(_command.type == 'SET'){
                processSetStatement( _command.value );
                return;
            }
            if(_command.type == 'INSERT_EVENT'){
                //event adds a random scene from a given object def for events
                //need to parse the scene and then call processHAEScript to get html and actions
                console.error('INSERT_EVENT is unimplemented');
                return;
            }
            if(_command.type == 'INSERT_SCENE'){
                //scene adds a specific scene to the dialog
                //need to parse the scene and then call processHAEScript to get html and actions
                console.error('INSERT_SCENE is unimplemented');
                return;
            }
            /* ACTION */
            if(_command.type == 'ACTION'){
                actions.push( getActionFromStatement(_command.value) );
                return;
            }
            if(_command.type == 'GOTO'){ //action shortcut for scenechange
                actions.push( getActionFromStatement(_command.type + ' ' + _command.value) );
                return;
            }
            if(_command.type == 'SCENE'){
                //SCENE is just a shortcut for ACTION SCENE
                //I was going to make it be like EVENT but with a specific scene, but that could lead to confusion
                actions.push('SCENE ' + _command.value);
                return;
            }
            /* IMAGE/IMG */
            if(_command.type == 'IMAGE' || _command.type == 'IMG'){
                html += getImageHTML(_command.value);
                return;
            }

            /* TEXT */
            if(_command.type == 'TEXT'){
                html += processTextStatement(_command.value) || '';
                return;
            }

            if(_command.type == 'COMMENT'){
                //It's a comment, don't do anything
                return;
            }

            console.error('Command type unknown:' + _command.type);
        });

        return {html, actions, sceneLocked};
    };
    /*

    ooooooooooooo oooooooooooo ooooooo  ooooo ooooooooooooo 
    8'   888   `8 `888'     `8  `8888    d8'  8'   888   `8 
         888       888            Y888..8P         888      
         888       888oooo8        `8888'          888      
         888       888    "       .8PY888.         888      
         888       888       o   d8'  `888b        888      
        o888o     o888ooooood8 o888o  o88888o     o888o     

     */

    var processTextStatement = function(_text_value){
        var textSplit = _text_value.split(/[ \t]*\r?\n|[ \t]*\r(?!\n)/g);
        if( !textSplit[0] ) textSplit.shift(); //we don't want the first newline, it's only there for json readability
        if( !_.last(textSplit) ) textSplit.pop(); //we don't want the last newline, it's only there for json readability
        textSplit = _.map(textSplit,function(_str){
            if( !_str ){
                //How should we handle blank lines?
                return ' <div class="dialog_blank_line"> </div> ';
            }
            return '<p>' + _str + '</p>';
        });
        H_Log('Text section became:', textSplit);
        return textSplit.join('');
    };

    /*

    ooooo oooooooooooo 
    `888' `888'     `8 
     888   888         
     888   888oooo8    
     888   888    "    
     888   888         
    o888o o888o     

     */
    //It would be cool if we could force IF functions to not be able to modify the game state, but it looks like that would require a clone to freeze, which isn't performant
    var processIfStatement = function(_IF){
        var spaceSplit = _IF.split(/\s+/);
        if(spaceSplit[0] == 'FN'){
            if( !get_HAE().functions ){
                console.error('Cannot use IF FN if you do not have a functions key inside the HAE def');
            }
            if( !spaceSplit[1] ){
                console.error('Cannot use IF FN without a function name afterwards');
            }
            if( !get_HAE().FN[ spaceSplit[1] ] ){
                console.error('Cannot use IF FN with undefined function name ' + spaceSplit[1]);
            }
            var value = '';
            try{
                value = get_HAE().FN[ spaceSplit[1] ]( GET_GAME_DATA(), GET_CELL_DATA(), get_HAE() );
            }catch(e) {
                console.error('There is an error when you call the  logic function ' + spaceSplit[1], e);
            }

            return value;
        }
        else{
            console.error('Can only handle FN type IF statements for now');
        }
    };

    /*

    oooooooooooo ooooo     ooo ooooo      ooo   .oooooo.   ooooooooooooo ooooo   .oooooo.   ooooo      ooo 
    `888'     `8 `888'     `8' `888b.     `8'  d8P'  `Y8b  8'   888   `8 `888'  d8P'  `Y8b  `888b.     `8' 
     888          888       8   8 `88b.    8  888               888       888  888      888  8 `88b.    8  
     888oooo8     888       8   8   `88b.  8  888               888       888  888      888  8   `88b.  8  
     888    "     888       8   8     `88b.8  888               888       888  888      888  8     `88b.8  
     888          `88.    .8'   8       `888  `88b    ooo       888       888  `88b    d88'  8       `888  
    o888o           `YbodP'    o8o        `8   `Y8bood8P'      o888o     o888o  `Y8bood8P'  o8o        `8  

     */

    var processFunctionStatement = function(_FN){
        var spaceSplit = _FN.split(/\s+/);

        if( !get_HAE().functions ){
            console.error('Cannot use FN/FUNCTION if you do not have a functions key inside the HAE def');
        }
        if( !spaceSplit[0] ){
            console.error('Cannot use FN/FUNCTION without a function name afterwards');
        }
        if( !get_HAE().FN[ spaceSplit[0] ] ){
            console.error('Cannot use FN/FUNCTION with undefined function name ' + spaceSplit[1]);
        }
        var value = '';
        try{
            value = get_HAE().FN[ spaceSplit[0] ]( GET_GAME_DATA(), GET_CELL_DATA(), get_HAE() );
        }catch(e) {
            console.error('There is an error when you call the function ' + spaceSplit[0], e);
        }

        return value;
    };

    /*

     .oooooo..o oooooooooooo ooooooooooooo 
    d8P'    `Y8 `888'     `8 8'   888   `8 
    Y88bo.       888              888      
     `"Y8888o.   888oooo8         888      
         `"Y88b  888    "         888      
    oo     .d8P  888       o      888      
    8""88888P'  o888ooooood8     o888o     

     */
    //This sets a variable into the state
    //can call FN, if someone wants to set a bunch of things inside a function
    //or can directly set varname = value
    var processSetStatement = function(_FN){
        var spaceSplit = _FN.split(/\s+/);

        if(spaceSplit[0] == 'FN' || spaceSplit[0] == 'FUNCTION'){
            spaceSplit.shift();
            processFunctionStatement(spaceSplit.join(' '));
        }
        else{
            if(spaceSplit[1] !== '='){
                console.error('Need to have = sign inbetween variable name and value, ie <<[SET money = 5]>>');
            }
            GET_GAME_DATA()[spaceSplit[0]] = spaceSplit[2];
        }
        return value;
    };

    /*

          .o.         .oooooo.   ooooooooooooo ooooo   .oooooo.   ooooo      ooo  .oooooo..o 
         .888.       d8P'  `Y8b  8'   888   `8 `888'  d8P'  `Y8b  `888b.     `8' d8P'    `Y8 
        .8"888.     888               888       888  888      888  8 `88b.    8  Y88bo.      
       .8' `888.    888               888       888  888      888  8   `88b.  8   `"Y8888o.  
      .88ooo8888.   888               888       888  888      888  8     `88b.8       `"Y88b 
     .8'     `888.  `88b    ooo       888       888  `88b    d88'  8       `888  oo     .d8P 
    o88o     o8888o  `Y8bood8P'      o888o     o888o  `Y8bood8P'  o8o        `8  8""88888P'  

    */

    var getActionFromStatement = function(_action){
        var spaceSplit = _action.split(/\s+/);
        var actionType = spaceSplit.shift();
        spaceSplit = spaceSplit.join(' ');
        var values = spaceSplit.split('||');
        return { actionType, values };
    };

    /*

    ooooo ooo        ooooo       .o.         .oooooo.    oooooooooooo  .oooooo..o 
    `888' `88.       .888'      .888.       d8P'  `Y8b   `888'     `8 d8P'    `Y8 
     888   888b     d'888      .8"888.     888            888         Y88bo.      
     888   8 Y88. .P  888     .8' `888.    888            888oooo8     `"Y8888o.  
     888   8  `888'   888    .88ooo8888.   888     ooooo  888    "         `"Y88b 
     888   8    Y     888   .8'     `888.  `88.    .88'   888       o oo     .d8P 
    o888o o8o        o888o o88o     o8888o  `Y8bood8P'   o888ooooood8 8""88888P'  
                                                                                  
     */
    /*
    Should the image code have it's own file? It will be used both by the dialog system and by the Image Cell, and possibly even the game title!
    So we really need 3 functions, one for each. Or maybe we just need 2, I could expect the title and the image cell to use the same thing, just with a parameter for a class/ID
    In fact, the Image Cell should only need to modify the src tag, not be recreated each time. So we can put that in the above update function instead.
    And the name shouldn't even HAVE an update function
    Which means, there shouldn't be a getImageHTML function inside this file at all
    As the dialog.js file is approved for it's own html
     */
    var getImageHTML = function(_src){
        //example _src = Images/LivingRoom.jpg
        var html = '<img src="' + _src + '.jpg">';
        return html;
    };

    //Returns public functions into the variable
    return DIALOG_FNs;
})();
