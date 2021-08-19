const express = require('express')
const router = express.Router()
const dbConnection = require('./dbConfig.js');
const roomsCollection = 'rooms';
const ordersCollection = 'orders';
const installCollection = 'installs';
const appId = '7cbc47b3-cfc6-4d20-a13d-40cd1521378b';
const refreshAccessUrl = 'https://www.wix.com/oauth/access';
const appSecret = 'f3d6e2dd-3d64-4878-b523-624bd20772c1';
const axios = require('axios');

router.use(express.json())
router.use(express.urlencoded({ extended: true }))
router.use(dbConnection)

router.post('/reserve', async (req, res) => {
  const {metaSiteId, orderId, visitorId} = req.body;
  const orderC = req.DBManager.db.collection(ordersCollection);
  await orderC.update({metaSiteId, visitorId, orderId}, { $inc:{quantity: 1}}, {upsert: true})
  res.json({success: true});
})
router.post('/my-orders', async (req, res) => {
  const {metaSiteId, visitorId} = req.body;
  const orderC = req.DBManager.db.collection(ordersCollection);
  const orders = await orderC.find({metaSiteId, visitorId}).toArray();
  const roomsC = req.DBManager.db.collection(roomsCollection);
  for (const order of orders) {
    order.roomDetails = await roomsC.findOne({roomId: order.orderId});
  }
  res.json({orders});
})
router.delete('/my-orders', async (req, res) => {
  const {metaSiteId, visitorId, orderId} = req.body;
  const orderC = req.DBManager.db.collection(ordersCollection);
  await orderC.update({metaSiteId, visitorId, orderId}, { $inc:{quantity: -1}})
  const order = await orderC.findOne({metaSiteId, visitorId, orderId})

  if(order.quantity <= 0) {
    await orderC.remove({metaSiteId, visitorId, orderId})
  }

  res.json({success: true});
})

router.post('/checkout-url', async (req, res) => {
  const {instanceId, visitorId, metaSiteId} = req.body;
  const {authorization,} = req.headers;
  const orderC = req.DBManager.db.collection(ordersCollection);
  const orders = await orderC.find({metaSiteId, visitorId}).toArray();
 
  const roomsC = req.DBManager.db.collection(roomsCollection);
  for (const order of orders) {
    order.roomDetails = await roomsC.findOne({roomId: order.orderId});
  }
 
  const instalactionC = req.DBManager.db.collection(installCollection);
  const installation = await instalactionC.find({instanceId}).toArray();
  console.log('installation:::', instanceId)
  const refreshResponse = await axios.post(refreshAccessUrl, {    
    "grant_type": "refresh_token",
    "client_id": appId,
    "client_secret": appSecret,
    "refresh_token": installation[0].refresh_token

  })

  const {access_token} = refreshResponse.data;
  console.log({token: access_token})
  await instalactionC.updateOne({instanceId}, {$set: {access_token}});
  
  console.log(5)
  const lineItems = orders.map(order => (
    {
      "id": order.orderId, 
      "quantity": order.quantity, 
      "description" : order.roomDetails.description, 
      "catalogReference":
      {
        appId, 
        "catalogItemId": order.orderId
      },

  }));
  // https://wix.slack.com/archives/CRHHL21DG/p1626335562120700
  axios.post('https://www.wixapis.com/ecom/v1/checkouts', {
    checkoutInfo:{
      customFields:[{value: visitorId, title: 'visitorId'}]
    },
    lineItems,
    "channelType": "WEB"
  }, {
    headers:{
        Authorization: authorization
    }
  }).then(response => {
    console.log('response::', response);
    res.send({});
  }).catch(e => {
    console.log(e);
    res.send({});
  })


});
router.get('/test-instance', () => {
  const instalactionC = req.DBManager.db.collection(installCollection);
  const installation = await instalactionC.find({instanceId}).toArray();
  const refreshResponse = await axios.post(refreshAccessUrl, {    
    "grant_type": "refresh_token",
    "client_id": appId,
    "client_secret": appSecret,
    "refresh_token": installation[0].refresh_token

  })

  const {access_token} = refreshResponse.data;
  await instalactionC.updateOne({instanceId}, {$set: {access_token}});
  
  axios.get('https://www.wixapis.com/apps/v1/instance', {
    headers:{
        Authorization: access_token
    }
  }).then(response => {
    res.send(response);
  }).catch(e => {
    console.log(e);
    res.send({});
  })
});
router.get('/fake-collection', () => {
  const instalactionC = req.DBManager.db.collection(installCollection);
  const installation = await instalactionC.find({instanceId}).toArray();
  const refreshResponse = await axios.post(refreshAccessUrl, {    
    "grant_type": "refresh_token",
    "client_id": appId,
    "client_secret": appSecret,
    "refresh_token": installation[0].refresh_token

  })

  const {access_token} = refreshResponse.data;
  await instalactionC.updateOne({instanceId}, {$set: {access_token}});
  
  axios.get('https://www.wixapis.com/stores/v1/collections/00000000-000000-000000-000000000001', {
    headers:{
        Authorization: access_token
    }
  }).then(response => {
    res.send(response);
  }).catch(e => {
    console.log(e);
    res.send({});
  })
})

router.post('/create-checkouts', async (req, res) => {
  const {authorization,} = req.headers;
  const {metaSiteId, visitorId} = req.body;
  const orderC = req.DBManager.db.collection(ordersCollection);
  const orders = await orderC.find({metaSiteId, visitorId}).toArray();
  const roomsC = req.DBManager.db.collection(roomsCollection);
  for (const order of orders) {
    order.roomDetails = await roomsC.findOne({roomId: order.orderId});
  }

  const lineItems = orders.map(order => (
    {
      "id": order.orderId, 
      "quantity": order.quantity, 
      "description" : order.roomDetails.description, 
      "catalogReference":
      {
        appId, 
        "catalogItemId": order.orderId
      },

  }));
  axios.post('https://www.wixapis.com/ecom/v1/checkouts', {
    lineItems,
    "channelType": "WEB"
  }, {
    headers:{
        Authorization: authorization
    }
  }).then(response => {
    console.log('response::', response);
    res.send({});
  }).catch(e => {
    console.log(e);
    res.send({});
  })

});
router.get('/', async (req, res) => {
  const roomsC = req.DBManager.db.collection(roomsCollection);
  const rooms = await roomsC.find({}).project({_id:0}).toArray();
  res.json({rooms});
})
module.exports = router
