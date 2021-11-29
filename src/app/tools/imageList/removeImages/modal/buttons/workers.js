import { closeRemoveImagesModal } from '../style.js';
import { setDoNotShowRemoveImageModalAgainState, getDoNotShowRemoveImageModalAgainState } from '../state.js';

function removeImage() {
  this.removeImageCallback();
  closeRemoveImagesModal();
}

function cancelRemoveImage() {
  closeRemoveImagesModal();
}

function toggleDoNotShowRemoveImageModalAgain() {
  setDoNotShowRemoveImageModalAgainState(!getDoNotShowRemoveImageModalAgainState());
}

export { removeImage, cancelRemoveImage, toggleDoNotShowRemoveImageModalAgain };
