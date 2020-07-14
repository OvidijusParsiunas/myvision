import { addSingleImageToList, addImageFromMultiUploadToList } from '../imageList';
import { onImageLoad } from './drawImageOnCanvas';
import { removeNoImagesFoundOnMLModalStyle } from '../../machineLearningModal/views/initiateMachineLearning/style';

function onFileLoad(imageMetaData, e) {
  const image = new Image();
  image.src = e.target.result;
  image.onload = onImageLoad;
  addSingleImageToList(imageMetaData, image);
  removeNoImagesFoundOnMLModalStyle();
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

// onerror?
function uploadImages(uploadData) {
  if (uploadData.files && uploadData.files.length > 0) {
    if (uploadData.files.length === 1) {
      const reader = new FileReader();
      reader.onload = onFileLoad.bind(this, uploadData.files[0]);
      reader.readAsDataURL(uploadData.files[0]);
    } else {
      for (let i = 0; i < uploadData.files.length; i += 1) {
        const reader = new FileReader();
        const isfirstImage = i === 0;
        reader.onload = onMultiFileLoad.bind(this, uploadData.files[i], isfirstImage);
        reader.readAsDataURL(uploadData.files[i]);
      }
    }
  }
}

export { uploadImages as default };
