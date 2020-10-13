/*jshint esversion: 6 */ 

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
function initializeHistory(){
    current_history = [];
}

var undo_history_count = 0;
function can_undo(){
    if( undo_history_count < (_.size(current_history) - 1) ) return true;
    return false; //If the size is 5, and if count is 4, then you are looking at the oldest element, and can not undo
}
function undo(){

}

function can_redo(){
    if( undo_history_count > 0 ) return true;
}
function redo(){

}

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

function history_update(){
    remove_future_history();
    current_history.push( _.deepClone( GET_GAME_STATE() ) );
    remove_old_history();
    auto_save();
}


/*

 .oooooo..o       .o.       oooooo     oooo oooooooooooo 
d8P'    `Y8      .888.       `888.     .8'  `888'     `8 
Y88bo.          .8"888.       `888.   .8'    888         
 `"Y8888o.     .8' `888.       `888. .8'     888oooo8    
     `"Y88b   .88ooo8888.       `888.8'      888    "    
oo     .d8P  .8'     `888.       `888'       888       o 
8""88888P'  o88o     o8888o       `8'       o888ooooood8 

*/

function auto_save(){
    if( undo_history_count ) return; //Do not autosave if you are not in the present!

    var currentSave = get_current_save();

    if( H_Log_Active() ){
        //don't want to waste deepClone
        H_Log( 'History size: ' + _.size(current_history), _.deepClone(current_history) );
    }
}

function save_to_slot( _slot_index ){
    var currentSave = get_current_save();
}

function save_to_file(){
    var currentSave = get_current_save();
}

function get_current_save(){
    return _.last( current_history );
}

////////////////
//DELETE SAVES//
////////////////

function deleteAutoSave(){
    //this deletes the save cookie
}

function deleteSaveSlot( _slot_index ){
    //this deletes the save cookie for this slot
}

/*

ooooo          .oooooo.         .o.       oooooooooo.   
`888'         d8P'  `Y8b       .888.      `888'   `Y8b  
 888         888      888     .8"888.      888      888 
 888         888      888    .8' `888.     888      888 
 888         888      888   .88ooo8888.    888      888 
 888       o `88b    d88'  .8'     `888.   888     d88' 
o888ooooood8  `Y8bood8P'  o88o     o8888o o888bood8P'   

 */

function load_slot( _load_index ){

}

function load_saved_file(){

}

function load_save(){

}

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

//This section grabs, loads, and saves cookies, save files, and any other way a save_load can happen
