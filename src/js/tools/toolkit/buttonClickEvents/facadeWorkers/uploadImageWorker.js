import uploadImage from '../facadeWorkersUtils/uploadFile/uploadImage';

function uploadImageFile(canvas, uploadData) {
  canvas.discardActiveObject();
  uploadImage(uploadData);
}

export { uploadImageFile as default };
