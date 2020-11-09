/*jshint esversion: 6 */ 

MODULES.IMAGE_CELL = (function () {
    
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
        if( !getCellLocation('IMAGE_CELL') ) return;
        HAE_PROCESSOR.ADD_TYPE(['IMAGE_CELL', 'IMG_CELL'], function(_value){
            STATE.GET_CELL_DATA('IMAGE_CELL').IMAGE = _value.trim();
        });
    };

    PUBLIC_FNs.restart_module = function(){};
    PUBLIC_FNs.update_module = function(){};
    PUBLIC_FNs.finished_draw = function(){
        if( !getCellLocation('IMAGE_CELL') ) return;
        STATE.GET_CELL_DATA('IMAGE_CELL').IMAGE = '';
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
    
    var $Img;
    PUBLIC_FNs.init_HTML = function(_$Cell){
        if( !getCellLocation('IMAGE_CELL') ) return;
        _$Cell[ getCellLocation('IMAGE_CELL') ].append(`<div id="ImageContainer">
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
        if( !getCellLocation('IMAGE_CELL') ) return;
        $Img.empty();
        if( !STATE.GET_CELL_DATA('IMAGE_CELL').IMAGE ) return;
        $Img.append('<img class="image_cell_img" src="Images/' + STATE.GET_CELL_DATA('IMAGE_CELL').IMAGE + '.jpg">');
    };

    return PUBLIC_FNs; //Returns public functions into the variable
});
