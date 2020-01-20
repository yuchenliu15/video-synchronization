$(() => {
    let test = $('.test-btn');
    let button = $('.button');
    let ag = afterglow.getPlayer('myvideo');
    let hashid = 0;
    let socket = io();
    const video = document.getElementById('myvideo');

    test.click(() => {

        ag.currentTime(20);
        console.log(ag)
    });
    button.click(() => { //Set the current page as the leader
        hashid = 1;
        console.log(hashid);
    });

    afterglow.on('myvideo', 'ready', function (event) {
        ag.play();
        setTimeout(() => {
            ag.pause();
        }, 1000);

    });

    video.addEventListener('timeupdate', function () {
        const time = ag.currentTime();
        if (hashid === 1)
            socket.emit('time', time);
    });


    let isTimeUpdateActivated = 0;
    afterglow.on('myvideo', 'play', (event) => {
        if (isTimeUpdateActivated === 0) {
            video.currentTime = ag.currentTime();
            isTimeUpdateActivated = 1;
        }
        if (hashid === 1) {
            socket.emit('play');
        }
    });

    afterglow.on('myvideo', 'paused', (event) => {
        if (hashid === 1) {
            socket.emit('pause')
        }
    });

    afterglow.on('myvideo', 'fullscreen-entered', (event) => {
        if (hashid === 1) {
            socket.emit('enter')
        }
    });

    afterglow.on('myvideo', 'fullscreen-left', (event) => {
        if (hashid === 1) {
            socket.emit('left')
        }
    });

    socket.on('play', () => {
        ag.play();
        console.log('RECEIVED play');
    });

    socket.on('pause', () => {
        ag.pause();
    });

    socket.on('enter', () => {
        ag.requestFullscreen();
    });

    socket.on('pause', () => {
        ag.exitFullscreen();
    });

    socket.on('time', (time) => {
        console.log('received' + time)
        const timeDiff = Math.abs(ag.currentTime() - time);
        console.log(timeDiff);
        if(timeDiff > 1){
            video.currentTime = time;
        }
    });

    socket.on('hash', msg => {
        hashid = msg; //Each unique hash assigned on connection to the socket.io and server
        console.log(hashid); //The first person signed in is the leader
    });

});