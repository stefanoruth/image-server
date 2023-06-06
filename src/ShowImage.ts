import { RequestHandler } from 'express'
import { getImageFile } from './Storage'
import { isValidImageType } from './Image'
import { getUuidFromFileName } from './Helpers'
import path from 'path'

export const showImage: RequestHandler = async (req, res, next) => {
    const type = req.params.type

    if (!isValidImageType(type)) {
        return next(new Error('Invalid image type'))
    }

    const id = getUuidFromFileName(req.params.file)
    const ext = path.extname(req.params.file)

    const image = await getImageFile(path.join(id, type + ext))

    res.send(image)
}
