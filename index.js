const express = require('express')
const path = require('path')
const PORT = process.env.PORT || 5000
const  cors = require('cors');
const roomsApi = require('./roomsApi.js');

express()
  .use(cors())
  .use(express.static(path.join(__dirname, 'public')))
  .use('/_api/rooms', roomsApi)
  .listen(PORT, () => console.log(`Listening on ${ PORT }`))
