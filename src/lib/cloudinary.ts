import config from '@/utils/config'
import { v2 as cloudinary } from 'cloudinary'

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
