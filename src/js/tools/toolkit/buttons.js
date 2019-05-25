import {
  createNewBndBoxBtnClick, createNewPolygonBtnClick,
  addPointsBtnClick, removeActiveShapeBtnClick,
  removePolygonPointBtnClick, downloadXMLBtnClick,
  uploadImageBtnClick, resetCanvasEventsToDefault,
} from './buttonEvents/facade';
import {
  interruptAllCanvasEventsBeforeFunc, interruptCanvasEventsAfterFunc,
  interruptAllCanvasEventsBeforeFuncWInputs, doNothingIfLabellingInProgress,
  interruptCanvasEventsNoPointRemovalBeforeFunc, interruptAllCanvasEventsBeforeMultipleFunc,
} from './buttonMiddleware/buttonMiddleware';

function assignToolkitButtonEvents() {
  window.createNewBndBox = interruptAllCanvasEventsBeforeFunc.bind(this, createNewBndBoxBtnClick);
  window.createNewPolygon = interruptAllCanvasEventsBeforeFunc.bind(this, createNewPolygonBtnClick);
  window.addPoints = interruptCanvasEventsNoPointRemovalBeforeFunc.bind(this, addPointsBtnClick);
  window.removePoint = doNothingIfLabellingInProgress.bind(this, removePolygonPointBtnClick);
  window.cancel = interruptAllCanvasEventsBeforeFunc.bind(this, resetCanvasEventsToDefault);
  window.downloadXML = interruptAllCanvasEventsBeforeMultipleFunc.bind(this,
    resetCanvasEventsToDefault, downloadXMLBtnClick);
  window.uploadImage = interruptAllCanvasEventsBeforeFuncWInputs.bind(this, this,
    { uploadImageBtnClick, resetCanvasEventsToDefault });
  window.removeShape = interruptCanvasEventsAfterFunc.bind(this,
    removeActiveShapeBtnClick, resetCanvasEventsToDefault);
}

export { assignToolkitButtonEvents as default };
