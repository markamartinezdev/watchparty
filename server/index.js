import dotenv from "dotenv"
import { dirname } from 'path';
import express from "express"
import serveStatic from "serve-static"
import history from "connect-history-api-fallback"

dotenv.config()

const app = express()


app.use(history({
  index: '/dist/index.html'
}));

app.use(serveStatic("../client/dist"))

var port = process.env.PORT || 5000

app.listen(port, () => {
   console.log(`Server running at ${port}`)
 });