const express = require("express");
const ape = require("@hutiwephy/ape");

module.exports = (function(){
    var tmp = express.Router();

    tmp.get("/ape.js", (req, res, next)=>{
        res.sendFile(ape.libpath);
    });
    
    tmp.get("/ape.min.js", (req, res, next)=>{
        res.sendFile(ape.libpath);
    });

    return tmp;
})();
