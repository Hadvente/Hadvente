/*jshint esversion: 6 */ 

MODULES.VN_DIALOG = function () {
    
    var VN_DIALOG_FNs = {};

    /*
    
    ooooo ooooo      ooo ooooo ooooooooooooo 
    `888' `888b.     `8' `888' 8'   888   `8 
     888   8 `88b.    8   888       888      
     888   8   `88b.  8   888       888      
     888   8     `88b.8   888       888      
     888   8       `888   888       888      
    o888o o8o        `8  o888o     o888o     

     */
    VN_DIALOG_FNs.initialize = function(){};
    /*
        
    ooooooooo.   oooooooooooo  .oooooo..o ooooooooooooo       .o.       ooooooooo.   ooooooooooooo 
    `888   `Y88. `888'     `8 d8P'    `Y8 8'   888   `8      .888.      `888   `Y88. 8'   888   `8 
     888   .d88'  888         Y88bo.           888          .8"888.      888   .d88'      888      
     888ooo88P'   888oooo8     `"Y8888o.       888         .8' `888.     888ooo88P'       888      
     888`88b.     888    "         `"Y88b      888        .88ooo8888.    888`88b.         888      
     888  `88b.   888       o oo     .d8P      888       .8'     `888.   888  `88b.       888      
    o888o  o888o o888ooooood8 8""88888P'      o888o     o88o     o8888o o888o  o888o     o888o     

     */
    VN_DIALOG_FNs.restart_module = function(){};
    /*

    ooooo     ooo ooooooooo.   oooooooooo.         .o.       ooooooooooooo oooooooooooo 
    `888'     `8' `888   `Y88. `888'   `Y8b       .888.      8'   888   `8 `888'     `8 
     888       8   888   .d88'  888      888     .8"888.          888       888         
     888       8   888ooo88P'   888      888    .8' `888.         888       888oooo8    
     888       8   888          888      888   .88ooo8888.        888       888    "    
     `88.    .8'   888          888     d88'  .8'     `888.       888       888       o 
       `YbodP'    o888o        o888bood8P'   o88o     o8888o     o888o     o888ooooood8 

    */
    VN_DIALOG_FNs.update_module = function(){};
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
    VN_DIALOG_FNs.init_HTML = function(_$Cell){
        if( !getCellLocation('VN_DIALOG') ) return;
        _$Cell[ getCellLocation('VN_DIALOG') ].append(`<div id="MainDialogContainer">
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
    VN_DIALOG_FNs.update_HTML = function(){
        if( !getCellLocation('VN_DIALOG') ) return;
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
    VN_DIALOG_FNs.finished_draw = function(){};

    //Returns public functions into the variable
    return VN_DIALOG_FNs;
};
