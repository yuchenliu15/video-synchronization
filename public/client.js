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

/*     player.on('ready', () => {
        player.controls(true);
    }); */

    button.click(() => { //Set the current page as the leader
        hashid = 1;
        console.log(hashid);
    });

    socket.on('hash', msg => {
        hashid = msg; //Each unique hash assigned on connection to the socket.io and server
        console.log(hashid); //The first person signed in is the leader
    });



    //automatically exit fullscreen when video ends
    player.on('ended', () => {
        //if (player.isFullscreen()) //sometimes doesn't work for local videos when if statement added
        player.exitFullscreen();
    });

    //sync play
    player.on('playing', function (event) {
        if (hashid === 1) {
            socket.emit('play');
        }
    });
    
    socket.on('play', () => {
        player.play();
    });

    //sync pause
    player.on('pause', (event) => {
        if (hashid === 1) {
            socket.emit('pause')
        }
    });

    socket.on('pause', () => {
        player.pause();
    });

    //as long as time difference is within 1 second, the video keeps on playing
    //when time change exceeds 1 second (click, drag, or even lagging), then time will sync
    player.on('timeupdate', function (event) {
        if (hashid === 1) {
            let time = player.currentTime();
            socket.emit('time', time);
        }
    });

    socket.on('time', (time) => {
        const timeDiff = Math.abs(player.currentTime() - time); //time difference
        if (timeDiff > 1) {
            player.currentTime(time);
        }
    });

    //sync exit fullscreen
    player.on('fullscreenchange', function (event) {
        const isFullscreen = player.isFullscreen();
        if (hashid === 1 && isFullscreen === false) {
            socket.emit('exit');
        }
    });

    socket.on('exit', () => {
        player.exitFullscreen();
    });

});