import { addNewImageToList } from '../../../../imageList/imageList';
import { onImageLoad } from './drawImageOnCanvas';

function onFileLoad(name, e) {
  const image = new Image();
  image.src = e.target.result;
  image.onload = onImageLoad;
  addNewImageToList(name, image);
}

function uploadImage(uploadData) {
  if (uploadData.files && uploadData.files[0]) {
    const reader = new FileReader();
    reader.onload = onFileLoad.bind(this, uploadData.files[0].name);
    reader.readAsDataURL(uploadData.files[0]);
  }
}

export { uploadImage as default };
