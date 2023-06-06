import path from 'path'
import { validate } from 'uuid'

export function getUuidFromFileName(filename: string) {
    const id = filename.replace(path.extname(filename), '')

    if (!validate(id)) {
        throw new Error('Invalid UUID')
    }

    return id
}
