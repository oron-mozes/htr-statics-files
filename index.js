const express = require('express')
const path = require('path')
const PORT = process.env.PORT || 5000
const  cors = require('cors');
const roomsApi = require('./roomsApi.js');
const installApi = require('./installApi.js');
const webComponentsApiApi = require('./webComponentsApi.js');

express()
  .use(cors({credentials: true,  origin: '*'}))
  ,use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');

    next();
  })
  .use('/js', webComponentsApiApi)
  .use(express.static(path.join(__dirname, 'public')))
  .use('/_api/install', installApi)
  .use('/_api/rooms', roomsApi)
  
  .listen(PORT, () => console.log(`Listening on ${ PORT }`))
