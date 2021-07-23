const express = require('express')
const path = require('path')
const PORT = process.env.PORT || 5000
const  cors = require('cors');
const roomsApi = require('./roomsApi.js');
const installApi = require('./installApi.js');
const webComponentsApiApi = require('./webComponentsApi.js');

express()
  .use(cors())
  .use(function (req, res, next) {
      res.header("Access-Control-Allow-Origin", "*");
      res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
      next();
  })
  .use('/js', webComponentsApiApi)
  .use(express.static(path.join(__dirname, 'public')))
  .use('/_api/install', installApi)
  .use('/_api/rooms', roomsApi)
  
  .listen(PORT, () => console.log(`Listening on ${ PORT }`))
