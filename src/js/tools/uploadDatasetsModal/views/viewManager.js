import registerDescriptionViewButtonEventHandlers from './description/buttonEvents';
import { assignDescriptionViewLocalVariables, prepareDescriptionView, hideDescriptionViewAssets } from './description/style';
import registerUploadDatasetsViewButtonEventHandlers from './uploadDatasets/buttonEvents';
import { assignUploadDatasetsViewLocalVariables, prepareUploadDatasetsView, hideUploadDatasetsViewAssets } from './uploadDatasets/style';
import { dimWindow, lightUpWindow } from '../../dimWindow/dimWindowService';
import parseAllFiles from './uploadDatasets/fileParsers/sharedFileParser';
import updateCOCOJSONTables from './uploadDatasets/tableUpdaters/COCOJSONTableUpdaters';
import updateVGGJSONTables from './uploadDatasets/tableUpdaters/VGGJSONTableUpdaters';
import updateVOCXMLTables from './uploadDatasets/tableUpdaters/VOCXMLTableUpdaters';
import validateCOCOJSONFormat from './uploadDatasets/formatValidators/COCOJSONValidator';
import validateVGGJSONFormat from './uploadDatasets/formatValidators/VGGJSONValidator';
import validateVOCXMLFormat from './uploadDatasets/formatValidators/VOCXMLValidator';
import removeCOCOJSONFileHandler from './uploadDatasets/removeFileHandlers/COCOJSONRemoveFileHandler';
import removeVGGJSONFileHandler from './uploadDatasets/removeFileHandlers/VGGJSONRemoveFileHandler';
import removeVOCXMLFileHandler from './uploadDatasets/removeFileHandlers/VOCXMLRemoveFileHandler';
import { addFile as addCOCOJSONFile, clearDatasetObject as clearCOCOJSONDatasetObject } from './uploadDatasets/datasetObjectManagers/COCOJSONDatasetObjectManager';
import { addFile as addVGGJSONFile, clearDatasetObject as clearVGGJSONDatasetObject } from './uploadDatasets/datasetObjectManagers/VGGJSONDatasetObjectManager';
import { addFile as addVOCXMLFile, clearDatasetObject as clearVOCXMLDatasetObject } from './uploadDatasets/datasetObjectManagers/VOCXMLDatasetObjectManager';
import {
  setFileParser, setTableUpdater, setFormatValidator, setAddFile, addAlreadyUploadedImages,
} from './uploadDatasets/uploadDatasetFilesHandler';
import assembleFinalObjectFromCOCOJSON from './uploadDatasets/finalObjectAssemblers/COCOJSONFinalObjectAssembler';
import assembleFinalObjectFromVGGJSON from './uploadDatasets/finalObjectAssemblers/VGGJSONFinalObjectAssembler';
import { setFinalObjectAssembler } from './uploadDatasets/drawShapesAndImages';
import { getAllImageData } from '../../imageList/imageList';
import {
  COCO_JSON_FORMAT, VGG_JSON_FORMAT, VOC_XML_FORMAT, ACCEPT_XML_AND_IMG_FILES, XML_POSTFIX,
} from '../consts';
import {
  setFormatState,
  getFormatState,
  setReuseAlreadyUploadedImagesState,
  getReuseAlreadyUploadedImagesState,
} from './uploadDatasets/stateManager';

let currentViewNumber = 1;
let modalElement = null;
let hideViewOnCancelFunc = null;
let closeModalFunc = null;

function setUpdateDatasetFileHandlerFunctions() {
  switch (getFormatState()) {
    case COCO_JSON_FORMAT:
      setAddFile(addCOCOJSONFile);
      setFileParser(parseAllFiles);
      setTableUpdater(updateCOCOJSONTables);
      setFormatValidator(validateCOCOJSONFormat);
      setFinalObjectAssembler(assembleFinalObjectFromCOCOJSON);
      registerUploadDatasetsViewButtonEventHandlers(closeModalFunc, removeCOCOJSONFileHandler,
        clearCOCOJSONDatasetObject);
      break;
    case VGG_JSON_FORMAT:
      setAddFile(addVGGJSONFile);
      setFileParser(parseAllFiles);
      setTableUpdater(updateVGGJSONTables);
      setFormatValidator(validateVGGJSONFormat);
      setFinalObjectAssembler(assembleFinalObjectFromVGGJSON);
      registerUploadDatasetsViewButtonEventHandlers(closeModalFunc, removeVGGJSONFileHandler,
        clearVGGJSONDatasetObject);
      break;
    case VOC_XML_FORMAT:
      setAddFile(addVOCXMLFile);
      setFileParser(parseAllFiles);
      setTableUpdater(updateVOCXMLTables);
      setFormatValidator(validateVOCXMLFormat);
      setFinalObjectAssembler(assembleFinalObjectFromVGGJSON);
      registerUploadDatasetsViewButtonEventHandlers(closeModalFunc, removeVOCXMLFileHandler,
        clearVOCXMLDatasetObject);
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
      setFormatState(VOC_XML_FORMAT);
      setReuseAlreadyUploadedImagesState(true);
      prepareUploadDatasetsView(VOC_XML_FORMAT, ACCEPT_XML_AND_IMG_FILES, XML_POSTFIX);
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
  assignUploadDatasetsViewLocalVariables();
  displayNextView();
  window.cancelUploadDatasetsModal = closeModal;
  closeModalFunc = closeModal;
}

export { displayModal, initialiseUploadDatasetsModal };
