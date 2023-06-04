import { RequestHandler } from 'express'

export const uploadForm: RequestHandler = (req, res) => {
    res.send(`<form method="post" action="/upload" enctype="multipart/form-data">
        <input type="file" name="images" accept="image/*" />
        <button>Upload</button>
    </form>`)
}
