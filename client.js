$(() => {
    let test = $('.test-btn');
    let button = $('.button');
    let ag = afterglow.getPlayer('myvideo');
    let hashid = 0;
    let socket = io();

    test.click(() => {
        ag.pause();
    });
    button.click(() => { //Set the current page as the leader
        hashid = 1;
        console.log(hashid);
    });

    afterglow.on('myvideo', 'ready', function(event) {
        ag.play();
        setTimeout(() => {
            ag.pause();
        }, 1000);
    });

    $('#myvideo').bind('timeupdate', function(){
        console.log('the time was updated to: ' + this.currentTime);
    });

    afterglow.on('myvideo', 'play', (event) => {
        if (hashid === 1) {
            socket.emit('play');
        }
    });

    afterglow.on('myvideo', 'paused', (event) => {
        if (hashid === 1) {
            socket.emit('pause')

        }
    });

    socket.on('play', () => {
        ag.play();
        console.log('RECEIVED play');
    });

    socket.on('pause', () => {
        ag.pause();
    });

    socket.on('hash', msg => {
        hashid = msg; //Each unique hash assigned on connection to the socket.io and server
        console.log(hashid); //The first person signed in is the leader
    });

});