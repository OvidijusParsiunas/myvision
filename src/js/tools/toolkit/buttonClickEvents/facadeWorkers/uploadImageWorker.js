import uploadImage from '../facadeWorkersUtils/uploadImage/uploadImage';

function uploadImageFile(canvas, uploadData) {
  canvas.discardActiveObject();
  uploadImage(uploadData);
}

export { uploadImageFile as default };
