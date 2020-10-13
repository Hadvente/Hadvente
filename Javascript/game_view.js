/*jshint esversion: 6 */ 

/*
game_view.js
This file draws the GUI itself.
It should be the only file with access to jquery if at all possible.
The GUI is designed in what are called "CELLS"

There are 4 required cells:
Dialog  - The main way the game is played is as a text adventure, this is where the text is shown 
Actions - Instead of having the actions listed inside the text dialog, There is instead a button list
Title   - Top left area for drawing the banner or logo of the game
Menu    - Has buttons that open popups like "Options", "Save/Load", "Inventory", etc

There are 6 optional cells:
Map/Nav -
Party   -
Member  -
Image   -
Player  -
Status  -
*/

//
//This is a local variable, no one else can use it
var $gameScreenDiv;

function clearGameView(){
    $gameScreenDiv.empty();
}

function initializeGameHtml(){
    if(get_HAE().cells.NO_RIGHT_COLUMN){
        $("body").append('<div id="GameWindow_2Columns"></div>');
        $gameScreenDiv = $('#GameWindow_2Columns');
    }
    else{
        $("body").append('<div id="GameWindow"></div>');
        $gameScreenDiv = $('#GameWindow');
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
        {html: '<div id="Right_Col_Cell_Engine" class="cellContainer"></div>'},
        {html: '<div id="Right_Col_Cell_Top" class="cellContainer"></div>'},
        {html: '<div id="Right_Col_Cell_Middle" class="cellContainer"></div>'},
        {html: '<div id="Right_Col_Cell_Bottom" class="cellContainer"></div>'},
        {html: '<div id="Right_Col_Cell_InfoBar" class="cellContainer"></div>'},

        {html: '<div id="Right_Col_Cell_Top_BIG" class="cellContainer"></div>'},
        {html: '<div id="Right_Col_Cell_Bottom_BIG" class="cellContainer"></div>'}
    ] 
];


function createCells(){
    _.each(cellDefinitions, function(_columns, _col){
        if( _col == 2 && get_HAE().cells.NO_RIGHT_COLUMN ) return; //We don't want the third column
        var currentY = 0;
        var colHtml;
        if( get_HAE().cells.NO_RIGHT_COLUMN ){
            colHtml = '<div id="' + ((_col == 0)? 'LeftColumn_2Columns': 'MiddleColumn_2Columns') + '">';
        }
        else{
            colHtml = '<div id="' + ((_col == 0)? 'LeftColumn': (_col == 1)? 'MiddleColumn' : 'RightColumn') + '">';
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
    _.each(initRequiredCells, (_fn) => _fn());
    _.each(initDesiredCells, (_fn) => _fn());
    deleteUnusedCells();
    _.each(setRequiredMenus, (_fn) => _fn());
    _.each(setDesiredMenus, (_fn) => _fn());
    updateScreen();
}

var $Cell = {};
function setEachCellSelector(){
    //These are all REQUIRED
    $Cell.Name         = $('#Left_Col_Cell_Name');
    $Cell.Menu         = $('#Left_Col_Cell_Menus');
    $Cell.Dialog       = $('#Center_Col_Cell_Dialog');
    $Cell.Actions      = $('#Center_Col_Cell_Actions');
    $Cell.Engine       = $('#Right_Col_Cell_Engine');
    $Cell.InfoBar      = $('#Right_Col_Cell_InfoBar');

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

//This is only for the initial state, it's okay that they don't read specific data
var initRequiredCells = {
    //left column
    Name: function(){
        $Cell.Name.append('<div id="NameLabel" class="sectionContainer giant_font"></div>');
    },
    Menu: function(){
        $Cell.Menu.append('<div id="GameMenu" class="sectionContainer small_font">Inventory and other game menus</div>');
    },
    Engine: function(){
        if(get_HAE().cells.NO_RIGHT_COLUMN) return;
        $Cell.Engine.append('<div id="EngineMenu" class="sectionContainer small_font">☼ This contains save/options/engine menus</div>');
    },
    InfoBar: function(){
        if(get_HAE().cells.NO_RIGHT_COLUMN) return;
        $Cell.InfoBar.append('<div id="InfoBar" class="sectionContainer small_font">This contains a status update</div>');
    },
    //middle column
    Dialog: function(){
        $Cell.Dialog.append(`<div id="MainDialogContainer">
            <div id="MainDialogScrollbar">
                <div id="MainDialogTextHolder" class="standard_font">
                </div>
            </div>
        </div>`);
    },
    Actions: function(){
        $Cell.Actions.append('<div id="ActionsMenu" class="sectionContainer small_font"></div>');
    },
};
var initDesiredCells = {
    //The remaining 6 items are all optional and may appear in any of the 6 slots!
    Status: function(){
        if( !get_HAE().cells.Status ) return;
        $Cell[ get_HAE().cells.Status ].append('<div id="AreaStatus" class="sectionContainer small_font">This is the area status and notifications window</div>');
    },
    PartyMembers: function(){
        if( !get_HAE().cells.PartyMembers ) return;
        $Cell[ get_HAE().cells.PartyMembers ].append('<div id="PartyMemberMenu" class="sectionContainer small_font">This shows the basic info for each party member</div>');
    },
    MemberView: function(){
        if( !get_HAE().cells.MemberView ) return;
        $Cell[ get_HAE().cells.MemberView ].append('<div id="MemberViewMenu" class="sectionContainer small_font">This shows a single party member, lets you talk to them, and see stats about them</div>');
    },
    Player: function(){
        if( !get_HAE().cells.Player ) return;
        $Cell[ get_HAE().cells.Player ].append('<div id="PlayerStatus" class="sectionContainer small_font">This contains the player status</div>');
    },
    Image: function(){
        if( !get_HAE().cells.Image ) return;
        $Cell[ get_HAE().cells.Image ].append('<div id="ImageViewer" class="sectionContainer small_font">This will show an image maybe</div>');
    },
    Nav: function(){
        if( !get_HAE().cells.Nav ) return;
        $Cell[ get_HAE().cells.Nav ].append('<div id="NavigationMenu" class="sectionContainer small_font"></div>');
    },
};
var $Menu = {}; //has same keys as above. jquery elements, though Actions is an object, look above for object keys.

var setRequiredMenus = {
    Name: function(){
        $Menu.Name = $('#NameLabel');
        $Menu.Name.html('HADVENTE');
    },
    Menu: function(){
        $Menu.Menu = $('#GameMenu');
    },
    //middle column
    Dialog: function(){
        $Menu.Dialog = $('#MainDialogTextHolder');
    },
    Actions: function(){
        $Menu.Actions = $('#ActionsMenu');
        $Menu.Actions.append(getActionsGridHtml());
        
        $CellDivs.Actions = {};
        _.times(MAP_GRID.getGridSize()[0], function(_y){
            _.times(MAP_GRID.getGridSize()[1], function(_x){
                $CellDivs.Actions['Action_'+ _y + '_'+ _x] = $('#Action_'+ _y + '_'+ _x);
                $CellDivs.Actions['Action_'+ _y + '_'+ _x].click(function(){
                    actionGridClick(_y, _x);
                });
            });
        });
    },
    Engine: function(){
        if(get_HAE().cells.NO_RIGHT_COLUMN) return;
        $Menu.Engine = $('#EngineMenu');
    },
    InfoBar: function(){
        if(get_HAE().cells.NO_RIGHT_COLUMN) return;
        $Menu.InfoBar = $('#InfoBar');
    },
};
var setDesiredMenus = {
    Status: function(){
        if( !get_HAE().cells.Status ) return;
        $Menu.Status = $('#AreaStatus');
    },
    PartyMembers: function(){
        if( !get_HAE().cells.PartyMembers ) return;
        $Menu.PartyMembers = $('#PartyMemberMenu');
    },
    MemberView: function(){
        if( !get_HAE().cells.MemberView ) return;
        $Menu.MemberView = $('#MemberViewMenu');
    },
    Player: function(){
        if( !get_HAE().cells.Player ) return;
        $Menu.Player = $('#PlayerStatus');
    },
    Image: function(){
        if( !get_HAE().cells.Image ) return;
        $Menu.Image = $('#ImageViewer');
    },
    Nav: function(){
        if( !get_HAE().cells.Nav ) return;
        $Menu.Nav = $('#NavigationMenu');
        //there are 3 aspects to Nav
        //The grid, which shows parts of the map that can be clicked and navigated
        //Nav Arrows, which you can click instead to move left right up down
        //Special Buttons, like the world map popup button
        //Some games have only the first element, because they choose to have so few locations
        //you should check the game .hae file to figure this out
        
        //FOR NOW: this map contains the grid and nothing more. Just draw first_grid and nothing else
        $Menu.Nav.append(getMapGridHtml());
    },
};

//need to figure out how to design to account for the arrow buttons once we have those
function getMapGridHtml(){
    //We want to grab the grid html. every game, or at least every grid, has a grid size defined
    var gridSize = MAP_GRID.getGridSize();
    var html = '<table class="gridContainer">';
    _.times(gridSize[0], function(_y){
        //height has to be set like this because of the indeterminate amount of rows
        html +='<tr class="map_grid_row">';
        _.times(gridSize[1], function(_x){
            html += '<td id="Grid_'+ _y + '_'+ _x + '" class="map_grid_cell"></div>';
        });
        html += '</tr>';
    });
    html +='</table>';
    return html;
}

//need to figure out how to design to account for the arrow buttons once we have those
function getActionsGridHtml(){
    //We want to grab the grid html. every game, or at least every grid, has a grid size defined
    var gridSize = ACTIONS.getGridSize();
    var html = '<table class="gridContainer">';
    _.times(gridSize[0], function(_y){
        //height has to be set like this because of the indeterminate amount of rows
        html +='<tr class="action_grid_row">';
        _.times(gridSize[1], function(_x){
            html += '<td id="Action_'+ _y + '_'+ _x + '" class="action_grid_cell actionButton"></div>';
        });
        html += '</tr>';
    });
    html +='</table>';
    return html;
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
    _.each(updateMenus, (_fn) => _fn());
}
//these contain menus that can be updated
//Some menus, like Name, never update after load
var $CellDivs = {};
var updateMenus = {
    Dialog: function(){
        if(DIALOG.hasNewDialog()){
            $Menu.Dialog.html(DIALOG.getDialogHtml());
        }
    },
    Actions: function(){
        var newGrid = ACTIONS.getGrid();
        //Every time the screen is updated, we want to redraw all the action cells
        //Even if the actions didn't update, since it should update 99% of the time,
        //The added protection against not redrawing is just wasted code complexity
        _.times(ACTIONS.getGridSize()[0], function(_y){
            _.times(ACTIONS.getGridSize()[1], function(_x){
                var actionVal = newGrid[_y][_x];
                if(actionVal){
                    $CellDivs.Actions['Action_'+ _y + '_'+ _x].html(actionVal.text);
                    if( !$CellDivs.Actions['Action_'+ _y + '_'+ _x].hasClass('active_action') ){
                        $CellDivs.Actions['Action_'+ _y + '_'+ _x].addClass('active_action');
                    }
                    $CellDivs.Actions['Action_'+ _y + '_'+ _x].prop('title', actionVal.tooltip);
                }
                else{
                    $CellDivs.Actions['Action_'+ _y + '_'+ _x].html('');
                    if( $CellDivs.Actions['Action_'+ _y + '_'+ _x].hasClass('active_action') ){
                        $CellDivs.Actions['Action_'+ _y + '_'+ _x].removeClass('active_action');
                    }
                    $CellDivs.Actions['Action_'+ _y + '_'+ _x].prop('title', '');
                }
            });
        });
    },

    Nav: function(){
        if( !get_HAE().cells.Nav ) return;
        
        if( getSceneLocked() ){
            if( !$Menu.Nav.hasClass('mapDisabled') ){
                $Menu.Nav.addClass('mapDisabled');
            }
        }
        else if( $Menu.Nav.hasClass('mapDisabled') ){
            $Menu.Nav.removeClass('mapDisabled');
        }
        
        //At this point we should check if anything has changed, because there is no reason to redraw if we have no map change
        var newGrid = MAP_GRID.getNewGrid();
        var newLocation = MAP_GRID.getNewLocation();
        if(!newGrid && !newLocation) return;

        //Initialize cells
        ////This part is inside Update because we want ot eventually rework this to handle changing grid sizes
        if( !$CellDivs.Nav ){ // || newGrid
            $CellDivs.Nav = {};
            _.times(MAP_GRID.getGridSize()[0], function(_y){
                _.times(MAP_GRID.getGridSize()[1], function(_x){
                    $CellDivs.Nav['Grid_'+ _y + '_'+ _x] = $('#Grid_'+ _y + '_'+ _x);
                    $CellDivs.Nav['Grid_'+ _y + '_'+ _x].click(function(){
                        mapGridClick(_y, _x);
                    });
                });
            });
        }

        //Initialize cell
        if( newGrid ){
            _.times(MAP_GRID.getGridSize()[0], function(_y){
                _.times(MAP_GRID.getGridSize()[1], function(_x){
                    if(newGrid[_y][_x]){
                        $CellDivs.Nav['Grid_'+ _y + '_'+ _x].html(MAP_GRID.getNameForLocation(_y, _x));
                        if( !$CellDivs.Nav['Grid_'+ _y + '_'+ _x].hasClass('map_grid_cell_in_use') ){
                            $CellDivs.Nav['Grid_'+ _y + '_'+ _x].addClass('map_grid_cell_in_use');
                        }
                    }
                    else{
                        $CellDivs.Nav['Grid_'+ _y + '_'+ _x].html('');
                        if( $CellDivs.Nav['Grid_'+ _y + '_'+ _x].hasClass('map_grid_cell_in_use') ){
                            $CellDivs.Nav['Grid_'+ _y + '_'+ _x].removeClass('map_grid_cell_in_use');
                        }
                    }
                });
            });
        }

        var previousLocation = MAP_GRID.getPreviousLocation();

        //Print out errors if neccessary, add and remove classes as needed
        if( previousLocation){
            if(!$CellDivs.Nav['Grid_'+ previousLocation[0] + '_'+ previousLocation[1]].hasClass('map_grid_cell_current') ){
                console.error('Grid missing class it expected to have?');
            }
            $CellDivs.Nav['Grid_'+ previousLocation[0] + '_'+ previousLocation[1]].removeClass('map_grid_cell_current');
        }
        if(!$CellDivs.Nav['Grid_'+ newLocation[0] + '_'+ newLocation[1]]){
            console.error('Grid does not have the cell of the new location! Why? Did things initialize out of order?', newLocation);
        }
        if( $CellDivs.Nav['Grid_'+ newLocation[0] + '_'+ newLocation[1]].hasClass('map_grid_cell_current') )  {
            console.error('Grid has class it was not expected to have?');
        }
        $CellDivs.Nav['Grid_'+ newLocation[0] + '_'+ newLocation[1]].addClass('map_grid_cell_current');

        //Is this even a good system?
        MAP_GRID.confirmMapUpdated();
    }
};

/*

oooooooooooo oooooo     oooo oooooooooooo ooooo      ooo ooooooooooooo 
`888'     `8  `888.     .8'  `888'     `8 `888b.     `8' 8'   888   `8 
 888           `888.   .8'    888          8 `88b.    8       888      
 888oooo8       `888. .8'     888oooo8     8   `88b.  8       888      
 888    "        `888.8'      888    "     8     `88b.8       888      
 888       o      `888'       888       o  8       `888       888      
o888ooooood8       `8'       o888ooooood8 o8o        `8      o888o     
                                                                       
                                                                       
                                                                       
ooooo   ooooo       .o.       ooooo      ooo oooooooooo.   ooooo        oooooooooooo ooooooooo.    .oooooo..o 
`888'   `888'      .888.      `888b.     `8' `888'   `Y8b  `888'        `888'     `8 `888   `Y88. d8P'    `Y8 
 888     888      .8"888.      8 `88b.    8   888      888  888          888          888   .d88' Y88bo.      
 888ooooo888     .8' `888.     8   `88b.  8   888      888  888          888oooo8     888ooo88P'   `"Y8888o.  
 888     888    .88ooo8888.    8     `88b.8   888      888  888          888    "     888`88b.         `"Y88b 
 888     888   .8'     `888.   8       `888   888     d88'  888       o  888       o  888  `88b.  oo     .d8P 
o888o   o888o o88o     o8888o o8o        `8  o888bood8P'   o888ooooood8 o888ooooood8 o888o  o888o 8""88888P'  

 */
/*
    This section should not actually handle data logic! It should instead just pass information into the correct files
 */
function mapGridClick(_y, _x){
    MAP_GRID.clickedGrid(_y, _x);
}

function actionGridClick(_y, _x){
    ACTIONS.clickedGrid(_y, _x);
}
