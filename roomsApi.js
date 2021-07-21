const express = require('express')
const router = express.Router()
const rooms = require('./rooms.json') ;

const reservation = new Map([]);
// const bodyParser = require('body-parser')
// router
// .use(bodyParser.urlencoded({ extended: true}))
// .use(bodyParser.json());

router.get('/', (req, res) => {
  res.json(rooms);
})
router.post('/reserve', (req, res) => {
  const {metaSiteId, orderId, visitorId} = req.body;
  const key = `${metaSiteId}-${visitorId}`;
  const orders = reservation.get(key) || [];
  console.log('orderId::', metaSiteId, orderId, visitorId, req.body);
  orders.push(orderId);
  reservation.set(key, orders);
  res.json({memberId:visitorId, orders, success: true});
})
router.get('/my-orders', (req, res) => {
  const {metaSiteId, visitorId} = req.body;
  const key = `${metaSiteId}-${visitorId}`;
  const orders = reservation.get(key) || [];
  orders.push[orderId]
  reservation.set(key, orders)
  res.json({orders });
})


module.exports = router
