import { assignInitiateMachineLearningViewLocalVariables, prepareInstantiateMachineLearningView, hideInitiateMachineLearningViewAssets } from './initiateMachineLearning/style';
import { assignGeneratedLabelsViewLocalVariables, hideGeneratedLabelsViewAssets } from './generatedLabels/style';
import { displayGeneratedLabelsView } from './generatedLabels/changeLabels';
import { assignNoObjectsFoundViewLocalVariables, displayNoObjectsFoundView, hideNoObjectsFoundViewAssets } from './noObjectsFound/style';
import registerInitiateMachineLearningViewButtonEventHandlers from './initiateMachineLearning/buttonEvents';
import { getProgressStatus, cancelMachineLearning } from './initiateMachineLearning/machineLearning';
import registerGeneratedLabelsViewButtonEventHandlers from './generatedLabels/buttonEvents';
import registerNoObjectsFoundViewButtonEventHandlers from './noObjectsFound/buttonEvents';
import { dimWindow, lightUpWindow } from '../../dimWindow/dimWindowService';
import { SLOW_LIGHTUP_MILLISECONDS, SLOW_DIM_SECONDS, THICK_DIM } from '../../dimWindow/consts';
import { getContinuousDrawingState, getLastDrawingModeState, setMachineLearningModalDisplayedState } from '../../state';
import { removeTempShapes, removeImageThumbnails, resetCursor } from '../../../canvas/utils/drawShapesViaCoordinates/drawShapesViaCoordinates';

let currentViewNumber = 1;
let machineLearningData = {};
let modalElement = null;
let closeModalFunc = null;

function setMachineLearningData(machineLearningDataArg) {
  machineLearningData = machineLearningDataArg;
}

function isMachineLearningObjectEmpty() {
  if (Object.keys(machineLearningData).length === 0 && machineLearningData.constructor === Object) {
    return true;
  }
  let isEmpty = true;
  Object.keys(machineLearningData).forEach((key) => {
    if (machineLearningData[key].length > 0) {
      isEmpty = false;
    }
  });
  return isEmpty;
}

function displayNextView() {
  switch (currentViewNumber) {
    case 1:
      prepareInstantiateMachineLearningView();
      closeModalFunc = () => {
        if (getProgressStatus()) {
          cancelMachineLearning();
          return false;
        }
        hideInitiateMachineLearningViewAssets();
        resetCursor();
        removeTempShapes();
        removeImageThumbnails();
        return true;
      };
      currentViewNumber += 1;
      break;
    case 2:
      if (isMachineLearningObjectEmpty()) {
        displayNoObjectsFoundView();
        closeModalFunc = () => {
          resetCursor();
          hideNoObjectsFoundViewAssets();
          return true;
        };
      } else {
        displayGeneratedLabelsView(machineLearningData);
        closeModalFunc = () => {
          resetCursor();
          removeTempShapes();
          removeImageThumbnails();
          hideGeneratedLabelsViewAssets();
          return true;
        };
      }
      currentViewNumber += 1;
      break;
    case 3:
      currentViewNumber += 1;
      break;
    default:
      break;
  }
}

function displayModal() {
  setTimeout(() => {
    modalElement.style.display = '';
    setMachineLearningModalDisplayedState(true);
  }, 60);
  dimWindow(SLOW_DIM_SECONDS, THICK_DIM);
}

// need to use window functions because when the escape button is clicked after
// the temp shapes have been drawn, the existing shapes are still selecatble
function resetContinuousShapeButtons() {
  if (getContinuousDrawingState()) {
    if (getLastDrawingModeState() === 'polygon') {
      window.createNewPolygon();
    } else if (getLastDrawingModeState() === 'boundingBox') {
      window.createNewBndBox();
    }
  }
}

function setButtons(isCancel) {
  if (isCancel) {
    resetContinuousShapeButtons();
  } else {
    window.editShapes();
  }
}

function closeModal(isCancel) {
  setButtons(isCancel);
  modalElement.style.display = 'none';
  lightUpWindow(SLOW_LIGHTUP_MILLISECONDS);
  currentViewNumber = 1;
  displayNextView();
  setMachineLearningModalDisplayedState(false);
}

function closeModalViaKeyboard() {
  const shouldCloseModal = closeModalFunc();
  if (shouldCloseModal) {
    closeModal(true);
  } else {
    currentViewNumber = 1;
    displayNextView();
  }
}

function assignViewManagerLocalVariables() {
  modalElement = document.getElementById('machine-learning-modal-parent');
}

function initialiseMachineLearningModal() {
  assignViewManagerLocalVariables();
  registerInitiateMachineLearningViewButtonEventHandlers(displayNextView,
    setMachineLearningData, closeModal);
  assignInitiateMachineLearningViewLocalVariables();
  registerGeneratedLabelsViewButtonEventHandlers(closeModal);
  assignGeneratedLabelsViewLocalVariables();
  registerNoObjectsFoundViewButtonEventHandlers(closeModal);
  assignNoObjectsFoundViewLocalVariables();
  displayNextView();
}

export { displayModal, initialiseMachineLearningModal, closeModalViaKeyboard };
