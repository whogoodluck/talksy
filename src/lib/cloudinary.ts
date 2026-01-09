import { v2 as cloudinary } from 'cloudinary'
import config from '../utils/config'

cloudinary.config({
  cloud_name: config.CLOUDINARY_CLOUD_NAME,
  api_key: config.CLOUDINARY_API_KEY,
  api_secret: config.CLOUDINARY_API_SECRET,
})

export const uploadImage = async (file: Express.Multer.File) => {
  const fileStr = file.buffer.toString('base64')
  const dataURI = `data:${file.mimetype};base64,${fileStr}`

  return await cloudinary.uploader.upload(dataURI, {
    folder: 'talksy',
  })
}

const getPublicIdFromUrl = (url: string): string => {
  const parts = url.split('/')
  const uploadIndex = parts.findIndex(p => p === 'upload')

  if (uploadIndex === -1) {
    throw new Error('Invalid Cloudinary URL')
  }

  const publicIdWithExt = parts
    .slice(uploadIndex + 1)
    .filter(p => !p.startsWith('v'))
    .join('/')

  return publicIdWithExt.replace(/\.[^/.]+$/, '')
}

export const deleteImage = async (url: string) => {
  const publicId = getPublicIdFromUrl(url)

  return await cloudinary.uploader.destroy(publicId)
}
