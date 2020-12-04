import dotenv from "dotenv"
dotenv.config()
import express from "express"
import { dirname } from 'path'
import { fileURLToPath } from 'url'
import routes from './routes/index.js'

const __dirname = dirname(fileURLToPath(import.meta.url));

const app = express();

app.use(express.json())

app.use('/api', routes)

const Port = process.env.PORT || 3000


app.listen(Port, () => {
  console.log("Api started on port: ", Port)
})