import dotenv from "dotenv"
import express from "express"
import mongodb from "mongodb"
import fs from "fs"
import path from 'path'
import Ffmpeg from 'fluent-ffmpeg'
import createDirectory from './create-directory.js'
import { dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url));

dotenv.config()

const app = express();

app.use(express.json())

app.set('view engine', 'html');

app.use(express.static(path.join(__dirname, 'public')));

// Ffmpeg.getAvailableFormats(function(err, formats) {
//   console.log('Available formats:');
//   console.dir(formats);
// });

// Ffmpeg.getAvailableCodecs(function(err, codecs) {
//   console.log('Available codecs:');
//   console.dir(codecs);
// });

// Ffmpeg.getAvailableEncoders(function(err, encoders) {
//   console.log('Available encoders:');
//   console.dir(encoders);
// });

// Ffmpeg.getAvailableFilters(function(err, filters) {
//   console.log("Available filters:");
//   console.dir(filters);
// });


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
        res.contentType('flv');
        var proc = Ffmpeg(path)
          // use the 'flashvideo' preset (located in /lib/presets/flashvideo.js)
          .preset('flashvideo')
          // setup event handlers
          .on('end', function() {
            console.log('file has been converted succesfully');
          })
          .on('error', function(err) {
            console.log('an error happened: ' + err.message);
          })
          // save to stream
          .pipe(res, {end:true});
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
      if (result[0]) res.status('200').send(result[0])
      else res.status('401').send({message:"room no longer exists"})
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

app.get('/api/test', (req,res) => {
  res.sendFile((path.join(__dirname, './index.html')))
})

app.get('/api/video', function(req, res) {

  res.contentType('flv');
  // make sure you set the correct path to your video file storage
  var pathToMovie = process.env.DIRECTORY + process.env.TESTPATH;
  console.log(pathToMovie)
  var proc = Ffmpeg(pathToMovie)
    // use the 'flashvideo' preset (located in /lib/presets/flashvideo.js)
    .preset('flashvideo')
    // setup event handlers
    .on('end', function() {
      console.log('file has been converted succesfully');
    })
    .on('error', function(err) {
      console.log('an error happened: ' + err.message);
    })
    // save to stream
    .pipe(res, {end:true});
});

app.listen(Port, () => {
  console.log("Api started on port: ", Port)
})