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
    steru: {
        ext: 'webp',
        quality: 75,
        size: {
            width: 600,
            height: 400,
        },
    },
    jpegx2: {
        ext: 'jpeg',
        quality: 75,
        watermark: true,
    },
} satisfies Record<
    string,
    {
        ext: 'webp' | 'original' | 'jpeg'
        size?: { width: number; height: number }
        quality?: number
        watermark?: boolean
    }
>

export type ImageType = keyof typeof imageTypes

export function isValidImageType(value: string): value is ImageType {
    return Object.keys(imageTypes).includes(value)
}
