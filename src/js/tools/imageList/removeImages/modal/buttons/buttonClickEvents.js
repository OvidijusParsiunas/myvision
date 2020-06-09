import { removeImage, cancelRemoveImage } from './workers';

function assignRemoveImagesModalButtonEventHandlers(removeImageCallback) {
  window.approveRemoveImage = removeImage.bind({ removeImageCallback });
  window.cancelRemoveImage = cancelRemoveImage;
}

export { assignRemoveImagesModalButtonEventHandlers as default };
