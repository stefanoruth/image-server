import { RequestHandler } from 'express'
import { database } from './Database'

export const uploadForm: RequestHandler = async (req, res) => {
    const images = await database.image.findMany({ select: { id: true }, where: { deletedAt: null } })

    const imagesHtml = images.map(image => `<li><img src="/images/original/${image.id}.jpg" class="w-[300px]"/></li>`)

    res.send(`<script src="https://cdn.tailwindcss.com"></script><form method="post" action="/upload" enctype="multipart/form-data">
        <input type="file" name="images" accept="image/*" multiple />
        <button>Upload</button>
    </form><ul>${imagesHtml}</ul>`)
}
