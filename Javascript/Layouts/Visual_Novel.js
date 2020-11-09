/*jshint esversion: 6 */ 

LAYOUTS.Visual_Novel = (function(){

    var PUBLIC_FNs = {};

    PUBLIC_FNs.initializeLayout = function(){
        //The individual visual novel cells are actually all highly interlinked.
        //This means that it makes most sense to do a lot of the VN cell initialization here.
        //This function is called _after_ the modules have been initialized but before the first draw.
    };



    PUBLIC_FNs.initializeContainer = function(_$Body){
        _$Body.append('<div id="GameWindow_VN"></div>');
        return $('#GameWindow_VN');
    };
    PUBLIC_FNs.initializeCells = function(_$Container){
        var html = '';
        html += '<div id="Container_VN">';
            html += '<div id="Body_VN">';
                html += '<div id="VN_Cell_BG"></div>';
                html += '<div id="VN_Cell_Char"></div>';
                html += '<div id="VN_Cell_Dialog" class="cellContainer"></div>';
            html += '</div>';
            //Header HTML
            //The header should float above the game, but it should only be visible on mouseover of the top part
            //Or, you could have a small part of it always visible, that you have to click to make the whole header scroll onto the scren
            html += '<div id="Header_VN">';
                html += '<div id="VN_Cell_Title"></div>';
                html += '<div id="VN_Cell_Menus"></div>';
            html += '</div>';
        html += '</div>';
        _$Container.append(html);
        //Get all the cells for later
        var $Cell = {};
        $Cell.Title        = $('#VN_Cell_Title');
        $Cell.Menus        = $('#VN_Cell_Menus');
        $Cell.BG           = $('#VN_Cell_BG');
        $Cell.Char         = $('#VN_Cell_Char');
        $Cell.Dialog       = $('#VN_Cell_Dialog');
        //Note about the VN layout: There is no system for adding new cells.
        //I need to write a way to make all of these cells automatic and not require anything
        return $Cell;
    };

    return PUBLIC_FNs;
});
