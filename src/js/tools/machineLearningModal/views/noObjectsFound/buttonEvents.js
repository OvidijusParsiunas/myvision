import { hideNoObjectsFoundViewAssets } from './style';

function closeModal(closeModalCallback) {
  closeModalCallback();
  hideNoObjectsFoundViewAssets();
}

function registerButtonEventHandlers(closeModalCallback) {
  window.closeMachineLearningModal = closeModal.bind(this, closeModalCallback);
}

export { registerButtonEventHandlers as default };
