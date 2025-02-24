# Authenticated Payload Exchange
Authenticate and Encrypt HTTP with User Credentials (Not TLS-SRP) (ExpressJS Implementation).

## Content
  - [Usage](#usage)
  - [Documentation](#documentation)
    - [ape()](#middleware) *
    - [ape](https://github.com/hutiwephy/ape#ape-core)
      - [libroute](#ape_libroute) *
      - [request()](https://github.com/hutiwephy/ape#ape_request)
      - [response](https://github.com/hutiwephy/ape#ape_response)
      - [libpath](https://github.com/hutiwephy/ape#ape_libpath)
      - [Session()](https://github.com/hutiwephy/ape#ape_session)
        - [jwt](https://github.com/hutiwephy/ape#ape_session_jwt)
        - [clientId](https://github.com/hutiwephy/ape#ape_session_clientid)
        - [token](https://github.com/hutiwephy/ape#ape_session_token)
        - [verify()](https://github.com/hutiwephy/ape#ape_session_verify)
        - [encode()](https://github.com/hutiwephy/ape#ape_session_encode)
        - [decode()](https://github.com/hutiwephy/ape#ape_session_decode)
        - [parse()](https://github.com/hutiwephy/ape#ape_session_parse)
    - [Express](#express)
      - [Request.session](#express_request_session) *
      - [Response.ape.send()](#express_response_ape_send) *
      - [Response.ape.json()](#express_response_ape_json) *

\* only the contents belong to this repo, all other content is related to the APE library

## Usage
```js
const express = require("express");
const ape = require("@hutiwephy/ape-express");


var app = express();
var api = express.Router();


api.use(ape((id)=>{
    return // Client secret
}));
api.use((err, req, res, next)=>{
    if(err){
        next(401);
    }
});

api.post("/", (req, res, next)=>{
    res.ape.json({
        error: false,
        code: 200,
        request_body: req.body,
    });
    next();
});

api.use((err, req, res, next)=>{
    // Handle errors
});

app.use("/api", api);
app.use(ape.libroute);
app.get("/", (req, res, next)=>{
    res.sendFile(__dirname+"/index.html");
});

app.listen(3000);
```

## Documentation
### <span id="middleware"></span> ape(callback)
Takes a client id to secret solver and automatically handles the entire ape authentication and body decryption.

> Note: Asyncronous callback is supported.

**Parameters**:
  - **`callback`**: `function` <br>
    Takes a client id `Buffer` and returns `null` or the corresponding secret in `Buffer` format.


**Returns**:
  - `Express.Middleware` <br>
    Middleware.



### <span id="ape_libroute"></span> ape.libroute
A Router to handle calls for the `ape.min.js` and `ape.js` library on the client side.

**Returns**:
  - `Express.Router` <br>
    Router constant.



## Express
### <span id="express_request_session"></span> Express.Request.session
If Authentication succeded this constant will be set with the current session.

**Returns**:
  - [`ape.Session`](https://github.com/hutiwephy/ape#ape_session) <br>
    Current Session.



### <span id="express_response_ape_send"></span> Response.ape.send(data)
Send Encrypted body chunks.

**Parameters**:
  - **`data`**: `string`, `object` <br>
    Data to send.
    If `object` then it will automatically set `Content-Type` to `application/json`.


**Returns**:
  - `Express.Response` <br>
    Returns response instance to allow daisy chaining.



### <span id="express_response_ape_json"></span> Response.ape.json(data)
Send Encrypted object as body chunks.

**Parameters**:
  - **`data`**: `object` <br>
    `object` to send. It will automatically set `Content-Type` to `application/json`.


**Returns**:
  - `void` <br>
    


