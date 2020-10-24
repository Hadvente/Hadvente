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
    DIALOG_FNs.initialize = function(){};
    /*
        
    ooooooooo.   oooooooooooo  .oooooo..o ooooooooooooo       .o.       ooooooooo.   ooooooooooooo 
    `888   `Y88. `888'     `8 d8P'    `Y8 8'   888   `8      .888.      `888   `Y88. 8'   888   `8 
     888   .d88'  888         Y88bo.           888          .8"888.      888   .d88'      888      
     888ooo88P'   888oooo8     `"Y8888o.       888         .8' `888.     888ooo88P'       888      
     888`88b.     888    "         `"Y88b      888        .88ooo8888.    888`88b.         888      
     888  `88b.   888       o oo     .d8P      888       .8'     `888.   888  `88b.       888      
    o888o  o888o o888ooooood8 8""88888P'      o888o     o88o     o8888o o888o  o888o     o888o     

     */
    DIALOG_FNs.restart_module = function(){};
    /*

    ooooo     ooo ooooooooo.   oooooooooo.         .o.       ooooooooooooo oooooooooooo 
    `888'     `8' `888   `Y88. `888'   `Y8b       .888.      8'   888   `8 `888'     `8 
     888       8   888   .d88'  888      888     .8"888.          888       888         
     888       8   888ooo88P'   888      888    .8' `888.         888       888oooo8    
     888       8   888          888      888   .88ooo8888.        888       888    "    
     `88.    .8'   888          888     d88'  .8'     `888.       888       888       o 
       `YbodP'    o888o        o888bood8P'   o88o     o8888o     o888o     o888ooooood8 

    */
    DIALOG_FNs.update_module = function(){};
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
        if( !get_HAE().cells.DIALOG ) return;
        _$Cell[ get_HAE().cells.DIALOG ].append(`<div id="MainDialogContainer">
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
        if( !get_HAE().cells.DIALOG ) return;
        if( HAE_SCENE.hasNewDialog() ){
            $Dialog.html( HAE_SCENE.getDialog() );
        }
    };
    /*

    ooooooooo.     .oooooo.    .oooooo..o ooooooooooooo    oooooooooo.   ooooooooo.         .o.    oooooo   oooooo     oooo 
    `888   `Y88.  d8P'  `Y8b  d8P'    `Y8 8'   888   `8    `888'   `Y8b  `888   `Y88.      .888.    `888.    `888.     .8'  
     888   .d88' 888      888 Y88bo.           888          888      888  888   .d88'     .8"888.    `888.   .8888.   .8'   
     888ooo88P'  888      888  `"Y8888o.       888          888      888  888ooo88P'     .8' `888.    `888  .8'`888. .8'    
     888         888      888      `"Y88b      888          888      888  888`88b.      .88ooo8888.    `888.8'  `888.8'     
     888         `88b    d88' oo     .d8P      888          888     d88'  888  `88b.   .8'     `888.    `888'    `888'      
    o888o         `Y8bood8P'  8""88888P'      o888o        o888bood8P'   o888o  o888o o88o     o8888o    `8'      `8'         

     */
    DIALOG_FNs.finished_draw = function(){};


    //Add processors here for specific HTML Commands

    HAE_PROCESSOR.ADD_TYPE(['IMAGE', 'IMG'], function(_value){
        var html = '<img src="' + _value + '.jpg">';
        return html;
    });

    //Add new system for <{Inline Commands}>, which work differently.
    //Alternatively, Inline Commands could have their own processor
    //It could also make sense to have IMG/IMAGE be an inline command since all it does it make html

    //Returns public functions into the variable
    return DIALOG_FNs;
};
