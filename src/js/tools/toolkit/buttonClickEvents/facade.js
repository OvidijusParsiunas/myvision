import initiateCreateNewBndBoxEvents from './facadeWorkers/createNewBndBoxWorker';
import initiateCreateNewPolygonEvents from './facadeWorkers/createNewPolygonWorker';
import removeActiveShapeEvent from './facadeWorkers/removeActiveShapeWorker';
import initiateAddPolygonPointsEvents from './facadeWorkers/addPolygonPointsWorker';
import initiateResetCanvasEventsToDefaultEvent from './facadeWorkers/resetCanvasEventsToDefaultWorker';
import initiateRemovePolygonPointsEvents from './facadeWorkers/removePolygonPointsWorker';
import toggleExportDatasetsPopUp from './facadeWorkers/toggleExportDatasetsPopUpWorker';
import toggleMachineLearningPopUp from './facadeWorkers/toggleMachineLearningPopUp';
import uploadImageFile from './facadeWorkers/uploadImageWorker';
import changeMovableObjectsState from './facadeWorkers/movableObjectsWorker';
import changeContinuousDrawingState from './facadeWorkers/continuousDrawingWorker';
import toggleLabelsVisibility from './facadeWorkers/toggleLabelsVisibilityWorker';
import { zoomCanvas } from './facadeWorkers/zoomWorker';
import switchImages from './facadeWorkers/switchImageWorker';
import toggleSettingsPopUp from './facadeWorkers/toggleSettingsPopUpWorker';
import triggerImageUpload from './facadeWorkers/uploadImageButtonWorker';
import initiateEditShapesEvent from './facadeWorkers/editShapesWorker';

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

function machineLearningBtnClick() {
  toggleMachineLearningPopUp(canvas);
}

function uploadImageInputClick(uploadData) {
  uploadImageFile(canvas, uploadData);
}

function movableObjectsBtnClick() {
  changeMovableObjectsState(canvas);
}

function continuousDrawingBtnClick() {
  changeContinuousDrawingState(canvas);
}

function toggleLabelsVisibilityBtnClick() {
  toggleLabelsVisibility(canvas);
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

function uploadImageBtnClick() {
  triggerImageUpload();
}

function editShapesBtnClick() {
  initiateEditShapesEvent(canvas);
}

export {
  assignCanvasMouseEvents,
  createNewBndBoxBtnClick,
  createNewPolygonBtnClick,
  resetCanvasEventsToDefault,
  continuousDrawingBtnClick,
  removeActiveShapeBtnClick,
  removePolygonPointBtnClick,
  movableObjectsBtnClick,
  toggleLabelsVisibilityBtnClick,
  exportDatasetsBtnClick,
  machineLearningBtnClick,
  uploadImageInputClick,
  addPointsBtnClick,
  zoomBtnClick,
  switchImageBtnClick,
  settingsBtnClick,
  uploadImageBtnClick,
  editShapesBtnClick,
};
