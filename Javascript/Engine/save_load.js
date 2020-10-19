/*jshint esversion: 6 */ 

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
