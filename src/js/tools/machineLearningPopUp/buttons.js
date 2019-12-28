import {
  closeMachineLearningPopUp, displayEditLabelButton,
  hideEditLabelButton, editMachineLearningLabel,
} from './style';
import startMachineLearning from './buttonEventHandlers';

// will be handled by eventHandlers later on for more functionality
function initialiseMachineLearningPopUp() {
  window.startMachineLearning = startMachineLearning;
  window.closeMachineLearningPopUp = closeMachineLearningPopUp;
  window.displayMachineLearningPopUpEditLabelButton = displayEditLabelButton;
  window.hideMachineLearningPopUpEditLabelButton = hideEditLabelButton;
  window.editMachineLearningLabel = editMachineLearningLabel;
}

export { initialiseMachineLearningPopUp as default };
