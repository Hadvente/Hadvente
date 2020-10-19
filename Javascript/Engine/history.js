/*jshint esversion: 6 */ 

(function(){
    /*

    ooooo   ooooo ooooo  .oooooo..o ooooooooooooo   .oooooo.   ooooooooo.   oooooo   oooo 
    `888'   `888' `888' d8P'    `Y8 8'   888   `8  d8P'  `Y8b  `888   `Y88.  `888.   .8'  
     888     888   888  Y88bo.           888      888      888  888   .d88'   `888. .8'   
     888ooooo888   888   `"Y8888o.       888      888      888  888ooo88P'     `888.8'    
     888     888   888       `"Y88b      888      888      888  888`88b.        `888'     
     888     888   888  oo     .d8P      888      `88b    d88'  888  `88b.       888      
    o888o   o888o o888o 8""88888P'      o888o      `Y8bood8P'  o888o  o888o     o888o     

     */
    var current_history = [];
    HISTORY.initializeHistory = function(){
        current_history = [];
    };

    var undo_history_count = 0;
    HISTORY.can_undo = function(){
        if( undo_history_count < (_.size(current_history) - 1) ) return true;
        return false; //If the size is 5, and if count is 4, then you are looking at the oldest element, and can not undo
    };
    HISTORY.undo = function(){
        if( undo_history_count < (_.size(current_history) - 1) ) undo_history_count++;
        //Okay, now, load the new game_state
    };

    HISTORY.can_redo = function(){
        if( undo_history_count > 0 ) return true;
    };
    HISTORY.redo = function(){
        if( undo_history_count > 0 ) undo_history_count++;
        //Okay, now, load the new game_state
    };

    function remove_future_history(){
        if(undo_history_count > 0){
            //if you have a 5 element array and count of 1, then -1 removes the last element
            current_history.splice( - undo_history_count );
            undo_history_count = 0;
        }
    }

    function remove_old_history(){
        if( _.size(current_history) > 10 ){
            current_history.splice(0, _.size(current_history) - 10);
        }
    }

    HISTORY.history_update = function(){
        remove_future_history();
        current_history.push( _.deepClone( STATE.GET_STATE() ) );
        remove_old_history();
        SAVE_LOAD.auto_save();
    };

    //Getters for save data
    HISTORY.get_present_state = function(){
        return( _.last( current_history ) );
    };
    HISTORY.is_in_present = function(){
        return !undo_history_count;
    };
}).call();
