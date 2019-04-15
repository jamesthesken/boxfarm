var url  = require('url'),
    sys  = require('sys'),
    express = require('express'),
    http=require('http');
    var path = require('path')

var app = express();
var server = http.createServer(app);

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'assets')));
app.set('views', __dirname + '/views');
app.set('view engine', 'html');

app.get('/', function(req, res){
    res.render('home');
});

app.listen(4000);
sys.puts('server running ' + 'now ' + Date.now());

