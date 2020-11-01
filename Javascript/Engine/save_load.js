/*jshint esversion: 6 */ 

(function(){
    //var STORAGE; //The storage system should not be touched by anything but the save system
    /*

     .oooooo..o       .o.       oooooo     oooo oooooooooooo 
    d8P'    `Y8      .888.       `888.     .8'  `888'     `8 
    Y88bo.          .8"888.       `888.   .8'    888         
     `"Y8888o.     .8' `888.       `888. .8'     888oooo8    
         `"Y88b   .88ooo8888.       `888.8'      888    "    
    oo     .d8P  .8'     `888.       `888'       888       o 
    8""88888P'  o88o     o8888o       `8'       o888ooooood8 

    */

    SAVES.initializeSaveSystem = function(){
        //STORAGE = STORAGE_FN(); //rename file in storage.js to STORAGE_FN, make it be a function that returns an object
        STORAGE.initialize_storage();
        var settings = STORAGE.getSettings();
    };

    //Auto_
    SAVES.auto_save = function(){
        if( !HISTORY.is_in_present() ) return; //Do not autosave if you are not in the present!

        var currentSave = HISTORY.get_present_state();

        if( !currentSave.META_DATA.scene_count ) return; //Do no make an autosave on the start screen

        currentSave.META_DATA.save_time = Date.now();
        STORAGE.saveData('AUTO', currentSave);
    };

    SAVES.make_new_save_slot = function(){
        var currentSave = HISTORY.get_currently_viewed_state();
        currentSave.META_DATA.save_time = Date.now();
        STORAGE.saveData('NEW SAVE ' + Math.random().toFixed(5), currentSave); //obviously, this is not a good way to get the save name
    };

    ////////////////
    //DELETE SAVES//
    ////////////////

    SAVES.delete_save_file = function( _save_key ){
        //this deletes the save cookie for this slot
        STORAGE.deleteData( _save_key );
    };

    /*

    ooooo          .oooooo.         .o.       oooooooooo.   
    `888'         d8P'  `Y8b       .888.      `888'   `Y8b  
     888         888      888     .8"888.      888      888 
     888         888      888    .8' `888.     888      888 
     888         888      888   .88ooo8888.    888      888 
     888       o `88b    d88'  .8'     `888.   888     d88' 
    o888ooooood8  `Y8bood8P'  o88o     o8888o o888bood8P'   

     */

    SAVES.load_save_file = function(_save_key){
        var currentSave = STORAGE.getData( _save_key );
        if( currentSave ){
            STATE.LOAD_STATE( currentSave );
        }
        //Question, should loading a save clear history, or should pressing undo put you back into the previous save?
    };

    // SAVES.get_save_file = function(_save_key){
    //     return STORAGE.getData( _save_key );
    // };

    /*

    oooooooooooo ooooo ooooo        oooooooooooo 
    `888'     `8 `888' `888'        `888'     `8 
     888          888   888          888         
     888oooo8     888   888          888oooo8    
     888    "     888   888          888    "    
     888          888   888       o  888       o 
    o888o        o888o o888ooooood8 o888ooooood8 
                                                 
                                                 
                                                 
     .oooooo..o oooooo   oooo  .oooooo..o ooooooooooooo oooooooooooo ooo        ooooo 
    d8P'    `Y8  `888.   .8'  d8P'    `Y8 8'   888   `8 `888'     `8 `88.       .888' 
    Y88bo.        `888. .8'   Y88bo.           888       888          888b     d'888  
     `"Y8888o.     `888.8'     `"Y8888o.       888       888oooo8     8 Y88. .P  888  
         `"Y88b     `888'          `"Y88b      888       888    "     8  `888'   888  
    oo     .d8P      888      oo     .d8P      888       888       o  8    Y     888  
    8""88888P'      o888o     8""88888P'      o888o     o888ooooood8 o8o        o888o 

     */


    SAVES.save_to_file = function(){
        var currentSave = HISTORY.get_currently_viewed_state();

        currentSave = JSON.stringify( currentSave, null, 4 ); //null, 4 is done to make the file human readable
        
        //convert save into file
        var saveFile = new Blob([currentSave], { type: 'application/json' });
        
        //make save name
        var fileName = 'SaveFile_' + _.timeToStringForFile(new Date());
        
        //create and save file
        var url = window.URL.createObjectURL(saveFile);
        $(document.body).append('<a id="fileDump" href="' + url + '" download="' + fileName + '"></a>');
        var $fileDump = $('#fileDump');
        $fileDump[0].click();
        _.delay(function(){
            window.URL.revokeObjectURL(url);
            $fileDump.remove();
        }, 500); //delay just to make sure the click has started. Once it has started, the revoke does not block the download.
    };
    SAVES.open_save_file = function(_callback){
        //If the load file object already does not already exist, we need to remake it
        //There is no way to capture the "closed file dialog" event, which means we need the change function
        //to fire on the OLD #LoadFile if it already exists 
        if( !$('#LoadFile')[0] ){

            $(document.body).append(`<div id="LoadFileContainer" class="popup_hidden">
                <input type="file" name="Choose Save File" id="LoadFile" accept=".json"></input>
            </div>`);

            $('#LoadFileContainer').on('change', '#LoadFile', function(_event) {
                var file = (_event.target && _event.target.files && _event.target.files[0]) ? _event.target.files[0] : null;
                if(!file) return _callback && _callback();
                var reader = new FileReader();
                reader.readAsText(file);
                reader.onerror = function() {
                    H_Error('could not read file');
                };
                reader.onload = function(_event) {
                    var imported_json = _event.target.result;
                    try{
                        var parsedFile = JSON.parse(imported_json);
                        H_Log('SAVES', 'parsed loaded file', imported_json);
                        STATE.LOAD_STATE( parsedFile );
                        $('#LoadFileContainer').remove();
                    }
                    catch(_err){
                        H_Error('Failure while loading file: ' + _err.stack);
                    }
                    return _callback && _callback();
                };
            });
        }


        $('#LoadFile')[0].click();
    };

    /*

    ooooooooo.     .oooooo.   ooooooooo.   ooooo     ooo ooooooooo.   
    `888   `Y88.  d8P'  `Y8b  `888   `Y88. `888'     `8' `888   `Y88. 
     888   .d88' 888      888  888   .d88'  888       8   888   .d88' 
     888ooo88P'  888      888  888ooo88P'   888       8   888ooo88P'  
     888         888      888  888          888       8   888         
     888         `88b    d88'  888          `88.    .8'   888         
    o888o         `Y8bood8P'  o888o           `YbodP'    o888o        

     */

    SAVES.createPopup = function(){
        var PopupId = PopupId;
        var $SavePopup = VIEW.openPopup(PopupId, 'Save and Load');
        ENGINE.addKeyPress(PopupId, function(e) {
            if (e.keyCode === 27){
                VIEW.closePopup(PopupId);
            }
        });

        createContentsOfSavePopup($SavePopup);
        addEventHandlersForSavePopup($SavePopup);
    };

    function createContentsOfSavePopup(_$Contents){
        console.log('recreating contents of save popup');
        _$Contents.empty();
        _$Contents.append('<div id="SaveSlotRowsContainer"><div id="SaveSlotRowsScrollbar"></div></div><div id="FileSaveLoadButtons"></div>');
        //add bottom save load file buttons
        var $FileSaveLoadBtns = $('#FileSaveLoadButtons');
        $FileSaveLoadBtns.append('<div id="SaveFileButton" class="saveLoadFileButton buttonBorder savePopupButton">Save to File</div><div id="LoadFileButton" class="saveLoadFileButton buttonBorder savePopupButton">Load From File</div>');
        //add file rows
        var $SlotRows = $('#SaveSlotRowsScrollbar');

        if( STORAGE.canNotSave() ){
            $SlotRows.append('<div class="saveSlotRow saveInfo">No form of local storage available, saves will not persist.</div>');
        }
        $SlotRows.append('<hr class="solidDivider">');

        var savesList = STORAGE.getAllSaveInfo();
        _.each(savesList, function(_save_info){
            var html = '<div class="saveSlotRow" savekey="' + _save_info.save_key + '">';

            var time = new Date(_save_info.updated_save_date);
            var timestamp = _.timeToString(time);
            //create save row here
            html += '<div class="loadSaveButton buttonBorder savePopupButton">Load</div>';
            html += '<div class="saveInfo">' + _save_info.name + '<br>' + timestamp + '</div>';
            html += '<div class="deleteSaveButton buttonBorder savePopupButton">Delete</div>';

            html += '</div>';
            $SlotRows.append(html);
            $SlotRows.append('<hr class="solidDivider">');
        });
        if( _.size(savesList) < 6 ){
            $SlotRows.append('<div class="saveSlotRow"><div id="NewSaveButton" class="buttonBorder savePopupButton">New Save</div></div><hr class="solidDivider">');
        }
    }

    function addEventHandlersForSavePopup(_$Contents){
        _$Contents.on('mouseup', '.deleteSaveButton', function(_event){
            var currentElem = _event.target;
            var saveKey = currentElem.parentElement.getAttribute('savekey');
            console.log('got save key for delete' + saveKey);

            //delete the save then refresh the popup
            SAVES.delete_save_file(saveKey);

            createContentsOfSavePopup(_$Contents);
        });
        _$Contents.on('mouseup', '.loadSaveButton', function(_event){
            var currentElem = _event.target;
            var saveKey = currentElem.parentElement.getAttribute('savekey');
            console.log('got save key for load' + saveKey);

            //load the save and close the popup
            SAVES.load_save_file(saveKey);

            VIEW.closePopup(PopupId);
        });

        _$Contents.on('mouseup', '#NewSaveButton', function(_event){
            SAVES.make_new_save_slot();
            createContentsOfSavePopup(_$Contents);
        });
        _$Contents.on('mouseup', '#SaveFileButton', function(_event){
            SAVES.save_to_file();
        });
        _$Contents.on('mouseup', '#LoadFileButton', function(_event){
            SAVES.open_save_file(function(){ VIEW.closePopup(PopupId); });
        });
    }
}).call();
