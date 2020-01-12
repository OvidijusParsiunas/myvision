import {
  postProcessSpacesInTextElement, updateGeneratedLabelsElementWidth, MLLabelTextPaste,
  displayHighlightedDefaultEditLabelButton, displayRedEditButtonIfActiveTextEmpty,
  displayGreyedDefaultEditLabelButton, editMachineLearningLabel, stopEditingActiveTextElement,
  getGeneratedUniqueLabelNames, getUniqueLabelPair, getGeneratedMachineLearningData,
} from './style';
import { setChangingMLGeneratedLabelNamesState } from '../../../toolkit/buttonClickEvents/facadeWorkersUtils/stateManager';
import { getAllExistingShapes } from '../../../../canvas/objects/allShapes/allShapes';
import { drawShapesViaCoordinates } from '../../../toolkit/buttonClickEvents/facadeWorkersUtils/drawShapesViaCoordinates/drawShapesViaCoordinates';

function MLLabelTextKeyDown(event) {
  if (event.key === 'Enter') {
    stopEditingActiveTextElement();
  } else {
    window.setTimeout(() => {
      if (event.code === 'Space') { postProcessSpacesInTextElement(); }
      updateGeneratedLabelsElementWidth();
      displayRedEditButtonIfActiveTextEmpty();
    }, 1);
  }
}

function submitMLGeneratedLabelNames(closePopUpCallback) {
  drawShapesViaCoordinates(getGeneratedMachineLearningData(), true);
  const allShapes = getAllExistingShapes();
  Object.keys(allShapes).forEach((key) => {
    const { shapeRef } = allShapes[key];
    if (shapeRef.isGeneratedViaML) {
      console.log('called');
    }
  });
  setChangingMLGeneratedLabelNamesState(false);
  closePopUpCallback();
}

// function next() {
//   const labelsObject = getLabelsObject()
//   setMachineLearningData(labelsObject);
//   nextViewCallback();
// }

function registerButtonEventHandlers(closePopUpCallback) {
  // should be generatedLabelsEditView

  // need to send back the object so could start populating
  // window.next = nextViewCallback;
  window.MLLabelTextKeyDown = MLLabelTextKeyDown;
  window.MLLabelTextPaste = MLLabelTextPaste;
  window.displayMachineLearningPopUpEditLabelButton = displayHighlightedDefaultEditLabelButton;
  window.hideMachineLearningPopUpEditLabelButton = displayGreyedDefaultEditLabelButton;
  window.editMachineLearningLabel = editMachineLearningLabel;
  window.submitMLGeneratedLabels = submitMLGeneratedLabelNames.bind(this,
    closePopUpCallback);
}

export { registerButtonEventHandlers as default };
