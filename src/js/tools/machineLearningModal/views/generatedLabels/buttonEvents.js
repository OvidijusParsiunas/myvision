import {
  updateGeneratedLabelsElementWidth, MLLabelTextPaste,
  displayHighlightedDefaultEditLabelButton, displayRedEditButtonIfActiveTextEmpty,
  displayGreyedDefaultEditLabelButton, changeRowToEdit, hideGeneratedLabelsViewAssets,
} from './style';
import {
  getGeneratedMachineLearningData, setActiveLabelProperties,
  stopEditingMLGeneratedLabelName, submitNewLabelNames,
} from './changeLabels';
import { drawShapesViaCoordinates } from '../../../../canvas/utils/drawShapesViaCoordinates/drawShapesViaCoordinates';

function MLLabelTextKeyDown(event) {
  if (event.key === 'Enter') {
    stopEditingMLGeneratedLabelName();
  } else {
    window.setTimeout(() => {
      updateGeneratedLabelsElementWidth();
      displayRedEditButtonIfActiveTextEmpty();
    }, 1);
  }
}

function submitMLGeneratedLabelNames(closeModalCallback) {
  submitNewLabelNames();
  const generatedMachineLearningData = getGeneratedMachineLearningData();
  drawShapesViaCoordinates(generatedMachineLearningData, true);
  closeModalCallback();
  hideGeneratedLabelsViewAssets();
}

function editMachineLearningLabelButtonClick(element) {
  setActiveLabelProperties(element);
  changeRowToEdit(element);
}

function registerButtonEventHandlers(closeModalCallback) {
  window.MLLabelTextKeyDown = MLLabelTextKeyDown;
  window.MLLabelTextPaste = MLLabelTextPaste;
  window.displayMachineLearningModalEditLabelButton = displayHighlightedDefaultEditLabelButton;
  window.hideMachineLearningModalEditLabelButton = displayGreyedDefaultEditLabelButton;
  window.editMachineLearningLabel = editMachineLearningLabelButtonClick;
  window.submitMLGeneratedLabels = submitMLGeneratedLabelNames.bind(this,
    closeModalCallback);
}

export { registerButtonEventHandlers as default };
