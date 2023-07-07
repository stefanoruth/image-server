import { Response } from 'express'
import sharp from 'sharp'
import { readFile } from './Storage'
import { ImageType, imageTypes } from './Image'

const cacheTime = 60 * 60

export async function fallbackImage(res: Response, type: ImageType) {
    const options = imageTypes[type]
    const fallbackImage = sharp(await readFile('fallback.svg'))

    if ('size' in options) {
        fallbackImage.resize({ width: options.size.width, height: options.size.height })
    } else {
        fallbackImage.resize({ width: 1500, height: 1500 })
    }

    res.set('Cache-Control', `max-age=${cacheTime}, public`)
    res.type(options.ext)
    res.status(404)
    fallbackImage.pipe(res)
}
