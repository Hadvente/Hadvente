/*jshint esversion: 6 */ 

//This explicitly does not handle inventory, it only shows it in a cell

MODULES.INVENTORY_VIEWER = (function () {
    
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
    
    var $Ul = {};
    PUBLIC_FNs.init_HTML = function(_$Cell){
        if( !getCellLocation('INVENTORY_VIEWER') ) return;
        _$Cell[ getCellLocation('INVENTORY_VIEWER') ].append(`<div id="InventoryContainer" class="inventory_list large_font">
            <section>
                <h3 class="inventory_margin">Inventory</h3>
                <ul id="InventoryList" class="inventory_margin">
                </ul>
            </section>
        </div>`);

        $Ul = $('#InventoryList');
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
        if( !getCellLocation('INVENTORY_VIEWER') ) return;
        $Ul.empty();
        var inventory = STATE.GET_GAME_DATA().INV || {};
        _.each(inventory, function(_value, _item){
            $Ul.append('<li>' + _value + '</li>');
        });
    };

    return PUBLIC_FNs; //Returns public functions into the variable
});
