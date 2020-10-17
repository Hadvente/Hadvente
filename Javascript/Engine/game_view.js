/*jshint esversion: 6 */ 

/*
game_view.js
This file draws the GUI itself.
It should be the only file with access to jquery if at all possible.
The GUI is designed in what are called "CELLS", which show each individual aspect of the GUI
*/

//
//This is a local variable, no one else can use it
var $gameScreenDiv;

function clearGameView(){
    $gameScreenDiv.empty();
}

function initializeGameHtml(){
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
}

//This used to be a complicated system to let it be more customizable
//But even as is I have problems
var cellDefinitions = [
    [
        {html: '<div id="Left_Col_Cell_Name"></div>'},
        {html: '<div id="Left_Col_Cell_Name_BIG"></div>'},

        {html: '<div id="Left_Col_Cell_Top" class="cellContainer"></div>'},
        {html: '<div id="Left_Col_Cell_Middle" class="cellContainer"></div>'},
        {html: '<div id="Left_Col_Cell_Bottom" class="cellContainer"></div>'},
        {html: '<div id="Left_Col_Cell_Menus" class="cellContainer"></div>'},

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
    $Cell.Name         = $('#Left_Col_Cell_Name');
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
    if(!usedCells.Name){
        $Cell.Name.remove();
    }
    if(!usedCells.Menu){
        $Cell.Menu.remove();
    }
    if(!usedCells.Dialog){
        $Cell.Dialog.remove();
    }
    if(!usedCells.Actions){
        $Cell.Actions.remove();
    }

    if(!usedCells.Top_Left){
        $Cell.Top_Left.remove();
    }
    if(!usedCells.Middle_Left){
        $Cell.Middle_Left.remove();
    }
    if(!usedCells.Bottom_Left){
        $Cell.Bottom_Left.remove();
    }
    if(!usedCells.Top_Right){
        $Cell.Top_Right.remove();
    }
    if(!usedCells.Middle_Right){
        $Cell.Middle_Right.remove();
    }
    if(!usedCells.Bottom_Right){
        $Cell.Bottom_Right.remove();
    }

    if(!usedCells.Top_Left_BIG){
        $Cell.Top_Left_BIG.remove();
    }
    if(!usedCells.Bottom_Left_BIG){
        $Cell.Bottom_Left_BIG.remove();
    }
    if(!usedCells.Top_Right_BIG){
        $Cell.Top_Right_BIG.remove();
    }
    if(!usedCells.Bottom_Right_BIG){
        $Cell.Bottom_Right_BIG.remove();
    }
}

function initCellHtml(){

    //temporary calls
    $Cell.Name.append('<div id="NameLabel" class="sectionContainer giant_font">' + (get_HAE().title || 'HADVENTE') + '</div>');
    $Cell.Menu.append('<div id="GameMenu" class="sectionContainer small_font">Inventory and other game menus</div>');

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
function updateScreen(){
    _.each(MODULES, function(_module, _name){
        if(_module.NO_HTML) return;
        if(_module.update_HTML){
            _module.update_HTML();
        }
        else{
            //You'll have to delete this line of code if you make something labelled a module that isn't part of the GUI
            //in which case, why is it a module? If your mod is called by other modules but isn't a module itself it shouldn't be part of modules
            ////Though I haven't actually set up a system for non-module mods, sooo...
            console.error('Why does this module not have an update_HTML? ' + _name);
        }
    });
}
