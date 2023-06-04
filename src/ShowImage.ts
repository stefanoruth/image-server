import { RequestHandler } from 'express'
import { getFile } from './Storage'

export const showImage: RequestHandler = async (req, res, next) => {
    const image = await getFile('8f0a3975-c1ea-46e3-a78d-6c4757de7539', 'original')

    res.type('jpeg')
    res.send(image)
}
