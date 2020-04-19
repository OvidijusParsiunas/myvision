import {
  createNewBndBoxBtnClick, createNewPolygonBtnClick, settingsBtnClick,
  addPointsBtnClick, removeActiveShapeBtnClick, removePolygonPointBtnClick,
  exportDatasetsBtnClick, uploadImageInputClick, resetCanvasEventsToDefault,
  movableObjectsBtnClick, continuousDrawingBtnClick, editShapesBtnClick,
  toggleLabelsVisibilityBtnClick, switchImageBtnClick, uploadImageBtnClick,
  zoomBtnClick, machineLearningBtnClick, uploadDatasetsBtnClick,
} from './facade';
import {
  interruptAllCanvasEventsBeforeFunc, interruptAllCanvasEventsBeforeFuncWInputs,
  doNothingIfLabellingInProgress, interruptNewShapeDrawingWthFunc1OrExecFunc2,
  doNothingIfLabellingOrAddingNewPoints, replaceExistingCanvas, removeButtonPopIfActive,
  interruptAllCanvasEventsBeforeMultipleFunc, func1IfDrawRemovePointsElseInterruptAllWthFunc2,
} from '../buttonEventMiddleware/buttonEventMiddleware';

function assignToolkitButtonClickEvents() {
  window.createNewBndBox = interruptAllCanvasEventsBeforeFunc.bind(this, createNewBndBoxBtnClick);
  window.createNewPolygon = func1IfDrawRemovePointsElseInterruptAllWthFunc2.bind(this,
    removePolygonPointBtnClick, createNewPolygonBtnClick);
  window.addPoints = doNothingIfLabellingOrAddingNewPoints.bind(this, addPointsBtnClick);
  window.removePoint = doNothingIfLabellingInProgress.bind(this, removePolygonPointBtnClick);
  window.editShapes = doNothingIfLabellingInProgress.bind(this, editShapesBtnClick);
  window.cancel = interruptAllCanvasEventsBeforeFunc.bind(this, resetCanvasEventsToDefault);
  window.exportDatasets = removeButtonPopIfActive.bind(this, exportDatasetsBtnClick);
  window.uploadDatasets = removeButtonPopIfActive.bind(this, uploadDatasetsBtnClick);
  window.displayMachineLearningModal = interruptAllCanvasEventsBeforeMultipleFunc.bind(this,
    resetCanvasEventsToDefault, removeButtonPopIfActive, machineLearningBtnClick);
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
