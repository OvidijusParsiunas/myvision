import { uploadImage } from '../facadeWorkersUtils/uploadFile/uploadImage';

function uploadImageFile(uploadData) {
  uploadImage(uploadData);
}

export { uploadImageFile as default };
