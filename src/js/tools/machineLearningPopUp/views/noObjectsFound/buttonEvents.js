import { hideNoObjectsFoundViewAssets } from './style';

function closePopUp(closePopUpCallback) {
  closePopUpCallback();
  hideNoObjectsFoundViewAssets();
}

function registerButtonEventHandlers(closePopUpCallback) {
  window.closeMachineLearningPopUp = closePopUp.bind(this, closePopUpCallback);
}

export { registerButtonEventHandlers as default };
