const express = require('express')
const router = express.Router()
const dbConnection = require('./dbConfig.js');
const roomsCollection = 'rooms';
const ordersCollection = 'orders';

const reservation = new Map([]);

router.use(express.json())
router.use(express.urlencoded())
router.use(dbConnection)

router.post('/reserve', async (req, res) => {
  const {metaSiteId, orderId, visitorId} = req.body;
  const orderC = req.DBManager.db.collection(ordersCollection);
  await orderC.findOneAndUpdate({metaSiteId, visitorId, orderId, $inc:{quantity: 1}}, {quantity: {$exists : false}}, {$set: {quantity: 1}}, {upsert: true})
  
  res.json({success: true});
})
router.post('/my-orders', async (req, res) => {
  const {metaSiteId, visitorId} = req.body;
  const key = `${metaSiteId}-${visitorId}`;
  res.json({orders: []});
})
router.delete('/my-orders', async (req, res) => {
  const {metaSiteId, visitorId, orderId} = req.body;
  const roomsC = req.DBManager.db.collection(roomsCollection);
  const rooms = await roomsC.find({}).project({_id:0}).toArray();

  
  res.json({orders: []});
})

router.get('/', async (req, res) => {
  const roomsC = req.DBManager.db.collection(roomsCollection);
  const rooms = await roomsC.find({}).project({_id:0}).toArray();
  console.log('able to get rooms', rooms)
  res.json({rooms});
})
module.exports = router
