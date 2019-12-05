import { addSingleImageToList, addImageFromMultiUploadToList } from '../../../../imageList/imageList';
import { onImageLoad, getImageProperties } from './drawImageOnCanvas';

function onFileLoad(imageMetaData, e) {
  const image = new Image();
  image.src = e.target.result;
  image.onload = onImageLoad;
  const newFileStatus = getImageProperties();
  addSingleImageToList(imageMetaData, image, newFileStatus);
}

function onMultiFileLoad(name, firstImage, e) {
  const image = new Image();
  image.src = e.target.result;
  if (firstImage) {
    image.onload = onImageLoad;
  }
  addImageFromMultiUploadToList(name, image, firstImage);
}

function uploadImage(uploadData) {
  if (uploadData.files && uploadData.files.length > 0) {
    if (uploadData.files.length === 1) {
      const reader = new FileReader();
      reader.onload = onFileLoad.bind(this, uploadData.files[0]);
      reader.readAsDataURL(uploadData.files[0]);
    } else {
      for (let i = 0; i < uploadData.files.length; i += 1) {
        const reader = new FileReader();
        const firstImage = i === 0;
        reader.onload = onMultiFileLoad.bind(this, uploadData.files[i].name, firstImage);
        reader.readAsDataURL(uploadData.files[i]);
      }
    }
  }
}

export { uploadImage as default };
