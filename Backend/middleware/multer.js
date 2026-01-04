import multer from 'multer'
import path from 'node:path'

const storage = multer.diskStorage({
  destination: './uploads/productos',
  filename: (req, file, callback) => {
    const extension = path.extname(file.originalname)
    callback(null, `producto-${Date.now()}${extension}`)
  }
})

export const uploadProducto = multer({
  storage,
  limits: { fileSize: 2 * 1024 * 1024 },
  fileFilter: (req, file, callback) => {
    if (!file.mimetype.startsWith('image/')) {
      return callback(new Error('Solo se permiten archivos de imagen'), false)
    }
    callback(null, true)
  }
})
