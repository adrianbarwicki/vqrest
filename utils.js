const isArray = obj => Object.prototype.toString.call(obj) === '[object Array]';

const updateObject = function (obj) {
    for (var i = 1; i < arguments.length; i++) {
        for (var prop in arguments[i]) {
            var val = arguments[i][prop];
            
            if (isArray(val)) {
                obj[prop] = val;
            } else {
                if (typeof val == "object") {
                    updateObject(obj[prop], val);
                } else {
                      obj[prop] = val;
                }
            }
        }
    }

    return obj;
};

module.exports = { updateObject, isArray };