import express from 'express'
import { getStoragePath } from './Storage'
import { uploadForm } from './UploadForm'
import { uploadImage } from './UploadImage'
import { showImage } from './ShowImage'

export const router = express.Router()

router.get('/', (req, res) => {
    res.send('Hello World' + getStoragePath())
})

router.get('/images/:type/:file', showImage)

router.get('/upload', uploadForm)
router.post('/upload', uploadImage)
