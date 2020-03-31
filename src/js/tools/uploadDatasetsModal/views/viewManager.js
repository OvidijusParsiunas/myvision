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
import validateYOLOTXTFormat from './uploadDatasets/formatValidators/YOLOTXTValidator';
import removeCOCOJSONFileHandler from './uploadDatasets/removeFileHandlers/COCOJSONRemoveFileHandler';
import removeVGGJSONFileHandler from './uploadDatasets/removeFileHandlers/VGGJSONRemoveFileHandler';
import removeVOCXMLFileHandler from './uploadDatasets/removeFileHandlers/VOCXMLRemoveFileHandler';
import { addFile as addCOCOJSONFile, clearDatasetObject as clearCOCOJSONDatasetObject } from './uploadDatasets/datasetObjectManagers/COCOJSONDatasetObjectManager';
import { addFile as addVGGJSONFile, clearDatasetObject as clearVGGJSONDatasetObject } from './uploadDatasets/datasetObjectManagers/VGGJSONDatasetObjectManager';
import { addFile as addVOCXMLFile, clearDatasetObject as clearVOCXMLDatasetObject } from './uploadDatasets/datasetObjectManagers/VOCXMLDatasetObjectManager';
import { addFile as addYOLOTXTFile, clearDatasetObject as clearYOLOTXTDatasetObject } from './uploadDatasets/datasetObjectManagers/YOLOTXTDatasetObjectManager';
import {
  setFileParser, setTableUpdater, setFormatValidator, setAddFile, addAlreadyUploadedImages,
} from './uploadDatasets/uploadDatasetFilesHandler';
import assembleFinalObjectFromCOCOJSON from './uploadDatasets/finalObjectAssemblers/COCOJSONFinalObjectAssembler';
import assembleFinalObjectFromVGGJSON from './uploadDatasets/finalObjectAssemblers/VGGJSONFinalObjectAssembler';
import assembleFinalObjectFromVOCXML from './uploadDatasets/finalObjectAssemblers/VOCXMLFinalObjectAssembler';
import { setFinalObjectAssembler } from './uploadDatasets/drawShapesAndImages';
import { getAllImageData } from '../../imageList/imageList';
import {
  COCO_JSON_FORMAT, VGG_JSON_FORMAT, VOC_XML_FORMAT,
  ACCEPT_JSON_AND_IMG_FILES, ACCEPT_XML_AND_IMG_FILES,
  XML_POSTFIX, JSON_POSTFIX, YOLO_TXT_FORMAT,
  ACCEPT_TXT_AND_IMG_FILES, TXT_POSTFIX,
  TWO_TABLE_STRATEGY, THREE_TABLE_STRATEGY,
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

function prepareChosenFormatFunctionality() {
  switch (getFormatState()) {
    case COCO_JSON_FORMAT:
      setAddFile(addCOCOJSONFile);
      setFileParser(parseAllFiles);
      setTableUpdater(updateCOCOJSONTables);
      setFormatValidator(validateCOCOJSONFormat);
      setFinalObjectAssembler(assembleFinalObjectFromCOCOJSON);
      registerUploadDatasetsViewButtonEventHandlers(closeModalFunc, removeCOCOJSONFileHandler,
        clearCOCOJSONDatasetObject);
      prepareUploadDatasetsView(COCO_JSON_FORMAT, ACCEPT_JSON_AND_IMG_FILES, JSON_POSTFIX,
        TWO_TABLE_STRATEGY);
      break;
    case VGG_JSON_FORMAT:
      setAddFile(addVGGJSONFile);
      setFileParser(parseAllFiles);
      setTableUpdater(updateVGGJSONTables);
      setFormatValidator(validateVGGJSONFormat);
      setFinalObjectAssembler(assembleFinalObjectFromVGGJSON);
      registerUploadDatasetsViewButtonEventHandlers(closeModalFunc, removeVGGJSONFileHandler,
        clearVGGJSONDatasetObject);
      prepareUploadDatasetsView(VGG_JSON_FORMAT, ACCEPT_JSON_AND_IMG_FILES, JSON_POSTFIX,
        TWO_TABLE_STRATEGY);
      break;
    case VOC_XML_FORMAT:
      setAddFile(addVOCXMLFile);
      setFileParser(parseAllFiles);
      setTableUpdater(updateVOCXMLTables);
      setFormatValidator(validateVOCXMLFormat);
      setFinalObjectAssembler(assembleFinalObjectFromVOCXML);
      registerUploadDatasetsViewButtonEventHandlers(closeModalFunc, removeVOCXMLFileHandler,
        clearVOCXMLDatasetObject);
      prepareUploadDatasetsView(VOC_XML_FORMAT, ACCEPT_XML_AND_IMG_FILES, XML_POSTFIX,
        TWO_TABLE_STRATEGY);
      break;
    case YOLO_TXT_FORMAT:
      setAddFile(addYOLOTXTFile);
      setFileParser(parseAllFiles);
      setTableUpdater(updateVOCXMLTables);
      setFormatValidator(validateYOLOTXTFormat);
      setFinalObjectAssembler(assembleFinalObjectFromVOCXML);
      registerUploadDatasetsViewButtonEventHandlers(closeModalFunc, removeVOCXMLFileHandler,
        clearYOLOTXTDatasetObject);
      prepareUploadDatasetsView(YOLO_TXT_FORMAT, ACCEPT_TXT_AND_IMG_FILES, TXT_POSTFIX,
        THREE_TABLE_STRATEGY);
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
      setFormatState(YOLO_TXT_FORMAT);
      setReuseAlreadyUploadedImagesState(true);
      prepareChosenFormatFunctionality();
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
