import { getOriginalImageFileExtension } from './Helpers'
import { ImageType, imageTypes } from './Image'

export async function getImageLink(imageId: string, type: ImageType) {
    const options = imageTypes[type]
    let extension: string

    if (type === 'original') {
        extension = await getOriginalImageFileExtension(imageId)
    } else {
        extension = options.ext
    }

    return `/images/${type}/${imageId}.${extension}`
}

export async function getImageLinks(imageId: string) {
    return Promise.all(Object.keys(imageTypes).map(type => getImageLink(imageId, type as ImageType)))
}
