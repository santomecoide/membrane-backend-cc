import express from 'express'
import cors from 'cors'
import bodyParser from 'body-parser'
import { router } from './presentation/routes'

const app = express()

const PORT = process.env.PORT ?? 8080
const CORS_OPTIONS = { origin: '*' }
const VERSION = 'v1'

app.use(cors(CORS_OPTIONS))
app.use(bodyParser.json())
app.use(`/${VERSION}`, router)

app.listen(PORT, () => {
  console.log(`http://localhost:${PORT}`)
})
