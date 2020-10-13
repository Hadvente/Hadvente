/*jshint esversion: 6 */ 

/*Other dialog functions not in test: FUNCTION_CALL, INSERT_SCENE*/

/*
dialog.js
This could be the biggest file in the system
What it does is interprets both HAE_GAME and GAME_STATE and convert it into the html string that will
appear in the main dialog box. It also will find the set of action buttons
*/

var hasNewDialog = false;
var dialogHTML = '';
function initializeDialogEngine(){
    //I have no idea what dialog would need to initiate, shouldn't it just read from things
    //and not actually manipulate anything else?
    ////Maybe the history system??
    var parsedScene = parseScene( 'START' );
    if( !parsedScene ){
        console.error('You cannot have a valid game without a scene named "START"!');
    }
    dialogHTML = parsedScene.html;
    hasNewDialog = true;
    setNewActions(parsedScene.actions);
    //Actually, one really good use for the initialize:
    //Convert the human-readable info in get_HAE() into code-readable data structures
    //For example, location_scenes is hard to parse in code, we don't want to do that each time
}

function updateDialog(){
    var newScene = false;
    //need to check if action button was clicked to update scene
    //need to check if map button was clicked to update scene
    newScene = getNewScene();

    if(newScene){
        var parsedScene = parseScene(newScene);
        if(parsedScene){
            dialogHTML = parsedScene.html;
            hasNewDialog = true;
            setNewActions(parsedScene.actions);
        }
    }
}

//Very little talks to DIALOG, mostly DIALOG tells and asks other modules things
//DIALOG asks for the current map position, DIALOG asks for the party's commentary, etc
//Even the Action Buttons do not talk to Dialog, instead DIALOG asks the Actions.js file if an action was pressed
var DIALOG = {
    hasNewDialog(){
        return hasNewDialog;
    },
    getDialogHtml(){
        return dialogHTML;
    },
    confirmDialogUpdated(){
        hasNewDialog = false;
    },
    getCurrentDialogActions(){
        //This is stored in dialog.js because it's actually the current scene's text
        //that defines the list of actions.
        return {};
    }
};

function parseScene(_string){
    var sceneText = get_HAE().text[_string];
    if(!sceneText){
        console.error('Scene passed in that does not exist:', _string);
        return '';
    }
    var parsedScene = HAE_PARSER.parseHAE(sceneText);

    var processedHAEScript = processHAEScript(parsedScene);


    return processedHAEScript;
}

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
function processHAEScript(_parsedArr){
    var html = '';
    var actions = [];

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
                return true;
            });
            return;
        }
        if(_command.type == 'DISABLE_CELLS'){

        }
        if(_command.type == 'FN' || _command.type == 'FUNCTION'){
            processFunctionStatement( _command.value );
        }
        if(_command.type == 'SET'){
            processSetStatement( _command.value );
        }
        if(_command.type == 'INSERT_EVENT'){
            //event adds a random scene from a given object def for events
            //need to parse the scene and then call processHAEScript to get html and actions
            console.error('INSERT_EVENT is unimplemented');
        }
        if(_command.type == 'INSERT_SCENE'){
            //scene adds a specific scene to the dialog
            //need to parse the scene and then call processHAEScript to get html and actions
            console.error('INSERT_SCENE is unimplemented');
        }
        /* ACTION */
        if(_command.type == 'ACTION'){
            actions.push( getActionFromStatement(_command.value) );
        }
        if(_command.type == 'GOTO'){ //action shortcut for scenechange
            actions.push( getActionFromStatement(_command.type + ' ' + _command.value) );
        }
        if(_command.type == 'SCENE'){
            //SCENE is just a shortcut for ACTION SCENE
            //I was going to make it be like EVENT but with a specific scene, but that could lead to confusion
            actions.push('SCENE ' + _command.value);
        }
        /* IMAGE/IMG */
        if(_command.type == 'IMAGE' || _command.type == 'IMG'){
            html += getImageHTML(_command.value);
        }

        /* TEXT */
        if(_command.type == 'TEXT'){
            html += processTextStatement(_command.value) || '';
        }
    });

    return {html, actions};
}
/*

ooooooooooooo oooooooooooo ooooooo  ooooo ooooooooooooo 
8'   888   `8 `888'     `8  `8888    d8'  8'   888   `8 
     888       888            Y888..8P         888      
     888       888oooo8        `8888'          888      
     888       888    "       .8PY888.         888      
     888       888       o   d8'  `888b        888      
    o888o     o888ooooood8 o888o  o88888o     o888o     

 */

function processTextStatement(_text_value){
    var textSplit = _text_value.split(/\s*\r?\n|\s*\r(?!\n)/g);
    if( !textSplit[0] ) textSplit.shift(); //we don't want the first newline, it's only there for json readability
    if( !_.last(textSplit) ) textSplit.pop(); //we don't want the last newline, it's only there for json readability
    textSplit = _.map(textSplit,function(_str){
        if( !_str ){
            //How should we handle blank lines?
            return ' <div class="dialog_blank_line"> </div> ';
        }
        return '<p>' + _str + '</p>';
    });
    return textSplit.join('');
}

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
function processIfStatement(_IF){
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
            value = get_HAE().FN[ spaceSplit[1] ]( get_GAME_STATE(), get_HAE() );
        }catch(e) {
            console.error('There is an error when you call the  logic function ' + spaceSplit[1], e);
        }

        return value;
    }
    else{
        console.error('Can only handle FN type IF statements for now');
    }
}

/*

oooooooooooo ooooo     ooo ooooo      ooo   .oooooo.   ooooooooooooo ooooo   .oooooo.   ooooo      ooo 
`888'     `8 `888'     `8' `888b.     `8'  d8P'  `Y8b  8'   888   `8 `888'  d8P'  `Y8b  `888b.     `8' 
 888          888       8   8 `88b.    8  888               888       888  888      888  8 `88b.    8  
 888oooo8     888       8   8   `88b.  8  888               888       888  888      888  8   `88b.  8  
 888    "     888       8   8     `88b.8  888               888       888  888      888  8     `88b.8  
 888          `88.    .8'   8       `888  `88b    ooo       888       888  `88b    d88'  8       `888  
o888o           `YbodP'    o8o        `8   `Y8bood8P'      o888o     o888o  `Y8bood8P'  o8o        `8  

 */

function processFunctionStatement(_FN){
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
        value = get_HAE().FN[ spaceSplit[0] ]( get_GAME_STATE(), get_HAE() );
    }catch(e) {
        console.error('There is an error when you call the function ' + spaceSplit[0], e);
    }

    return value;
}

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
function processSetStatement(_FN){
    var spaceSplit = _FN.split(/\s+/);

    if(spaceSplit[0] == 'FN' || spaceSplit[0] == 'FUNCTION'){
        spaceSplit.shift();
        processFunctionStatement(spaceSplit.join(' '));
    }
    else{
        if(spaceSplit[1] !== '='){
            console.error('Need to have = sign inbetween variable name and value, ie <<[SET money = 5]>>');
        }
        get_GAME_STATE()[spaceSplit[0]] = spaceSplit[2];
    }
    return value;
}

/*

      .o.         .oooooo.   ooooooooooooo ooooo   .oooooo.   ooooo      ooo  .oooooo..o 
     .888.       d8P'  `Y8b  8'   888   `8 `888'  d8P'  `Y8b  `888b.     `8' d8P'    `Y8 
    .8"888.     888               888       888  888      888  8 `88b.    8  Y88bo.      
   .8' `888.    888               888       888  888      888  8   `88b.  8   `"Y8888o.  
  .88ooo8888.   888               888       888  888      888  8     `88b.8       `"Y88b 
 .8'     `888.  `88b    ooo       888       888  `88b    d88'  8       `888  oo     .d8P 
o88o     o8888o  `Y8bood8P'      o888o     o888o  `Y8bood8P'  o8o        `8  8""88888P'  

*/

function getActionFromStatement(_action){
    var spaceSplit = _action.split(/\s+/);
    var actionType = spaceSplit.shift();
    spaceSplit = spaceSplit.join(' ');
    var values = spaceSplit.split('||');
    return { actionType, values };
}

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
function getImageHTML(_src){
    //example _src = Images/LivingRoom.jpg
    var html = '<img src="' + _src + '.jpg">';
    return html;
}
