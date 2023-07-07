import { ImageType, imageTypes } from './Image'
import path from 'path'
import { fileExists, getImagesPath, readFile } from './Storage'
import sharp from 'sharp'
import { getOriginalImageFileExtension } from './Helpers'

export async function processImage(imageId: string, override: boolean) {
    const originalExtension = await getOriginalImageFileExtension(imageId)

    for (const type of Object.keys(imageTypes) as ImageType[]) {
        console.log({ type, imageId })

        await processImageFormat(imageId, type, originalExtension, override)
    }
}

async function processImageFormat(imageId: string, type: ImageType, originalExtension: string, override: boolean) {
    if (type === 'original') {
        return // Skip original
    }

    const options = imageTypes[type]

    const filename = `${type}.${options.ext}`
    const file = path.join(getImagesPath(), imageId, filename)

    if (!override && (await fileExists(file))) {
        return // Skip exisiting
    }

    const originalFile = path.join(getImagesPath(), imageId, `original.${originalExtension}`)

    const pipe = await sharp(originalFile).rotate()

    if ('size' in options) {
        pipe.resize({ width: options.size.width, height: options.size.height, withoutEnlargement: true })
    }

    if (options.ext === 'webp') {
        pipe.webp({ quality: 'quality' in options ? options.quality : undefined })
    }

    if (options.ext === 'jpeg') {
        pipe.jpeg({ quality: 'quality' in options ? options.quality : undefined })
    }

    if ('watermark' in options && options.watermark === true) {
        const imageInfo = await pipe.toBuffer({ resolveWithObject: true }).then(res => res.info)

        const watermark = await getWatermark({ height: imageInfo.height, width: imageInfo.width })

        const offset = 40

        pipe.composite([
            {
                input: watermark.file,
                gravity: 'northeast',
                top: offset,
                left: imageInfo.width - watermark.width - offset,
            },
        ])
    }

    await pipe.toFile(file)
}

async function getWatermark(image: { width: number; height: number }) {
    const watermark = await readFile('logo.svg')

    const scaleWidth = 0.1
    const scaleHeight = 0.07
    const originalWidth = 918
    const originalHeight = 551.23

    let width: number | undefined
    let height: number | undefined

    if (image.width > image.height) {
        width = Math.round(image.width * scaleWidth)
        height = Math.round((width / originalWidth) * originalHeight)
    } else {
        width = Math.round(image.height * scaleHeight)
        width = Math.round((width / originalHeight) * originalWidth)
    }

    return {
        file: await sharp(watermark).resize({ width, height }).toBuffer(),
        width,
    }
}
