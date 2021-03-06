/*jshint esversion: 6 */ 

MODULES.MENUS = (function () {
    /*
    // A way to add css within the module file, in case I want to not have to add another stylesheet file for each module.
    var styles = `
        .MenuDiv { 
            width: 100%;
        }
    `

    var styleSheet       = document.createElement("style");
    styleSheet.type      = "text/css";
    styleSheet.innerText = styles;
    document.head.appendChild(styleSheet);
     */
    
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
    //The menus don't do much until you click on one
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
    
    var $Undo, $Redo;
    PUBLIC_FNs.init_HTML = function(_$Cell){
        //This is called during the initial draw, but before the first update event is fired
        if( !getCellLocation('MENUS') ) return;

        var html = '<table class="gridContainer">';
        html +='<tr class="menu_grid_row">';
            html += '<td colspan="2" id="Menu_Button_Undo"    class="menu_grid_cell menuGridButton" onmouseup="MODULES.MENUS.mouseUpUndo()">UNDO</td>';
            html += '<td colspan="2" id="Menu_Button_Redo"    class="menu_grid_cell menuGridButton" onmouseup="MODULES.MENUS.mouseUpRedo()">REDO</td>';
            html += '<td colspan="2" id="Menu_Button_Restart" class="menu_grid_cell menuGridButton" onmouseup="MODULES.MENUS.mouseUpRestart()">RESTART</td>';
        //html += '</tr>';
        //html +='<tr class="menu_grid_row">';
            html += '<td colspan="3" id="Menu_Button_Options" class="menu_grid_cell menuGridButton" onmouseup="MODULES.MENUS.mouseUpOptions()">OPTIONS</td>';
            html += '<td colspan="3" id="Menu_Button_Save"    class="menu_grid_cell menuGridButton" onmouseup="MODULES.MENUS.mouseUpSave()">SAVE & LOAD</td>';
        html += '</tr>';
        html +='</table>';

        _$Cell[ getCellLocation('MENUS') ].append('<div id="MenusMenu" class="sectionContainer small_font">' + html + '</div>');
        $Undo    = $('#Menu_Button_Undo');
        $Redo    = $('#Menu_Button_Redo');
    };

    function getMenuButtonsHtml(){
        return html;
    }
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
        if( HISTORY.can_undo() ){
            if( $Undo.hasClass('menu_button_disabled') ){
                $Undo.removeClass('menu_button_disabled');
            }
        }
        else{
            if( !$Undo.hasClass('menu_button_disabled') ){
                $Undo.addClass('menu_button_disabled');
            }
        }

        if( HISTORY.can_redo() ){
            if( $Redo.hasClass('menu_button_disabled') ){
                $Redo.removeClass('menu_button_disabled');
            }
        }
        else{
            if( !$Redo.hasClass('menu_button_disabled') ){
                $Redo.addClass('menu_button_disabled');
            }
        }
    };

    PUBLIC_FNs.mouseUpUndo = function(){
        if( !HISTORY.can_undo() ) return;
        H_Log('click', 'clicked undo btn');
        HISTORY.undo();
    };
    PUBLIC_FNs.mouseUpRedo = function(){
        if( !HISTORY.can_redo() ) return;
        H_Log('click', 'clicked redo btn');
        HISTORY.redo();
    };


    PUBLIC_FNs.mouseUpSave = function(){
        SAVES.createPopup();
    };

    PUBLIC_FNs.mouseUpRestart = function(){
        HISTORY.restartGamePopup();
    };
    PUBLIC_FNs.mouseUpOptions = function(){
        H_Log('click', 'clicked options menu');
    };

    return PUBLIC_FNs; //Returns public functions into the variable
})();
