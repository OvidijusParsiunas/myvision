import {
  createNewBndBoxBtnClick, createNewPolygonBtnClick, settingsBtnClick,
  addPointsBtnClick, removeActiveShapeBtnClick, removePolygonPointBtnClick,
  exportDatasetsBtnClick, uploadImagesInputClick, resetCanvasEventsToDefault,
  switchImageBtnClick, uploadImagesBtnClick, editShapesBtnClick,
  zoomBtnClick, machineLearningBtnClick, uploadDatasetsBtnClick,
} from './facade';
import {
  interruptAllCanvasEventsBeforeFunc, interruptAllCanvasEventsBeforeFuncWInputs,
  doNothingIfLabellingInProgress, interruptNewShapeDrawingWthFunc1OrExecFunc2,
  doNothingIfLabellingOrAddingNewPoints, replaceExistingCanvas, removeButtonPopIfActive,
  interruptAllCanvasEventsBeforeMultipleFunc, func1IfDrawRemovePointsElseInterruptAllWthFunc2,
} from './eventMiddleware/buttonEventMiddleware';

function assignToolkitButtonEventHandlers() {
  window.editShapes = doNothingIfLabellingInProgress.bind(this, editShapesBtnClick);
  window.createNewBndBox = interruptAllCanvasEventsBeforeFunc.bind(this, createNewBndBoxBtnClick);
  window.createNewPolygon = func1IfDrawRemovePointsElseInterruptAllWthFunc2.bind(this,
    removePolygonPointBtnClick, createNewPolygonBtnClick);
  window.addPoints = doNothingIfLabellingOrAddingNewPoints.bind(this, addPointsBtnClick);
  window.removePoint = doNothingIfLabellingInProgress.bind(this, removePolygonPointBtnClick);
  window.cancel = interruptAllCanvasEventsBeforeFunc.bind(this, resetCanvasEventsToDefault);
  window.exportDatasets = removeButtonPopIfActive.bind(this, exportDatasetsBtnClick);
  window.uploadDatasets = interruptAllCanvasEventsBeforeMultipleFunc.bind(this,
    resetCanvasEventsToDefault, removeButtonPopIfActive, uploadDatasetsBtnClick);
  window.displayMachineLearningModal = interruptAllCanvasEventsBeforeMultipleFunc.bind(this,
    resetCanvasEventsToDefault, removeButtonPopIfActive, machineLearningBtnClick);
  window.uploadImages = interruptAllCanvasEventsBeforeFuncWInputs.bind(this, this,
    { uploadImagesInputClick, resetCanvasEventsToDefault });
  window.triggerImageUpload = removeButtonPopIfActive.bind(this, uploadImagesBtnClick);
  window.removeShape = interruptNewShapeDrawingWthFunc1OrExecFunc2.bind(this,
    resetCanvasEventsToDefault, removeActiveShapeBtnClick);
  window.zoom = zoomBtnClick;
  window.switchImage = replaceExistingCanvas.bind(this, switchImageBtnClick,
    resetCanvasEventsToDefault);
  window.displaySettingsPopup = removeButtonPopIfActive.bind(this, settingsBtnClick);
}

export { assignToolkitButtonEventHandlers as default };
