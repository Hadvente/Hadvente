/*jshint esversion: 6 */ 

/*
game_view.js
This file draws the GUI itself.
The GUI is designed in what are called "CELLS", which show each individual aspect of the GUI
*/

LAYOUTS['3_COLUMNS'] = (function(){
    var PUBLIC_FNs = {};
    
    PUBLIC_FNs.initializeLayout = function(){

    };
    PUBLIC_FNs.initializeContainer = function(_$Body){
        _$Body.append('<div id="GameWindow_3Columns"></div>');
        return $('#GameWindow_3Columns');
    };
    PUBLIC_FNs.initializeCells = function(_$Container){
        createCells(_$Container);
        return setEachCellSelector();
    };

    var cellDefinitions = [
        [
            {html: '<div id="Left_Col_Cell_Title"></div>'},

            {html: '<div id="Left_Col_Cell_Top" class="cellContainer"></div>'},
            {html: '<div id="Left_Col_Cell_Middle" class="cellContainer"></div>'},
            {html: '<div id="Left_Col_Cell_Bottom" class="cellContainer"></div>'},

            {html: '<div id="Left_Col_Cell_Top_BIG" class="cellContainer"></div>'},
            {html: '<div id="Left_Col_Cell_Bottom_BIG" class="cellContainer"></div>'}
        ],
        [
            {html: '<div id="Center_Col_Cell_Menus"></div>'},
            {html: '<div id="Center_Col_Cell_Dialog" class="cellContainer"></div>'},
            {html: '<div id="Center_Col_Cell_Actions" class="cellContainer"></div>'},
        ],
        [
            {html: '<div id="Right_Col_Cell_Top" class="cellContainer"></div>'},
            {html: '<div id="Right_Col_Cell_Middle" class="cellContainer"></div>'},
            {html: '<div id="Right_Col_Cell_Bottom" class="cellContainer"></div>'},

            {html: '<div id="Right_Col_Cell_Top_BIG" class="cellContainer"></div>'},
            {html: '<div id="Right_Col_Cell_Bottom_BIG" class="cellContainer"></div>'}
        ] 
    ];

    function createCells(_$Container){
        _.each(cellDefinitions, function(_columns, _col){
            var currentY = 0;
            var colHtml = '<div id="' + ((_col == 0)? 'LeftColumn_3Columns': (_col == 1)? 'MiddleColumn_3Columns' : 'RightColumn_3Columns') + '">';
            _.each(_columns, function(_arr, _not_first_row){
                colHtml += _arr.html;
            });
            colHtml += '</div>';
            _$Container.append(colHtml);
        });
    }

    function setEachCellSelector(){
        var $Cell = {};
        //These are all REQUIRED
        $Cell.Title        = $('#Left_Col_Cell_Title');
        $Cell.Menu         = $('#Center_Col_Cell_Menus');
        $Cell.Dialog       = $('#Center_Col_Cell_Dialog');
        $Cell.Actions      = $('#Center_Col_Cell_Actions');

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

        return $Cell;
    }

    return PUBLIC_FNs;
});
