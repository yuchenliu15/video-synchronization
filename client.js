//Need to check if leader is playing, if so, play()
$(() => {
    const player = videojs('my-video');
    let exitallbutton = $('.exit-btn');
    let button = $('.button');
    let hashid = 0;
    let socket = io();



    exitallbutton.click(() => {
        if (hashid === 1)
            socket.emit('exit');
    });

    socket.on('test', () => {
        player.exitFullscreen();
    });

    player.on('ready', () => {
        player.controls(true);
    });

    button.click(() => { //Set the current page as the leader
        hashid = 1;
        console.log(hashid);
    });

    //For Youtube specifically, preload the video so play immediately after click
    player.on('timeupdate', function (event) {
        if (hashid === 1) {
            let time = player.currentTime();
            socket.emit('time', time);
        }
    });

    player.on('fullscreenchange', function (event) {
        const isFullscreen = player.isFullscreen();
        if (hashid === 1 && isFullscreen === false) {
            socket.emit('exit');
        }
    });

    player.on('ended', () => {
        //if (player.isFullscreen()) //sometimes doesn't work for local videos when if statement added
        player.exitFullscreen();
    });

    player.on('playing', function (event) {
        if (hashid === 1) {
            socket.emit('play');
        }
    });

    player.on('pause', (event) => {
        if (hashid === 1) {
            socket.emit('pause')
        }
    });

    socket.on('play', () => {
        player.play();
    });

    socket.on('pause', () => {
        player.pause();
    });

    socket.on('time', (time) => {
        console.log('received' + time)
        const timeDiff = Math.abs(player.currentTime() - time);
        console.log(timeDiff);
        if (timeDiff > 1) {
            player.currentTime(time);
        }
    });

    socket.on('hash', msg => {
        hashid = msg; //Each unique hash assigned on connection to the socket.io and server
        console.log(hashid); //The first person signed in is the leader
    });

    socket.on('exit', () => {
        player.exitFullscreen();
    });

});