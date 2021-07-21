const express = require('express')
const router = express.Router()
const roomsData = require('./rooms.json') ;


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
router.post('/my-orders', (req, res) => {
  const {metaSiteId, visitorId} = req.body;
  const key = `${metaSiteId}-${visitorId}`;
  const orders = reservation.get(key) || [];
  res.json({orders: roomsData.rooms.filter(room => orders.includes(room.id)) });
})

router.get('/', (req, res) => {
  res.json(roomsData);
})
module.exports = router
