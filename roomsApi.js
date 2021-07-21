const express = require('express')
const router = express.Router()
const rooms = require('./rooms.json') ;

const reservation = new Map([]);

router.get('/', (req, res) => {
  res.json(rooms);
})
router.post('/reserve', (req, res) => {
  // const {metaSiteId, orderId} = JSON.parse(req.body);
  console.log(':::req.body', req.body.metaSiteId)
  // const key = `${metaSiteId}-${1}`;
  // const orders = reservation.get(key) || [];
  // orders.push[orderId]
  // reservation.set(key, orders)
  // res.json({memberId:1, orders, success: true});
  res.json({})
})


module.exports = router
