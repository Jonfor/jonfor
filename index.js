/**
 * Created by jonfor on 12/2/15.
 */
var express = require('express');
var app = express();
var favicon = require('serve-favicon');
var logger = require('morgan');

var server = app.listen(3000, function () {
    var host = server.address().address;
    var port = server.address().port;
    console.log('Listening at http://%s:%s', host, port);
});

app.use(logger('dev'));
app.use(favicon(__dirname + '/public/img/favicon.ico'));
app.use('/public', express.static(__dirname + '/public'));

app.get('/', function (req, res, next) {
    res.sendFile(__dirname + '/index.html');
});

app.get('/resume', function (req, res, next) {
    res.sendFile(__dirname + '/JonathanF_2015ResumeOnline.pdf');
});

//app.get('/dank', function (req, res, next) {
//    var http = require('http').Server(app);
//    var io = require('socket.io')(http);
//});