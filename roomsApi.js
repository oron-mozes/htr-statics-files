const express = require('express')
const router = express.Router()
const rooms = require('./rooms.json') ;

router.get('/', (req, res) => {
  res.json(rooms);
})


export default router;