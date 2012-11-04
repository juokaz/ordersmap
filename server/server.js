var express = require('express')
  , http = require('http');
var app = express();
var server = http.createServer(app);
var io = require('socket.io').listen(server);

app.configure(function(){
    app.use(express.methodOverride());
    app.use(express.bodyParser());
    app.use(app.router);
});

app.configure('development', function(){
    app.use(express.static(__dirname + '/public'));
    app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

app.configure('production', function(){
  var oneYear = 31557600000;
  app.use(express.static(__dirname + '/public', { maxAge: oneYear }));
  app.use(express.errorHandler());
});

server.listen(8000);

var mysql      = require('mysql');
var connection = mysql.createConnection({
  host     : '#',
  user     : '#',
  password : '#',
  database : '#',
});

connection.connect();

var geocoder = require('geocoder'),
  HashMap = require('hashmap').HashMap;

var locations = new HashMap();

io.sockets.on('connection', function (socket) {
  setInterval(function() {
    connection.query('SELECT address, total FROM orders WHERE date > UNIX_TIMESTAMP(SUBTIME(NOW(), "0:5:0")) AND date < UNIX_TIMESTAMP(SUBTIME(NOW(), "0:0:0")) ORDER BY date desc', function(err, rows, fields) {
      if (err) throw err;

      rows.forEach(function (item) {
        if (locations.get(item.address) === false) {
          console.log("previously failed lookup");
        } else if (locations.get(item.address)) {
          console.log("previous lookup");
          socket.emit('latlng', {
              lat: locations.get(item.address).lat,
              lng: locations.get(item.address).lng,
              size: 100
            });
        } else {
          geocoder.geocode(item.address + " USA", function ( err, data ) {
            console.log("Address lookup");
            if (!data.results) {
                console.log("No address");
                locations.set(item.address, false);
            } else {
              data.results.forEach(function (gem) {
                locations.set(item.address, gem.geometry.location);
                socket.emit('latlng', {
                  lat: gem.geometry.location.lat,
                  lng: gem.geometry.location.lng,
                  size: 100
                });
              });
            }
          });
        }
      });
    });
  }, 10000);
});

