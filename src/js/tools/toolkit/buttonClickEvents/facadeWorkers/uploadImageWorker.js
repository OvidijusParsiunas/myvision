import uploadImage from '../../../imageList/uploadImage/uploadImage';

function uploadImageFile(canvas, uploadData) {
  canvas.discardActiveObject();
  uploadImage(uploadData);
}

export { uploadImageFile as default };
