/**
 * 
 * @param {Buffer} body 
 * @returns {object}
 */
module.exports = function(body){
    return (body.length == 0)? {} : JSON.parse(body.toString("utf8"));
}
