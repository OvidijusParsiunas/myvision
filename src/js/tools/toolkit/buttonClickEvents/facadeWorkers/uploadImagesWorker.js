import uploadImages from '../../../imageList/uploadImages/uploadImages';

function triggeUploadImagesButton() {
  document.getElementById('uploadImages').click();
}

function uploadImageFiles(canvas, uploadData) {
  canvas.discardActiveObject();
  uploadImages(uploadData);
}

export { triggeUploadImagesButton, uploadImageFiles };
