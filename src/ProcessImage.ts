import { ImageType, imageTypes } from './Image'
import path from 'path'
import { fileExists, getImagesPath } from './Storage'
import sharp from 'sharp'

export async function processImage(imageId: string) {
    for (const type of Object.keys(imageTypes) as ImageType[]) {
        console.log({ type, imageId })
        if (type === 'original') {
            continue // Skip original
        }

        await processImageFormat(imageId, type)
    }
}

export async function processImageFormat(imageId: string, type: ImageType) {
    const options = imageTypes[type]

    const filename = `${type}.${options.ext}`
    const file = path.join(getImagesPath(), imageId, filename)

    console.log({ file })

    if (await fileExists(file)) {
        return // Skip exisiting
    }

    const originalFile = path.join(getImagesPath(), imageId, `original.jpg`)

    const pipe = await sharp(originalFile).rotate()

    if ('size' in options) {
        pipe.resize({ width: options.size.width, height: options.size.height, withoutEnlargement: true })
    }

    if (options.ext === 'webp') {
        pipe.webp()
    }

    await pipe.toFile(file)

    console.log('genetes', type)
}
