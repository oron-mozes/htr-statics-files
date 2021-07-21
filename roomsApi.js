const express = require('express')
const router = express.Router()
const rooms = require('./rooms.json') ;

const reservation = new Map([]);

router.get('/', (req, res) => {
  res.json(rooms);
})
router.post('/reserve', (req, res) => {
  const {metasiteId, memberId, orderId} = req.body;
  const key = `${metasiteId}-${memberId}`;
  const orders = reservation.get(key) || [];
  orders.push[orderId]
  reservation.set(key, orders)
  res.json({memberId, orders, success: true});
})


module.exports = router
