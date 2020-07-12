import { hideUseExistingImagesViewAssets } from './style';
import { setReuseAlreadyUploadedImagesState } from '../../state';

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
