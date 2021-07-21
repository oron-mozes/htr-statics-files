const express = require('express')
const router = express.Router()
const rooms = require('./rooms.json') ;

const reservation = new Map([]);

router.get('/', (req, res) => {
  res.json(rooms);
})
router.post('/reserve', (req, res) => {
  const {metaSiteId, orderId, visitorId} = req.body;
  const key = `${metaSiteId}-${visitorId}`;
  const orders = reservation.get(key) || [];
  orders.push[orderId]
  reservation.set(key, orders)
  res.json({memberId:visitorId, orders, success: true});
})


module.exports = router
