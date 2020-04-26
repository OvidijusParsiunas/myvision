import { createLabelShape, removeTargetShape, isLabelling } from './labellingProcess';
import { resetCanvasEventsToDefault } from '../toolkit/buttonClickEvents/facade';
import { getContinuousDrawingState, getLastDrawingModeState, setHasDrawnShapeState } from '../stateMachine';
import { resetDrawPolygonMode } from '../../canvas/objects/polygon/polygon';
import { resetDrawBoundingBoxMode } from '../../canvas/objects/boundingBox/boundingBox';
import { getLabelOptions } from '../labelList/labelOptions';
import { displayTickSVGOverImageThumbnail } from '../imageList/imageList';
import { preprocessPastedText, preprocessLabelText } from '../utils/textProcessingUtils';
import scrollIntoViewIfNeeded from '../utils/tableUtils';
import {
  hideLabellerModal, changeStyleWhenInputEmpty,
  changeStyleWhenInputInvalid, changeStyleToAllowSubmit,
} from './style';

let textInputElement = null;
let optionsElement = null;
let oneOrMoreLabelsAdded = false;
let currentlySelectedLabelOption = null;

function changeSubmitButtonStyling() {
  const prepocessedText = preprocessLabelText(textInputElement.value);
  if (prepocessedText === '') {
    changeStyleWhenInputEmpty();
  } else if (prepocessedText === 'new label') {
    changeStyleWhenInputInvalid();
  } else {
    changeStyleToAllowSubmit();
  }
}

function prepareLabellerModalElements() {
  textInputElement = document.getElementById('labeller-modal-input');
  optionsElement = document.getElementById('labeller-modal-options');
}

function resetDrawingMode() {
  if (!getContinuousDrawingState()) {
    resetCanvasEventsToDefault();
  } else if (getLastDrawingModeState() === 'polygon') {
    resetDrawPolygonMode();
  } else if (getLastDrawingModeState() === 'boundingBox') {
    resetDrawBoundingBoxMode();
  }
}

function labelShape() {
  const preprocessedText = preprocessLabelText(textInputElement.value);
  if (preprocessedText !== '') {
    createLabelShape();
    setHasDrawnShapeState(true);
    resetDrawingMode();
    displayTickSVGOverImageThumbnail();
    oneOrMoreLabelsAdded = true;
  }
}

function cancelLabellingProcess() {
  if (isLabelling()) {
    hideLabellerModal();
    removeTargetShape();
    resetDrawingMode();
  }
}

function selectLabelOption(text, element, color) {
  if (currentlySelectedLabelOption) {
    currentlySelectedLabelOption.id = '';
    currentlySelectedLabelOption.style.backgroundColor = '';
  }
  const { parentElement } = element.parentElement;
  parentElement.id = 'used';
  parentElement.style.backgroundColor = color;
  currentlySelectedLabelOption = parentElement;
  textInputElement.value = text;
  changeSubmitButtonStyling();
}

function setCaretPosition(caretPos) {
  textInputElement.value = textInputElement.value;
  if (textInputElement.createTextRange) {
    const range = textInputElement.createTextRange();
    range.move('character', caretPos);
    range.select();
    return true;
  }
  if (textInputElement.selectionStart || textInputElement.selectionStart === 0) {
    textInputElement.focus();
    textInputElement.setSelectionRange(caretPos, caretPos);
    return true;
  }
  textInputElement.focus();
  return false;
}

function getOptionsElementList() {
  if (!oneOrMoreLabelsAdded && optionsElement.childNodes[1]) {
    oneOrMoreLabelsAdded = true;
    return optionsElement.childNodes[1].childNodes;
  }
  return optionsElement.childNodes[0].childNodes;
}

// at the moment if the mouse hovers over an option, then the user types in that option
// and changes something again -> the highlight will disappear as the currentlySelectedLabelOption
// is blanked. The only way this can be prevented is adding a special indicator for when
// that element is being highlighted
function inputKeyDown(event) {
  if (event.key !== 'Enter') {
    window.setTimeout(() => {
      if (event.code === 'Space') {
        const initialCaretLocation = textInputElement.selectionStart;
        setCaretPosition(initialCaretLocation);
      }
      if (currentlySelectedLabelOption) {
        currentlySelectedLabelOption.style.backgroundColor = '';
        currentlySelectedLabelOption.id = '';
      }
      const optionsElementList = getOptionsElementList();
      for (let i = 0; i < optionsElementList.length; i += 1) {
        if (optionsElementList[i].childNodes[0].childNodes[0].childNodes[0].innerHTML
            === textInputElement.value) {
          [currentlySelectedLabelOption] = optionsElementList[i].childNodes;
          currentlySelectedLabelOption.style.backgroundColor = getLabelOptions()[i].color.label;
          currentlySelectedLabelOption.id = 'used';
          scrollIntoViewIfNeeded(currentlySelectedLabelOption, optionsElement);
          break;
        }
      }
      changeSubmitButtonStyling();
    }, 0);
  }
}

function pasteLabelText() {
  window.setTimeout(() => {
    const initialCaretLocation = textInputElement.selectionStart;
    textInputElement.value = preprocessPastedText(textInputElement.value);
    setCaretPosition(initialCaretLocation);
  }, 0);
}

export {
  labelShape, inputKeyDown, cancelLabellingProcess,
  selectLabelOption, prepareLabellerModalElements, pasteLabelText,
};
