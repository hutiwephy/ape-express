const express = require("express");
const ape = require("@hutiwephy/ape");
const bodyreader = require("./bodyreader.js");

/**
 * @callback express.Middleware
 * 
 * @param {express.Request} req 
 * @param {express.Response} res 
 * @param {express.NextFunction} next 
 * @returns {void} 
 */

/**
 * @callback getSecretCallback
 * 
 * @param {Buffer} id
 * @returns {null|Buffer|Promise<null|Buffer>} 
 */

/**
 * 
 * @param {getSecretCallback} callback 
 * @returns {express.Middleware} 
 */
module.exports = function(callback){
    if(typeof callback != "function"){
        throw new TypeError("callback is not of type function!");
    }

    return async function(req, res, next){
        // Validate session
        /** @type {ape.Session} */
        var session = null;
        try{
            session = new ape.Session(req.headers.authorization);
        }catch(err){
            next(err);
            return;
        }

        try{
            if(!session.verify(await callback(session.clientId))){
                next(new ape.Session.FailedVerification());
                return;
            }
        }catch(err){
            next(new ape.Session.FailedVerification());
            return;
        }

        // Extend ExpressJS
        req.session = session;

        res.ape = {};

        /**
         * 
         * @param {string|Buffer|object} data 
         * @returns {express.Response} 
         */
        res.ape.send = function(data){
            if(Buffer.isBuffer(data) || typeof data == "string"){
                return res.send(res.req.session.encode(data))
            }else if(typeof data == "object"){
                return res.set("Content-Type", "application/json").send(res.req.session.encode(JSON.stringify(data)));
            }else{
                throw new TypeError("unsupported data type");
            }
        }

        /**
         * 
         * @param {object} data 
         * @returns {express.Response} 
         */
        res.ape.json = function(data){
            if(typeof data == "object"){
                res.ape.send(data).end();
            }else{
                throw new TypeError("unsupported data type");
            }
        }

        // Handle body data
        //   Receive the body
        var body = await bodyreader(req);

        //   Decode body
        body = session.parse(body.toString("utf8"));

        //   Parse body
        var type = req.get("Content-Type");
        try{
            req.body = await require(`./bodyparser/${type.toLowerCase().replace("/", "_")}.js`)(body);
        }catch(err){
            req.body = body;
        }

        // Call next middleware without errors
        next();
        return;
    }
};
