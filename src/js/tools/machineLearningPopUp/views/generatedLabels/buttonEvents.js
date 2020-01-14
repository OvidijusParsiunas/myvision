import {
  updateGeneratedLabelsElementWidth, MLLabelTextPaste,
  displayHighlightedDefaultEditLabelButton, displayRedEditButtonIfActiveTextEmpty,
  displayGreyedDefaultEditLabelButton, changeRowToEdit, hideGeneratedLabelsViewAssets,
} from './style';
import {
  getGeneratedMachineLearningData, setActiveLabelProperties,
  stopEditingMLGeneratedLabelName, submitNewLabelNames,
} from './changeLabels';
import { drawShapesViaCoordinates } from '../../../toolkit/buttonClickEvents/facadeWorkersUtils/drawShapesViaCoordinates/drawShapesViaCoordinates';

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

function submitMLGeneratedLabelNames(closePopUpCallback) {
  submitNewLabelNames();
  const generatedMachineLearningData = getGeneratedMachineLearningData();
  drawShapesViaCoordinates(generatedMachineLearningData, true);
  closePopUpCallback();
  hideGeneratedLabelsViewAssets();
}

function editMachineLearningLabelButtonClick(element) {
  setActiveLabelProperties(element);
  changeRowToEdit(element);
}

function registerButtonEventHandlers(closePopUpCallback) {
  window.MLLabelTextKeyDown = MLLabelTextKeyDown;
  window.MLLabelTextPaste = MLLabelTextPaste;
  window.displayMachineLearningPopUpEditLabelButton = displayHighlightedDefaultEditLabelButton;
  window.hideMachineLearningPopUpEditLabelButton = displayGreyedDefaultEditLabelButton;
  window.editMachineLearningLabel = editMachineLearningLabelButtonClick;
  window.submitMLGeneratedLabels = submitMLGeneratedLabelNames.bind(this,
    closePopUpCallback);
}

export { registerButtonEventHandlers as default };
