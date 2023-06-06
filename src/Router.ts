import express from 'express'
import { uploadForm } from './UploadForm'
import { uploadImage } from './UploadImage'
import { showImage } from './ShowImage'

export const router = express.Router()

router.get('/', uploadForm)

router.get('/images/:type/:file', showImage)

router.post('/upload', uploadImage)
