import { closeRemoveImagesModal } from '../style';
import { setDoNotShowRemoveImageModalAgainState, getDoNotShowRemoveImageModalAgainState } from '../state';

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
