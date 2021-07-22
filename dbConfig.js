const { MongoClient } = require('mongodb')

const limitedConnection = "mongodb+srv://oronmozes:<password>@cluster0.qcw5u.mongodb.net/myFirstDatabase?retryWrites=true&w=majority"
const client = new MongoClient(limitedConnection)
const dbName = 'htr'

module.exports = async (req, res, next) => {
  await client.connect()
  console.log('Connected successfully to server')
  const db = client.db(dbName)
  req.DBManager = {
    db
  }
  next();
}