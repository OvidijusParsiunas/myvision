import registerDescriptionViewButtonEventHandlers from './description/buttonEvents.js';
import { assignDescriptionViewLocalVariables, prepareDescriptionView, hideDescriptionViewAssets } from './description/style.js';
import registerSelectFormatViewButtonEventHandlers from './selectFormat/buttonEvents.js';
import { assignSelectFormatViewLocalVariables, prepareSelectFormatView, hideSelectFormatViewAssets } from './selectFormat/style.js';
import registerUploadDatasetsViewButtonEventHandlers from './uploadDatasets/buttonEvents.js';
import { assignUseExistingImagesQstnViewLocalVariables, prepareUseExistingImagesQstnView, hideUseExistingImagesViewAssets } from './useExistingImagesQstn/style.js';
import registerUseExistingImagesQstnViewButtonEventHandlers from './useExistingImagesQstn/buttonEvents.js';
import { assignUploadDatasetsViewLocalVariables, prepareUploadDatasetsView, hideUploadDatasetsViewAssets } from './uploadDatasets/style.js';
import { dimWindow, lightUpWindow } from '../../dimWindow/dimWindowService.js';
import { SLOW_LIGHTUP_MILLISECONDS, SLOW_DIM_SECONDS, THICK_DIM } from '../../dimWindow/consts.js';
import updateCOCOJSONTables from './uploadDatasets/tableUpdaters/COCOJSONTableUpdater.js';
import updateVGGJSONTables from './uploadDatasets/tableUpdaters/VGGJSONTableUpdater.js';
import updateVOCXMLTables from './uploadDatasets/tableUpdaters/VOCXMLTableUpdater.js';
import updateYOLOTXTTables from './uploadDatasets/tableUpdaters/YOLOTXTTableUpdater.js';
import updateCSVTables from './uploadDatasets/tableUpdaters/CSVTableUpdater.js';
import validateCOCOJSONFormat from './uploadDatasets/formatValidators/COCOJSONValidator.js';
import validateVGGJSONFormat from './uploadDatasets/formatValidators/VGGJSONValidator.js';
import validateCSVFormat from './uploadDatasets/formatValidators/CSVValidator.js';
import validateVOCXMLFormat from './uploadDatasets/formatValidators/VOCXMLValidator.js';
import validateYOLOTXTFormat from './uploadDatasets/formatValidators/YOLOTXTValidator.js';
import removeCOCOJSONFileHandler from './uploadDatasets/removeFileHandlers/COCOJSONRemoveFileHandler.js';
import removeVGGJSONFileHandler from './uploadDatasets/removeFileHandlers/VGGJSONRemoveFileHandler.js';
import removeCSVFileHandler from './uploadDatasets/removeFileHandlers/CSVRemoveFileHandler.js';
import removeYOLOTXTFileHandler from './uploadDatasets/removeFileHandlers/YOLOTXTRemoveFileHandler.js';
import removeVOCXMLFileHandler from './uploadDatasets/removeFileHandlers/VOCXMLRemoveFileHandler.js';
import COCOJSONObjectDatasetManager from './uploadDatasets/datasetObjectManagers/COCOJSONDatasetObjectManager.js';
import VGGJSONObjectDatasetManager from './uploadDatasets/datasetObjectManagers/VGGJSONDatasetObjectManager.js';
import CSVObjectDatasetManager from './uploadDatasets/datasetObjectManagers/CSVDatasetObjectManager.js';
import VOCXMLObjectDatasetManager from './uploadDatasets/datasetObjectManagers/VOCXMLDatasetObjectManager.js';
import YOLOTXTObjectDatasetManager from './uploadDatasets/datasetObjectManagers/YOLOTXTDatasetObjectManager.js';
import {
  setTableUpdater, setFormatValidator, setAddFile, addAlreadyUploadedImages,
} from './uploadDatasets/uploadDatasetFilesHandler.js';
import assembleFinalObjectFromCOCOJSON from './uploadDatasets/finalObjectAssemblers/COCOJSONFinalObjectAssembler.js';
import assembleFinalObjectFromVGGJSON from './uploadDatasets/finalObjectAssemblers/VGGJSONFinalObjectAssembler.js';
import assembleFinalObjectFromCSV from './uploadDatasets/finalObjectAssemblers/CSVFinalObjectAssembler.js';
import assembleFinalObjectFromVOCXML from './uploadDatasets/finalObjectAssemblers/VOCXMLFinalObjectAssembler.js';
import assembleFinalObjectFromYOLOTXT from './uploadDatasets/finalObjectAssemblers/YOLOTXTFinalObjectAssembler.js';
import { setFinalObjectAssembler } from './uploadDatasets/drawShapesAndImages.js';
import { getAllImageData } from '../../imageList/imageList.js';
import {
  JSON_POSTFIX, CSV_POSTFIX, XML_POSTFIX, TXT_POSTFIX,
  ACCEPT_JSON_AND_IMG_FILES, ACCEPT_CSV_AND_IMG_FILES,
  ACCEPT_XML_AND_IMG_FILES, ACCEPT_TXT_AND_IMG_FILES,
  TWO_TABLE_STRATEGY, THREE_TABLE_STRATEGY, YOLO_TXT_FORMAT,
  COCO_JSON_FORMAT, VGG_JSON_FORMAT, CSV_FORMAT, VOC_XML_FORMAT,
} from '../consts.js';
import {
  getContinuousDrawingState, getLastDrawingModeState,
  setUploadDatasetsModalDisplayedState, getCrosshairUsedOnCanvasState,
} from '../../state.js';
import { setCreatePolygonButtonToActive, setCreateBoundingBoxButtonToActive } from '../../toolkit/styling/state.js';
import { getFormatState, setReuseAlreadyUploadedImagesState, getReuseAlreadyUploadedImagesState } from '../state.js';
import { moveCrosshair } from '../../../canvas/mouseInteractions/cursorModes/drawWithCrosshairMode.js';
import { executeFunctionOnceOnMouseOver } from '../../../keyEvents/mouse/mouseOverOut.js';

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
      if (getCrosshairUsedOnCanvasState()) executeFunctionOnceOnMouseOver(moveCrosshair);
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
