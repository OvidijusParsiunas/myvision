import registerDescriptionViewButtonEventHandlers from './description/buttonEvents';
import { assignDescriptionViewLocalVariables, prepareDescriptionView, hideDescriptionViewAssets } from './description/style';
import registerSelectFormatViewButtonEventHandlers from './selectFormat/buttonEvents';
import { assignSelectFormatViewLocalVariables, prepareSelectFormatView, hideSelectFormatViewAssets } from './selectFormat/style';
import registerUploadDatasetsViewButtonEventHandlers from './uploadDatasets/buttonEvents';
import { assignUseExistingImagesQstnViewLocalVariables, prepareUseExistingImagesQstnView } from './useExistingImagesQstn/style';
import registerUseExistingImagesQstnViewButtonEventHandlers from './useExistingImagesQstn/buttonEvents';
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
import * as UploadDatasetsConsts from '../consts';
import {
  getFormatState, setReuseAlreadyUploadedImagesState, getReuseAlreadyUploadedImagesState,
} from '../stateMachine';

let currentViewNumber = 1;
let modalElement = null;
let hideViewOnCancelFunc = null;
let closeModalFunc = null;
let goBackToSelectFormatViewFunc = null;

function prepareChosenFormatFunctionality() {
  switch (getFormatState()) {
    case UploadDatasetsConsts.COCO_JSON_FORMAT:
      setAddFile(COCOJSONObjectDatasetManager.addFile);
      setTableUpdater(updateCOCOJSONTables);
      setFormatValidator(validateCOCOJSONFormat);
      setFinalObjectAssembler(assembleFinalObjectFromCOCOJSON);
      registerUploadDatasetsViewButtonEventHandlers(closeModalFunc, removeCOCOJSONFileHandler,
        COCOJSONObjectDatasetManager.clearDatasetObject, goBackToSelectFormatViewFunc);
      prepareUploadDatasetsView(
        UploadDatasetsConsts.COCO_JSON_FORMAT,
        UploadDatasetsConsts.ACCEPT_JSON_AND_IMG_FILES,
        UploadDatasetsConsts.JSON_POSTFIX,
        UploadDatasetsConsts.TWO_TABLE_STRATEGY,
      );
      break;
    case UploadDatasetsConsts.VGG_JSON_FORMAT:
      setAddFile(VGGJSONObjectDatasetManager.addFile);
      setTableUpdater(updateVGGJSONTables);
      setFormatValidator(validateVGGJSONFormat);
      setFinalObjectAssembler(assembleFinalObjectFromVGGJSON);
      registerUploadDatasetsViewButtonEventHandlers(closeModalFunc, removeVGGJSONFileHandler,
        VGGJSONObjectDatasetManager.clearDatasetObject, goBackToSelectFormatViewFunc);
      prepareUploadDatasetsView(
        UploadDatasetsConsts.VGG_JSON_FORMAT,
        UploadDatasetsConsts.ACCEPT_JSON_AND_IMG_FILES,
        UploadDatasetsConsts.JSON_POSTFIX,
        UploadDatasetsConsts.TWO_TABLE_STRATEGY,
      );
      break;
    case UploadDatasetsConsts.CSV_FORMAT:
      setAddFile(CSVObjectDatasetManager.addFile);
      setTableUpdater(updateCSVTables);
      setFormatValidator(validateCSVFormat);
      setFinalObjectAssembler(assembleFinalObjectFromCSV);
      registerUploadDatasetsViewButtonEventHandlers(closeModalFunc, removeCSVFileHandler,
        CSVObjectDatasetManager.clearDatasetObject, goBackToSelectFormatViewFunc);
      prepareUploadDatasetsView(
        UploadDatasetsConsts.CSV_FORMAT,
        UploadDatasetsConsts.ACCEPT_CSV_AND_IMG_FILES,
        UploadDatasetsConsts.CSV_POSTFIX,
        UploadDatasetsConsts.TWO_TABLE_STRATEGY,
      );
      break;
    case UploadDatasetsConsts.VOC_XML_FORMAT:
      setAddFile(VOCXMLObjectDatasetManager.addFile);
      setTableUpdater(updateVOCXMLTables);
      setFormatValidator(validateVOCXMLFormat);
      setFinalObjectAssembler(assembleFinalObjectFromVOCXML);
      registerUploadDatasetsViewButtonEventHandlers(closeModalFunc, removeVOCXMLFileHandler,
        VOCXMLObjectDatasetManager.clearDatasetObject, goBackToSelectFormatViewFunc);
      prepareUploadDatasetsView(
        UploadDatasetsConsts.VOC_XML_FORMAT,
        UploadDatasetsConsts.ACCEPT_XML_AND_IMG_FILES,
        UploadDatasetsConsts.XML_POSTFIX,
        UploadDatasetsConsts.TWO_TABLE_STRATEGY,
      );
      break;
    case UploadDatasetsConsts.YOLO_TXT_FORMAT:
      setAddFile(YOLOTXTObjectDatasetManager.addFile);
      setTableUpdater(updateYOLOTXTTables);
      setFormatValidator(validateYOLOTXTFormat);
      setFinalObjectAssembler(assembleFinalObjectFromYOLOTXT);
      registerUploadDatasetsViewButtonEventHandlers(closeModalFunc, removeYOLOTXTFileHandler,
        YOLOTXTObjectDatasetManager.clearDatasetObject, goBackToSelectFormatViewFunc);
      prepareUploadDatasetsView(
        UploadDatasetsConsts.YOLO_TXT_FORMAT,
        UploadDatasetsConsts.ACCEPT_TXT_AND_IMG_FILES,
        UploadDatasetsConsts.TXT_POSTFIX,
        UploadDatasetsConsts.THREE_TABLE_STRATEGY,
      );
      break;
    default:
      break;
  }
}

// don't need to reset the height, expand it to fit reuse existing images
// rename table updaters to table updater

function displayNextView() {
  switch (currentViewNumber) {
    case 1:
      prepareDescriptionView();
      hideViewOnCancelFunc = hideDescriptionViewAssets;
      currentViewNumber += 1;
      break;
    case 2:
      prepareSelectFormatView();
      hideViewOnCancelFunc = hideSelectFormatViewAssets;
      currentViewNumber += 1;
      break;
    case 3:
      currentViewNumber += 1;
      if (getAllImageData().length > 0) {
        prepareUseExistingImagesQstnView();
      } else {
        setReuseAlreadyUploadedImagesState(false);
        displayNextView();
      }
      break;
    case 4:
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

function goBackToSelectFormatView() {
  currentViewNumber = 2;
  displayNextView();
}

function assignViewManagerLocalVariables() {
  modalElement = document.getElementById('upload-datasets-modal-parent');
}

function initialiseUploadDatasetsModal() {
  assignViewManagerLocalVariables();
  registerDescriptionViewButtonEventHandlers(displayNextView);
  assignDescriptionViewLocalVariables();
  registerSelectFormatViewButtonEventHandlers(displayNextView);
  assignSelectFormatViewLocalVariables();
  registerUseExistingImagesQstnViewButtonEventHandlers(displayNextView);
  assignUseExistingImagesQstnViewLocalVariables();
  assignUploadDatasetsViewLocalVariables();
  displayNextView();
  window.cancelUploadDatasetsModal = closeModal;
  closeModalFunc = closeModal;
  goBackToSelectFormatViewFunc = goBackToSelectFormatView;
}

export { displayModal, initialiseUploadDatasetsModal };
