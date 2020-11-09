/*jshint esversion: 6 */ 

MODULES.ACTIONS = function () {
    
    var ACTION_FNs = {};

    /*
    
    ooooo ooooo      ooo ooooo ooooooooooooo 
    `888' `888b.     `8' `888' 8'   888   `8 
     888   8 `88b.    8   888       888      
     888   8   `88b.  8   888       888      
     888   8     `88b.8   888       888      
     888   8       `888   888       888      
    o888o o8o        `8  o888o     o888o     

     */
    var actionGridSize;
    var actionGrid = [];
    var maxActions;
    ACTION_FNs.initialize = function(){
        if( !getCellLocation('ACTIONS') ) return;
        actionGridSize = (get_HAE().ACTIONS && get_HAE().ACTIONS.grid_size) || [3, 3];
        maxActions = actionGridSize[0] * actionGridSize[1];

        _.times(actionGridSize[0], function(_y){
            var newRow = [];
            _.times(actionGridSize[1], function(_x){
                newRow.push('');
            });
            actionGrid.push(newRow);
        });
    };
    ACTION_FNs.restart_module = function(){};
    /*

    ooooo     ooo ooooooooo.   oooooooooo.         .o.       ooooooooooooo oooooooooooo 
    `888'     `8' `888   `Y88. `888'   `Y8b       .888.      8'   888   `8 `888'     `8 
     888       8   888   .d88'  888      888     .8"888.          888       888         
     888       8   888ooo88P'   888      888    .8' `888.         888       888oooo8    
     888       8   888          888      888   .88ooo8888.        888       888    "    
     `88.    .8'   888          888     d88'  .8'     `888.       888       888       o 
       `YbodP'    o888o        o888bood8P'   o88o     o8888o     o888o     o888ooooood8 

     */
    ACTION_FNs.update_module = function(){
        if( !getCellLocation('ACTIONS') ) return;
        //this is the main function that gets called each time an update event is called
        var actionsList = STATE.GET_SCENE_DATA().ACTIONS || [];

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
        if( !getCellLocation('ACTIONS') ) return;
        _$Cell[ getCellLocation('ACTIONS') ].append('<div id="ActionsMenu" class="sectionContainer small_font">' + getActionsGridHtml() + '</div>');
        
        _.times(actionGridSize[0], function(_y){
            _.times(actionGridSize[1], function(_x){
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
        var gridSize = actionGridSize;
        var html = '<table class="gridContainer">';
        _.times(gridSize[0], function(_y){
            html +='<tr class="action_grid_row">';
            _.times(gridSize[1], function(_x){
                html += '<td id="Action_'+ _y + '_'+ _x + '" class="action_grid_cell actionButton"></td>';
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
    ACTION_FNs.update_HTML = function(){
        if( !getCellLocation('ACTIONS') ) return;
        //Every time the screen is updated, we want to redraw all the action cells
        //Even if the actions didn't update, since it should update 99% of the time,
        //The added protection against not redrawing is just wasted code complexity
        _.times(actionGridSize[0], function(_y){
            _.times(actionGridSize[1], function(_x){
                var actionVal = actionGrid[_y][_x];
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
        if( !actionGrid[_y][_x] ) return; //no cell to click on
        H_Log('ACTIONS', 'clicked on action cell ' + _y + ', ' + _x + ' - which has the value of ', actionGrid[_y][_x]);

        if( ActionTypeClickFns[ actionGrid[_y][_x].actionType ] ){
            ActionTypeClickFns[ actionGrid[_y][_x].actionType ]( actionGrid[_y][_x] );
        }
        else{
            console.error('action button does not have a valid action!', actionGrid[_y][_x].actionType );
        }
    }

    ACTION_FNs.finished_draw = function(){};

    /*

          .o.         .oooooo.   ooooooooooooo ooooo   .oooooo.   ooooo      ooo  .oooooo..o 
         .888.       d8P'  `Y8b  8'   888   `8 `888'  d8P'  `Y8b  `888b.     `8' d8P'    `Y8 
        .8"888.     888               888       888  888      888  8 `88b.    8  Y88bo.      
       .8' `888.    888               888       888  888      888  8   `88b.  8   `"Y8888o.  
      .88ooo8888.   888               888       888  888      888  8     `88b.8       `"Y88b 
     .8'     `888.  `88b    ooo       888       888  `88b    d88'  8       `888  oo     .d8P 
    o88o     o8888o  `Y8bood8P'      o888o     o888o  `Y8bood8P'  o8o        `8  8""88888P'  

     */        
    //THIS SECTION ADDS THE ACTIONS TO THE MACRO LIST
    HAE_PROCESSOR.ADD_TYPE(['ACTION'], function(_value, _scene_data){
        if( !_scene_data.ACTIONS ) _scene_data.ACTIONS = [];
        _scene_data.ACTIONS.push( getActionFromStatement(_value) );
    });
    HAE_PROCESSOR.ADD_TYPE(['GOTO'], function(_value, _scene_data){
        if( !_scene_data.ACTIONS ) _scene_data.ACTIONS = [];
        _scene_data.ACTIONS.push( getActionFromStatement('GOTO ' + _value) );
    });
    var getActionFromStatement = function(_action){
        var spaceSplit = _action.split(/\s+/);
        var actionType = spaceSplit.shift();
        spaceSplit = spaceSplit.join(' ');
        var values = spaceSplit.split('||');
        return { actionType, values };
    };
    
    var ActionTypeButtonFns = {};
    var ActionTypeClickFns = {};
    ACTION_FNs.ADD_TYPE = function( _names, _value_fn, _click_fn){
        if(!_names || !_value_fn || !_click_fn){
            console.error('Action type needs a names array, a preprocessor function, and a click fn');
        }
        if( _.isString(_names) ) _names = [_names]; 
        _.each(_names, function(_name){
            ActionTypeButtonFns[_name] = _value_fn;
            ActionTypeClickFns[_name] = _click_fn;
        });
    };
    ACTION_FNs.ADD_TYPE(['NONE'], function(_values, _type){}, function( _button_obj ){});
    ACTION_FNs.ADD_TYPE(['GOTO'], function(_values, _type){

        if( !_.size( _.compact(_values) ) ){
            console.error('Action was taken without value', _action);
            return '';
        }

        return{
            text: _values[0], //impossible to not have values[0]
            scene: _values[1] || _values[0],
            tooltip: _values[2] || ''
        };
    }, function( _button_obj ){
        return HAE_SCENE.SET_NEW_SCENE( _button_obj.scene );
    });

    var parseActionString = function(_action){
        if(!_action) return '';

        if(!_action.actionType){
            console.error('Action was made without value, if you want to have an empty space in your action list, put <[ACTION NONE]> instead');
            return '';
        }

        if( ActionTypeButtonFns[ _action.actionType ] ){
            var newActionObj = ActionTypeButtonFns[ _action.actionType ](_action.values, _action.actionType);
            if(newActionObj) newActionObj.actionType = _action.actionType;
            return newActionObj || '';
        }
        else{
            console.error('We do not have this action type yet: ' + _action.actionType, _action);
            return '';
        }
    };

    //Returns public functions into the variable
    return ACTION_FNs;
};
