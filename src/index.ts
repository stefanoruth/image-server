import express from 'express'
import fileUpload from 'express-fileupload'
import compression from 'compression'
import { createTerminus } from '@godaddy/terminus'
import { database } from './Database'
import { router } from './Router'

const app = express()

app.use(compression())
app.use(express.json())
// app.use(express.urlencoded())
app.use(fileUpload())
app.use(router)

const server = app.listen(3000, () => console.log('Started: http://localhost:3000'))

createTerminus(server, {
    onSignal: () => Promise.all([database.$disconnect()]),
})
