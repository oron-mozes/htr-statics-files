const express = require('express')
const router = express.Router()
const axios = require('axios');

const dbConnection = require('./dbConfig.js');
const installCollection = 'installs';

const wixInstallerUrl = 'https://www.wix.com/installer/install';
const redirectUrl = 'https://htr-staticfiles.herokuapp.com/_api/install/getBackToMe';
const accessUrl = 'https://www.wix.com/oauth/access';
const lastInstallerRedirect = 'https://www.wix.com/installer/token-received?access_token='
const appId = '7cbc47b3-cfc6-4d20-a13d-40cd1521378b';
const appSecret = 'f3d6e2dd-3d64-4878-b523-624bd20772c1';

router.use(express.json())
router.use(express.urlencoded())
router.use(dbConnection)

router.get('/getBackToMe', async (req, res) => {
  const {code, state = 'myState' , instanceId} = req.query;
  
  const response = await axios.post(accessUrl, {
    "grant_type": "authorization_code",
    "client_id": appId,
    "client_secret": appSecret,
    code
  })
  const installsC = req.DBManager.db.collection(installCollection);
  const {refresh_token, access_token} = response.data;
  await installsC.updateOne({instanceId}, {refresh_token, access_token}, {upsert: true})
  console.log('access_token::', access_token, response.data);
   res.redirect(`${lastInstallerRedirect}${access_token}`);
 })

router.get('/', async (req, res) => {
 const {token} = req.query;
 const redirectToWix = `${wixInstallerUrl}?token=${token}&appId=${appId}&redirectUrl=${redirectUrl}&state=${JSON.stringify({test: 'state'})}`;
  res.redirect(redirectToWix);
})
module.exports = router
