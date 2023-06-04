import fs from 'fs/promises'
import path from 'path'
import { ImageType, imageTypes } from './Image'
import { database } from './Database'

export function getStoragePath(): string {
    return path.join(process.cwd(), 'storage')
}

export async function getFile(id: string, type: ImageType) {
    const options = imageTypes[type]

    let ext: string = options.ext

    if (options.ext === 'original') {
        const image = await database.image.findUniqueOrThrow({ select: { originalFiletype: true }, where: { id } })

        ext = image.originalFiletype
    }

    return fs.readFile(path.join(getStoragePath(), id, `${type}.jpg`))
}

export async function saveFile(id: string, ext: string, type: ImageType, data: Buffer) {
    if (!(await folderExists(id))) {
        await createFolder(id)
    }

    await fs.writeFile(path.join(getStoragePath(), id, type + ext), data)
}

export async function createFolder(folderName: string) {
    await fs.mkdir(path.join(getStoragePath(), folderName))
}

export async function folderExists(folderName: string): Promise<boolean> {
    return fs
        .stat(path.join(getStoragePath(), folderName))
        .then(() => true)
        .catch(() => false)
}
