import registerDescriptionViewButtonEventHandlers from './description/buttonEvents';
import { assignDescriptionViewLocalVariables, prepareDescriptionView, hideDescriptionViewAssets } from './description/style';
import registerUploadDatasetsViewButtonEventHandlers from './uploadDatasets/buttonEvents';
import { assignUploadDatasetsViewLocalVariables, prepareUploadDatasetsView, hideUploadDatasetsViewAssets } from './uploadDatasets/style';
import { dimWindow, lightUpWindow } from '../../dimWindow/dimWindowService';
import parseAllFiles from './uploadDatasets/fileParsers/sharedFileParser';
import updateCOCOJSONTables from './uploadDatasets/tableUpdaters/COCOJSONTableUpdaters';
import validateCOCOJSONFormat from './uploadDatasets/formatValidators/COCOJSONValidator';
import validateVGGJSONFormat from './uploadDatasets/formatValidators/VGGJSONValidator';
import { addFile as addCOCOJSONFile } from './uploadDatasets/datasetObjectManagers/COCOJSONDatasetObjectManager';
import { addFile as addVGGJSONFile } from './uploadDatasets/datasetObjectManagers/VGGJSONDatasetObjectManager';
import {
  setFileParser, setTableUpdater, setFormatValidator, setAddFile, addAlreadyUploadedImages,
} from './uploadDatasets/uploadDatasetFilesHandler';
import assembleFinalObjectFromCOCOJSON from './uploadDatasets/finalObjectAssemblers/COCOJSONFinalObjectAssembler';
import { setFinalObjectAssembler } from './uploadDatasets/drawShapesAndImages';
import { getAllImageData } from '../../imageList/imageList';
import { COCO_JSON_FORMAT, VGG_JSON_FORMAT } from '../consts';
import {
  setFormatState,
  getFormatState,
  setReuseAlreadyUploadedImagesState,
  getReuseAlreadyUploadedImagesState,
} from './uploadDatasets/stateManager';

let currentViewNumber = 1;
let modalElement = null;
let hideViewOnCancelFunc = null;

function setUpdateDatasetFileHandlerFunctions() {
  switch (getFormatState()) {
    case COCO_JSON_FORMAT:
      setAddFile(addCOCOJSONFile);
      setFileParser(parseAllFiles);
      setTableUpdater(updateCOCOJSONTables);
      setFormatValidator(validateCOCOJSONFormat);
      setFinalObjectAssembler(assembleFinalObjectFromCOCOJSON);
      break;
    case VGG_JSON_FORMAT:
      setAddFile(addVGGJSONFile);
      setFileParser(parseAllFiles);
      setTableUpdater(updateCOCOJSONTables);
      setFormatValidator(validateVGGJSONFormat);
      setFinalObjectAssembler(assembleFinalObjectFromCOCOJSON);
      break;
    default:
      break;
  }
}

function displayNextView() {
  switch (currentViewNumber) {
    case 1:
      prepareDescriptionView();
      hideViewOnCancelFunc = hideDescriptionViewAssets;
      // jumping to upload datasets
      currentViewNumber += 2;
      break;
    case 2:
      currentViewNumber += 1;
      break;
    case 3:
      // will be done in previous view in future
      setFormatState(VGG_JSON_FORMAT);
      setReuseAlreadyUploadedImagesState(true);
      prepareUploadDatasetsView(VGG_JSON_FORMAT);
      setUpdateDatasetFileHandlerFunctions();
      if (getReuseAlreadyUploadedImagesState()) {
        addAlreadyUploadedImages(getAllImageData());
      }
      hideViewOnCancelFunc = hideUploadDatasetsViewAssets;
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
  hideViewOnCancelFunc();
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
  registerUploadDatasetsViewButtonEventHandlers(closeModal);
  assignUploadDatasetsViewLocalVariables();
  displayNextView();
  window.cancelUploadDatasetsModal = closeModal;
}

export { displayModal, initialiseUploadDatasetsModal };
