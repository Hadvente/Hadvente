/*jshint esversion: 6 */ 

MODULES.TITLE = (function () {
    
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
    PUBLIC_FNs.initialize = function(){}; PUBLIC_FNs.restart_module = function(){};
    PUBLIC_FNs.update_module = function(){}; PUBLIC_FNs.finished_draw = function(){};
    PUBLIC_FNs.update_HTML = function(){};

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
    
    var $Elems = {};
    PUBLIC_FNs.init_HTML = function(_$Cell){
        _$Cell.Title.append('<div id="TitleContainer" class="titleDiv giant_font"></div><div id="AuthorContainer" class="titleDiv small_font"></div>');
        $('#TitleContainer').html(get_HAE().title || '');
        $('#AuthorContainer').html(get_HAE().author || '');
    };

    return PUBLIC_FNs; //Returns public functions into the variable
});
