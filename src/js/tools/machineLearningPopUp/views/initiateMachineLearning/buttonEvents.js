import startMachineLearning from './machineLearning';
import { closeMachineLearningPopUp } from './style';

function moveToNextView(nextViewCallback) {
  nextViewCallback();
}

function registerButtonEventHandlers(nextViewCallback, setMachineLearningData) {
  window.startMachineLearning = startMachineLearning.bind(
    this, setMachineLearningData,
  );
  window.closeMachineLearningPopUp = closeMachineLearningPopUp;
  window.changeInitiateMLToNextView = moveToNextView.bind(
    this, nextViewCallback,
  );
}

export { registerButtonEventHandlers as default };
