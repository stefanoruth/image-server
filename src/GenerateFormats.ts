import { parseArgs } from 'node:util'
import { database } from './Database'

const { values: args } = parseArgs({ options: { cursor: { type: 'string' } } })
const take = 10

async function run() {
    let cursor = args.cursor

    do {
        const images = await database.image.findMany({
            select: { id: true },
            where: { deletedAt: null },
            orderBy: { createdAt: 'asc' },
            take,
        })

        cursor = images.length === take ? images.at(-1)?.id : undefined

        for (const image of images) {
            // image
            console.log({ image })
        }
    } while (cursor)
}

run()
    .catch(console.error)
    .finally(() => Promise.all([database.$disconnect()]))
