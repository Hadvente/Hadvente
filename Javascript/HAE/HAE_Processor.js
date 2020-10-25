/*jshint esversion: 6 */ 

/*
HAE_Processor.js
This file deals with processing the individual commands of the system
It could have a system where you pass in a list of types and a function that those are associated with
So, then, inside the individual modules that add new types, you can call it like:
HAE_PROCESSOR.AddCommand(['FN', 'FUNCTION'], function(_value){});
*/

var HAE_PROCESSOR = (function () {

    var PROCESSOR_FNs = {};

    PROCESSOR_FNs.PROCESS_SCENE = function(_string){
        var sceneText = get_HAE().text[_string];
        if(!sceneText){
            console.error('Scene passed in that does not exist:', _string);
            return '';
        }
        var parsedScene = HAE_PARSER.parseHAE(sceneText);

        var processedHAEScript = processScene(parsedScene);

        return processedHAEScript;
    };

    function processScene( _parsedArr, _SCENE_DATA ){
        var html = '';
        var SCENE_DATA = _SCENE_DATA || {}; 

        //Arrays are meant for logic flow, like if statements
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
                    contents = processScene(_logic.list, SCENE_DATA);
                    html += contents.html;
                    return true;
                });
            }
            else{
                if( Processors[_command.type] ){
                    var value = Processors[_command.type]( _command.value, SCENE_DATA );
                    if( value && _.isString(value) ){
                        html += value;
                    }
                }
                else{
                    console.error('Command type unknown:' + _command.type, _command.value);
                }
            }
        });

        return {html, SCENE_DATA};
    }

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
                value = get_HAE().FN[ spaceSplit[1] ]( STATE.GET_GAME_DATA(), STATE.GET_STATE(), get_HAE() );
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

      .oooooo.     .oooooo.   ooo        ooooo ooo        ooooo       .o.       ooooo      ooo oooooooooo.    .oooooo..o 
     d8P'  `Y8b   d8P'  `Y8b  `88.       .888' `88.       .888'      .888.      `888b.     `8' `888'   `Y8b  d8P'    `Y8 
    888          888      888  888b     d'888   888b     d'888      .8"888.      8 `88b.    8   888      888 Y88bo.      
    888          888      888  8 Y88. .P  888   8 Y88. .P  888     .8' `888.     8   `88b.  8   888      888  `"Y8888o.  
    888          888      888  8  `888'   888   8  `888'   888    .88ooo8888.    8     `88b.8   888      888      `"Y88b 
    `88b    ooo  `88b    d88'  8    Y     888   8    Y     888   .8'     `888.   8       `888   888     d88' oo     .d8P 
     `Y8bood8P'   `Y8bood8P'  o8o        o888o o8o        o888o o88o     o8888o o8o        `8  o888bood8P'   8""88888P'  

     */
    
    var Processors = {};
    PROCESSOR_FNs.ADD_TYPE = function( _names, _function){
        if( _.isString(_names) ) _names = [_names]; 
        _.each(_names, function(_name){
            Processors[_name] = _function;
        });
    };
    PROCESSOR_FNs.ADD_TYPE(['DISABLE_CELLS', 'LOCKSCENE', 'LOCK_SCENE', 'SCENELOCKED', 'SCENE_LOCKED'], function(_value, _scene_data){
        _scene_data.SCENE_LOCKED = true; //Note, the actions cell does not disable with this, it ignores it
    });

    var processFunctionStatement = function(_value){
        var spaceSplit = _value.split(/\s+/);

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
            value = get_HAE().FN[ spaceSplit[0] ]( STATE.GET_GAME_DATA(), STATE.GET_STATE(), get_HAE() );
        }catch(e) {
            console.error('There is an error when you call the function ' + spaceSplit[0], e);
        }

        return value;
    };

    PROCESSOR_FNs.ADD_TYPE(['SET'], function(_value){
        var spaceSplit = _value.split(/\s+/);

        if(spaceSplit[0] == 'FN' || spaceSplit[0] == 'FUNCTION'){
            spaceSplit.shift();
            processFunctionStatement(spaceSplit.join(' '));
        }
        else{
            if(spaceSplit[1] !== '='){
                console.error('Need to have = sign inbetween variable name and value, ie <<[SET money = 5]>>');
            }
            STATE.GET_GAME_DATA()[spaceSplit[0]] = spaceSplit[2];
        }
    });

    PROCESSOR_FNs.ADD_TYPE(['FN', 'FUNCTION'], function(_value){
        return processFunctionStatement(_value);
    });

    PROCESSOR_FNs.ADD_TYPE(['INSERT_EVENT'], function(_value){
        //TODO
        console.error('INSERT_EVENT is unimplemented');
    });

    PROCESSOR_FNs.ADD_TYPE(['INSERT_SCENE'], function(_value){
        //TODO
        console.error('INSERT_SCENE is unimplemented');
    });
    PROCESSOR_FNs.ADD_TYPE(['COMMENT', '//'], function(_value){
        //It's a comment, don't do anything
    });

    PROCESSOR_FNs.ADD_TYPE(['TEXT'], function(_value){
        var textSplit = _value.split(/[ \t]*\r?\n|[ \t]*\r(?!\n)/g);
        if( !textSplit[0] ) textSplit.shift(); //we don't want the first newline, it's only there for json readability
        if( !_.last(textSplit) ) textSplit.pop(); //we don't want the last newline, it's only there for json readability
        textSplit = _.map(textSplit,function(_str){
            if( !_str ){
                //How should we handle blank lines?
                return ' <div class="dialog_blank_line"> </div> ';
            }
            return '<p>' + _str + '</p>';
        });
        H_Log('HAE', 'Text section became:', textSplit);
        return textSplit.join('');
    });

    //Returns public functions into the variable
    return PROCESSOR_FNs;
})();
