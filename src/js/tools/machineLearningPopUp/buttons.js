import { closeMachineLearningPopUp } from './style';
import startMachineLearning from './buttonEventHandlers';

// will be handled by eventHandlers later on for more functionality
function initialiseMachineLearningPopUp() {
  window.startMachineLearning = startMachineLearning;
  window.closeMachineLearningPopUp = closeMachineLearningPopUp;
}

export { initialiseMachineLearningPopUp as default };
