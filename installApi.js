const express = require('express')
const router = express.Router()
const axios = require('axios');

const dbConnection = require('./dbConfig.js');
const installCollection = 'install';

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
  const {code, state, instanceId} = req.query;
  console.log('backToMe:::code, state, instanceId', code, state, instanceId);
  const {refresh_token, access_token} = axios.post(accessUrl, {
    "grant_type": "authorization_code",
    "client_id": appId,
    "client_secret": appSecret,
    code
  })
  console.log('backToMe:::refresh_token, access_token', refresh_token, access_token);

   res.redirect(`${lastInstallerRedirect}${access_token}`);
 })

router.get('/', async (req, res) => {
 const {token} = req.query;
 console.log('TOKEN:::', token);
  res.redirect(`${wixInstallerUrl}?${token}&${appId}&${redirectUrl}`);
})
module.exports = router