import { displayChangeGeneratedLabelsView, assignChangeGeneratedLabelsViewLocalVariables } from './changeGeneratedLabelsView/style';
import { assignInitiateMachineLearningViewLocalVariables, hideInitiateMachineLearningViewAssets } from './initiateMachineLearning/style';
import { assignNoObjectsFoundViewLocalVariables, displayNoObjectsFoundView } from './noObjectsFound/style';
import registerInitiateMachineLearningViewButtonEventHandlers from './initiateMachineLearning/buttonEvents';
import registerChangeGeneratedLabelsViewButtonEventHandlers from './changeGeneratedLabelsView/buttonEvents';
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

function displayNextView() {
  switch (currentViewNumber) {
    case 1:
      // display initial view
      // prepareInstantiateMachineLearningView();
      currentViewNumber += 1;
      break;
    case 2:
      hideInitiateMachineLearningViewAssets();
      if (isObjectEmpty(machineLearningData)) {
        displayNoObjectsFoundView(machineLearningData);
      } else {
        displayChangeGeneratedLabelsView(machineLearningData);
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

function displayMachineLearningPopUp() {
  console.log('called');
}

function closePopUp() {
  popupElement.style.display = 'none';
  lightUpWindow();
}

function assignViewManagerLocalVariables() {
  popupElement = document.getElementById('machine-learning-popup-parent');
}

function initialiseMachineLearningPopUp() {
  setTimeout(() => {
    dimWindow(0.5);
  }, 5000);
  displayNextView();
  assignViewManagerLocalVariables();
  registerInitiateMachineLearningViewButtonEventHandlers(displayNextView,
    setMachineLearningData, closePopUp);
  assignInitiateMachineLearningViewLocalVariables();
  registerChangeGeneratedLabelsViewButtonEventHandlers(closePopUp);
  assignChangeGeneratedLabelsViewLocalVariables();
  registerNoObjectsFoundViewButtonEventHandlers(closePopUp);
  assignNoObjectsFoundViewLocalVariables();
}

export { displayMachineLearningPopUp, initialiseMachineLearningPopUp };
