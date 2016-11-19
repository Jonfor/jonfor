/**
 * Created by jonfor on 12/2/15.
 * Testing shit out~
 */
var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var favicon = require('serve-favicon');
var logger = require('morgan');
var helmet = require('helmet');

app.use(logger('dev'));
app.use(helmet());
app.use(favicon(__dirname + '/public/img/favicon.ico'));
app.use('/public', express.static(__dirname + '/public'));

var server = http.listen(3000, function () {
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

app.get('/dank', function (req, res, next) {
    var io = require('socket.io')(http);

    var names = ['Kaka Karrotcake', 'Vergina', 'xXSupersandlegend69', 'Dani California', '420nosc0pe', 'Gilgamesh',
            'King David', 'Slim Shady', 'Jonfurry', 'Kristian Stewart', 'Googo', 'Freezy Pop', 'Lvl 70 ret pally lfg VC',
            'Danku Soulu', 'Soju is watered down Vodka', 'Bob Rober', 'Bob Ross', 'Master Cheef', 'Final Fantasy Money',
            'Michelle Cumella Obama', 'Lightning', 'Stan, your biggest fan', 'Edward Snowden is a hero',
            'Edward Snowden is a zero', 'Tay Zonday\'s Chocolate Rain', 'EXODIAAAAAAAAAAAA', 'Nico, your cousin', 'Dan Coach',
            'Dan Cooch', 'Dan Crotch', 'Crotchy', 'Koch Koch', 'Gilagan', 'MR. HAAAAAAAAAAAAAN', 'Android 69', 'Kappa Kappa Kappa'],
        userList = [];

    io.on('connection', function (socket) {
        socket.username = getRandomName(userList);
        socket.on('body ready', function () {
            bodyIsReady(socket.username);
            io.emit('body ready', {userList: userList, username: socket.username});
        });

        socket.on('disconnect', function () {
            deleteUser(socket.username);
            io.emit('body dies', socket.username.replace(/\s+/g, ''));

        });

        io.emit('body lives', userList);
    });

    function getRandomName() {
        // We store the username in the socket session for this client
        var name = names[Math.floor(Math.random() * names.length)];

        // Check if the name is taken already. Reroll if it is taken.
        while (userList.indexOf(name) > -1) {
            name = names[Math.floor(Math.random() * names.length)];
        }
        // Add the name to the used names list.
        userList.push(
            {
                name: name,
                isBodyReady: false
            }
        );

        return name;
    }

    function bodyIsReady(username) {
        for (var i = 0; i < userList.length; i++) {
            if (userList[i].name === username) {
                userList[i].isBodyReady = true;
                break;
            }
        }
    }

    function deleteUser(username) {
        for (var i = 0; i < userList.length; i++) {
            if (userList[i].name === username) {
                userList.splice(i, 1);
                break;
            }
        }
    }

    res.sendFile(__dirname + '/darkSouls.html');
});
