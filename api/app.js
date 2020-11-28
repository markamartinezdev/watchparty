import dotenv from "dotenv"
import express from "express"
import mongodb from "mongodb"
import fs from "fs"
import ffmpeg from 'ffmpeg'
import createDirectory from './create-directory.js'


dotenv.config()

const app = express();

app.use(express.json());


console.log("scanning")
const directory = createDirectory(process.env.DIRECTORY)
console.log("scan complete")

const Port = process.env.PORT || 3000

const MongoClient = mongodb.MongoClient
const ObjectID = mongodb.ObjectID

var url = process.env.DB_URL

const options = {
  useNewUrlParser: true,
  reconnectTries: Number.MAX_VALUE,
  reconnectInterval: 500,
  connectTimeoutMS: 10000,
};

const generateKey = (length) => {
  var result           = '';
  var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  var charactersLength = characters.length;
  for ( var i = 0; i < length; i++ ) {
     result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

app.get('/list', (req, res) => {
  res.status('200').send(directory);
})

app.get('/watch/:roomId', (req, res) => {
  const roomId = req.params.roomId

  // Get file path
  MongoClient.connect(url, function(err, db) {
    if (err) throw err;
    var dbo = db.db(process.env.DBNAME)
    var query = { _id: ObjectID(roomId) }

    dbo.collection("room").find(query).toArray(function(err, result) {
      if (err) throw err

      const path = result[0].filePath
      const stat = fs.statSync(path)
      const fileSize = stat.size
      const range = req.headers.range

      db.close()

      if (range) {
        const parts = range.replace(/bytes=/, "").split("-")
        const start = parseInt(parts[0], 10)
        const end = parts[1] 
          ? parseInt(parts[1], 10)
          : fileSize-1
        const chunksize = (end-start)+1
        const file = fs.createReadStream(path, {start, end})
        const head = {
          'Content-Range': `bytes ${start}-${end}/${fileSize}`,
          'Accept-Ranges': 'bytes',
          'Content-Length': chunksize,
          'Content-Type': 'video/mp4',
        }
        res.writeHead(206, head);
        file.pipe(res)
      }
      else {
        const head = {
          'Content-Length': fileSize,
          'Content-Type': 'video/mp4',
        }
        res.writeHead(200, head)
        fs.createReadStream(path).pipe(res)
      }
    });
  });
})

app.get('/room/:roomId', (req, res) => {
  const roomId = req.params.roomId
  MongoClient.connect(url, function(err, db) {
    if (err) throw err;
    var dbo = db.db(process.env.DBNAME)
    var query = { _id: ObjectID(roomId) }

    dbo.collection("room").find(query).toArray(function(err, result) {
      if (err) throw err

      db.close()
      res.status('200').send(result[0])
    });
  });
})

app.post('/create-room/', (request, response) => {
  console.log("in room")
  MongoClient.connect(url, function(err, db) {
    const filePath = request.body.filePath
    const fileName = request.body.name
    const accessKey = generateKey(5)
    if (err) throw err
    var dbo = db.db(process.env.DBNAME)
    var myobj = { key: accessKey, participants: 1 , maxParticipants : 10, createdAt: new Date(), fileName, filePath}
    

    dbo.collection("room").createIndex( { "createdAt": 1 }, { expireAfterSeconds: 20000 } )

    dbo.collection("room").insertOne(myobj, function(err, res) {
      if (err) throw err;
      console.log("1 document inserted")
      // create watch party
      response.status('200').send({link:res.insertedId, accessKey: accessKey.toUpperCase()})
      db.close()
    });
  });
})

app.get('/', (req,res) => {
  res.status('200').send('Why are you here?')
})

app.listen(Port, () => {
  console.log("Api started on port: ", Port)
})