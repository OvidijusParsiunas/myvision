import { startMachineLearning, getProgressStatus, cancelMachineLearning } from './machineLearning';
import { prepareInstantiateMachineLearningView } from './style';

function cancelInitiateMLPopUp(closePopUp) {
  if (getProgressStatus()) {
    cancelMachineLearning();
    prepareInstantiateMachineLearningView();
  } else {
    closePopUp();
    prepareInstantiateMachineLearningView();
  }
}

function moveToNextView(nextViewCallback) {
  nextViewCallback();
}

function registerButtonEventHandlers(nextViewCallback, setMachineLearningData, closePopUp) {
  window.startMachineLearning = startMachineLearning.bind(
    this, nextViewCallback, setMachineLearningData,
  );
  window.changeInitiateMLToNextView = moveToNextView.bind(
    this, nextViewCallback,
  );
  window.cancelInitiateMLPopUp = cancelInitiateMLPopUp.bind(this, closePopUp);
}

export { registerButtonEventHandlers as default };
