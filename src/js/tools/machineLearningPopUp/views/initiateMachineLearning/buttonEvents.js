import startMachineLearning from './machineLearning';
import { closeMachineLearningPopUp } from './style';

function registerButtonEventHandlers(nextViewCallback, setMachineLearningData) {
  window.startMachineLearning = startMachineLearning.bind(
    this, nextViewCallback, setMachineLearningData,
  );
  window.closeMachineLearningPopUp = closeMachineLearningPopUp;
}

export { registerButtonEventHandlers as default };
