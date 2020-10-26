/*jshint esversion: 6 */ 

/*
game_view.js
This file draws the GUI itself.
The GUI is designed in what are called "CELLS", which show each individual aspect of the GUI
*/

(function(){
    //
    //This is a local variable, no one else can use it
    var $gameScreenDiv;

    //No one clears the screen right now, you do not need to do that to open a new save file
    // function clearGameView(){
    //     $gameScreenDiv.empty();
    // }

    VIEW.initializeGameHtml = function(){
        if(get_HAE().cells.HAS_RIGHT_COLUMN){
            $("body").append('<div id="GameWindow_3Columns"></div>');
            $gameScreenDiv = $('#GameWindow_3Columns');
        }
        else{
            $("body").append('<div id="GameWindow_2Columns"></div>');
            $gameScreenDiv = $('#GameWindow_2Columns');
        }

        //Make the cells
        createCells();
        initAllCells();
        initPopup();
    };

    //I want to look into ways this can be more customizable and defined by a game
    //possibly have standard definitions stored away
    //and the game can pick one, define a new one, or if no choice is made it will go to a default
    var cellDefinitions = [
        [
            {html: '<div id="Left_Col_Cell_Menus" class=""></div>'},

            {html: '<div id="Left_Col_Cell_Top" class="cellContainer"></div>'},
            {html: '<div id="Left_Col_Cell_Middle" class="cellContainer"></div>'},
            {html: '<div id="Left_Col_Cell_Bottom" class="cellContainer"></div>'},

            {html: '<div id="Left_Col_Cell_Top_BIG" class="cellContainer"></div>'},
            {html: '<div id="Left_Col_Cell_Bottom_BIG" class="cellContainer"></div>'}
        ],
        [
            {html: '<div id="Center_Col_Cell_Dialog" class="cellContainer"></div>'},
            {html: '<div id="Center_Col_Cell_Actions" class="cellContainer"></div>'},
        ],
        [
            {html: '<div id="Right_Col_Cell_Top" class="cellContainer"></div>'},
            {html: '<div id="Right_Col_Cell_Middle" class="cellContainer"></div>'},
            {html: '<div id="Right_Col_Cell_Bottom" class="cellContainer"></div>'},

            {html: '<div id="Right_Col_Cell_Top_BIG" class="cellContainer"></div>'},
            {html: '<div id="Right_Col_Cell_Bottom_BIG" class="cellContainer"></div>'}
        ] 
    ];


    function createCells(){
        _.each(cellDefinitions, function(_columns, _col){
            if( _col == 2 && !get_HAE().cells.HAS_RIGHT_COLUMN ) return; //We don't want the third column
            var currentY = 0;
            var colHtml;
            if( get_HAE().cells.HAS_RIGHT_COLUMN ){
                colHtml = '<div id="' + ((_col == 0)? 'LeftColumn_3Columns': (_col == 1)? 'MiddleColumn_3Columns' : 'RightColumn_3Columns') + '">';
            }
            else{
                colHtml = '<div id="' + ((_col == 0)? 'LeftColumn_2Columns': 'MiddleColumn_2Columns') + '">';
            }
            _.each(_columns, function(_arr, _not_first_row){

                if(_arr.html){
                    //this is a custom column
                    colHtml += _arr.html;
                    return;
                }
            });
            colHtml += '</div>';
            $gameScreenDiv.append(colHtml);
        });
    }


    function initAllCells(){
        setEachCellSelector();
        deleteUnusedCells();
        initCellHtml();
    }

    var $Cell = {};
    function setEachCellSelector(){
        //These are all REQUIRED
        $Cell.Menu         = $('#Left_Col_Cell_Menus');
        $Cell.Dialog       = $('#Center_Col_Cell_Dialog');
        $Cell.Actions      = $('#Center_Col_Cell_Actions');

        //
        //Left Column
        $Cell.Top_Left     = $('#Left_Col_Cell_Top');
        $Cell.Middle_Left  = $('#Left_Col_Cell_Middle');
        $Cell.Bottom_Left  = $('#Left_Col_Cell_Bottom');

        //Right Column
        $Cell.Top_Right    = $('#Right_Col_Cell_Top');
        $Cell.Middle_Right = $('#Right_Col_Cell_Middle');
        $Cell.Bottom_Right = $('#Right_Col_Cell_Bottom');

        //Big Cells
        $Cell.Top_Left_BIG     = $('#Left_Col_Cell_Top_BIG');
        $Cell.Bottom_Left_BIG  = $('#Left_Col_Cell_Bottom_BIG');
        $Cell.Top_Right_BIG    = $('#Right_Col_Cell_Top_BIG');
        $Cell.Bottom_Right_BIG = $('#Right_Col_Cell_Bottom_BIG');
    }

    function deleteUnusedCells(){
        var usedCells = _.invert(get_HAE().cells);
        _.each($Cell, function(_$div, _location_name){
            if( !usedCells[_location_name] ){
                _$div.remove();
            }
        });
    }

    function initCellHtml(){
        _.each(MODULES, function(_module, _name){
            if(_module.NO_HTML) return;
            if(_module.init_HTML){
                _module.init_HTML($Cell);
            }
            else{
                console.error('Why does this module not have an init_HTML? ' + _name);
            }
        });
    }

    /*

    ooooo     ooo ooooooooo.   oooooooooo.         .o.       ooooooooooooo oooooooooooo 
    `888'     `8' `888   `Y88. `888'   `Y8b       .888.      8'   888   `8 `888'     `8 
     888       8   888   .d88'  888      888     .8"888.          888       888         
     888       8   888ooo88P'   888      888    .8' `888.         888       888oooo8    
     888       8   888          888      888   .88ooo8888.        888       888    "    
     `88.    .8'   888          888     d88'  .8'     `888.       888       888       o 
       `YbodP'    o888o        o888bood8P'   o88o     o8888o     o888o     o888ooooood8 

     */
    VIEW.updateScreen = function(){
        _.each(MODULES, function(_module, _name){
            if(_module.NO_HTML) return;
            if(_module.update_HTML){
                _module.update_HTML();
            }
            else{
                console.error('Why does this module not have an update_HTML? ' + _name);
            }
        });
    };

    function initPopup(){
        $("body").append('<div id="PopupContainer" class="background_obscure popup_hidden"></div>');
    }

    var isPopupOpen = false;
    VIEW.openPopup = function(_class_list){
        if( isPopupOpen ) VIEW.closePopup(); //this is valid if you want to replace a popup
        $('#PopupContainer').append(`<div id="PopupContentsContainer"><div id="PopupContents" class="${_class_list || 'popup_container'}"></div></div>`);
        $('#PopupContainer').removeClass('popup_hidden');
        isPopupOpen = true;
        return $('#PopupContents');
    };

    VIEW.closePopup = function( _popup_name ){
        if( !isPopupOpen ){
            H_Error('Someone has called closePopup when the popup is already closed!');
            return;
        }
        $('#PopupContainer').empty();
        $('#PopupContainer').addClass('popup_hidden');
        isPopupOpen = false;
        if( _popup_name ){
            ENGINE.removeKeyPress( _popup_name );
        }
    };

}).call();
