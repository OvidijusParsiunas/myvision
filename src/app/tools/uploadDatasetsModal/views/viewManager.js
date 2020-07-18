import registerDescriptionViewButtonEventHandlers from './description/buttonEvents';
import { assignDescriptionViewLocalVariables, prepareDescriptionView, hideDescriptionViewAssets } from './description/style';
import registerSelectFormatViewButtonEventHandlers from './selectFormat/buttonEvents';
import { assignSelectFormatViewLocalVariables, prepareSelectFormatView, hideSelectFormatViewAssets } from './selectFormat/style';
import registerUploadDatasetsViewButtonEventHandlers from './uploadDatasets/buttonEvents';
import { assignUseExistingImagesQstnViewLocalVariables, prepareUseExistingImagesQstnView, hideUseExistingImagesViewAssets } from './useExistingImagesQstn/style';
import registerUseExistingImagesQstnViewButtonEventHandlers from './useExistingImagesQstn/buttonEvents';
import { assignUploadDatasetsViewLocalVariables, prepareUploadDatasetsView, hideUploadDatasetsViewAssets } from './uploadDatasets/style';
import { dimWindow, lightUpWindow } from '../../dimWindow/dimWindowService';
import { SLOW_LIGHTUP_MILLISECONDS, SLOW_DIM_SECONDS, THICK_DIM } from '../../dimWindow/consts';
import updateCOCOJSONTables from './uploadDatasets/tableUpdaters/COCOJSONTableUpdater';
import updateVGGJSONTables from './uploadDatasets/tableUpdaters/VGGJSONTableUpdater';
import updateVOCXMLTables from './uploadDatasets/tableUpdaters/VOCXMLTableUpdater';
import updateYOLOTXTTables from './uploadDatasets/tableUpdaters/YOLOTXTTableUpdater';
import updateCSVTables from './uploadDatasets/tableUpdaters/CSVTableUpdater';
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
  JSON_POSTFIX, CSV_POSTFIX, XML_POSTFIX, TXT_POSTFIX,
  ACCEPT_JSON_AND_IMG_FILES, ACCEPT_CSV_AND_IMG_FILES,
  ACCEPT_XML_AND_IMG_FILES, ACCEPT_TXT_AND_IMG_FILES,
  TWO_TABLE_STRATEGY, THREE_TABLE_STRATEGY, YOLO_TXT_FORMAT,
  COCO_JSON_FORMAT, VGG_JSON_FORMAT, CSV_FORMAT, VOC_XML_FORMAT,
} from '../consts';
import { getContinuousDrawingState, getLastDrawingModeState, setUploadDatasetsModalDisplayedState } from '../../state';
import { setCreatePolygonButtonToActive, setCreateBoundingBoxButtonToActive } from '../../toolkit/styling/state';
import { getFormatState, setReuseAlreadyUploadedImagesState, getReuseAlreadyUploadedImagesState } from '../state';

let currentViewNumber = 1;
let modalElement = null;
let hideViewOnCancelFunc = null;
let closeModalFunc = null;
let goBackToSelectFormatViewFunc = null;

function prepareChosenFormatFunctionality() {
  switch (getFormatState()) {
    case COCO_JSON_FORMAT:
      setAddFile(COCOJSONObjectDatasetManager.addFile);
      setTableUpdater(updateCOCOJSONTables);
      setFormatValidator(validateCOCOJSONFormat);
      setFinalObjectAssembler(assembleFinalObjectFromCOCOJSON);
      registerUploadDatasetsViewButtonEventHandlers(closeModalFunc, removeCOCOJSONFileHandler,
        COCOJSONObjectDatasetManager.clearDatasetObject, goBackToSelectFormatViewFunc);
      prepareUploadDatasetsView(
        COCO_JSON_FORMAT, ACCEPT_JSON_AND_IMG_FILES, JSON_POSTFIX, TWO_TABLE_STRATEGY,
      );
      break;
    case VGG_JSON_FORMAT:
      setAddFile(VGGJSONObjectDatasetManager.addFile);
      setTableUpdater(updateVGGJSONTables);
      setFormatValidator(validateVGGJSONFormat);
      setFinalObjectAssembler(assembleFinalObjectFromVGGJSON);
      registerUploadDatasetsViewButtonEventHandlers(closeModalFunc, removeVGGJSONFileHandler,
        VGGJSONObjectDatasetManager.clearDatasetObject, goBackToSelectFormatViewFunc);
      prepareUploadDatasetsView(
        VGG_JSON_FORMAT, ACCEPT_JSON_AND_IMG_FILES, JSON_POSTFIX, TWO_TABLE_STRATEGY,
      );
      break;
    case CSV_FORMAT:
      setAddFile(CSVObjectDatasetManager.addFile);
      setTableUpdater(updateCSVTables);
      setFormatValidator(validateCSVFormat);
      setFinalObjectAssembler(assembleFinalObjectFromCSV);
      registerUploadDatasetsViewButtonEventHandlers(closeModalFunc, removeCSVFileHandler,
        CSVObjectDatasetManager.clearDatasetObject, goBackToSelectFormatViewFunc);
      prepareUploadDatasetsView(
        CSV_FORMAT, ACCEPT_CSV_AND_IMG_FILES, CSV_POSTFIX, TWO_TABLE_STRATEGY,
      );
      break;
    case VOC_XML_FORMAT:
      setAddFile(VOCXMLObjectDatasetManager.addFile);
      setTableUpdater(updateVOCXMLTables);
      setFormatValidator(validateVOCXMLFormat);
      setFinalObjectAssembler(assembleFinalObjectFromVOCXML);
      registerUploadDatasetsViewButtonEventHandlers(closeModalFunc, removeVOCXMLFileHandler,
        VOCXMLObjectDatasetManager.clearDatasetObject, goBackToSelectFormatViewFunc);
      prepareUploadDatasetsView(
        VOC_XML_FORMAT, ACCEPT_XML_AND_IMG_FILES, XML_POSTFIX, TWO_TABLE_STRATEGY,
      );
      break;
    case YOLO_TXT_FORMAT:
      setAddFile(YOLOTXTObjectDatasetManager.addFile);
      setTableUpdater(updateYOLOTXTTables);
      setFormatValidator(validateYOLOTXTFormat);
      setFinalObjectAssembler(assembleFinalObjectFromYOLOTXT);
      registerUploadDatasetsViewButtonEventHandlers(closeModalFunc, removeYOLOTXTFileHandler,
        YOLOTXTObjectDatasetManager.clearDatasetObject, goBackToSelectFormatViewFunc);
      prepareUploadDatasetsView(
        YOLO_TXT_FORMAT, ACCEPT_TXT_AND_IMG_FILES, TXT_POSTFIX, THREE_TABLE_STRATEGY,
      );
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
        hideViewOnCancelFunc = hideUseExistingImagesViewAssets;
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

function getCurrentViewNumber() {
  return currentViewNumber;
}

function displayModal() {
  setTimeout(() => {
    modalElement.style.display = '';
    setUploadDatasetsModalDisplayedState(true);
  }, 60);
  dimWindow(SLOW_DIM_SECONDS, THICK_DIM);
}

function resetContinuousShapeButtons() {
  if (getContinuousDrawingState()) {
    if (getLastDrawingModeState() === 'polygon') {
      setCreatePolygonButtonToActive();
    } else if (getLastDrawingModeState() === 'boundingBox') {
      setCreateBoundingBoxButtonToActive();
    }
  }
}

function setButtons(isCancel) {
  if (isCancel) {
    resetContinuousShapeButtons();
  } else {
    setTimeout(() => {
      window.editShapes();
    }, 0);
  }
}

function closeModal(isCancel) {
  setButtons(isCancel);
  modalElement.style.display = 'none';
  lightUpWindow(SLOW_LIGHTUP_MILLISECONDS);
  hideViewOnCancelFunc();
  currentViewNumber = 1;
  displayNextView();
  setUploadDatasetsModalDisplayedState(false);
}

function closeModalViaKeyboard() {
  closeModal(true);
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

export {
  displayModal, getCurrentViewNumber, closeModal,
  closeModalViaKeyboard, initialiseUploadDatasetsModal,
};
