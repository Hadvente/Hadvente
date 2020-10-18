/*jshint esversion: 6 */ 

/*
HAE_Parser.js
This file takes in a string that represents an HAE dialog scene and converts into an array
that represents a parsed version of the scene
It does NOT return the html of the scene
It doesn't even run the IF statements of the scene
It only returns a data structure that represents the possibilities of the scene
*/

var HAE_PARSER = (function () {
   
    var PARSER_FNs = {
        parseHAE(_str){
            var splitScene  = SPLIT_HAE(_str);
            H_Log('split:', splitScene );
            testLogicCount(splitScene);
            var parsedScene = PARSE_HAE(splitScene);
            H_Log('logic parse:', parsedScene );
            return parsedScene;
        }
    };
    
    //The way this system works is to first parse the commands and text into a flat array (SPLIT_HAE)
    //And then convert that array into a nested representation of the scene to help process IF logic and text/commands (PARSE_HAE)
    var SPLIT_HAE = function(_string){
        var current_list = [];
        var split = _string.split(/<<\[|]>>/g);
        _.each(split, function(_msg, _ind){
            if( (_ind%2) === 0 ){
                //even indices are text
                current_list.push( { type:'TEXT', value: _msg } );
            }
            else{
                var command = _msg.split(' ');
                var cmdType = command.shift();
                var cmdVal = command.join(' ');
                current_list.push( { type: cmdType, value: cmdVal } );
            }
        });
        return current_list;
    };
    var PARSE_HAE = function(_split_HAE){
        var stack = [];
        var current_list = [];

        _.each(_split_HAE, function(_thing){

            if(_thing.type == "IF"){
                stack.push(current_list);
                _thing.list = [];
                current_list = [_thing];
            }
            else if(_thing.type == "ELSE" || _thing.type == "ELSEIF"){
                _thing.list = [];
                current_list.push(_thing);
            }
            else if(_thing.type == "ENDIF"){
                if( !_.size(stack) ){
                    console.error('ENDIF received without an IF statement before it!');
                }
                var previous_list = stack.pop();
                previous_list.push(current_list);
                current_list = previous_list;
            }
            else{
                //currently inside an if statement
                if( _.last(current_list) && _.last(current_list).list ){
                    _.last(current_list).list.push(_thing);
                }
                //If the last statement was an ENDIF, then you will actually be grabbing an array if IFs, not the IF itself
                //not an IF
                else{
                    current_list.push(_thing);
                }
            }
        });
        if( _.size(stack) ){
            console.error('The IF/ELSEIF/ELSE/ENDIF statements do not line up in this scene! There are multiple elements lost from the scene because of this');
        }
        return current_list;
    };

    var testLogicCount = function(_split_HAE){
        var ifCount = 0;
        var endIfCount = 0;
        _.each(_split_HAE, function(_thing){
            if(_thing.type == "IF") ifCount++;
            else if(_thing.type == "ENDIF") endIfCount++;
        });
        if( ifCount !== endIfCount ){
            console.error('The IF Count of this scene does not line up with the ENDIF count!');
        }
    };
    
    //Returns public functions into the variable
    return PARSER_FNs;
})();

/*
This is a way to parse without using recursion
function iterativeLogicParse(_string){
    var stack = [];
    var current_list = [];

    _.each(message, function(c){

        //This is designed to throw away c!
        if(c == "("){
            stack.push(current_list);
            current_list = [];
        }
        else if(c == ")"){
            var previous_list = stack.pop();
            previous_list.push(current_list);
            current_list = previous_list;
        }
        else{
            current_list.push(c);
        }
    });
    return current_list;
}*/
