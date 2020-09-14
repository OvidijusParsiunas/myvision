import initiateCreateNewBndBoxEvents from './facadeWorkers/createNewBndBoxWorker';
import initiateCreateNewPolygonEvents from './facadeWorkers/createNewPolygonWorker';
import initiateAddPolygonPointsEvents from './facadeWorkers/addPolygonPointsWorker';
import initiateResetCanvasEventsToDefaultEvent from './facadeWorkers/resetCanvasEventsToDefaultWorker';
import initiateRemovePolygonPointsEvents from './facadeWorkers/removePolygonPointsWorker';
import toggleExportDatasetsPopup from './facadeWorkers/toggleExportDatasetsPopUpWorker';
import displayMachineLearningModal from './facadeWorkers/displayMLModalWorker';
import { zoomCanvas } from './facadeWorkers/zoomWorker';
import toggleSettingsPopup from './facadeWorkers/toggleSettingsPopUpWorker';
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
  toggleExportDatasetsPopup(canvas);
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

function settingsBtnClick() {
  toggleSettingsPopup();
}

function editShapesBtnClick() {
  initiateEditShapesEvent(canvas);
}

export {
  assignCanvasMouseEvents,
  createNewBndBoxBtnClick,
  createNewPolygonBtnClick,
  resetCanvasEventsToDefault,
  removePolygonPointBtnClick,
  exportDatasetsBtnClick,
  uploadDatasetsBtnClick,
  machineLearningBtnClick,
  addPointsBtnClick,
  zoomBtnClick,
  settingsBtnClick,
  editShapesBtnClick,
};
