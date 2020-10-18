/*jshint esversion: 6 */ 

//History and the save system are part of the same file because the reference each other so much...
////BUT SHOULD THEY BE???
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
        STORAGE.auto_save();
    };

    //Getters for save data
    HISTORY.get_present_state = function(){
        return( _.last( current_history ) );
    };
    HISTORY.is_in_present = function(){
        return( undo_history_count );
    };
}).call();

(function(){
    /*

     .oooooo..o       .o.       oooooo     oooo oooooooooooo 
    d8P'    `Y8      .888.       `888.     .8'  `888'     `8 
    Y88bo.          .8"888.       `888.   .8'    888         
     `"Y8888o.     .8' `888.       `888. .8'     888oooo8    
         `"Y88b   .88ooo8888.       `888.8'      888    "    
    oo     .d8P  .8'     `888.       `888'       888       o 
    8""88888P'  o88o     o8888o       `8'       o888ooooood8 

    */

    STORAGE.initializeSaveSystem = function(){
        STORAGE.initialize_storage();
    };

    STORAGE.auto_save = function(){
        if( !HISTORY.is_in_present() ) return; //Do not autosave if you are not in the present!

        var currentSave = HISTORY.get_present_state();

        if( !currentSave.META_DATA.scene_count ) return; //Do no make an autosave on the start screen

        currentSave.META_DATA.save_time = Date.now();

        STORAGE.saveData('SAVE_SLOT_AUTO', currentSave);

        if( H_Log_Active() ){
            //don't want to waste deepClone
            H_Log( 'History size: ' + _.size(current_history), _.deepClone(current_history) );
        }
    };

    STORAGE.save_to_slot = function( _slot_index ){
        var currentSave = HISTORY.get_present_state();
    };

    STORAGE.save_to_file = function(){
        var currentSave = HISTORY.get_present_state();
    };

    ////////////////
    //DELETE SAVES//
    ////////////////

    STORAGE.deleteAutoSave = function(){
        //this deletes the save cookie
    };

    STORAGE.deleteSaveSlot = function( _slot_index ){
        //this deletes the save cookie for this slot
    };

    /*

    ooooo          .oooooo.         .o.       oooooooooo.   
    `888'         d8P'  `Y8b       .888.      `888'   `Y8b  
     888         888      888     .8"888.      888      888 
     888         888      888    .8' `888.     888      888 
     888         888      888   .88ooo8888.    888      888 
     888       o `88b    d88'  .8'     `888.   888     d88' 
    o888ooooood8  `Y8bood8P'  o88o     o8888o o888bood8P'   

     */

    STORAGE.get_save_file = function(_load_index){
        if(_load_index == 'AUTO'){
            return STORAGE.getData( 'SAVE_SLOT_AUTO' );
        }
        else{
            //load index should be a number that represents the save slot
            return STORAGE.getData( 'SAVE_SLOT_' + ( _load_index || 0 ) );
        }
    };

    STORAGE.has_save_file = function(_load_index){
        if(_load_index == 'AUTO'){
            return !!STORAGE.getData( 'SAVE_SLOT_AUTO' );
        }
        else{
            //load index should be a number that represents the save slot
            return !!STORAGE.getData( 'SAVE_SLOT_' + ( _load_index || 0 ) );
        }
    };

    /*

    oooooooooooo ooooo ooooo        oooooooooooo 
    `888'     `8 `888' `888'        `888'     `8 
     888          888   888          888         
     888oooo8     888   888          888oooo8    
     888    "     888   888          888    "    
     888          888   888       o  888       o 
    o888o        o888o o888ooooood8 o888ooooood8 
                                                 
                                                 
                                                 
     .oooooo..o oooooo   oooo  .oooooo..o ooooooooooooo oooooooooooo ooo        ooooo 
    d8P'    `Y8  `888.   .8'  d8P'    `Y8 8'   888   `8 `888'     `8 `88.       .888' 
    Y88bo.        `888. .8'   Y88bo.           888       888          888b     d'888  
     `"Y8888o.     `888.8'     `"Y8888o.       888       888oooo8     8 Y88. .P  888  
         `"Y88b     `888'          `"Y88b      888       888    "     8  `888'   888  
    oo     .d8P      888      oo     .d8P      888       888       o  8    Y     888  
    8""88888P'      o888o     8""88888P'      o888o     o888ooooood8 o8o        o888o 

     */

    STORAGE.open_save_file = function(){
        //I think I would like save files to be loaded into a slot, not directly loaded
    };
}).call();
