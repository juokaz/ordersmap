Real time orders map using WebGL and Socket.IO 

Forked from https://github.com/zsolt/globestats
 
### Usage ###

The globe uses the wonderful Socket.IO and Express libraries.

Make sure to modify MySQL configuration and DB query for your server!

```
cd server
npm install socket.io
npm install express
npm install mysql@2.0.0-alpha4
npm install geocoder
npm install hashmap
```

Then start the server with

```
node server/server.js
```

And finally point your browser to http://localhost:8000/ . The server
will start sending lat/lng data from the addresses' lookups using Google API.

<img src="http://zsolt.github.com/globestats.jpg" width="366" height="349" border="0"/>
