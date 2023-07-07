import { RequestHandler } from 'express'
import { database } from './Database'
import { getImageLinks } from './ImageLink'

export const uploadForm: RequestHandler = async (req, res) => {
    const images = await database.image.findMany({ select: { id: true }, where: { deletedAt: null } })

    const imagesHtml = (
        await Promise.all(
            images.map(
                async image =>
                    `<li>${(await getImageLinks(image.id))
                        .map(url => `<p><a href="${url}" target="_blank">${url}</a></p>`)
                        .join('')}</li>`
            )
        )
    ).join('<br/>')

    res.send(`<script src="https://cdn.tailwindcss.com"></script><form method="post" action="/upload" enctype="multipart/form-data">
        <input type="file" name="images" accept="image/*" multiple />
        <button>Upload</button>
    </form><ul>${imagesHtml}</ul>`)
}
