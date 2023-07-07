import fs from 'fs/promises'
import path from 'path'
import { ImageType } from './Image'

export function getStoragePath(): string {
    return path.join(process.cwd(), 'storage')
}

export function getImagesPath(): string {
    return path.join(getStoragePath(), 'images')
}

export function getImagePath(filename: string): string {
    return path.join(getImagesPath(), filename)
}

export async function getImageFile(filename: string) {
    return fs.readFile(getImagePath(filename))
}

export async function readFile(filename: string) {
    return fs.readFile(path.join(getStoragePath(), filename))
}

export async function saveFile(id: string, ext: string, type: ImageType, data: Buffer) {
    if (!(await folderExists(id))) {
        await createFolder(id)
    }

    await fs.writeFile(path.join(getImagesPath(), id, type + ext), data)
}

export async function createFolder(folderName: string) {
    await fs.mkdir(path.join(getImagesPath(), folderName))
}

export async function folderExists(folderName: string): Promise<boolean> {
    return fs
        .stat(path.join(getImagesPath(), folderName))
        .then(() => true)
        .catch(() => false)
}

export async function fileExists(file: string) {
    return fs
        .access(file, fs.constants.F_OK)
        .then(() => true)
        .catch(() => false)
}
