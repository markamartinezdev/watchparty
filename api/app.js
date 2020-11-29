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

app.get('/api/list', (req, res) => {
  res.status('200').send(directory);
})

app.get('/api/watch/:roomId', (req, res) => {
  const roomId = req.params.roomId

  // Get file path
  MongoClient.connect(url, function(err, db) {
    if (err) throw err;
    var dbo = db.db(process.env.DBNAME)
    var query = { _id: ObjectID(roomId) }

    const collection = dbo.collection("room")

    collection.find(query).toArray(function(err, result) {
      if (err) throw err

      if(result[0]) {
        const path = result[0].filePath
        const stat = fs.statSync(path)
        const range = req.headers.range

        fs.stat(path, function(err, stats) {
          if (err) {
            if (err.code === 'ENOENT') {
              // 404 Error if file not found
              return res.sendStatus(404);
            }
          res.end(err);
          }
          if (!range) {
           // 416 Wrong range
           return res.sendStatus(416);
          }
          var positions = range.replace(/bytes=/, "").split("-");
          var start = parseInt(positions[0], 10);
          var total = stats.size;
          var end = positions[1] ? parseInt(positions[1], 10) : total - 1;
          var chunksize = (end - start) + 1;
    
          res.writeHead(206, {
            "Content-Range": "bytes " + start + "-" + end + "/" + total,
            "Accept-Ranges": "bytes",
            "Content-Length": chunksize,
            "Content-Type": "video/mp4"
          });
    
          var stream = fs.createReadStream(path, { start: start, end: end })
            .on("open", function() {
              stream.pipe(res);
            }).on("error", function(err) {
              res.end(err);
            });
        });
      }
      else {
        res.status('401').send({message:"room no longer exists"})
      }
    });
  });
})

app.get('/api/room/:roomId', (req, res) => {
  const roomId = req.params.roomId
  MongoClient.connect(url, function(err, db) {
    if (err) throw err;
    var dbo = db.db(process.env.DBNAME)
    var query = { _id: ObjectID(roomId) }

    dbo.collection("room").find(query).toArray(function(err, result) {
      if (err) throw err

      db.close()
      result[0] ?
      res.status('200').send(result[0]) :
      res.status('401').send({message:"room no longer exists"})
    });
  });
})

app.post('/api/create-room/', (request, response) => {
  console.log("in room")
  MongoClient.connect(url, function(err, db) {
    const filePath = request.body.filePath
    const fileName = request.body.name
    const accessKey = generateKey(5)
    if (err) throw err
    var dbo = db.db(process.env.DBNAME)

    var myobj = { 
      key: accessKey,
      participants: 1 ,
      maxParticipants : 10,
      createdAt: new Date(),
      currentPosition: 0,
      paused: false,
      fileName,
      filePath
    }
    
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

app.get('/api', (req,res) => {
  res.status('200').send('Why are you here?')
})

app.listen(Port, () => {
  console.log("Api started on port: ", Port)
})