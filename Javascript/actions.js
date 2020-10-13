/*jshint esversion: 6 */ 

var ACTIONS = (function () {
    
    var ACTION_FNs = {};

    /*

    ooooooooo.   ooooo     ooo oooooooooo.  ooooo        ooooo   .oooooo.   
    `888   `Y88. `888'     `8' `888'   `Y8b `888'        `888'  d8P'  `Y8b  
     888   .d88'  888       8   888     888  888          888  888          
     888ooo88P'   888       8   888oooo888'  888          888  888          
     888          888       8   888    `88b  888          888  888          
     888          `88.    .8'   888    .88P  888       o  888  `88b    ooo  
    o888o           `YbodP'    o888bood8P'  o888ooooood8 o888o  `Y8bood8P'  

    */
   
    var actionsGridSize;
    var actionGrid = [];
    var maxActions;
    ACTION_FNs.initialize = function(){
        actionsGridSize = (get_HAE().actions && get_HAE().actions.grid_size) || [3, 3];
        maxActions = actionsGridSize[0] * actionsGridSize[1];

        _.times(actionsGridSize[0], function(_y){
            var newRow = [];
            _.times(actionsGridSize[1], function(_x){
                newRow.push('');
            });
            actionGrid.push(newRow);
        });
    };
    ACTION_FNs.clickedGrid = function(_y, _x){
        if( !actionGrid[_y][_x] ) return; //no cell to click on
        H_Log('clicked on action cell ' + _y + ', ' + _x + ' - which has the value of ', actionGrid[_y][_x]);

        if( actionGrid[_y][_x].location ){
            MAP_GRID.forceLocationScene();
        }
        else if( actionGrid[_y][_x].scene ){
            setNewScene( actionGrid[_y][_x].scene ); 
        }
        else{
            console.error('action button does not have scene!');
        }

        runGameUpdate();
    };
    ACTION_FNs.getGridSize = function(){
        return actionsGridSize;
    };
    ACTION_FNs.getGrid = function(){ //Who would ever want the unparsed action list?
        return actionGrid;
    };
    ACTION_FNs.getGridLabels = function(){
        //This returns the strings that belongs to the actions
        return actionGrid;
    };
    ACTION_FNs.update_system = function(){
        //this is the main function that gets called each time an update event is called
        var actionList = getCurrentActions();

        //convert action list into an actionGrid array
        if(_.size(actionList) > maxActions){
            console.error('We can currently only handle ' + maxActions + ' actions per scene');
        }

        var index = 0;
        _.each(actionGrid, function(_actionRow, _indRow){
            _.each(_actionRow, function(_action, _indCell){
                actionGrid[_indRow][_indCell] = parseActionString(actionList[index] || '');
                index++;
            });
        });
    };

    /*
    
    ooooooooo.   ooooooooo.   ooooo oooooo     oooo       .o.       ooooooooooooo oooooooooooo 
    `888   `Y88. `888   `Y88. `888'  `888.     .8'       .888.      8'   888   `8 `888'     `8 
     888   .d88'  888   .d88'  888    `888.   .8'       .8"888.          888       888         
     888ooo88P'   888ooo88P'   888     `888. .8'       .8' `888.         888       888oooo8    
     888          888`88b.     888      `888.8'       .88ooo8888.        888       888    "    
     888          888  `88b.   888       `888'       .8'     `888.       888       888       o 
    o888o        o888o  o888o o888o       `8'       o88o     o8888o     o888o     o888ooooood8 

     */
    
    var parseActionString = function(_action){
        if(!_action) return '';

        if(!_action.actionType){
            console.error('Action was made without value, if you want to have an empty space in your action list, put <<[ACTION NONE]>> instead');
            return '';
        }

        if( !_.size(_action.values) ){
            console.error('Action was taken without value', _action);
            return '';
        }

        if(_action.actionType == 'NONE'){
            return '';
        }
        if(_action.actionType == 'CONTINUE' || _action.actionType == 'LOCATION'){
            return {
                text: 'Continue',
                tooltip: 'Finish scene',
                scene: 'LOCATION',
                location: true
            };
        }
        if(_action.actionType == 'GOTO'){

            var action = { text: _action.values[0], //impossible to not have values[0]
                scene: _action.values[1] || _action.values[0],
                tooltip: _action.values[2] || '' };
            return action;
        }
        else{
            console.error('We do not have this action type yet: ' + _action.actionType, _action);
            return '';
        }
    };

    //Returns public functions into the variable
    return ACTION_FNs;
})();
