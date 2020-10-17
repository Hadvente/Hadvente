/*jshint esversion: 6 */ 

/*
dialog.js
This could be the biggest file in the system
What it does is interprets both HAE_GAME and GAME_STATE and convert it into the html string that will
appear in the main dialog box. It also will find the set of action buttons
*/

MODULES.DIALOG = function () {
    
    var DIALOG_FNs = {};

    /*

    ooooooooo.   ooooo     ooo oooooooooo.  ooooo        ooooo   .oooooo.   
    `888   `Y88. `888'     `8' `888'   `Y8b `888'        `888'  d8P'  `Y8b  
     888   .d88'  888       8   888     888  888          888  888          
     888ooo88P'   888       8   888oooo888'  888          888  888          
     888          888       8   888    `88b  888          888  888          
     888          `88.    .8'   888    .88P  888       o  888  `88b    ooo  
    o888o           `YbodP'    o888bood8P'  o888ooooood8 o888o  `Y8bood8P'  

    */
   
    var dialogHTML = '';
    DIALOG_FNs.initialize = function(){
    };
    DIALOG_FNs.update_module = function(){
    };

    DIALOG_FNs.finished_draw = function(){
        //does nothing for now
    };

    DIALOG_FNs.restart_module = function(){
        //This is called when the game_state is modified by the save system
        //Anything that must be modified when a save is loaded should happen here
    };

    /*
    
    ooooo   ooooo ooooooooooooo ooo        ooooo ooooo        
    `888'   `888' 8'   888   `8 `88.       .888' `888'        
     888     888       888       888b     d'888   888         
     888ooooo888       888       8 Y88. .P  888   888         
     888     888       888       8  `888'   888   888         
     888     888       888       8    Y     888   888       o 
    o888o   o888o     o888o     o8o        o888o o888ooooood8 
    
     */
    
    var $Dialog = {};
    DIALOG_FNs.init_HTML = function(_$Cell){
        if( !get_HAE().cells.DIALOG ) return;
        _$Cell[ get_HAE().cells.DIALOG ].append(`<div id="MainDialogContainer">
            <div id="MainDialogScrollbar">
                <div id="MainDialogTextHolder" class="standard_font">
                </div>
            </div>
        </div>`);
        $Dialog = $('#MainDialogTextHolder');
    };

    DIALOG_FNs.update_HTML = function(){
        if( !get_HAE().cells.DIALOG ) return;
        if( HAE_SCENE.hasNewDialog() ){
            $Dialog.html( HAE_SCENE.getDialog() );
        }
    };

    HAE_PROCESSOR.ADD(['IMAGE', 'IMG'], function(_value){
        var html = '<img src="' + _value + '.jpg">';
        return html;
    });

    //Returns public functions into the variable
    return DIALOG_FNs;
};
