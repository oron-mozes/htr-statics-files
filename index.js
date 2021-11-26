const express = require('express')
const path = require('path')
const PORT = process.env.PORT || 5000
const  cors = require('cors');
const roomsApi = require('./roomsApi.js');
const installApi = require('./installApi.js');
const catalogSpi = require('./catalogSpi.js');
const webComponentsApiApi = require('./webComponentsApi.js');

express()
  .use(cors())
  .set('views', path.join(__dirname, 'views'))
  .set('view engine', 'ejs')
  .use('/js', webComponentsApiApi)
  .use(express.static(path.join(__dirname, 'public')))
  .use('/_api/install', installApi)
  .use('/catalog-spi', catalogSpi)
  .use('/_api/rooms', roomsApi)
  .get('/web-component', (req, res) => {
    res.render('index')
  })
  
  .listen(PORT, () => console.log(`Listening on ${ PORT }`))
