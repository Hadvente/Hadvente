/*jshint esversion: 6 */ 

/*
game_view.js
This file draws the GUI itself.
The GUI is designed in what are called "CELLS", which show each individual aspect of the GUI
*/

(function(){

    VIEW.initializeGameHtml = function(){
        var $Body      = initBody();
        var Layout     = getLayout();
        var $Container = initContainer($Body,  Layout);
        var $Cells     = initCells($Container, Layout);
        deleteUnusedCells($Cells);
        initCellHtml($Cells);
        initPopup();
    };

    function initBody(){
        return  $('body'); //right now, I do not do anything to the body before appending the layout container
    }

    function getLayout(){
        var Layout;
        if( get_HAE().Layout ){
            Layout = LAYOUTS[ get_HAE().Layout ];
            if( !Layout ){
                H_Error('Layout is invalid, you must have a layout file that matches the layout in the HAE.');
            }
        }
        else{
            Layout = LAYOUTS['2_COLUMNS']; //If a layout is undefined, we default to 2_COLUMNS
            if( !Layout ){
                H_Error('Need to provide a Layout. 2_COLUMNS Layout is missing, so we can not pick a default.');
            }
        }
        if( _.isFunction(Layout) ){
            Layout = Layout();
        }
        if(!Layout || !Layout.initializeLayout || !Layout.initializeContainer || !Layout.initializeCells){
            H_Error('Layout must either be an object or function that returns an object containing the 3 functions initializeLayout, initializeContainer, and initializeCells');
        }
        initLayout(Layout);
        return Layout;
    }

    function initLayout( _layout ){
        _layout.initializeLayout();
    }
    function initContainer( _$Body, _layout ){
        return _layout.initializeContainer(_$Body);
    }
    function initCells( _$Container, _layout ){
        return _layout.initializeCells(_$Container);
    }

    function deleteUnusedCells(_$Cells){
        if( URLS.debug_cells ) return;
        var usedCells = {};
        _.each(MODULES, function( _module, _module_name ){
            if( getCellLocation(_module_name) ){
                usedCells[ getCellLocation(_module_name) ] = _module_name;
            }
        });
        _.each(_$Cells, function(_$div, _location_name){
            if( !usedCells[_location_name] ){
                _$div.remove();
            }
        });
    }

    function initCellHtml(_$Cells){
        _.each(MODULES, function(_module, _name){
            if(_module.NO_HTML) return;
            _module.init_HTML(_$Cells);
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
            _module.update_HTML();
        });
    };

    function initPopup(){
        $("body").append('<div id="PopupContainer" class="background_obscure popup_hidden"></div>');
    }

    var isPopupOpen = false;
    VIEW.openPopup = function(_popup_id, _popup_header, _class_list){
        if( isPopupOpen ) VIEW.closePopup(); //this is valid if you want to replace a popup
        $('#PopupContainer').append(`<div id="PopupContentsContainer"><div id="PopupContents" class="${_class_list || ''} popup_container"></div></div>`);
        $('#PopupContainer').removeClass('popup_hidden');
        isPopupOpen = true;

        var $Contents = $('#PopupContents');
        if(_popup_header || _popup_id){
            if( !_popup_header ) H_Error('Need Popup Header if you pass in a Popup Name to openPopup');
            if( !_popup_header ) H_Error('Need Popup Header if you pass in a Popup Name to openPopup');
            $Contents.append('<div id="PopupHeader"><div id="PopupName">' + _popup_header + '</div><div id="ClosePopup" class="buttonBorder" onmouseup="VIEW.closePopup(\'' + _popup_id + '\');">X</div></div>');
            $Contents.append('<div id="' + _popup_id + 'Contents" class="' + (_class_list || '') + ' remaining_space_of_popup">If these words are visible, the popup has no contents</div>');
            $Contents = $Contents.find('#' + _popup_id + 'Contents');
        }
        return $Contents;
    };

    VIEW.closePopup = function( _popup_id ){
        if( !isPopupOpen ){
            H_Error('Someone has called closePopup when the popup is already closed!');
            return;
        }
        $('#PopupContainer').empty();
        $('#PopupContainer').addClass('popup_hidden');
        isPopupOpen = false;
        if( _popup_id ){
            ENGINE.removeKeyPress( _popup_id );
        }
    };

}).call();
