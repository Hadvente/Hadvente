/*jshint esversion: 6 */ 

MODULES.VN_BG = (function () {
    
    var PUBLIC_FNs = {};

    /*
    
    ooooo ooooo      ooo ooooo ooooooooooooo 
    `888' `888b.     `8' `888' 8'   888   `8 
     888   8 `88b.    8   888       888      
     888   8   `88b.  8   888       888      
     888   8     `88b.8   888       888      
     888   8       `888   888       888      
    o888o o8o        `8  o888o     o888o     

     */
    PUBLIC_FNs.initialize = function(){
        //This starts up the module. It is called before anything has been drawn.
        if( !getCellLocation('VN_BG') ) return;
        HAE_PROCESSOR.ADD_TYPE(['BG'], function(_value){
            STATE.GET_CELL_DATA('VN_BG').IMAGE = _value.trim();
        });
    };

    /*
        
    ooooooooo.   oooooooooooo  .oooooo..o ooooooooooooo       .o.       ooooooooo.   ooooooooooooo 
    `888   `Y88. `888'     `8 d8P'    `Y8 8'   888   `8      .888.      `888   `Y88. 8'   888   `8 
     888   .d88'  888         Y88bo.           888          .8"888.      888   .d88'      888      
     888ooo88P'   888oooo8     `"Y8888o.       888         .8' `888.     888ooo88P'       888      
     888`88b.     888    "         `"Y88b      888        .88ooo8888.    888`88b.         888      
     888  `88b.   888       o oo     .d8P      888       .8'     `888.   888  `88b.       888      
    o888o  o888o o888ooooood8 8""88888P'      o888o     o88o     o8888o o888o  o888o     o888o     

     */
    PUBLIC_FNs.restart_module = function(){
        //This is called when the game_state is modified by the save system
        //Anything that must be modified when a save is loaded should happen here
    };

    /*

    ooooo     ooo ooooooooo.   oooooooooo.         .o.       ooooooooooooo oooooooooooo 
    `888'     `8' `888   `Y88. `888'   `Y8b       .888.      8'   888   `8 `888'     `8 
     888       8   888   .d88'  888      888     .8"888.          888       888         
     888       8   888ooo88P'   888      888    .8' `888.         888       888oooo8    
     888       8   888          888      888   .88ooo8888.        888       888    "    
     `88.    .8'   888          888     d88'  .8'     `888.       888       888       o 
       `YbodP'    o888o        o888bood8P'   o88o     o8888o     o888o     o888ooooood8 

     */
    
    PUBLIC_FNs.optional_pre_scene_update = function(){
        //This function is OPTIONAL, and it happens before the current scene is processed
        //Do not use it for your main scene code, because the scene does not exist yet!
        //You would mostly use it if you expect your current scene to need info about the cell
    };

    PUBLIC_FNs.update_module = function(){
        //this is the main function that gets called each time an update event is called
        if( !getCellLocation('VN_BG') ) return;
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

    //PUBLIC_FNs.NO_HTML = true; //If this is true, then the functions init_HTML and update_HTML don't need to exist
    
    var $Img;
    PUBLIC_FNs.init_HTML = function(_$Cell){
        //This is called during the initial draw, but before the first update event is fired
        if( !getCellLocation('VN_BG') ) return;
        _$Cell[ getCellLocation('VN_BG') ].append(`<div id="ImageContainer">
        </div>`);

        $Img = $('#ImageContainer');
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
    PUBLIC_FNs.update_HTML = function(){
        //This is the update event for the HTML, update the DOM in here
        if( !getCellLocation('VN_BG') ) return;
        if( !getCellLocation('VN_BG') ) return;
        $Img.empty();
        if( !STATE.GET_CELL_DATA('VN_BG').IMAGE ) return;
        var imagePath = get_HAE().VN_BG.Backgrounds[STATE.GET_CELL_DATA('VN_BG').IMAGE];
        if( !imagePath ){
            H_Error('Invalid Image name provided, ' + STATE.GET_CELL_DATA('VN_BG').IMAGE + ' is not valid.');
            return;
        }
        $Img.append('<img class="image_cell_img" src="Images/BG/' + imagePath + '">');
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
    PUBLIC_FNs.finished_draw = function(){
        //This is called after the gui is drawn. If you need to do some post-draw cleanup, do it here.
        STATE.GET_CELL_DATA('VN_BG').IMAGE = '';
    };

    return PUBLIC_FNs; //Returns public functions into the variable
});
