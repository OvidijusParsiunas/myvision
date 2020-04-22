import initiateCreateNewBndBoxEvents from './facadeWorkers/createNewBndBoxWorker';
import initiateCreateNewPolygonEvents from './facadeWorkers/createNewPolygonWorker';
import { removeActiveShapeEvent } from './facadeWorkers/removeActiveShapeWorker';
import initiateAddPolygonPointsEvents from './facadeWorkers/addPolygonPointsWorker';
import initiateResetCanvasEventsToDefaultEvent from './facadeWorkers/resetCanvasEventsToDefaultWorker';
import initiateRemovePolygonPointsEvents from './facadeWorkers/removePolygonPointsWorker';
import toggleExportDatasetsPopUp from './facadeWorkers/toggleExportDatasetsPopUpWorker';
import displayMachineLearningModal from './facadeWorkers/displayMLModalWorker';
import { uploadImageFiles, triggeUploadImagesButton } from './facadeWorkers/uploadImagesWorker';
import { zoomCanvas } from './facadeWorkers/zoomWorker';
import switchImages from './facadeWorkers/switchImageWorker';
import toggleSettingsPopUp from './facadeWorkers/toggleSettingsPopUpWorker';
import initiateEditShapesEvent from './facadeWorkers/editShapesWorker';
import displayUploadDatasetsModal from './facadeWorkers/displayUploadDatasetsModalWorker';

let canvas = null;

function createNewBndBoxBtnClick() {
  initiateCreateNewBndBoxEvents(canvas);
}

function createNewPolygonBtnClick() {
  initiateCreateNewPolygonEvents(canvas);
}

function addPointsBtnClick() {
  initiateAddPolygonPointsEvents(canvas);
}

function removeActiveShapeBtnClick() {
  removeActiveShapeEvent(canvas);
}

function resetCanvasEventsToDefault() {
  initiateResetCanvasEventsToDefaultEvent(canvas);
}

function removePolygonPointBtnClick() {
  initiateRemovePolygonPointsEvents(canvas);
}

function assignCanvasMouseEvents(canvasObj) {
  canvas = canvasObj;
}

function exportDatasetsBtnClick() {
  toggleExportDatasetsPopUp(canvas);
}

function uploadDatasetsBtnClick() {
  displayUploadDatasetsModal();
}

function machineLearningBtnClick() {
  displayMachineLearningModal(canvas);
}

function zoomBtnClick(activity) {
  zoomCanvas(canvas, activity);
}

function switchImageBtnClick(direction) {
  switchImages(direction);
}

function settingsBtnClick() {
  toggleSettingsPopUp();
}

function uploadImagesInputClick(uploadData) {
  uploadImageFiles(canvas, uploadData);
}

function uploadImagesBtnClick() {
  triggeUploadImagesButton();
}

function editShapesBtnClick() {
  initiateEditShapesEvent(canvas);
}

export {
  assignCanvasMouseEvents,
  createNewBndBoxBtnClick,
  createNewPolygonBtnClick,
  resetCanvasEventsToDefault,
  removeActiveShapeBtnClick,
  removePolygonPointBtnClick,
  exportDatasetsBtnClick,
  uploadDatasetsBtnClick,
  machineLearningBtnClick,
  uploadImagesInputClick,
  addPointsBtnClick,
  zoomBtnClick,
  switchImageBtnClick,
  settingsBtnClick,
  uploadImagesBtnClick,
  editShapesBtnClick,
};
