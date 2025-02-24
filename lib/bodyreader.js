
/**
 * 
 * @param {Express.Request} req 
 * @returns {Promise<Buffer, Error>}
 */
module.exports = function(req){
    return new Promise((resolve, reject)=>{
        body = [];
        req.on("data", (chunk)=>{
            body.push(chunk);
        });
        req.on("end", ()=>{
            resolve(Buffer.concat(body));
        });
        req.on("error", (err)=>{
            reject(err);
        });
    });
};
