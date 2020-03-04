// import { assignInitiateMachineLearningViewLocalVariables, prepareInstantiateMachineLearningView } from './initiateMachineLearning/style';
// import { assignGeneratedLabelsViewLocalVariables } from './generatedLabels/style';
// import { displayGeneratedLabelsView } from './generatedLabels/changeLabels';
// import { assignNoObjectsFoundViewLocalVariables, displayNoObjectsFoundView } from './noObjectsFound/style';
// import registerInitiateMachineLearningViewButtonEventHandlers from './initiateMachineLearning/buttonEvents';
// import registerGeneratedLabelsViewButtonEventHandlers from './generatedLabels/buttonEvents';
import registerDescriptionViewButtonEventHandlers from './description/buttonEvents';
import { assignDescriptionViewLocalVariables, prepareDescriptionView, hideDescriptionViewAssets } from './description/style';
import registerUploadDatasetsViewButtonEventHandlers from './uploadDatasets/buttonEvents';
import { assignUploadDatasetsViewLocalVariables, prepareUploadDatasetsView, hideUploadDatasetsViewAssets } from './uploadDatasets/style';
import { dimWindow, lightUpWindow } from '../../dimWindow/dimWindowService';

let currentViewNumber = 1;
// let machineLearningData = {};
let modalElement = null;
let hideViewFunc = null;

// function setMachineLearningData(machineLearningDataArg) {
//   machineLearningData = machineLearningDataArg;
// }

// function isMachineLearningObjectEmpty() {
//   if (Object.keys(machineLearningData).length === 0 && machineLearningData.constructor === Object) {
//     return true;
//   }
//   let isEmpty = true;
//   Object.keys(machineLearningData).forEach((key) => {
//     if (machineLearningData[key].length > 0) {
//       isEmpty = false;
//     }
//   });
//   return isEmpty;
// }

// the following architecture was originally prepared for more views
function displayNextView() {
  switch (currentViewNumber) {
    case 1:
      prepareDescriptionView();
      hideViewFunc = hideDescriptionViewAssets;
      // jumping to upload datasets
      currentViewNumber += 2;
      break;
    case 2:
      // if (isMachineLearningObjectEmpty()) {
      // displayNoObjectsFoundView();
      // } else {
      // displayGeneratedLabelsView(machineLearningData);
      // }
      currentViewNumber += 1;
      break;
    case 3:
      prepareUploadDatasetsView();
      hideViewFunc = hideUploadDatasetsViewAssets;
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
  dimWindow(0.5);
}

function closeModal() {
  modalElement.style.display = 'none';
  lightUpWindow();
  hideViewFunc();
  currentViewNumber = 1;
  displayNextView();
}

function assignViewManagerLocalVariables() {
  modalElement = document.getElementById('upload-datasets-modal-parent');
}

function initialiseUploadDatasetsModal() {
  assignViewManagerLocalVariables();
  registerDescriptionViewButtonEventHandlers(displayNextView);
  assignDescriptionViewLocalVariables();
  registerUploadDatasetsViewButtonEventHandlers(displayNextView);
  assignUploadDatasetsViewLocalVariables();
  displayNextView();
  window.cancelUploadDatasetsModal = closeModal;
}

export { displayModal, initialiseUploadDatasetsModal };
