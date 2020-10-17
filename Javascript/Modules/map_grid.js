/*jshint esversion: 6 */ 

MODULES.MAP_GRID = function() { 

    var MAP_GRID_FNs = {};

    /*

    ooooooooo.   ooooo     ooo oooooooooo.  ooooo        ooooo   .oooooo.   
    `888   `Y88. `888'     `8' `888'   `Y8b `888'        `888'  d8P'  `Y8b  
     888   .d88'  888       8   888     888  888          888  888          
     888ooo88P'   888       8   888oooo888'  888          888  888          
     888          888       8   888    `88b  888          888  888          
     888          `88.    .8'   888    .88P  888       o  888  `88b    ooo  
    o888o           `YbodP'    o888bood8P'  o888ooooood8 o888o  `Y8bood8P'  

    */
   
    var newMapGrid = false;
    var mapIsDisabled = false;
    var previousLocation;
    MAP_GRID_FNs.initialize = function(){
        if( !get_HAE().cells.MAP_GRID ) return; //there is no NAV
        if( !get_HAE().maps ){
            console.error('If you have a NAV cell, you need a maps key');
            return;
        }
        if( !get_HAE().maps.starting_map ){
            console.error('If you have a NAV cell, you need a starting_map key inside maps');
            //maybe this will change because of procedurally generated maps?
            //or maybe starting_map can be a function
            return;
        }
        if( !get_HAE().maps[ get_HAE().maps.starting_map ] ){
            console.error('The starting_map does not exist');
            return;
        }

        GET_CELL_DATA('MAP_GRID').map_name = get_HAE().maps.starting_map;
        GET_CELL_DATA('MAP_GRID').location = getCurrentMap().start;

        newMapGrid = true;
    };
    MAP_GRID_FNs.forceLocationScene = function(){
        if( !get_HAE().cells.MAP_GRID ){
            console.error('Your HAE Script tried to force a MAP_GRID location scene when it does not have the MAP_GRID cell!');
            return;
        }
        var newLocationID = getLocationID();
        var newScene = getLocationScene(newLocationID);
        return MODULES.DIALOG.SET_NEW_SCENE(newScene);
    };
    MAP_GRID_FNs.changeMapGrid = function(_map_id){
        if( !get_HAE().cells.MAP_GRID ) return;
        //Not called yet, but could be an action attached to a scene that sends you to a new map grid
    };
    MAP_GRID_FNs.update_module = function(_map_id){
        if( !get_HAE().cells.MAP_GRID ) return;
        //Not used yet, but could be an action attached to a scene that sends you to a new map grid
    };
    //Is this really the correct way to do it?
    MAP_GRID_FNs.finished_draw = function(){
        previousLocation = GET_CELL_DATA('MAP_GRID').location;
        newMapGrid = false;
    };

    MAP_GRID_FNs.restart_module = function(){
        //This is called when the game_state is modified by the save system
        //Anything that must be modified when a save is loaded should happen here
    };

    function getCurrentMap(){
        return get_HAE().maps[ GET_CELL_DATA('MAP_GRID').map_name ];
    }
    function getCurrentLocation(){
        return GET_CELL_DATA('MAP_GRID').location;
    }

    /*
    
    ooooo   ooooo ooooooooooooo ooo        ooooo ooooo        
    `888'   `888' 8'   888   `8 `88.       .888' `888'        
     888     888       888       888b     d'888   888         
     888ooooo888       888       8 Y88. .P  888   888         
     888     888       888       8  `888'   888   888         
     888     888       888       8    Y     888   888       o 
    o888o   o888o     o888o     o8o        o888o o888ooooood8 
    
     */

    var $Nav;
    MAP_GRID_FNs.init_HTML = function(_$Cell){
        if( !get_HAE().cells.MAP_GRID ) return;
        _$Cell[ get_HAE().cells.MAP_GRID ].append('<div id="NavigationMenu" class="sectionContainer small_font"></div>');
        $Nav = $('#NavigationMenu');
        //there are 3 aspects to Nav
        //The grid, which shows parts of the map that can be clicked and navigated
        //Nav Arrows, which you can click instead to move left right up down
        //Special Buttons, like the world map popup button
        //Some games have only the first element, because they choose to have so few locations
        //you should check the game .hae file to figure this out
        
        //FOR NOW: this map contains the grid and nothing more. Just draw first_grid and nothing else
        $Nav.append(getMapGridHtml());
    };

    //need to figure out how to design to account for the arrow buttons once we have those
    function getMapGridHtml(){
        //We want to grab the grid html. every game, or at least every grid, has a grid size defined
        var gridSize = getCurrentMap().grid_size;
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

    var $Cells;
    MAP_GRID_FNs.update_HTML = function(){
        if( !get_HAE().cells.MAP_GRID ) return;
        
        if( STATE.GET_SCENE_LOCKED() ){
            if( !$Nav.hasClass('mapDisabled') ){
                $Nav.addClass('mapDisabled');
            }
        }
        else if( $Nav.hasClass('mapDisabled') ){
            $Nav.removeClass('mapDisabled');
        }
        
        //At this point we should check if anything has changed, because there is no reason to redraw if we have no map change
        var newGrid = getNewGrid();
        var newLocation = getNewLocation();
        if(!newGrid && !newLocation) return;

        //Initialize cells
        ////This part is inside Update because we want ot eventually rework this to handle changing grid sizes
        if( !$Cells ){ // || newGrid
            $Cells = {};
            _.times(getCurrentMap().grid_size[0], function(_y){
                _.times(getCurrentMap().grid_size[1], function(_x){
                    $Cells['Grid_'+ _y + '_'+ _x] = $('#Grid_'+ _y + '_'+ _x);
                    $Cells['Grid_'+ _y + '_'+ _x].click(function(){
                        mapGridClick(_y, _x);
                    });
                });
            });
        }

        //Initialize cell
        if( newGrid ){
            _.times(getCurrentMap().grid_size[0], function(_y){
                _.times(getCurrentMap().grid_size[1], function(_x){
                    if(newGrid[_y][_x]){
                        $Cells['Grid_'+ _y + '_'+ _x].html( getNameForLocation(_y, _x) );
                        if( !$Cells['Grid_'+ _y + '_'+ _x].hasClass('map_grid_cell_in_use') ){
                            $Cells['Grid_'+ _y + '_'+ _x].addClass('map_grid_cell_in_use');
                        }
                    }
                    else{
                        $Cells['Grid_'+ _y + '_'+ _x].html('');
                        if( $Cells['Grid_'+ _y + '_'+ _x].hasClass('map_grid_cell_in_use') ){
                            $Cells['Grid_'+ _y + '_'+ _x].removeClass('map_grid_cell_in_use');
                        }
                    }
                });
            });
        }

        if( previousLocation){
            if(!$Cells['Grid_'+ previousLocation[0] + '_'+ previousLocation[1]].hasClass('map_grid_cell_current') ){
                console.error('Grid missing class it expected to have?');
            }
            $Cells['Grid_'+ previousLocation[0] + '_'+ previousLocation[1]].removeClass('map_grid_cell_current');
        }
        if(!$Cells['Grid_'+ newLocation[0] + '_'+ newLocation[1]]){
            console.error('Grid does not have the cell of the new location! Why? Did things initialize out of order?', newLocation);
        }
        if( $Cells['Grid_'+ newLocation[0] + '_'+ newLocation[1]].hasClass('map_grid_cell_current') )  {
            console.error('Grid has class it was not expected to have?');
        }
        $Cells['Grid_'+ newLocation[0] + '_'+ newLocation[1]].addClass('map_grid_cell_current');
    };

    function mapGridClick(_y, _x){
        if( !getCurrentMap().grid[_y][_x] ) return; //no cell to click on
        if( getCurrentLocation()[0] == _y && getCurrentLocation()[1] == _x) return; //Clicking on the current cell should do nothing
        if( STATE.GET_SCENE_LOCKED() ) return; //The map is locked

        H_Log('clicked on cell ' + _y + ', ' + _x + ' - which has the value of ' + getCurrentMap().grid[_y][_x]);

        previousLocation = getCurrentLocation();
        GET_CELL_DATA('MAP_GRID').location = [_y, _x];

        var newLocationID = getLocationID();
        var newScene = getLocationScene(newLocationID);
        return MODULES.DIALOG.SET_NEW_SCENE(newScene);
    }

    function getNewGrid(){
        //if grid has not changed, we do not want to update the location on the screen
        if( !newMapGrid ) return;
        return getCurrentMap().grid;
    }

    function getNewLocation(){
        //If our location hasn't changed, we do not want to update the location in the html
        if(previousLocation && previousLocation[0] == getCurrentLocation()[0] && previousLocation[1] == getCurrentLocation()[1]) return;
        return getCurrentLocation();
    }

    function getLocationID(){
        var y = getCurrentLocation()[0];
        var x = getCurrentLocation()[1];
        var loc = getCurrentMap().grid[y][x];
        return _.isObject(loc)? loc.ID : loc;
    }

    function getCurrentLocationScenes(_location_ID){
        if( !getCurrentMap().locations ){
            console.error('Why dont you have a locations key for figuring out what scenes belong to a location?');
            return '';
        }
        if( !getCurrentMap().locations[ _location_ID ] ){
            console.error('locations is missing a location!' + _location_ID, getCurrentMap().locations);
            return '';
        }
        if( !getCurrentMap().locations[ _location_ID ].scenes ){
            console.error('locations is missing the scenes key!' + _location_ID, getCurrentMap().locations);
            return '';
        }
        return getCurrentMap().locations[ _location_ID ].scenes;
    }

    function getNameForLocation(_y, _x){
        if( !getCurrentMap().grid[_y][_x] ) return ''; //empty cell
        if( _.isObject(getCurrentMap().grid[_y][_x]) ){
            return getCurrentMap().grid[_y][_x].Name || getCurrentMap().grid[_y][_x].scene;
        }
        if( !getCurrentMap().locations ){
            console.error('Why dont you have a locations key for figuring out what scenes belong to a location?');
            return '';
        }
        if( !getCurrentMap().locations ){
            console.error('Why dont you have a locations key for figuring out what scenes belong to a location?');
            return '';
        }
        if( !getCurrentMap().locations[ getCurrentMap().grid[_y][_x] ] ){
            console.error('Locations key missing specific location: ' + getCurrentMap().grid[_y][_x]);
            return '';
        }
        if( !getCurrentMap().locations[ getCurrentMap().grid[_y][_x] ].Name ){
            console.error('Locations key missing Name: ' + getCurrentMap().grid[_y][_x]);
            return '';
        }
        return getCurrentMap().locations[ getCurrentMap().grid[_y][_x] ].Name;
    }

    function getLocationScene(_location_ID){
        var locScenesArr = getCurrentLocationScenes(_location_ID);
        //need to filter the list for anything that doesn't pass requirements
        locScenesArr = _.filter(locScenesArr, function(_LocScene){
            if(_LocScene.requirements === true) return true;
            if( _.isFunction(_LocScene.requirements) ){
                return _LocScene.requirements( GET_GAME_DATA(), GET_CELL_DATA(), get_HAE() ); //Requirements gets handed the game state for calculating whether it's currently valid
            }
            console.error('The requirements for all scenes based on a location must be either true or a function', locScenesArr);
        });
        //locScenesArr is now an array of scenes, need to pick one at random weighed by probability
        var randomElementIndex = Math.floor(Math.random() * locScenesArr.length);
        var locScene = locScenesArr[randomElementIndex];
        //The location_scenes is not complete, plus we will not reference it directly from the get_HAE()
        return locScene.scene;
    }

    //Returns public functions into the variable
    return MAP_GRID_FNs;
};
