import { displayChangeGeneratedLabelsView, assignChangeGeneratedLabelsViewLocalVariables } from './changeGeneratedLabelsView/style';
import { assignInitiateMachineLearningViewLocalVariables } from './initiateMachineLearning/style';
import registerInitiateMachineLearningViewButtonEventHandlers from './initiateMachineLearning/buttonEvents';
import registerChangeGeneratedLabelsViewButtonEventHandlers from './changeGeneratedLabelsView/buttonEvents';

let currentViewNumber = 1;

function hideMachineLearningPopUp() {
  // dim
  // prepare initial view
}

function nextView() {
  switch (currentViewNumber) {
    case 1:
      // display initial view
      // prepareInstantiateMachineLearningView();
      currentViewNumber += 1;
      break;
    case 2:
      displayChangeGeneratedLabelsView();
      currentViewNumber += 1;
      break;
    case 3:
      // displaythirdview
      currentViewNumber += 1;
      break;
    default:
      break;
  }
}

function displayMachineLearningPopUp() {
  nextView();
}

function initialiseMachineLearningPopUp() {
  nextView();
  registerInitiateMachineLearningViewButtonEventHandlers(nextView);
  assignInitiateMachineLearningViewLocalVariables();
  registerChangeGeneratedLabelsViewButtonEventHandlers(nextView);
  assignChangeGeneratedLabelsViewLocalVariables();
}

export { displayMachineLearningPopUp, hideMachineLearningPopUp, initialiseMachineLearningPopUp };
