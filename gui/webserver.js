/**
 * @file Serves the Box Farm GUI webpage and
 * interacts with the BoxBrain system.
 * @projectname Box Farm GUI
 * @version 0.5.7
 * @author Control Subsystem
 * @copyright 2018-2019
 */

// Box Farm settings.
const SETTINGS_PATH = __dirname + '/';
const SETTINGS_FILE = 'settings.json';

// Garden data.
const DATA_PATH = __dirname + '/public/'; // Change to non-public directory.
const DATA_FILE = 'data.json';

// Plant imaging files location.
const PLANT_IMG_DIR = __dirname + '/public/plant_imaging';
const PLANT_IMG_URL = './plant_imaging/'; // Not a local directory.

const url  = require('url'),
      sys  = require('util'), // From "sys".
      fs = require( 'fs' ),
      express = require('express'),
      bodyParser = require( 'body-parser' ), // For JSON parsing.
      http=require('http'),
      path = require('path'),
      socketio = require( 'socket.io' );

const app = express();

// For GUI.
const guiServer = http.createServer(app);

// For backend Python scripts.
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

// Look for the template files here.
app.set('views', __dirname + '/views');

// Render template file as EJS.
app.set('view engine', 'ejs');

// Make selected files accessible remotely.
app.use(express.static(path.join(__dirname, 'js')));
app.use(express.static(path.join(__dirname, 'css')));
app.use(express.static(path.join(__dirname, 'assets')));
app.use(express.static(path.join(__dirname, 'public')));

app.use( bodyParser.urlencoded( { extended: true } ) );

// ?
app.get('/', function(req, res){
    res.render('home');
});

// Load plant imaging thumbnails and links.
app.get(
  '/imaging.html', 
  ( req, res ) => {
    // List the files in plant imaging directory.
    fs.readdir(
      PLANT_IMG_DIR,
      ( err, filePaths ) => {
        if( err ) {
          res.status( 404 ).send( 'Error: Directory not found.' );
          
          // End it here.
          throw err;
        }
        
        // filePaths are in alphanumeric order. Therefore,
        // the order is preserved when sorted by RGB and NIR images.
        // Filenames has to be in the format ID_NUMBER.EXT.
        
        // Change according to file name criteria.
        const RGB = 'rgb';
        const NIR = 'nir';
        
        const imgPaths = {
          num: [],
          rgb: [],
          nir: []
        };
        
        // Arrange image types by file name.
        filePaths.forEach(
          path => {
            // Take the filename.
            const name = path.split( '.' )[ 0 ];
            
            // Split by ID and NUMBER.
            const splitName = name.split( '_' );
            
            const id = splitName[ 0 ];
            const num = splitName[ 1 ];
            
            switch( id ) {
              case RGB:
                imgPaths.rgb.push( PLANT_IMG_URL + path );
                imgPaths.num.push( num ); // Only appended once per num and images are expected to come in pairs.
                break;
              case NIR:
                imgPaths.nir.push( PLANT_IMG_URL + path );
                break;
              default:
                // Exclude the file with an invalid ID.
            }
          }
        );
        
        // Create the HTML page with the thumbnails.
        // imgPaths looks like { num: [], rgb: [], nir: [] }.
        res.render(
          'templates/imaging', 
          {
            filesLs: imgPaths
          } 
        );
      }
    );
    
    console.log( Date.now() + ': Navigated to imaging.html by the client ' + req.ip + '.' );
  }
);

// Send the settings data to the client.
app.post(
  '/load',
  ( req, res ) => {
    fs.readFile(
      SETTINGS_PATH + SETTINGS_FILE,
      ( err, data ) => {
        if( err ) {
          res.status( 500 );
          
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
          res.status( 500 );
          
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
  '/analytics',
  ( req, res ) => {
    fs.readFile(
      DATA_PATH + DATA_FILE,
      ( err, data ) => {
        if( err ) {
          res.status( 500 );
          
          // Warning: Stops the server.
          throw err;
        }

        res.send( data );
      }
    );

    console.log( Date.now() + ': Bluelab data was sent to client ' + req.ip + '.' );
  }
);

// Communicates to remote clients and serves the webpages.
guiServer.listen(
  4000,
  () => {
    console.log( Date.now() + ': Box Farm GUI server has started.' );
  }
);

// Communicates to the local backend Python scripts.
pyServer.listen(
  4004,
  () => {
    console.log( Date.now() + ': Box Farm backend server has started.' );
  }
);
