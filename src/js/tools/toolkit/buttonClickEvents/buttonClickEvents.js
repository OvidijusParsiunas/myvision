import {
  createNewBndBoxBtnClick, createNewPolygonBtnClick, settingsBtnClick, zoomBtnClick,
  addPointsBtnClick, removeActiveShapeBtnClick, removePolygonPointBtnClick,
  exportDatasetsBtnClick, uploadImageInputClick, resetCanvasEventsToDefault,
  movableObjectsBtnClick, continuousDrawingBtnClick, editShapesBtnClick,
  toggleLabelsVisibilityBtnClick, switchImageBtnClick, uploadImageBtnClick,
} from './facade';
import {
  interruptAllCanvasEventsBeforeFunc, interruptAllCanvasEventsBeforeFuncWInputs,
  doNothingIfLabellingInProgress, interruptNewShapeDrawingWthFunc1OrExecFunc2,
  doNothingIfLabellingOrAddingNewPoints, interruptAllCanvasEventsBeforeMultipleFunc,
  replaceExistingCanvas, removeButtonPopIfActive,
} from '../buttonEventMiddleware/buttonEventMiddleware';

function assignToolkitButtonClickEvents() {
  window.createNewBndBox = interruptAllCanvasEventsBeforeFunc.bind(this, createNewBndBoxBtnClick);
  window.createNewPolygon = interruptAllCanvasEventsBeforeFunc.bind(this, createNewPolygonBtnClick);
  window.addPoints = doNothingIfLabellingOrAddingNewPoints.bind(this, addPointsBtnClick);
  window.removePoint = doNothingIfLabellingInProgress.bind(this, removePolygonPointBtnClick);
  window.editShapes = doNothingIfLabellingInProgress.bind(this, editShapesBtnClick);
  window.cancel = interruptAllCanvasEventsBeforeFunc.bind(this, resetCanvasEventsToDefault);
  window.exportDatasets = interruptAllCanvasEventsBeforeMultipleFunc.bind(this,
    resetCanvasEventsToDefault, removeButtonPopIfActive, exportDatasetsBtnClick);
  window.uploadImage = interruptAllCanvasEventsBeforeFuncWInputs.bind(this, this,
    { uploadImageInputClick, resetCanvasEventsToDefault });
  window.removeShape = interruptNewShapeDrawingWthFunc1OrExecFunc2.bind(this,
    resetCanvasEventsToDefault, removeActiveShapeBtnClick);
  window.movableObjects = movableObjectsBtnClick;
  window.continuousDrawing = continuousDrawingBtnClick;
  window.toggleLabelsVisibility = toggleLabelsVisibilityBtnClick;
  window.zoom = zoomBtnClick;
  window.switchImage = replaceExistingCanvas.bind(this, switchImageBtnClick,
    resetCanvasEventsToDefault);
  window.triggerImageUpload = removeButtonPopIfActive.bind(this, uploadImageBtnClick);
  window.displaySettingsPopup = removeButtonPopIfActive.bind(this, settingsBtnClick);
}

export { assignToolkitButtonClickEvents as default };
