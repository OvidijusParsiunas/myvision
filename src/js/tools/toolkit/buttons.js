import {
  createNewBndBoxBtnClick, createNewPolygonBtnClick,
  addPointsBtnClick, removeActiveShapeBtnClick,
  removePolygonPointBtnClick, downloadXMLBtnClick,
  uploadImageBtnClick, resetCanvasEventsToDefault,
} from './buttonEvents/facade';
import {
  interruptAllCanvasEventsBeforeFunc, interruptCanvasEventsAfterFunc,
  interruptCanvasEventsBeforeFuncWParams, doNothingIfLabellingInProgress,
  interruptCanvasEventsNoPointRemovalBeforeFunc,
} from './buttonMiddleware/buttonMiddleware';

function assignToolkitButtonEvents() {
  window.createNewBndBox = interruptAllCanvasEventsBeforeFunc.bind(this, createNewBndBoxBtnClick);
  window.createNewPolygon = interruptAllCanvasEventsBeforeFunc.bind(this, createNewPolygonBtnClick);
  window.addPoints = interruptCanvasEventsNoPointRemovalBeforeFunc.bind(this, addPointsBtnClick);
  window.removePoint = doNothingIfLabellingInProgress.bind(this, removePolygonPointBtnClick);
  window.downloadXML = interruptAllCanvasEventsBeforeFunc.bind(this, downloadXMLBtnClick);
  window.cancel = interruptAllCanvasEventsBeforeFunc.bind(this, resetCanvasEventsToDefault);
  window.uploadImage = interruptCanvasEventsBeforeFuncWParams.bind(this, this, uploadImageBtnClick);
  window.removeShape = interruptCanvasEventsAfterFunc.bind(this,
    removeActiveShapeBtnClick, resetCanvasEventsToDefault);
}

export { assignToolkitButtonEvents as default };
