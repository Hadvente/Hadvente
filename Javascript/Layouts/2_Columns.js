/*jshint esversion: 6 */ 

LAYOUTS['2_COLUMNS'] = (function(){

    var PUBLIC_FNs = {};
    
    PUBLIC_FNs.initializeLayout = function(){

    };
    PUBLIC_FNs.initializeContainer = function(_$Body){
        _$Body.append('<div id="GameWindow_2Columns"></div>');
        return $('#GameWindow_2Columns');
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
        ]
    ];


    function createCells(_$Container){
        _.each(cellDefinitions, function(_columns, _col){
            var currentY = 0;
            var colHtml = '<div id="' + ((_col == 0)? 'LeftColumn_2Columns': 'MiddleColumn_2Columns') + '">';
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

        //Big Cells
        $Cell.Top_Left_BIG     = $('#Left_Col_Cell_Top_BIG');
        $Cell.Bottom_Left_BIG  = $('#Left_Col_Cell_Bottom_BIG');

        return $Cell;
    }

    return PUBLIC_FNs;
})();
