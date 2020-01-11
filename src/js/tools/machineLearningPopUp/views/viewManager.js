import { displayChangeGeneratedLabelsView, assignChangeGeneratedLabelsViewLocalVariables } from './changeGeneratedLabelsView/style';
import { assignInitiateMachineLearningViewLocalVariables, hideInitiateMachineLearningViewAssets } from './initiateMachineLearning/style';
import { assignNoObjectsFoundViewLocalVariables, displayNoObjectsFoundView } from './noObjectsFound/style';
import registerInitiateMachineLearningViewButtonEventHandlers from './initiateMachineLearning/buttonEvents';
import registerChangeGeneratedLabelsViewButtonEventHandlers from './changeGeneratedLabelsView/buttonEvents';
import registerNoObjectsFoundViewButtonEventHandlers from './noObjectsFound/buttonEvents';

let currentViewNumber = 1;
let machineLearningData = {};

function hideMachineLearningPopUp() {
  // dim
  // prepare initial view
}

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
      // call coordinates
      // displaythirdview
      currentViewNumber += 1;
      break;
    default:
      break;
  }
}

function displayMachineLearningPopUp() {
  displayNextView();
}

function closePopUp() {
  console.log('closing popup action');
}

function initialiseMachineLearningPopUp() {
  displayNextView();
  // no new names generated view
  registerInitiateMachineLearningViewButtonEventHandlers(displayNextView, setMachineLearningData);
  assignInitiateMachineLearningViewLocalVariables();
  registerChangeGeneratedLabelsViewButtonEventHandlers(displayNextView, setMachineLearningData);
  assignChangeGeneratedLabelsViewLocalVariables();
  registerNoObjectsFoundViewButtonEventHandlers(closePopUp);
  assignNoObjectsFoundViewLocalVariables();
}

export { displayMachineLearningPopUp, hideMachineLearningPopUp, initialiseMachineLearningPopUp };
