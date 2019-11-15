import { createLabelShape, removeTargetShape, isLabelling } from './labellingProcess';
import { resetCanvasEventsToDefault } from '../toolkit/buttonClickEvents/facade';
import { hideLabelPopUp } from './style';
import { getContinuousDrawingState, getLastDrawingModeState, setHasDrawnShapeState } from '../toolkit/buttonClickEvents/facadeWorkersUtils/stateManager';
import { resetDrawPolygonMode } from '../../canvas/objects/polygon/polygon';
import { resetDrawBoundingBoxMode } from '../../canvas/objects/boundingBox/boundingBox';
import { getLabelOptions } from '../labelList/labelOptions';

let textInputElement = null;
let submitButtonElement = null;
let popupLabelOptions = null;
let popupLabelOptionsIndex = 1;
let currentlySelectedLabelOption = null;

function changeSubmitButtonStyling() {
  if (textInputElement.value !== '' && textInputElement.value !== 'new label') {
    submitButtonElement.style.backgroundColor = 'rgb(205, 232, 205)';
  } else {
    submitButtonElement.style.backgroundColor = '';
  }
}

function prepareLabelPopupElements() {
  textInputElement = document.getElementById('popup-label-input');
  popupLabelOptions = document.getElementById('popup-label-options');
  submitButtonElement = document.getElementById('popup-submit-button');
}

function labelShape() {
  popupLabelOptionsIndex = 0;
  createLabelShape();
  setHasDrawnShapeState(true);
  if (!getContinuousDrawingState()) {
    resetCanvasEventsToDefault();
  } else if (getLastDrawingModeState() === 'polygon') {
    resetDrawPolygonMode();
  } else if (getLastDrawingModeState() === 'boundingBox') {
    resetDrawBoundingBoxMode();
  }
}

function cancelLabellingProcess() {
  if (isLabelling()) {
    hideLabelPopUp();
    removeTargetShape();
  }
}

function selectLabelOption(text, element) {
  if (currentlySelectedLabelOption) {
    currentlySelectedLabelOption.id = '';
    currentlySelectedLabelOption.style.backgroundColor = '';
  }
  element.id = 'used';
  currentlySelectedLabelOption = element;
  textInputElement.value = text;
  changeSubmitButtonStyling();
}

function inputKeyDown(event) {
  if (event.key === 'Enter') {
    labelShape();
  } else {
    window.setTimeout(() => {
      if (currentlySelectedLabelOption) {
        currentlySelectedLabelOption.style.backgroundColor = '';
        currentlySelectedLabelOption.id = '';
      }
      const popupLabelOptionsList = popupLabelOptions.childNodes[popupLabelOptionsIndex].childNodes;
      for (let i = 0; i < popupLabelOptionsList.length; i += 1) {
        if (popupLabelOptionsList[i].childNodes[0].childNodes[0].childNodes[0].innerHTML
            === textInputElement.value) {
          [currentlySelectedLabelOption] = popupLabelOptionsList[i].childNodes;
          currentlySelectedLabelOption.style.backgroundColor = getLabelOptions()[i].color.label;
          currentlySelectedLabelOption.id = 'used';
          currentlySelectedLabelOption.scrollIntoViewIfNeeded();
          break;
        }
      }
      changeSubmitButtonStyling();
    }, 0);
  }
}

export {
  labelShape, cancelLabellingProcess, inputKeyDown,
  selectLabelOption, prepareLabelPopupElements,
};
