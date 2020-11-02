/*jshint esversion: 6 */ 

MODULES.MAP_GRID = function() { 

    var MAP_GRID_FNs = {};

    /*
    
    ooooo ooooo      ooo ooooo ooooooooooooo 
    `888' `888b.     `8' `888' 8'   888   `8 
     888   8 `88b.    8   888       888      
     888   8   `88b.  8   888       888      
     888   8     `88b.8   888       888      
     888   8       `888   888       888      
    o888o o8o        `8  o888o     o888o     

     */
    var newMapGrid = false; //If this is used for anything other than HTML, it needs to become part of the State
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

        if(MODULES.ACTIONS){
            MODULES.ACTIONS.ADD_TYPE(['CONTINUE', 'LOCATION'], function(_values, _type){
                return {
                    text: 'Continue',
                    tooltip: 'Finish scene'
                };
            }, function( _button_obj ){
                return MODULES.MAP_GRID.forceLocationScene();
            });
        }

        STATE.GET_CELL_DATA('MAP_GRID').map_name = get_HAE().maps.starting_map;
        STATE.GET_CELL_DATA('MAP_GRID').location = getCurrentMap().start;
        newMapGrid = true;
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
    MAP_GRID_FNs.restart_module = function(){
        //This is called when the game_state is modified by the save system
        //Anything that must be modified when a save is loaded should happen here
        STATE.GET_CELL_DATA('MAP_GRID').map_name = STATE.GET_CELL_DATA('MAP_GRID').map_name || get_HAE().maps.starting_map;
        STATE.GET_CELL_DATA('MAP_GRID').location = STATE.GET_CELL_DATA('MAP_GRID').location || getCurrentMap().start;
        newMapGrid = true;
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
    MAP_GRID_FNs.update_module = function(_map_id){
        if( !get_HAE().cells.MAP_GRID ) return;
        //Not used yet, but could be an action attached to a scene that sends you to a new map grid
    };

    /*

    ooooooooo.   ooooo     ooo oooooooooo.  ooooo        ooooo   .oooooo.   
    `888   `Y88. `888'     `8' `888'   `Y8b `888'        `888'  d8P'  `Y8b  
     888   .d88'  888       8   888     888  888          888  888          
     888ooo88P'   888       8   888oooo888'  888          888  888          
     888          888       8   888    `88b  888          888  888          
     888          `88.    .8'   888    .88P  888       o  888  `88b    ooo  
    o888o           `YbodP'    o888bood8P'  o888ooooood8 o888o  `Y8bood8P'  

    */
    //these public functions should not be public like this. They should instead be passed in as command and action types
    MAP_GRID_FNs.forceLocationScene = function(){
        if( !get_HAE().cells.MAP_GRID ){
            console.error('Your HAE Script tried to force a MAP_GRID location scene when it does not have the MAP_GRID cell!');
            return;
        }
        var newLocationID = getLocationID();
        var newScene = getLocationScene(newLocationID);
        return HAE_SCENE.SET_NEW_SCENE(newScene);
    };
    MAP_GRID_FNs.changeMapGrid = function(_map_id){
        if( !get_HAE().cells.MAP_GRID ) return;
        //Not called yet, but could be an action attached to a scene that sends you to a new map grid
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
            html +='<tr class="map_grid_row">';
            _.times(gridSize[1], function(_x){
                html += '<td id="Grid_'+ _y + '_'+ _x + '" class="map_grid_cell"></td>';
            });
            html += '</tr>';
        });
        html +='</table>';
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
    var $Cells;
    MAP_GRID_FNs.update_HTML = function(){
        if( !get_HAE().cells.MAP_GRID ) return;
        
        if( STATE.GET_SCENE_DATA().SCENE_LOCKED ){
            if( !$Nav.hasClass('mapDisabled') ){
                $Nav.addClass('mapDisabled');
            }
        }
        else if( $Nav.hasClass('mapDisabled') ){
            $Nav.removeClass('mapDisabled');
        }
        
        //At this point we should check if anything has changed, because there is no reason to redraw if we have no map change
        var newGrid = getNewGrid();

        //Initialize cells
        if( newGrid ){

            //first, reset the map to have the correct map
            $Nav.empty().append(getMapGridHtml());

            //next, add all the click functions
            $Cells = {};
            _.times(getCurrentMap().grid_size[0], function(_y){
                _.times(getCurrentMap().grid_size[1], function(_x){
                    $Cells['Grid_'+ _y + '_'+ _x] = $('#Grid_'+ _y + '_'+ _x);
                    $Cells['Grid_'+ _y + '_'+ _x].click(function(){
                        mapGridClick(_y, _x);
                    });
                });
            });

            //then add all the click functions and classes
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

        //We want to remove map_grid_cell_current from everything to avoid confusing logic about what was previously highlighted
        _.each( $Cells, function( _$cell ){
            if( _$cell.hasClass('map_grid_cell_current') ){
                _$cell.removeClass('map_grid_cell_current');
            }
        });
        $Cells['Grid_'+ getCurrentLocation()[0] + '_'+ getCurrentLocation()[1]].addClass('map_grid_cell_current');
    };

    function mapGridClick(_y, _x){
        if( STATE.GET_SCENE_DATA().SCENE_LOCKED ) return; //The map is locked
        if( !getCurrentMap().grid[_y][_x] ) return; //no cell to click on
        if( getCurrentLocation()[0] == _y && getCurrentLocation()[1] == _x) return; //Clicking on the current cell should do nothing

        H_Log('MAP_GRID', 'clicked on cell ' + _y + ', ' + _x + ' - which has the value of ' + getCurrentMap().grid[_y][_x]);

        STATE.GET_CELL_DATA('MAP_GRID').previousLocation = getCurrentLocation();
        STATE.GET_CELL_DATA('MAP_GRID').location = [_y, _x];

        var newLocationID = getLocationID();
        var newScene = getLocationScene(newLocationID);
        return HAE_SCENE.SET_NEW_SCENE(newScene);
    }

    /*

    ooooooooo.     .oooooo.    .oooooo..o ooooooooooooo    oooooooooo.   ooooooooo.         .o.    oooooo   oooooo     oooo 
    `888   `Y88.  d8P'  `Y8b  d8P'    `Y8 8'   888   `8    `888'   `Y8b  `888   `Y88.      .888.    `888.    `888.     .8'  
     888   .d88' 888      888 Y88bo.           888          888      888  888   .d88'     .8"888.    `888.   .8888.   .8'   
     888ooo88P'  888      888  `"Y8888o.       888          888      888  888ooo88P'     .8' `888.    `888  .8'`888. .8'    
     888         888      888      `"Y88b      888          888      888  888`88b.      .88ooo8888.    `888.8'  `888.8'     
     888         `88b    d88' oo     .d8P      888          888     d88'  888  `88b.   .8'     `888.    `888'    `888'      
    o888o         `Y8bood8P'  8""88888P'      o888o        o888bood8P'   o888o  o888o o88o     o8888o    `8'      `8'         

     */
    MAP_GRID_FNs.finished_draw = function(){
        STATE.GET_CELL_DATA('MAP_GRID').previousLocation = getCurrentLocation(); //This prevents errors when the next scene is in the same location
        newMapGrid = false;
    };
    
    //I am including the Private header because this cell has so many 'get' to deal with accessing the map
    /*
    
    ooooooooo.   ooooooooo.   ooooo oooooo     oooo       .o.       ooooooooooooo oooooooooooo 
    `888   `Y88. `888   `Y88. `888'  `888.     .8'       .888.      8'   888   `8 `888'     `8 
     888   .d88'  888   .d88'  888    `888.   .8'       .8"888.          888       888         
     888ooo88P'   888ooo88P'   888     `888. .8'       .8' `888.         888       888oooo8    
     888          888`88b.     888      `888.8'       .88ooo8888.        888       888    "    
     888          888  `88b.   888       `888'       .8'     `888.       888       888       o 
    o888o        o888o  o888o o888o       `8'       o88o     o8888o     o888o     o888ooooood8 

     */
    function getCurrentMap(){
        return get_HAE().maps[ STATE.GET_CELL_DATA('MAP_GRID').map_name ];
    }
    function getCurrentLocation(){
        return STATE.GET_CELL_DATA('MAP_GRID').location;
    }
    function getPreviousLocation(){
        return STATE.GET_CELL_DATA('MAP_GRID').previousLocation;
    }
    function getNewGrid(){
        //if grid has not changed, we do not want to redraw the map
        if( !newMapGrid ) return;
        return getCurrentMap().grid;
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
                return _LocScene.requirements( STATE.GET_GAME_DATA(), STATE.GET_STATE(), get_HAE() ); //Requirements gets handed the game state for calculating whether it's currently valid
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
