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
    //Everything after this is about the individual processor methods
    PROCESSOR_FNs.PROCESS_SCENE = function( _parsedArr ){
        var html = '';
        var sceneLocked = false;

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
                    contents = PROCESSOR_FNs.PROCESS_SCENE(_logic.list);
                    html += contents.html;
                    sceneLocked = sceneLocked || contents.sceneLocked;
                    return true;
                });
            }

            //This is also a required built-in command, since we want commands to only return strings
            else if(_command.type == 'DISABLE_CELLS'){
                sceneLocked = true;
            }
            else{
                if( Processors[_command.type] ){
                    var value = Processors[_command.type](_command.value);
                    if( value && _.isString(value) ){
                        html += value;
                    }
                }
                else{
                    console.error('Command type unknown:' + _command.type, _command.value);
                }
            }
        });

        return {html, sceneLocked};
    };

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

    //Everything after this is about the individual processor methods
    var Processors = {};
    PROCESSOR_FNs.ADD = function( _names, _function){
        if( _.isString(_names) ) _names = [_names]; 
        _.each(_names, function(_name){
            Processors[_name] = _function;
        });
    };

    //Returns public functions into the variable
    return PROCESSOR_FNs;
})();

HAE_PROCESSOR.ADD(['TEXT'], function(_value){
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
    H_Log('Text section became:', textSplit);
    return textSplit.join('');
});

HAE_PROCESSOR.ADD(['SET'], function(_value){
    var spaceSplit = _value.split(/\s+/);

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
});
HAE_PROCESSOR.ADD(['FN', 'FUNCTION'], function(_value){
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
        value = get_HAE().FN[ spaceSplit[0] ]( GET_GAME_DATA(), GET_CELL_DATA(), get_HAE() );
    }catch(e) {
        console.error('There is an error when you call the function ' + spaceSplit[0], e);
    }

    return value;
});
HAE_PROCESSOR.ADD(['INSERT_EVENT'], function(_value){
    console.error('INSERT_EVENT is unimplemented');
});
HAE_PROCESSOR.ADD(['INSERT_SCENE'], function(_value){
    console.error('INSERT_SCENE is unimplemented');
});

HAE_PROCESSOR.ADD(['COMMENT', '//'], function(_value){
    //It's a comment, don't do anything
});
