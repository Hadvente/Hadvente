/*jshint esversion: 6 */ 

//save_load_history calls functions in this file to deal with putting the save data somewhere

(function(){
    STORAGE.initialize_storage = function(){
        check_has_local_storage();
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
            H_Error('Your browser does not suppoer local storage. Please let the developer know which browser you are using, ' +
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


    //NOTE: I WILL NOT USE COOKIES, COOKIES SUCK! You can't use cookies locally, so obviously you must use something else
    //Cookies are kinda like cloud saves, since they're read server-side
    //I have now plan to implement cloud saves, that seems like years of effort
    //localStorage is super easy to use, so I will stick with that for now


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

    STORAGE.saveData = function( _key, _item ){
        if(use_local_storage){
            var savedItem = _.isObject(_item)? JSON.stringify( _item ) : _item;
            localStorage.setItem(_key, '' + savedItem);
        }
        else if(use_indexed_db){
            console.error('indexedDB is unimplemented');
        }
        else{
            console.error('no avaiable storage type');
        }
    };

    STORAGE.getData = function( _key ){
        if(use_local_storage){
            var saveData = localStorage.getItem( _key );
            return JSON.parse( saveData );
        }
        else if(use_indexed_db){
            console.error('indexedDB is unimplemented');
        }
        else{
            console.error('no avaiable storage type');
        }
    };

    STORAGE.deleteData = function( _key ){
        if(use_local_storage){
            localStorage.removeItem( _key );
        }
        else if(use_indexed_db){
            console.error('indexedDB is unimplemented');
        }
        else{
            console.error('no avaiable storage type');
        }
    };
}).call();

