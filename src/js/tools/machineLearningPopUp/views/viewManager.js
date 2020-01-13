import {
  assignInitiateMachineLearningViewLocalVariables,
  hideInitiateMachineLearningViewAssets,
  prepareInstantiateMachineLearningView,
} from './initiateMachineLearning/style';
import { assignGeneratedLabelsViewLocalVariables } from './generatedLabels/style';
import { displayGeneratedLabelsView } from './generatedLabels/changeLabels';
import { assignNoObjectsFoundViewLocalVariables, displayNoObjectsFoundView } from './noObjectsFound/style';
import registerInitiateMachineLearningViewButtonEventHandlers from './initiateMachineLearning/buttonEvents';
import registerGeneratedLabelsViewButtonEventHandlers from './generatedLabels/buttonEvents';
import registerNoObjectsFoundViewButtonEventHandlers from './noObjectsFound/buttonEvents';
import { dimWindow, lightUpWindow } from '../../dimWindow/dimWindowService';

let currentViewNumber = 1;
let machineLearningData = {};
let popupElement = null;

function setMachineLearningData(machineLearningDataArg) {
  machineLearningData = machineLearningDataArg;
}

function isObjectEmpty(object) {
  return Object.keys(object).length === 0 && object.constructor === Object;
}

// the following architecture was prepared for more views
function displayNextView() {
  switch (currentViewNumber) {
    case 1:
      prepareInstantiateMachineLearningView();
      currentViewNumber += 1;
      break;
    case 2:
      hideInitiateMachineLearningViewAssets();
      if (isObjectEmpty(machineLearningData)) {
        displayNoObjectsFoundView(machineLearningData);
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

function displayPopUp() {
  popupElement.style.display = '';
  dimWindow(0.5);
}

function closePopUp() {
  popupElement.style.display = 'none';
  lightUpWindow();
  currentViewNumber = 1;
  displayNextView();
}

function assignViewManagerLocalVariables() {
  popupElement = document.getElementById('machine-learning-popup-parent');
}

function initialiseMachineLearningPopUp() {
  assignViewManagerLocalVariables();
  registerInitiateMachineLearningViewButtonEventHandlers(displayNextView,
    setMachineLearningData, closePopUp);
  assignInitiateMachineLearningViewLocalVariables();
  registerGeneratedLabelsViewButtonEventHandlers(closePopUp);
  assignGeneratedLabelsViewLocalVariables();
  registerNoObjectsFoundViewButtonEventHandlers(closePopUp);
  assignNoObjectsFoundViewLocalVariables();
  displayNextView();
}

export { displayPopUp, initialiseMachineLearningPopUp };
