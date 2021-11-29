import {
  emptyDivFirefoxBugFix, changeRowToEdit, MLLabelTextPaste,
  updateGeneratedLabelsElementWidth, hideGeneratedLabelsViewAssets,
  displayGreyedDefaultEditLabelButton, scrollHorizontallyToAppropriateWidth,
  displayHighlightedDefaultEditLabelButton, displayRedEditButtonIfActiveTextEmpty,
} from './style.js';
import {
  getGeneratedMachineLearningData, setActiveLabelProperties,
  stopEditingMLGeneratedLabelName, submitNewLabelNames,
} from './changeLabels.js';
import { drawShapesViaCoordinates } from '../../../../canvas/utils/drawShapesViaCoordinates/drawShapesViaCoordinates.js';

function MLLabelTextKeyDown(event) {
  if (event.key === 'Enter') {
    stopEditingMLGeneratedLabelName();
    scrollHorizontallyToAppropriateWidth('');
  } else {
    window.setTimeout(() => {
      updateGeneratedLabelsElementWidth();
      emptyDivFirefoxBugFix(event.key);
      displayRedEditButtonIfActiveTextEmpty();
    }, 1);
  }
}

function submitMLGeneratedLabelNames(closeModalCallback) {
  submitNewLabelNames();
  const generatedMachineLearningData = getGeneratedMachineLearningData();
  drawShapesViaCoordinates(generatedMachineLearningData, true);
  closeModalCallback(false);
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
  window.submitMLGeneratedLabels = submitMLGeneratedLabelNames.bind(this, closeModalCallback);
}

export { registerButtonEventHandlers as default };
