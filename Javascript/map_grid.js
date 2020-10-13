/*jshint esversion: 6 */ 

(function () {

    MODULES.MAP_GRID =  function() { 
    
        var MAP_GRID_FNs = {NAME: 'MAP_GRID'};

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
        var currentLocation;
        var previousLocation;
        var currentMap;
        MAP_GRID_FNs.initialize = function(){
            if( !get_HAE().cells.Nav ) return; //there is no NAV
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

            currentMap = get_HAE().maps[ get_HAE().maps.starting_map ];

            currentLocation = currentMap.start;
            newMapGrid = true;
        };
        MAP_GRID_FNs.clickedGrid = function(_y, _x){
            //if( mapIsDisabled ) return; //Clicking on the map while it is disabled is an illegal action :V
            if( !currentMap.grid[_y][_x] ) return; //no cell to click on
            if( currentLocation[0] == _y && currentLocation[1] == _x) return; //Clicking on the current cell should do nothing
            if( getSceneLocked() ) return; //The map is locked

            H_Log('clicked on cell ' + _y + ', ' + _x + ' - which has the value of ' + currentMap.grid[_y][_x]);

            previousLocation = currentLocation;
            currentLocation = [_y, _x];

            var newLocationID = MAP_GRID_FNs.getLocationID();
            var newScene = MAP_GRID_FNs.getLocationScene(newLocationID);
            setNewScene(newScene);

            runGameUpdate();
        };
        MAP_GRID_FNs.getNewGrid = function(){
            //if grid has not changed, we do not want to update the location on the screen
            if( !newMapGrid ) return;
            return currentMap.grid;
        };
        MAP_GRID_FNs.getNewLocation = function(){
            //If our location hasn't changed, we do not want to update the location in the html
            if(previousLocation && previousLocation[0] == currentLocation[0] && previousLocation[1] == currentLocation[1]) return;
            return currentLocation;
        };
        MAP_GRID_FNs.getPreviousLocation = function(){
            return previousLocation;
        };
        MAP_GRID_FNs.getGridSize = function(){
            return currentMap.grid_size;
        };
        MAP_GRID_FNs.getLocationID = function(){
            var loc = currentMap.grid[currentLocation[0]][currentLocation[1]];
            return _.isObject(loc)? loc.ID : loc;
        };
        MAP_GRID_FNs.getCurrentLocationScenes = function(_location_ID){
            if( !currentMap.locations ){
                console.error('Why dont you have a locations key for figuring out what scenes belong to a location?');
                return '';
            }
            if( !currentMap.locations[ _location_ID ] ){
                console.error('locations is missing a location!' + _location_ID, currentMap.locations);
                return '';
            }
            if( !currentMap.locations[ _location_ID ].scenes ){
                console.error('locations is missing the scenes key!' + _location_ID, currentMap.locations);
                return '';
            }
            return currentMap.locations[ _location_ID ].scenes;
        };
        MAP_GRID_FNs.getNameForLocation = function(_y, _x){
            if( !currentMap.grid[_y][_x] ) return ''; //empty cell
            if( !currentMap.locations ){
                console.error('Why dont you have a locations key for figuring out what scenes belong to a location?');
                return '';
            }
            if( !currentMap.locations ){
                console.error('Why dont you have a locations key for figuring out what scenes belong to a location?');
                return '';
            }
            if( !currentMap.locations[ currentMap.grid[_y][_x] ] ){
                console.error('Locations key missing specific location: ' + currentMap.grid[_y][_x]);
                return '';
            }
            if( !currentMap.locations[ currentMap.grid[_y][_x] ].Name ){
                console.error('Locations key missing Name: ' + currentMap.grid[_y][_x]);
                return '';
            }
            return currentMap.locations[ currentMap.grid[_y][_x] ].Name;
        };
        MAP_GRID_FNs.getLocationScene = function(_location_ID){
            var locScenesArr = MAP_GRID_FNs.getCurrentLocationScenes(_location_ID);
            //need to filter the list for anything that doesn't pass requirements
            locScenesArr = _.filter(locScenesArr, function(_LocScene){
                if(_LocScene.requirements === true) return true;
                if( _.isFunction(_LocScene.requirements) ){
                    return _LocScene.requirements( get_GAME_STATE(), get_HAE() ); //Requirements gets handed the game state for calculating whether it's currently valid
                }
                console.error('The requirements for all scenes based on a location must be either true or a function', locScenesArr);
            });
            //locScenesArr is now an array of scenes, need to pick one at random weighed by probability
            var randomElementIndex = Math.floor(Math.random() * locScenesArr.length);
            var locScene = locScenesArr[randomElementIndex];
            //The location_scenes is not complete, plus we will not reference it directly from the get_HAE()
            return locScene.scene;
        };
        MAP_GRID_FNs.forceLocationScene = function(){
            var newLocationID = MAP_GRID_FNs.getLocationID();
            var newScene = MAP_GRID_FNs.getLocationScene(newLocationID);
            setNewScene(newScene);
        };
        MAP_GRID_FNs.changeMapGrid = function(_map_id){
            //Not called yet, but could be an action attached to a scene that sends you to a new map grid
        };
        //Is this really the correct way to do it?
        MAP_GRID_FNs.finished_draw = function(){
            previousLocation = currentLocation;
            newMapGrid = false;
        };
        MAP_GRID_FNs.update_module = function(_map_id){
            //Not used yet, but could be an action attached to a scene that sends you to a new map grid
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
            if( !get_HAE().cells.Nav ) return;
            $Cell[ get_HAE().cells.Nav ].append('<div id="NavigationMenu" class="sectionContainer small_font"></div>');
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
            var gridSize = currentMap.grid_size;
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
            if( !get_HAE().cells.Nav ) return;
            
            if( getSceneLocked() ){
                if( !$Nav.hasClass('mapDisabled') ){
                    $Nav.addClass('mapDisabled');
                }
            }
            else if( $Nav.hasClass('mapDisabled') ){
                $Nav.removeClass('mapDisabled');
            }
            
            //At this point we should check if anything has changed, because there is no reason to redraw if we have no map change
            var newGrid = MAP_GRID_FNs.getNewGrid();
            var newLocation = MAP_GRID_FNs.getNewLocation();
            if(!newGrid && !newLocation) return;

            //Initialize cells
            ////This part is inside Update because we want ot eventually rework this to handle changing grid sizes
            if( !$Cells ){ // || newGrid
                $Cells = {};
                _.times(currentMap.grid_size[0], function(_y){
                    _.times(currentMap.grid_size[1], function(_x){
                        $Cells['Grid_'+ _y + '_'+ _x] = $('#Grid_'+ _y + '_'+ _x);
                        $Cells['Grid_'+ _y + '_'+ _x].click(function(){
                            mapGridClick(_y, _x);
                        });
                    });
                });
            }

            //Initialize cell
            if( newGrid ){
                _.times(currentMap.grid_size[0], function(_y){
                    _.times(currentMap.grid_size[1], function(_x){
                        if(newGrid[_y][_x]){
                            $Cells['Grid_'+ _y + '_'+ _x].html(MAP_GRID_FNs.getNameForLocation(_y, _x));
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
            MAP_GRID_FNs.clickedGrid(_y, _x);
        }
        /*
        
        ooooooooo.   ooooooooo.   ooooo oooooo     oooo       .o.       ooooooooooooo oooooooooooo 
        `888   `Y88. `888   `Y88. `888'  `888.     .8'       .888.      8'   888   `8 `888'     `8 
         888   .d88'  888   .d88'  888    `888.   .8'       .8"888.          888       888         
         888ooo88P'   888ooo88P'   888     `888. .8'       .8' `888.         888       888oooo8    
         888          888`88b.     888      `888.8'       .88ooo8888.        888       888    "    
         888          888  `88b.   888       `888'       .8'     `888.       888       888       o 
        o888o        o888o  o888o o888o       `8'       o88o     o8888o     o888o     o888ooooood8 

         */
        
        //private
        var examplePrivateMapFn = function(_action){
        };

        //Returns public functions into the variable
        return MAP_GRID_FNs;
    
    }();

}).call();
