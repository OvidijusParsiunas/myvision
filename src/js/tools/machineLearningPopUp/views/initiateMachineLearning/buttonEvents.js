import { startMachineLearning, getProgressStatus, cancelMachineLearning } from './machineLearning';
import { prepareInstantiateMachineLearningView } from './style';

function cancelInitiateMLPopUp() {
  cancelMachineLearning();
  prepareInstantiateMachineLearningView();
}

function moveToNextView(nextViewCallback) {
  nextViewCallback();
}

function registerButtonEventHandlers(nextViewCallback, setMachineLearningData) {
  window.startMachineLearning = startMachineLearning.bind(
    this, nextViewCallback, setMachineLearningData,
  );
  window.changeInitiateMLToNextView = moveToNextView.bind(
    this, nextViewCallback,
  );
  window.cancelInitiateMLPopUp = cancelInitiateMLPopUp;
}

export { registerButtonEventHandlers as default };
