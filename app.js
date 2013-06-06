/**
* file: app.js
*/
var express = require('express')
  , app     = express()
  , server  = require('http').createServer(app)
  , path    = require('path')
  , io      = require('socket.io').listen(server)
  , spawn   = require('child_process').spawn
  , omx     = require('omxcontrol');

app.configure(function() {
    app.set('port', 1234)
    app.use(express.favicon());
    app.use(express.logger('dev'));
    app.use(express.bodyParser());
    app.use(express.methodOverride());
    app.set('view engine', 'jade');
    app.set('views', path.join(__dirname, 'public'));
    app.use(express.static(__dirname + '/public'));
    app.use(omx());
    app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

// ROUTES
app.get('/', function (req, res) {
    var localAddress = process.env.SERVER_ADDRESS || '127.0.0.1:';
    res.render('index', { url: localAddress, port: app.get('port')});
});

app.get('/remote', function (req, res) {
    res.render('remote');
});

app.get('/play/:video_id', function (req, res) {
    res.render('404');
});


// SOCKET.IO CONFIG
io.set('log level', 1);

server.listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});

var ss; //There has to be a better way to do this

//Run and pipe shell script output
function shellCmd(cmd, args, cb, end) {
    var spawn = require('child_process').spawn
      , child = spawn(cmd, args);
    child.stdout.on('data', function (buffer) { cb(this, buffer) });
    child.stdout.on('end', end);
}

//Socket.io Server
io.sockets.on('connection', function (socket) {

 socket.on("screen", function(data){
   socket.type = "screen";
   ss = socket;
   console.log("Screen ready...");
 });

 socket.on("remote", function(data){
   socket.type = "remote";
   console.log("Remote ready...");
 });

 socket.on("controll", function(data){
    console.log(data);
   if(socket.type === "remote"){
     if(data.action === "tap"){
         if(ss != undefined){
            ss.emit("controlling", {action:"enter"});
            }
     }
     else if(data.action === "swipeLeft"){
      if(ss != undefined){
          ss.emit("controlling", {action:"goLeft"});
          }
     }
     else if(data.action === "swipeRight"){
       if(ss != undefined){
           ss.emit("controlling", {action:"goRight"});
           }
     }
   }
 });

 socket.on("video", function(data){

    if( data.action === "play"){
    var id = data.video_id,
         url = "http://www.youtube.com/watch?v="+id;

    var runShell = new shellCmd('youtube-dl',['-o','%(id)s.%(ext)s','-f','/18/22',url],
        function (me, buffer) {
            me.stdout += buffer.toString();
            socket.emit("loading",{output: me.stdout});
            console.log(me.stdout)
         },
        function () {
            //child = spawn('omxplayer',[id+'.mp4']);
            omx.start(id+'.mp4');
        });
    }

 });
});
