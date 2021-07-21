const express = require('express')
const router = express.Router()
const rooms = require('./rooms.json') ;

const reservation = new Map([]);

router.get('/', (req, res) => {
  res.json(rooms);
})
router.post('/reserve', (req, res) => {
  const {metasiteId, orderId} = req.body;
  
  const key = `${metasiteId}-${1}`;
  const orders = reservation.get(key) || [];
  orders.push[orderId]
  reservation.set(key, orders)
  res.json({memberId:1, orders, success: true});
})


module.exports = router
