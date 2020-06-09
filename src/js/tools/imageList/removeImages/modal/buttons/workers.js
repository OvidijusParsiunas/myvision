import { hideRemoveImagesModal } from '../style';

function removeImage() {
  this.removeImageCallback();
  hideRemoveImagesModal();
}

function cancelRemoveImage() {
  hideRemoveImagesModal();
}

export { removeImage, cancelRemoveImage };
