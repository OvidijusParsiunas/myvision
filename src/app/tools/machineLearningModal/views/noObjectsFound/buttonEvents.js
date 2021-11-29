import { hideNoObjectsFoundViewAssets } from './style.js';
import { resetCursor } from '../../../../canvas/utils/drawShapesViaCoordinates/drawShapesViaCoordinates.js';

function closeModal(closeModalCallback) {
  resetCursor();
  closeModalCallback(true);
  hideNoObjectsFoundViewAssets();
}

function registerButtonEventHandlers(closeModalCallback) {
  window.closeMachineLearningModal = closeModal.bind(this, closeModalCallback);
}

export { registerButtonEventHandlers as default };
