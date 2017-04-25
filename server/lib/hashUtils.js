const crypto = require('crypto');

/************************************************************/
// Add any hashing utility functions below
/************************************************************/

var sha512 = function(password, tempKey){
    var hash = crypto.createHmac('sha512', tempKey); /** Hashing algorithm sha512 */
    hash.update(password);

    var value = hash.digest('hex');
    return value;
    // return {
    //     tempKey:tempKey,
    //     passwordHash:value
    // };
};



module.exports.hashfunc = sha512;