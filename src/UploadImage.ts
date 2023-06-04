import { RequestHandler } from 'express'
import { saveFile } from './Storage'
import { database } from './Database'
import path from 'path'

export const uploadImage: RequestHandler = async (req, res, next) => {
    let images = req.files?.images

    console.log(req.files)

    if (typeof images === 'undefined') {
        return next(new Error('Missing files'))
    }

    if (!Array.isArray(images)) {
        images = [images]
    }

    for (const image of images) {
        // Store image

        const entity = await database.image.create({
            select: { id: true },
            data: { originalFilename: image.name, originalFiletype: image.mimetype },
        })

        await saveFile(entity.id, path.extname(image.name), 'original', image.data)
    }

    res.json(true)
}
