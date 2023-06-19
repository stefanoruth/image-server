import fs from 'fs/promises'
import path from 'path'
import { getImagesPath } from './Storage'

const filesToKeep = ['.gitignore']

async function cleanImageFolders() {
    const folders = await (await fs.readdir(path.join(getImagesPath()))).filter(item => !filesToKeep.includes(item))

    for (const folder of folders) {
        await fs.rm(path.join(getImagesPath(), folder), { recursive: true })
    }
}

cleanImageFolders().catch(console.error)
