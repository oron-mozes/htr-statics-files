const express = require('express')
const path = require('path')
const PORT = process.env.PORT || 5000
const  cors = require('cors');
const roomsApi = require('./roomsApi.js');
const bodyParser = require('body-parser')

express()
  .use(cors())
  .use(bodyParser.urlencoded())
  .use(bodyParser.json())
  .use(express.static(path.join(__dirname, 'public')))
  .use('/_api/rooms', roomsApi)
  .listen(PORT, () => console.log(`Listening on ${ PORT }`))
