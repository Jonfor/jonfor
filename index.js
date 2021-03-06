const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const favicon = require('serve-favicon');
const logger = require('morgan');
const helmet = require('helmet');
const multer = require('multer');
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/sounds/')
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname.replace(/ /g, "_"))
    }
});
const limits = {
    fields: 100,
    fileSize: '209715200', // 200MB is more than enough
    files: 100,
    parts: 200
};
const upload = multer({storage: storage, limits: limits});
const bodyParser = require('body-parser');
app.use(logger('dev'));
app.use(helmet());
app.use(favicon(__dirname + '/public/img/favicon.ico'));
app.use('/public', express.static(__dirname + '/public'));
app.use(bodyParser.json({extended: true}));
var db = require('./backend/queries');

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function (err, req, res, next) {
        res.status(err.code || 500)
            .json({
                success: false,
                message: err
            });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function (err, req, res, next) {
    res.status(err.status || 500)
        .json({
            success: false,
            message: err.message
        });
});

const server = http.listen(3000, function () {
    var host = server.address().address;
    var port = server.address().port;
    console.log('Listening at http://%s:%s', host, port);
});

app.get('/', function (req, res, next) {
    res.sendFile(__dirname + '/index.html');
});

app.get('/resume', function (req, res, next) {
    res.sendFile(__dirname + '/JonathanF_2015ResumeOnline.pdf');
});

app.get('/api/sounds', db.getAllSounds);
app.get('/api/sounds/:id', db.getSingleSound);
app.post('/api/sounds', upload.single('sound'), db.createSound);
app.put('/api/sounds/:id', db.updateSound);
app.delete('/api/sounds/:id', db.removeSound);
