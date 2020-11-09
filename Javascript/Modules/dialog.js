/*jshint esversion: 6 */ 

/*
dialog.js
draws the current scene's html in a dialog box
*/

MODULES.DIALOG = function () {
    
    var DIALOG_FNs = {};

    /*
    
    ooooo ooooo      ooo ooooo ooooooooooooo 
    `888' `888b.     `8' `888' 8'   888   `8 
     888   8 `88b.    8   888       888      
     888   8   `88b.  8   888       888      
     888   8     `88b.8   888       888      
     888   8       `888   888       888      
    o888o o8o        `8  o888o     o888o     

     */
    DIALOG_FNs.initialize = function(){
        if( !getCellLocation('DIALOG') ) return;
        
        HAE_PROCESSOR.ADD_TYPE(['IMAGE', 'IMG'], function(_value){
            var html = '<img src="' + _value + '.jpg">';
            return html;
        });
    };
    DIALOG_FNs.restart_module = function(){};
    DIALOG_FNs.update_module = function(){};
    DIALOG_FNs.finished_draw = function(){};
    /*
    
    ooooo   ooooo ooooooooooooo ooo        ooooo ooooo        
    `888'   `888' 8'   888   `8 `88.       .888' `888'        
     888     888       888       888b     d'888   888         
     888ooooo888       888       8 Y88. .P  888   888         
     888     888       888       8  `888'   888   888         
     888     888       888       8    Y     888   888       o 
    o888o   o888o     o888o     o8o        o888o o888ooooood8 
    
     */ 
    var $Dialog;
    DIALOG_FNs.init_HTML = function(_$Cell){
        if( !getCellLocation('DIALOG') ) return;
        _$Cell[ getCellLocation('DIALOG') ].append(`<div id="MainDialogContainer">
            <div id="MainDialogScrollbar">
                <div id="MainDialogTextHolder" class="standard_font">
                </div>
            </div>
        </div>`);
        $Dialog = $('#MainDialogTextHolder');
    };
    /*
    
    oooooooooo.   ooooooooo.         .o.       oooooo   oooooo     oooo 
    `888'   `Y8b  `888   `Y88.      .888.       `888.    `888.     .8'  
     888      888  888   .d88'     .8"888.       `888.   .8888.   .8'   
     888      888  888ooo88P'     .8' `888.       `888  .8'`888. .8'    
     888      888  888`88b.      .88ooo8888.       `888.8'  `888.8'     
     888     d88'  888  `88b.   .8'     `888.       `888'    `888'      
    o888bood8P'   o888o  o888o o88o     o8888o       `8'      `8'       

     */
    DIALOG_FNs.update_HTML = function(){
        if( !getCellLocation('DIALOG') ) return;
        if( HAE_SCENE.hasNewDialog() ){
            $Dialog.html( HAE_SCENE.getDialog() );
        }
    };

    //Returns public functions into the variable
    return DIALOG_FNs;
};
