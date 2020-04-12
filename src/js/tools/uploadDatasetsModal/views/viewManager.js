import registerDescriptionViewButtonEventHandlers from './description/buttonEvents';
import { assignDescriptionViewLocalVariables, prepareDescriptionView, hideDescriptionViewAssets } from './description/style';
import registerUploadDatasetsViewButtonEventHandlers from './uploadDatasets/buttonEvents';
import { assignUploadDatasetsViewLocalVariables, prepareUploadDatasetsView, hideUploadDatasetsViewAssets } from './uploadDatasets/style';
import { dimWindow, lightUpWindow } from '../../dimWindow/dimWindowService';
import updateCOCOJSONTables from './uploadDatasets/tableUpdaters/COCOJSONTableUpdaters';
import updateVGGJSONTables from './uploadDatasets/tableUpdaters/VGGJSONTableUpdaters';
import updateVOCXMLTables from './uploadDatasets/tableUpdaters/VOCXMLTableUpdaters';
import updateYOLOTXTTables from './uploadDatasets/tableUpdaters/YOLOTXTTableUpdaters';
import updateCSVTables from './uploadDatasets/tableUpdaters/CSVTableUpdaters';
import validateCOCOJSONFormat from './uploadDatasets/formatValidators/COCOJSONValidator';
import validateVGGJSONFormat from './uploadDatasets/formatValidators/VGGJSONValidator';
import validateCSVFormat from './uploadDatasets/formatValidators/CSVValidator';
import validateVOCXMLFormat from './uploadDatasets/formatValidators/VOCXMLValidator';
import validateYOLOTXTFormat from './uploadDatasets/formatValidators/YOLOTXTValidator';
import removeCOCOJSONFileHandler from './uploadDatasets/removeFileHandlers/COCOJSONRemoveFileHandler';
import removeVGGJSONFileHandler from './uploadDatasets/removeFileHandlers/VGGJSONRemoveFileHandler';
import removeCSVFileHandler from './uploadDatasets/removeFileHandlers/CSVRemoveFileHandler';
import removeYOLOTXTFileHandler from './uploadDatasets/removeFileHandlers/YOLOTXTRemoveFileHandler';
import removeVOCXMLFileHandler from './uploadDatasets/removeFileHandlers/VOCXMLRemoveFileHandler';
import COCOJSONObjectDatasetManager from './uploadDatasets/datasetObjectManagers/COCOJSONDatasetObjectManager';
import VGGJSONObjectDatasetManager from './uploadDatasets/datasetObjectManagers/VGGJSONDatasetObjectManager';
import CSVObjectDatasetManager from './uploadDatasets/datasetObjectManagers/CSVDatasetObjectManager';
import VOCXMLObjectDatasetManager from './uploadDatasets/datasetObjectManagers/VOCXMLDatasetObjectManager';
import YOLOTXTObjectDatasetManager from './uploadDatasets/datasetObjectManagers/YOLOTXTDatasetObjectManager';
import {
  setTableUpdater, setFormatValidator, setAddFile, addAlreadyUploadedImages,
} from './uploadDatasets/uploadDatasetFilesHandler';
import assembleFinalObjectFromCOCOJSON from './uploadDatasets/finalObjectAssemblers/COCOJSONFinalObjectAssembler';
import assembleFinalObjectFromVGGJSON from './uploadDatasets/finalObjectAssemblers/VGGJSONFinalObjectAssembler';
import assembleFinalObjectFromCSV from './uploadDatasets/finalObjectAssemblers/CSVFinalObjectAssembler';
import assembleFinalObjectFromVOCXML from './uploadDatasets/finalObjectAssemblers/VOCXMLFinalObjectAssembler';
import assembleFinalObjectFromYOLOTXT from './uploadDatasets/finalObjectAssemblers/YOLOTXTFinalObjectAssembler';
import { setFinalObjectAssembler } from './uploadDatasets/drawShapesAndImages';
import { getAllImageData } from '../../imageList/imageList';
import {
  COCO_JSON_FORMAT, VGG_JSON_FORMAT, VOC_XML_FORMAT,
  ACCEPT_JSON_AND_IMG_FILES, ACCEPT_XML_AND_IMG_FILES,
  XML_POSTFIX, JSON_POSTFIX, YOLO_TXT_FORMAT,
  ACCEPT_TXT_AND_IMG_FILES, TXT_POSTFIX,
  TWO_TABLE_STRATEGY, THREE_TABLE_STRATEGY,
  CSV_FORMAT, ACCEPT_CSV_AND_IMG_FILES,
  CSV_POSTFIX,
} from '../consts';
import {
  setFormatState, setReuseAlreadyUploadedImagesState,
  getFormatState, getReuseAlreadyUploadedImagesState,
} from './uploadDatasets/stateManager';

let currentViewNumber = 1;
let modalElement = null;
let hideViewOnCancelFunc = null;
let closeModalFunc = null;

function prepareChosenFormatFunctionality() {
  switch (getFormatState()) {
    case COCO_JSON_FORMAT:
      setAddFile(COCOJSONObjectDatasetManager.addFile);
      setTableUpdater(updateCOCOJSONTables);
      setFormatValidator(validateCOCOJSONFormat);
      setFinalObjectAssembler(assembleFinalObjectFromCOCOJSON);
      registerUploadDatasetsViewButtonEventHandlers(closeModalFunc, removeCOCOJSONFileHandler,
        COCOJSONObjectDatasetManager.clearDatasetObject);
      prepareUploadDatasetsView(COCO_JSON_FORMAT, ACCEPT_JSON_AND_IMG_FILES, JSON_POSTFIX,
        TWO_TABLE_STRATEGY);
      break;
    case VGG_JSON_FORMAT:
      setAddFile(VGGJSONObjectDatasetManager.addFile);
      setTableUpdater(updateVGGJSONTables);
      setFormatValidator(validateVGGJSONFormat);
      setFinalObjectAssembler(assembleFinalObjectFromVGGJSON);
      registerUploadDatasetsViewButtonEventHandlers(closeModalFunc, removeVGGJSONFileHandler,
        VGGJSONObjectDatasetManager.clearDatasetObject);
      prepareUploadDatasetsView(VGG_JSON_FORMAT, ACCEPT_JSON_AND_IMG_FILES, JSON_POSTFIX,
        TWO_TABLE_STRATEGY);
      break;
    case CSV_FORMAT:
      setAddFile(CSVObjectDatasetManager.addFile);
      setTableUpdater(updateCSVTables);
      setFormatValidator(validateCSVFormat);
      setFinalObjectAssembler(assembleFinalObjectFromCSV);
      registerUploadDatasetsViewButtonEventHandlers(closeModalFunc, removeCSVFileHandler,
        CSVObjectDatasetManager.clearDatasetObject);
      prepareUploadDatasetsView(CSV_FORMAT, ACCEPT_CSV_AND_IMG_FILES, CSV_POSTFIX,
        TWO_TABLE_STRATEGY);
      break;
    case VOC_XML_FORMAT:
      setAddFile(VOCXMLObjectDatasetManager.addFile);
      setTableUpdater(updateVOCXMLTables);
      setFormatValidator(validateVOCXMLFormat);
      setFinalObjectAssembler(assembleFinalObjectFromVOCXML);
      registerUploadDatasetsViewButtonEventHandlers(closeModalFunc, removeVOCXMLFileHandler,
        VOCXMLObjectDatasetManager.clearDatasetObject);
      prepareUploadDatasetsView(VOC_XML_FORMAT, ACCEPT_XML_AND_IMG_FILES, XML_POSTFIX,
        TWO_TABLE_STRATEGY);
      break;
    case YOLO_TXT_FORMAT:
      setAddFile(YOLOTXTObjectDatasetManager.addFile);
      setTableUpdater(updateYOLOTXTTables);
      setFormatValidator(validateYOLOTXTFormat);
      setFinalObjectAssembler(assembleFinalObjectFromYOLOTXT);
      registerUploadDatasetsViewButtonEventHandlers(closeModalFunc, removeYOLOTXTFileHandler,
        YOLOTXTObjectDatasetManager.clearDatasetObject);
      prepareUploadDatasetsView(YOLO_TXT_FORMAT, ACCEPT_TXT_AND_IMG_FILES, TXT_POSTFIX,
        THREE_TABLE_STRATEGY);
      break;
    default:
      break;
  }
}

// remove file handlers should either have the format names used on the export function
// or all other files should not use their name in their export function

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
