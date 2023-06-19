import { RequestHandler } from 'express'
import { saveFile } from './Storage'
import { database } from './Database'
import path from 'path'
import { sendPubsubMessage } from './Redis'

export const uploadImage: RequestHandler = async (req, res, next) => {
    let images = req.files?.images

    if (typeof images === 'undefined') {
        return next(new Error('Missing files'))
    }

    if (!Array.isArray(images)) {
        images = [images]
    }

    for (const image of images) {
        const entity = await database.image.create({
            select: { id: true },
            data: {
                originalFilename: image.name,
                originalFileMimiType: image.mimetype,
                originalFileExtension: path.extname(image.name),
            },
        })

        await saveFile(entity.id, path.extname(image.name), 'original', image.data)

        await sendPubsubMessage('newImage', { id: entity.id })
    }

    return res.redirect('/')
}
