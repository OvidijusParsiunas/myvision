import { addSingleImageToList, addImageFromMultiUploadToList } from '../imageList';
import { onImageLoad } from './drawImageOnCanvas';
import { removeNoImagesFoundOnMLModalStyle } from '../../machineLearningModal/views/initiateMachineLearning/style';

// potential to undo and validate in the drag and drop logic,
// depending on what is being used for upload datasets
function isFormatValid(file) {
  return file.type.includes('image/');
}

function onMultiFileLoad(imageMetadata, isfirstImage, e) {
  const image = new Image();
  image.src = e.target.result;
  if (isfirstImage) {
    image.onload = onImageLoad;
  }
  addImageFromMultiUploadToList(imageMetadata, image, isfirstImage);
  removeNoImagesFoundOnMLModalStyle();
}

function uploadMultipleImages(uploadData) {
  for (let i = 0; i < uploadData.files.length; i += 1) {
    if (isFormatValid(uploadData.files[0])) {
      const reader = new FileReader();
      const isfirstImage = i === 0;
      reader.onload = onMultiFileLoad.bind(this, uploadData.files[i], isfirstImage);
      reader.readAsDataURL(uploadData.files[i]);
    }
  }
}

function onSingleFileLoad(imageMetaData, e) {
  const image = new Image();
  image.src = e.target.result;
  image.onload = onImageLoad;
  addSingleImageToList(imageMetaData, image);
  removeNoImagesFoundOnMLModalStyle();
}

function uploadSingleImage(uploadData) {
  if (isFormatValid(uploadData.files[0])) {
    const reader = new FileReader();
    reader.onload = onSingleFileLoad.bind(this, uploadData.files[0]);
    reader.readAsDataURL(uploadData.files[0]);
  }
}

// onerror?
function uploadImages(uploadData) {
  if (uploadData.files && uploadData.files.length > 0) {
    if (uploadData.files.length === 1) {
      uploadSingleImage(uploadData);
    } else {
      uploadMultipleImages(uploadData);
    }
  }
}

export { uploadImages as default };
