/*jshint esversion: 6 */ 

//This adds the function deepClone to underscore
_.mixin({
    //Note: If we used lodash instead of underscore, lodash would have it's own deepClone function called cloneDeep
    //This is twice as fast as Lodash's deepClone, but this does not account for edge cases like lodash does (note 2: I don't know what edge cases they account for, I just presume they do because why else would it be so slow)
    deepClone: function(_object){
        if(_.isFunction(_object)) return _object;

        var newObject = _.isArray(_object) ? [] : {}; 

        _.each(_object, function(_value, _key_or_ind ) {
            if ( _.isObject(_value) ){
                _value = _.deepClone(_value);
            }
            // question for array, why set it like this and not with push?
            // One reason: Sparse Arrays would lose their correct index - But, doesn't that mean the sparse array recreation may
            ///  not be the same as the original, with extra indexes with a value of undefined?
            newObject[ _key_or_ind ] = _value;
        });

        return newObject;
    }
});
