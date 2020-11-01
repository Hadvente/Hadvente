/*jshint esversion: 6 */ 

//save_load_history calls functions in this file to deal with putting the save data somewhere

(function(){
    STORAGE.initialize_storage = function(){
        check_has_local_storage();
        STORAGE.initSettings();
    };

    STORAGE.canNotSave = function(){
        return !use_local_storage && !use_indexed_db;
    };

    /////////
    //TESTS//
    /////////
    var use_local_storage = false;
    function check_has_local_storage() {
        var hasLocalStorage = function(){
            try {
                localStorage.setItem('test_key', 'test_value');
                if( !localStorage.test_key ) return false;
                localStorage.removeItem('test_key');
                return true;
            } catch(e) {
                return false;
            }
        };

        use_local_storage = hasLocalStorage();

        if( !use_local_storage ){
            H_Error('Your browser does not support local storage. Please let the developer know which browser you are using, ' +
                        'and try using the latest firefox, chrome, or other popular browser releases.');
        }
    }

    var use_indexed_db = false;
    //I do not want to implement indexedDB for now, it's much more complicated than the simple save system needs
    //If I ever have a reason to manipulate or read multiple saves at once, then it would be a good idea to switch
    //I would also need to switch if we want to have multiple megabyte save files. I'm not sure what text adventure would save that much data.
    // function localIndexedDBTest() {
    //     return !!window.indexedDB;
    // }


    //NOTE: I have no plans to use cookies. You can't use cookies locally, so obviously you must use something else
    //Cookies are kinda like cloud saves, since they're read server-side
    //I have no plan to implement cloud saves
    //localStorage is super easy to use, so I will stick with that for now

    /*

     .oooooo..o oooooooooooo ooooooooooooo ooooooooooooo ooooo ooooo      ooo   .oooooo.     .oooooo..o 
    d8P'    `Y8 `888'     `8 8'   888   `8 8'   888   `8 `888' `888b.     `8'  d8P'  `Y8b   d8P'    `Y8 
    Y88bo.       888              888           888       888   8 `88b.    8  888           Y88bo.      
     `"Y8888o.   888oooo8         888           888       888   8   `88b.  8  888            `"Y8888o.  
         `"Y88b  888    "         888           888       888   8     `88b.8  888     ooooo      `"Y88b 
    oo     .d8P  888       o      888           888       888   8       `888  `88.    .88'  oo     .d8P 
    8""88888P'  o888ooooood8     o888o         o888o     o888o o8o        `8   `Y8bood8P'   8""88888P'  

     */

    var saveIndex = 0;
    var ALL_SETTINGS;
    STORAGE.initSettings = function(){
        ALL_SETTINGS = STORAGE.getData( 'SETTINGS' );
        if( !ALL_SETTINGS ){
            ALL_SETTINGS = { Settings: {}, AutoSaves: {}, Saves: {} };
            saveSettingsData( ALL_SETTINGS );
        }
    };
    STORAGE.getSettings = function(){
        return ALL_SETTINGS.Settings;
    };
    STORAGE.saveSettings = function( _settings ){
        ALL_SETTINGS.Settings = _settings;
        saveSettingsData( ALL_SETTINGS );
    };
    function saveSettingsData( _obj ){
        if(use_local_storage){
            var savedItem = JSON.stringify( _obj );
            localStorage.setItem('SETTINGS', savedItem);
        }
        else if(use_indexed_db){
            console.error('indexedDB is unimplemented');
        }
        else{
            console.error('no avaiable storage type');
        }
    }

    function addOrUpdateSettingsSaves(_save_key, _save_description){
        var save_description = _save_description || ALL_SETTINGS.AutoSaves[_save_key] || ALL_SETTINGS.Saves[_save_key] || {};

        //add defaults to save if save does not exist
        if( !localStorage.getItem(_save_key) ){
            saveIndex++;
            save_description.saveIndex = saveIndex;

            save_description.save_key = _save_key;
            save_description.name = save_description.name || (_save_key + ' - ' + saveIndex);
            save_description.save_creation_date = Date.now();
            if(_save_key.includes('AUTO') ) save_description.AutoSave = true;
        }
        else if( !save_description.AutoSave ) H_Error('How did I _update_ a non-autosave? There is no system for that.');
        
        save_description.updated_save_date = Date.now();

        //put save info inside settings
        if(save_description.AutoSave){
            ALL_SETTINGS.AutoSaves[_save_key] = save_description;
        }
        else{
            ALL_SETTINGS.Saves[_save_key] = save_description;
        }
        saveSettingsData( ALL_SETTINGS );
    }

    function removeSaveFromSettings(_save_key){
        delete ALL_SETTINGS.AutoSaves[_save_key];
        delete ALL_SETTINGS.Saves[_save_key];
        saveSettingsData( ALL_SETTINGS );
    }

    STORAGE.getAllSaveInfo = function(){
        var allAutoSaves = _.deepClone(ALL_SETTINGS.AutoSaves);
        var allSaves = _.deepClone(ALL_SETTINGS.Saves);
        var sortedAuto  = _.sortBy(allAutoSaves, function(_obj) { return _obj.saveIndex; });
        var sortedSaves = _.sortBy(allSaves,     function(_obj) { return _obj.saveIndex; });
        return [].concat(sortedAuto, sortedSaves);
    };

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

    //This section grabs, loads, and saves cookies, save files, and any other way a save_load can happen

    STORAGE.saveData = function( _save_key, _obj, _description_obj ){
        if( !_.isObject(_obj) ){
            H_Error('STORAGE.saveData can only save objects, passed in non-object for ' + _save_key, _obj);
        }
        
        addOrUpdateSettingsSaves(_save_key, _description_obj);

        if(use_local_storage){
            var savedItem = JSON.stringify( _obj );
            localStorage.setItem(_save_key, '' + savedItem);
        }
        else if(use_indexed_db){
            console.error('indexedDB is unimplemented');
        }
        else{
            console.error('no avaiable storage type');
        }
    };

    STORAGE.getData = function( _save_key ){
        if(use_local_storage){
            var saveData = localStorage.getItem( _save_key );
            if(saveData) return JSON.parse( saveData );
            return null;
        }
        else if(use_indexed_db){
            console.error('indexedDB is unimplemented');
        }
        else{
            console.error('no avaiable storage type');
        }
    };

    STORAGE.deleteData = function( _save_key ){
        removeSaveFromSettings( _save_key );
        if(use_local_storage){
            localStorage.removeItem( _save_key );
        }
        else if(use_indexed_db){
            console.error('indexedDB is unimplemented');
        }
        else{
            console.error('no avaiable storage type');
        }
    };

}).call();

