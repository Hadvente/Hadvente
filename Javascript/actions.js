/*jshint esversion: 6 */ 

var ACTIONS = (function () {
    
    var ACTION_FNs = {NAME: 'ACTIONS'}; //NOTE: ACTIONS and DIALOG are not normal modules, they are required, so they are not put in the system

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
            return MODULES.MAP_GRID.forceLocationScene();
        }
        else if( actionGrid[_y][_x].scene ){
            return DIALOG.SET_NEW_SCENE( actionGrid[_y][_x].scene );
        }
        else{
            console.error('action button does not have scene!');
        }
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
    ACTION_FNs.update_module = function(){
        //this is the main function that gets called each time an update event is called
        
        //convert action list into an actionGrid array
        if(_.size(actionsList) > maxActions){
            console.error('We can currently only handle ' + maxActions + ' actions per scene');
        }

        var index = 0;
        _.each(actionGrid, function(_actionRow, _indRow){
            _.each(_actionRow, function(_action, _indCell){
                actionGrid[_indRow][_indCell] = parseActionString(actionsList[index] || '');
                index++;
            });
        });
    };

    var actionsList = [];
    ACTION_FNs.SET_NEW_ACTIONS = function(_new_actions){
        actionsList = _new_actions;
    };

    ACTION_FNs.finished_draw = function(){
        //does nothing for now? Can't clear actionsList because clicking the action actually references the list!
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

    var $Actions = {};
    ACTION_FNs.init_HTML = function(_$Cell){
        _$Cell.append('<div id="ActionsMenu" class="sectionContainer small_font">' + getActionsGridHtml() + '</div>');
        
        _.times(ACTIONS.getGridSize()[0], function(_y){
            _.times(ACTIONS.getGridSize()[1], function(_x){
                $Actions['Action_'+ _y + '_'+ _x] = $('#Action_'+ _y + '_'+ _x);
                $Actions['Action_'+ _y + '_'+ _x].click(function(){
                    actionGridClick(_y, _x);
                });
            });
        });
    };

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

    ACTION_FNs.update_HTML = function(){
        var newGrid = ACTIONS.getGrid();
        //Every time the screen is updated, we want to redraw all the action cells
        //Even if the actions didn't update, since it should update 99% of the time,
        //The added protection against not redrawing is just wasted code complexity
        _.times(ACTIONS.getGridSize()[0], function(_y){
            _.times(ACTIONS.getGridSize()[1], function(_x){
                var actionVal = newGrid[_y][_x];
                if(actionVal){
                    $Actions['Action_'+ _y + '_'+ _x].html(actionVal.text);
                    if( !$Actions['Action_'+ _y + '_'+ _x].hasClass('active_action') ){
                        $Actions['Action_'+ _y + '_'+ _x].addClass('active_action');
                    }
                    $Actions['Action_'+ _y + '_'+ _x].prop('title', actionVal.tooltip);
                }
                else{
                    $Actions['Action_'+ _y + '_'+ _x].html('');
                    if( $Actions['Action_'+ _y + '_'+ _x].hasClass('active_action') ){
                        $Actions['Action_'+ _y + '_'+ _x].removeClass('active_action');
                    }
                    $Actions['Action_'+ _y + '_'+ _x].prop('title', '');
                }
            });
        });
    };

    function actionGridClick(_y, _x){
        ACTIONS.clickedGrid(_y, _x);
    }

    //private is not a valid label, it means nothing. Public is valid because there should be very few things anyone asks for
    //but private means nothing to the contents of the section other than the fact people outside of the singleton
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
