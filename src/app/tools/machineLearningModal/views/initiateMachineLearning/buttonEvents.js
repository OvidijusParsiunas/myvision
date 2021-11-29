import {
  startMachineLearning, getProgressStatus,
  cancelMachineLearning, isFractionOfImagesAnalysedByML,
} from './machineLearning.js';
import {
  prepareInstantiateMachineLearningView, hideInitiateMachineLearningViewAssets,
  removeStartButton, removeCancelButton, displayMLCoverageSelectionButtons, removeRetryButton,
  removeMLCoverageSelectionButtons,
} from './style.js';

function cancelMLModal(closeModal) {
  if (getProgressStatus()) {
    cancelMachineLearning();
  } else {
    closeModal(true);
    hideInitiateMachineLearningViewAssets();
  }
  prepareInstantiateMachineLearningView();
}

function moveToNextView(nextViewCallback) {
  hideInitiateMachineLearningViewAssets();
  nextViewCallback();
}

function startMachineLearningMiddleware(nextViewCallback, setMachineLearningData, retry) {
  if (retry) { removeRetryButton(); }
  if (isFractionOfImagesAnalysedByML()) {
    removeStartButton();
    removeCancelButton();
    displayMLCoverageSelectionButtons();
  } else {
    startMachineLearning(nextViewCallback, setMachineLearningData, 'all');
  }
}

function machineLearningCoverageMiddleware(nextViewCallback, setMachineLearningData, coverage) {
  removeMLCoverageSelectionButtons();
  startMachineLearning(nextViewCallback, setMachineLearningData, coverage);
}

function registerButtonEventHandlers(nextViewCallback, setMachineLearningData, closeModal) {
  window.startMachineLearning = startMachineLearningMiddleware.bind(this,
    nextViewCallback, setMachineLearningData, false);
  window.changeInitiateMLToNextView = moveToNextView.bind(this, nextViewCallback);
  window.cancelMLModal = cancelMLModal.bind(this, closeModal);
  window.retryMachineLearning = startMachineLearningMiddleware.bind(this,
    nextViewCallback, setMachineLearningData, true);
  window.startMachineLearningWithCoverage = machineLearningCoverageMiddleware.bind(this,
    nextViewCallback, setMachineLearningData);
}

export { registerButtonEventHandlers as default };
