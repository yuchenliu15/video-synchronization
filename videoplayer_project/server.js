/* 
*iPhones cannot be on low-power mode for every funcitonalities to work
*/

const express = require('express');
const path = require('path');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (request, response) => {
    response.sendFile(__dirname + '/index.html');
});

let connection_count = 0;

io.on("connection", (socket) => {
    //hashing method: connection_count increase by 1 when ever a new user connects
    //the number is then sent through socket to identify this user, number is assigned to variable hashid
    //first one to connect is the leader, or can be set to leader using SET LEADER button
    connection_count += 1;
    socket.emit('hash', connection_count);
    socket.on('play', () => {
        socket.broadcast.emit('play');
    });

    socket.on('pause', () => {
        socket.broadcast.emit('pause');
    });

    socket.on('time', (msg) => {
        socket.broadcast.emit('time', msg);
    });

    socket.on('exit', () => {
        socket.broadcast.emit('exit');
    });

});

http.listen(3000, () => {
    console.log('listening on 3000');
});