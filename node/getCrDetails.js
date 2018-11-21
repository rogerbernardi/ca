var http = require('http');
var https = require('https');
var dt = require('./getSidRest');

http.createServer(function (req, res) {
        res.writeHead(200, {
                'Content-Type': 'text/html'
        });
        res.write(dt.getSid());
        res.end();
}).listen(8080);


