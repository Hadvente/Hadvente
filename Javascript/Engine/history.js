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
        if( undo_history_count < (_.size(current_history) - 1) ){
            undo_history_count++;
            STATE.LOAD_STATE( _.deepClone( current_history[_.size(current_history) - 1 - undo_history_count] ), 'NO AUTO SAVE OR HISTORY' );
        }
    };

    HISTORY.can_redo = function(){
        if( 0 < undo_history_count ) return true;
    };
    HISTORY.redo = function(){
        if( 0 < undo_history_count ){
            undo_history_count--;
            STATE.LOAD_STATE(_.deepClone( current_history[_.size(current_history) - 1 - undo_history_count] ), 'NO AUTO SAVE OR HISTORY' );
        }
    };

    function remove_future_history(){
        //if you have a 5 element array and count of 1, then -1 removes the last element
        current_history.splice( - undo_history_count );
        undo_history_count = 0;
    }

    function remove_old_history(){
        if( _.size(current_history) > 10 ){
            current_history.splice(0, _.size(current_history) - 10);
        }
    }

    HISTORY.history_update = function(){
        if(undo_history_count > 0){
            remove_future_history();
        }
        remove_old_history();
        current_history.push( _.deepClone( STATE.GET_STATE() ) );
        SAVES.auto_save();
    };

    //Getters for save data
    HISTORY.get_present_state = function(){
        return( _.last( current_history ) );
    };
    HISTORY.is_in_present = function(){
        return !undo_history_count;
    };
    HISTORY.get_currently_viewed_state = function(){
        return( _.last( current_history ) );
    };

    HISTORY.restartGamePopup = function(){
        var PopUpId = 'Restart_Popup';
        var $RestartPopup = VIEW.openPopup(PopUpId, 'Restart Game', 'small_popup');
        ENGINE.addKeyPress(PopUpId, function(e) {
            if (e.keyCode === 27){
                VIEW.closePopup(PopUpId);
            }
        });
        $RestartPopup.html('<div style="margin-top: 10px;">Are you sure you want to restart?</br>All unsaved data will be lost.</div><div id="RestartGame" class="buttonBorder">RESTART</div>');

        $RestartPopup.on('mouseup', '#RestartGame', function(_event){
            STATE.initializeGameState();
            STATE.LOAD_STATE( STATE.GET_STATE(), 'NO AUTOSAVE' );
            VIEW.closePopup(PopUpId);
        });
    };

    HISTORY.log_history = function(){
        if(H_Log_Active()){
            var namesOfHist = _.map(current_history, function(_obj){return _obj.CURRENT_SCENE;});
            H_Log('HISTORY', 'Logging history at beginning of update, post autosave:\n' +
                'NAMES OF SCENES IN HISTORY:\n' + namesOfHist.join(', ') + '\ncurrent scene:',
                _.deepClone(current_history[_.size(current_history) - 1 - undo_history_count]));
        }
    };
}).call();
