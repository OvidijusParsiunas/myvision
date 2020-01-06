import { displayChangeGeneratedLabelsView, assignChangeGeneratedLabelsViewLocalVariables } from './changeGeneratedLabelsView/style';
import { assignInitiateMachineLearningViewLocalVariables } from './initiateMachineLearning/style';
import registerInitiateMachineLearningViewButtonEventHandlers from './initiateMachineLearning/buttonEvents';
import registerChangeGeneratedLabelsViewButtonEventHandlers from './changeGeneratedLabelsView/buttonEvents';

let currentViewNumber = 1;
let machineLearningData = {};

function hideMachineLearningPopUp() {
  // dim
  // prepare initial view
}

function setMachineLearningData(machineLearningDataArg) {
  machineLearningData = machineLearningDataArg;
}

function displayNextView() {
  switch (currentViewNumber) {
    case 1:
      // display initial view
      // prepareInstantiateMachineLearningView();
      currentViewNumber += 1;
      break;
    case 2:
      displayChangeGeneratedLabelsView(machineLearningData);
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

function initialiseMachineLearningPopUp() {
  displayNextView();
  registerInitiateMachineLearningViewButtonEventHandlers(displayNextView, setMachineLearningData);
  assignInitiateMachineLearningViewLocalVariables();
  registerChangeGeneratedLabelsViewButtonEventHandlers(displayNextView);
  assignChangeGeneratedLabelsViewLocalVariables();
}

export { displayMachineLearningPopUp, hideMachineLearningPopUp, initialiseMachineLearningPopUp };
