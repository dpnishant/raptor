#!/usr/bin/env node
var static = require("node-static");
var file = new static.Server('.', {
  headers: {
    "Content-Security-Policy": "default-src 'self'; object-src 'none'; img-src 'self' data:; script-src 'self' 'unsafe-eval'",
  }
});

const PORT = process.env.PORT || 4000;
require ('http').createServer(function (req, res) {
  req.addListener('end', function () {
    file.serve(req, res);
  }).resume();
}).listen(PORT);

console.log("> node-static is listening on http://127.0.0.1:"+PORT);
