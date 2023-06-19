import { createClient } from 'redis'

export const redis = createClient()
export const pubsub = redis.duplicate()

redis.on('error', error => console.error(error))
pubsub.on('error', error => console.error(error))

interface Topics {
    newImage: {
        id: string
    }
}

export type Topic = keyof Topics

export async function sendPubsubMessage<T extends Topic>(topic: T, message: Topics[T]) {
    await redis.publish(topic, JSON.stringify(message))
}

export async function startListenForPubsubMessages<T extends Topic>(
    topic: T,
    handler: (message: Topics[T]) => Promise<void>
) {
    await pubsub.subscribe(topic, (rawMessage, channel) => {
        const message = JSON.parse(rawMessage) as Topics[T]

        return handler(message)
    })
}
