import cloudinary from 'cloudinary';
import { config } from '../../Config/app.config';

cloudinary.v2.config({
  cloud_name: 'farmily-production',
  api_key: config.storage.database.fileStorage.cloudinary.apiKey,
  api_secret: config.storage.database.fileStorage.cloudinary.apiSecret,
  secure: true,
});

export default cloudinary;
