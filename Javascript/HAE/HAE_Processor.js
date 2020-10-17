/*jshint esversion: 6 */ 

/*
HAE_Processor.js
This file deals with processing the individual commands of the system
It could have a system where you pass in a list of types and a function that those are associated with
So, then, inside the individual modules that add new types, you can call it like:
HAE_PROCESSOR.AddCommand(['FN', 'FUNCTION'], function(_value){});
*/

var HAE_PROCESSOR = (function () {

    var PARSER_FNs = {};

    PARSER_FNs.initialize = function(){

    };
    
    PARSER_FNs.update_scene = function(){

    };

    //Returns public functions into the variable
    return PARSER_FNs;
})();
