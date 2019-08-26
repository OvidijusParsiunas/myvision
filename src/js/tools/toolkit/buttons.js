import {
  createNewBndBoxBtnClick, createNewPolygonBtnClick,
  addPointsBtnClick, removeActiveShapeBtnClick,
  removePolygonPointBtnClick, downloadXMLBtnClick,
  uploadImageBtnClick, resetCanvasEventsToDefault,
  movableObjectsBtnClick, continuousDrawingBtnClick,
  toggleLabelsVisibilityBtnClick, zoomBtnClick,
} from './buttonEvents/facade';
import {
  interruptAllCanvasEventsBeforeFunc, interruptAllCanvasEventsBeforeFuncWInputs,
  doNothingIfLabellingInProgress, interruptNewShapeDrawingWthFunc1OrExecFunc2,
  doNothingIfLabellingOrAddingNewPoints, interruptAllCanvasEventsBeforeMultipleFunc,
} from './buttonMiddleware/buttonMiddleware';

function assignToolkitButtonEvents() {
  window.createNewBndBox = interruptAllCanvasEventsBeforeFunc.bind(this, createNewBndBoxBtnClick);
  window.createNewPolygon = interruptAllCanvasEventsBeforeFunc.bind(this, createNewPolygonBtnClick);
  window.addPoints = doNothingIfLabellingOrAddingNewPoints.bind(this, addPointsBtnClick);
  window.removePoint = doNothingIfLabellingInProgress.bind(this, removePolygonPointBtnClick);
  window.cancel = interruptAllCanvasEventsBeforeFunc.bind(this, resetCanvasEventsToDefault);
  window.downloadXML = interruptAllCanvasEventsBeforeMultipleFunc.bind(this,
    resetCanvasEventsToDefault, downloadXMLBtnClick);
  window.uploadImage = interruptAllCanvasEventsBeforeFuncWInputs.bind(this, this,
    { uploadImageBtnClick, resetCanvasEventsToDefault });
  window.removeShape = interruptNewShapeDrawingWthFunc1OrExecFunc2.bind(this,
    resetCanvasEventsToDefault, removeActiveShapeBtnClick);
  window.movableObjects = movableObjectsBtnClick;
  window.continuousDrawing = continuousDrawingBtnClick;
  window.toggleLabelsVisibility = toggleLabelsVisibilityBtnClick;
  window.zoom = zoomBtnClick;
}

export { assignToolkitButtonEvents as default };
