import { ImageType, imageTypes } from './Image'

export async function processImage(imageId: string) {
    for (const type of Object.keys(imageTypes)) {
        processImageFormat(imageId, type)
    }
}

export async function processImageFormat(imageId: string, type: ImageType) {}
