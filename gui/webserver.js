/**
 * @file Serves the Box Farm GUI webpage and
 * interacts with the BoxBrain system.
 * @projectname Box Farm GUI
 * @version 0.5.4
 * @author Control Subsystem
 * @copyright 2018-2019
 */

const SETTINGS_PATH = __dirname + '/';
const SETTINGS_FILE = 'settings.json';

const url  = require('url'),
      sys  = require('util'), // From "sys".
      fs = require( 'fs' ),
      express = require('express'),
      bodyParser = require( 'body-parser' ), // For JSON parsing.
      http=require('http'),
      path = require('path'),
      socketio = require( 'socket.io' );

const app = express();

const guiServer = http.createServer(app);
const pyServer = http.createServer();

// Set up socket.io server.
const pyIo = socketio( pyServer );

pyIo.on('connection', function(socket){
  console.log(Date.now() + ': Python client connected.');

  socket.on('Status', function(msg){
    console.log('Status: ' + msg);
  });

  socket.on('disconnect', function(){
    console.log(Date.now() + ': Python client disconnected.');
  });
});



/*
io.on('connection', function(socket){

});
*/

app.use(express.static(path.join(__dirname, 'js')));
app.use(express.static(path.join(__dirname, 'css')));
app.use(express.static(path.join(__dirname, 'assets')));
app.use(express.static(path.join(__dirname, 'public')));

app.set('views', __dirname + '/views');
app.set('view engine', 'html');

app.use( bodyParser.urlencoded( { extended: true } ) );

app.get('/', function(req, res){
    res.render('home');
});

// Send the settings data to the client.
app.post(
  '/load',
  ( req, res ) => {
    fs.readFile(
      SETTINGS_PATH + SETTINGS_FILE,
      ( err, data ) => {
        if( err ) {
          // Warning: Stops the server.
          throw err;
        }

        res.send( data );
      }
    );

    console.log( Date.now() + ': Settings were sent to the client ' + req.ip + '.' );
  }
);

// Receive the settings data from the client.
app.post(
  '/save',
  ( req, res ) => {
    console.log( Date.now() + ': Settings were received from the client ' + req.ip + '.' );

    // Write the JSON string that was sent over to the settings file.
    fs.writeFile(
      SETTINGS_PATH + SETTINGS_FILE,
      req.body.settingsJSON,
      err => {
        if( err ) {
          // Warning: Stops the server.
          throw err;
        }
      }
    );

    res.end( "Settings were received by BoxBrain." );
  }
);

// Send Bluelab data to the client.
app.post(
  '/load',
  ( req, res ) => {
    fs.readFile(
      '../statics/data.json',
      ( err, data ) => {
        if( err ) {
          // Warning: Stops the server.
          throw err;
        }

        res.send( data );
      }
    );

    console.log( Date.now() + ': Bluelab data was sent to client. ' + req.ip + '.' );
  }
);

guiServer.listen(
  4000,
  () => {
    console.log( Date.now() + ': Box Farm GUI server has started.' );
  }
);

pyServer.listen(
  4004,
  () => {
    console.log( Date.now() + ': Box Farm backend server has started.' );
  }
);
