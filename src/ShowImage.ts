import { RequestHandler } from 'express'
import { fileExists, getImageFile, getImagePath } from './Storage'
import { isValidImageType } from './Image'
import { getUuidFromFileName } from './Helpers'
import path from 'path'

export const showImage: RequestHandler = async (req, res, next) => {
    try {
        const type = req.params.type

        if (!isValidImageType(type)) {
            throw new Error('Invalid image type')
        }

        const id = getUuidFromFileName(req.params.file)
        const ext = path.extname(req.params.file)
        const filepath = path.join(id, type + ext)

        if (!(await fileExists(getImagePath(filepath)))) {
            throw new Error(`Missing file: "${filepath}"`)
        }

        const image = await getImageFile(path.join(id, type + ext))

        res.contentType('image/webp').send(image)
    } catch (error) {
        return next(error)
    }
}
