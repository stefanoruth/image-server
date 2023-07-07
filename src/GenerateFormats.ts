import { parseArgs } from 'node:util'
import { database } from './Database'
import { processImage } from './ProcessImage'

const { values: args } = parseArgs({
    options: { cursor: { type: 'string' }, id: { type: 'string' }, override: { type: 'boolean' } },
})
const take = 10

async function run() {
    let cursor = args.cursor

    do {
        const images = await database.image.findMany({
            select: { id: true },
            where: { deletedAt: null, id: args.id },
            orderBy: { createdAt: 'asc' },
            take,
        })

        cursor = images.length === take ? images.at(-1)?.id : undefined

        await Promise.all(images.map(image => processImage(image.id, args.override || false)))
    } while (cursor)
}

run()
    .catch(console.error)
    .finally(() => Promise.all([database.$disconnect()]))
