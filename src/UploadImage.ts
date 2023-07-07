import { RequestHandler } from 'express'
import { saveFile } from './Storage'
import { database } from './Database'
import path from 'path'
import { sendPubsubMessage } from './Redis'
import { isValidFileExtension, isValidMimeType } from './Helpers'

export const uploadImage: RequestHandler = async (req, res, next) => {
    let images = req.files?.images

    if (typeof images === 'undefined') {
        return next(new Error('Missing files'))
    }

    if (!Array.isArray(images)) {
        images = [images]
    }

    for (const image of images) {
        if (!isValidFileExtension(image.name)) {
            throw new Error('Invalid image extension')
        }

        if (!isValidMimeType(image.mimetype)) {
            throw new Error('Invalid image extension')
        }

        const entity = await database.image.create({
            select: { id: true },
            data: {
                originalFilename: image.name,
                originalFileMimiType: image.mimetype,
                originalFileExtension: path.extname(image.name).replace('.', ''),
            },
        })

        await saveFile(entity.id, path.extname(image.name), 'original', image.data)

        await sendPubsubMessage('newImage', { id: entity.id })
    }

    return res.redirect('/')
}
