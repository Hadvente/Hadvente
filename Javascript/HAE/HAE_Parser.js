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
    
    /*

    ooooooooo.   ooooo     ooo oooooooooo.  ooooo        ooooo   .oooooo.   
    `888   `Y88. `888'     `8' `888'   `Y8b `888'        `888'  d8P'  `Y8b  
     888   .d88'  888       8   888     888  888          888  888          
     888ooo88P'   888       8   888oooo888'  888          888  888          
     888          888       8   888    `88b  888          888  888          
     888          `88.    .8'   888    .88P  888       o  888  `88b    ooo  
    o888o           `YbodP'    o888bood8P'  o888ooooood8 o888o  `Y8bood8P'  

    */
   
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

    /*
    
    ooooooooo.   ooooooooo.   ooooo oooooo     oooo       .o.       ooooooooooooo oooooooooooo 
    `888   `Y88. `888   `Y88. `888'  `888.     .8'       .888.      8'   888   `8 `888'     `8 
     888   .d88'  888   .d88'  888    `888.   .8'       .8"888.          888       888         
     888ooo88P'   888ooo88P'   888     `888. .8'       .8' `888.         888       888oooo8    
     888          888`88b.     888      `888.8'       .88ooo8888.        888       888    "    
     888          888  `88b.   888       `888'       .8'     `888.       888       888       o 
    o888o        o888o  o888o o888o       `8'       o88o     o8888o     o888o     o888ooooood8 

     */
    
    //The way this system works is to first parse the commands and text into a flat array (SPLIT_HAE)
    //And then convert that array into a nested representation of the scene to help process IF logic and text/commands (PARSE_HAE)
    var infiniblocker = 5000;
    var SPLIT_HAE = function(_string){
        var message = _string;
        var current_list = [];
        
        while(infiniblocker && message && message.indexOf('<<[') != -1){
            if( message.indexOf('<<[') !== 0 ){
                //there was basic text at the beginning of the script!
                var splitForFirst = message.split('<<['); 
                current_list.push( { type:'TEXT', value: splitForFirst.shift() } );
                message = '<<[' + splitForFirst.join('<<[');
            }

            var splitForCommand = message.split(']>>');
            var command = splitForCommand.shift().substr(3).split(' ');
            var cmdType = command.shift();
            var cmdVal = command.join(' ');
            current_list.push( { type: cmdType, value: cmdVal } );
            message = splitForCommand.join(']>>');

            infiniblocker--;
        }
        if( infiniblocker < 2 ){
            console.error('Do you have an infinite loop in your script?', _string);
        }
        //There is still remaining stuff to put in the game!
        if(message){
            current_list.push( { type:'TEXT', value: message } );
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
