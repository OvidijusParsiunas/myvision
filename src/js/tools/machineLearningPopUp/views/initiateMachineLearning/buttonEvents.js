import {
  startMachineLearning, getProgressStatus,
  cancelMachineLearning, isFractionOfImagesAnalysedByML,
} from './machineLearning';
import {
  prepareInstantiateMachineLearningView, hideInitiateMachineLearningViewAssets, removeErrorMessage,
  removeStartButton, removeCancelButton, displayMLCoverageSelectionButtons, removeRetryButton,
  removeMLCoverageSelectionButtons,
} from './style';

function cancelInitiateMLPopUp(closePopUp) {
  if (getProgressStatus()) {
    cancelMachineLearning();
    prepareInstantiateMachineLearningView();
  } else {
    closePopUp();
    removeErrorMessage();
    removeRetryButton();
    prepareInstantiateMachineLearningView();
  }
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

function registerButtonEventHandlers(nextViewCallback, setMachineLearningData, closePopUp) {
  window.startMachineLearning = startMachineLearningMiddleware.bind(this,
    nextViewCallback, setMachineLearningData, false);
  window.changeInitiateMLToNextView = moveToNextView.bind(
    this, nextViewCallback,
  );
  window.cancelInitiateMLPopUp = cancelInitiateMLPopUp.bind(this, closePopUp);
  window.retryMachineLearning = startMachineLearningMiddleware.bind(this,
    nextViewCallback, setMachineLearningData, true);
  window.startMachineLearningWithCoverage = machineLearningCoverageMiddleware.bind(this,
    nextViewCallback, setMachineLearningData);
}

export { registerButtonEventHandlers as default };
