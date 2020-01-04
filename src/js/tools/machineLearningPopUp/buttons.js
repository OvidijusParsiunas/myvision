import { closeMachineLearningPopUp } from './style';
import startMachineLearning from './buttonEventHandlers';
import { displayHighlightedDefaultEditLabelButton, editMachineLearningLabel, displayGreyedDefaultEditLabelButton } from './changeGeneratedLabelsView';

// will be handled by eventHandlers later on for more functionality
function initialiseMachineLearningPopUp() {
  window.startMachineLearning = startMachineLearning;
  window.closeMachineLearningPopUp = closeMachineLearningPopUp;
  window.displayMachineLearningPopUpEditLabelButton = displayHighlightedDefaultEditLabelButton;
  window.hideMachineLearningPopUpEditLabelButton = displayGreyedDefaultEditLabelButton;
  window.editMachineLearningLabel = editMachineLearningLabel;
}

export { initialiseMachineLearningPopUp as default };
