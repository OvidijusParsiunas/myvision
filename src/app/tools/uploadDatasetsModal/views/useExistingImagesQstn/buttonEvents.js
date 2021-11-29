import { hideUseExistingImagesViewAssets } from './style.js';
import { setReuseAlreadyUploadedImagesState } from '../../state.js';

function moveToNextView(nextViewCallback, reuseAlreadyUploadedImages) {
  setReuseAlreadyUploadedImagesState(reuseAlreadyUploadedImages);
  hideUseExistingImagesViewAssets();
  nextViewCallback();
}

function registerButtonEventHandlers(nextViewCallback) {
  window.reuseAlreadyExistingImages = moveToNextView.bind(
    this, nextViewCallback,
  );
}

export { registerButtonEventHandlers as default };
