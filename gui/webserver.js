/**
 * @file Serves the Box Farm GUI webpage and
 * interacts with the BoxBrain system.
 * @projectname Box Farm GUI
 * @version 0.5.4
 * @author Control Subsystem
 * @copyright 2018-2019
 */

const url  = require('url'),
      sys  = require('util'), // From "sys".
      fs = require( 'fs' ),
      express = require('express'),
      bodyParser = require( 'body-parser' ), // For JSON parsing.
      http=require('http'),
      path = require('path');

const app = express();
const server = http.createServer(app);



app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'assets')));
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
      'settings.json',
      ( err, data ) => {
        if( err ) {
          // Warning: Stops the server.
          throw err;
        }

        res.send( data );
      }
    );
  }
);

// Receive the settings data from the client.
app.post(
  '/save',
  ( req, res ) => {
    console.log( 'Settings were received at ' + Date.now() + '.' );

    // Write the JSON string that was sent over to the settings file.
    fs.writeFile(
      'settings.json',
      req.body.settingsJSON,
      err => {
        if( err ) {
          // Warning: Stops the server.
          throw err;
        }
      }
    );

    res.end( "Settings were received." );
  }
);

app.listen(
  4000,
  () => {
    console.log( 'Box Farm GUI server is running now at ' + Date.now() + '.' );
  }
);
