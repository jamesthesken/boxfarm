var url  = require('url'),
    express = require('express'),
    http=require('http');
    var path = require('path')


var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'assets')));
app.set('views', __dirname + '/views');
app.set('view engine', 'html');

app.get('/', function(req, res){
    res.render('home');
});


console.log('server running ' + 'now ' + Date.now());

io.on('connection', function(socket){
  console.log('Python client connected');
});

io.on('connection', function(socket){
  socket.on('Status', function(msg){
    console.log('Status: ' + msg);
  });
});

http.listen(4000, function(){
  console.log('listening on Port 4000');
});
