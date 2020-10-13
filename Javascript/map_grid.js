/*jshint esversion: 6 */ 

/*
map_grid.js
*/

var newMapGrid = false;
var mapIsDisabled = false;
var currentLocation;
var previousLocation;
var currentMap;
function initializeMapEngine(){
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

    //Now that we have a map def, we could easily rework it so a function returns a procedurally generated
    //map def
}

function updateMapGrid(){
    //this is the main function that gets called each time an update event is called
    //This really only does anything if a scene forced a map change
}

//All interactions with other modules should be in here
var MAP_GRID = {
    clickedGrid(_y, _x){
        //if( mapIsDisabled ) return; //Clicking on the map while it is disabled is an illegal action :V
        if( !currentMap.grid[_y][_x] ) return; //no cell to click on
        if( currentLocation[0] == _y && currentLocation[1] == _x) return; //Clicking on the current cell should do nothing

        H_Log('clicked on cell ' + _y + ', ' + _x + ' - which has the value of ' + currentMap.grid[_y][_x]);

        previousLocation = currentLocation;
        currentLocation = [_y, _x];

        var newLocationID = MAP_GRID.getLocationID();
        var newScene = MAP_GRID.getLocationScene(newLocationID);
        setNewScene(newScene);

        runGameUpdate();
    },
    getNewGrid(){
        //if grid has not changed, we do not want to update the location on the screen
        if( !newMapGrid ) return;
        return currentMap.grid;
    },
    getNewLocation(){
        //If our location hasn't changed, we do not want to update the location in the html
        if(previousLocation && previousLocation[0] == currentLocation[0] && previousLocation[1] == currentLocation[1]) return;
        return currentLocation;
    },
    getPreviousLocation(){
        return previousLocation;
    },
    getGridSize(){
        return currentMap.grid_size;
    },
    getLocationID(){
        var loc = currentMap.grid[currentLocation[0]][currentLocation[1]];
        return _.isObject(loc)? loc.ID : loc;
    },
    getCurrentLocationScenes(_location_ID){
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
    },
    getNameForLocation(_y, _x){
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
    },
    getLocationScene(_location_ID){
        var locScenesArr = MAP_GRID.getCurrentLocationScenes(_location_ID);
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
    },
    forceLocationScene(){
        var newLocationID = MAP_GRID.getLocationID();
        var newScene = MAP_GRID.getLocationScene(newLocationID);
        setNewScene(newScene);
    },
    changeMapGrid(_map_id){
        //Not called yet, but could be an action attached to a scene that sends you to a new map grid
    },
    //Is this really the correct way to do it?
    confirmMapUpdated(){
        previousLocation = currentLocation;
        newMapGrid = false;
    }
};
