export const imageTypes = {
    original: {
        ext: 'original',
    },
    '2000x1500': {
        ext: 'webp',
        size: {
            width: 2000,
            height: 1500,
        },
    },
} satisfies Record<string, { ext: 'webp' | 'original'; size?: { width: number; height: number } }>

export type ImageType = keyof typeof imageTypes

export function isValidImageType(value: string): value is ImageType {
    return Object.keys(imageTypes).includes(value)
}
