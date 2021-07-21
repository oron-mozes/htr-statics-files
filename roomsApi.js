const express = require('express')
const router = express.Router()
const rooms = require('./rooms.json') ;


const reservation = new Map([]);

router.use(express.json())
router.use(express.urlencoded())

router.post('/reserve', (req, res) => {
  const {metaSiteId, orderId, visitorId} = req.body;
  const key = `${metaSiteId}-${visitorId}`;
  const orders = reservation.get(key) || [];
  orders.push(orderId);
  reservation.set(key, orders);
  res.json({memberId:visitorId, orders, success: true});
})
router.get('/my-orders', (req, res) => {
  console.log('???????????????', req.body);
  const {metaSiteId, visitorId} = req.body;
  const key = `${metaSiteId}-${visitorId}`;
  const orders = reservation.get(key) || [];
  res.json({orders });
})

router.get('/', (req, res) => {
  res.json(rooms);
})
module.exports = router
