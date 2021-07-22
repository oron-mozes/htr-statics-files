const express = require('express')
const router = express.Router()
const roomsData = require('./rooms.json') ;
const dbConnection = require('./dbConfig.js');


const reservation = new Map([]);

router.use(express.json())
router.use(express.urlencoded())
router.use(dbConnection)

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
router.delete('/my-orders', (req, res) => {
  const {metaSiteId, visitorId, orderId} = req.body;
  const key = `${metaSiteId}-${visitorId}`;
  const orders = reservation.get(key).filter(id => id !== orderId) || [];
  reservation.set(key, orders);
  res.json({orders: roomsData.rooms.filter(room => orders.includes(room.id)) });
})

router.get('/', (req, res) => {
  const collection = req.DBManager.db.collection('rooms');
  const rooms = await collection.findAll({});
  console.log('able to get rooms', rooms)
  res.json(roomsData);
})
module.exports = router
