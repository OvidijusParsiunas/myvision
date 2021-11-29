import { removeImage, cancelRemoveImage, toggleDoNotShowRemoveImageModalAgain } from './workers.js';

function assignRemoveImagesModalButtonEventHandlers(removeImageCallback) {
  window.approveRemoveImage = removeImage.bind({ removeImageCallback });
  window.cancelRemoveImage = cancelRemoveImage;
  window.toggleDoNotShowRemoveImageModalAgain = toggleDoNotShowRemoveImageModalAgain;
}

export { assignRemoveImagesModalButtonEventHandlers as default };
