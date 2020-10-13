/*jshint esversion: 6 */ 

//This adds the function deepClone to underscore
_.mixin({
    deepClone: function(_object){
        if(_.isFunction(_object)) return _object;

        var newObject = _.isArray(_object) ? [] : {}; 

        _.each(_object, function(_value, _key_or_ind ) {
            if ( _.isObject(_value) || _.isFunction(_value) ){
                _value = _.deepClone(_value);
            }
            //question for array, why set it like this and not with push?
            newObject[ _key_or_ind ] = _value;
        });

        return newObject;
    }
});
