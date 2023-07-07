import path from 'path'
import { validate } from 'uuid'
import { database } from './Database'

export function getUuidFromFileName(filename: string) {
    const id = filename.replace(path.extname(filename), '')

    if (!validate(id)) {
        throw new Error('Invalid UUID')
    }

    return id
}

export async function getOriginalImageFileExtension(imageId: string) {
    const image = await database.image.findUniqueOrThrow({
        select: { originalFileExtension: true },
        where: { id: imageId },
    })

    return image.originalFileExtension.replace('.', '')
}

export function isValidFileExtension(filename: string): boolean {
    const ext = path.extname(filename).replace('.', '').toLowerCase()

    return ['jpg', 'jpeg', 'png', 'webp', 'heic', 'heif'].includes(ext)
}

export function isValidMimeType(mimetype: string): boolean {
    return ['image/heic', 'image/heif', 'image/webp', 'image/jpeg', 'image/webp'].includes(mimetype.toLowerCase())
}
