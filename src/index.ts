import express from 'express'
import fileUpload from 'express-fileupload'
import compression from 'compression'
import { createTerminus } from '@godaddy/terminus'
import { database } from './Database'
import { router } from './Router'
import { pubsub, redis, startListenForPubsubMessages } from './Redis'
import { processImage } from './ProcessImage'

const app = express()

app.use(compression())
app.use(express.json())
app.use(fileUpload())
app.use(router)

redis.connect()
pubsub.connect()

startListenForPubsubMessages('newImage', async message => {
    console.log({ message })

    await processImage(message.id)
})

const server = app.listen(3000, () => console.log('Started: http://localhost:3000'))

createTerminus(server, {
    onSignal: () => Promise.all([database.$disconnect(), redis.disconnect(), pubsub.disconnect()]),
})
