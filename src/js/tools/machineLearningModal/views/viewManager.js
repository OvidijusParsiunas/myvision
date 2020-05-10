import { assignInitiateMachineLearningViewLocalVariables, prepareInstantiateMachineLearningView } from './initiateMachineLearning/style';
import { assignGeneratedLabelsViewLocalVariables } from './generatedLabels/style';
import { displayGeneratedLabelsView } from './generatedLabels/changeLabels';
import { assignNoObjectsFoundViewLocalVariables, displayNoObjectsFoundView } from './noObjectsFound/style';
import registerInitiateMachineLearningViewButtonEventHandlers from './initiateMachineLearning/buttonEvents';
import registerGeneratedLabelsViewButtonEventHandlers from './generatedLabels/buttonEvents';
import registerNoObjectsFoundViewButtonEventHandlers from './noObjectsFound/buttonEvents';
import { dimWindow, lightUpWindow } from '../../dimWindow/dimWindowService';
import { SLOW_LIGHTUP_MILLISECONDS, SLOW_DIM_SECONDS, THICK_DIM } from '../../dimWindow/consts';
import { getContinuousDrawingState, getLastDrawingModeState } from '../../stateMachine';
import { setCreatePolygonButtonToActive, setCreateBoundingBoxButtonToActive } from '../../toolkit/styling/stateMachine';

let currentViewNumber = 1;
let machineLearningData = {};
let modalElement = null;

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

// the following architecture was originally prepared for more views
function displayNextView() {
  switch (currentViewNumber) {
    case 1:
      prepareInstantiateMachineLearningView();
      currentViewNumber += 1;
      break;
    case 2:
      if (isMachineLearningObjectEmpty()) {
        displayNoObjectsFoundView();
      } else {
        displayGeneratedLabelsView(machineLearningData);
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
  }, 60);
  dimWindow(SLOW_DIM_SECONDS, THICK_DIM);
}

function resetContinuousShapeButtons() {
  if (getContinuousDrawingState()) {
    if (getLastDrawingModeState() === 'polygon') {
      setCreatePolygonButtonToActive();
    } else if (getLastDrawingModeState() === 'boundingBox') {
      setCreateBoundingBoxButtonToActive();
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

export { displayModal, initialiseMachineLearningModal };
