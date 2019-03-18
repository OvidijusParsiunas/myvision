import {
  createNewBndBoxBtnClick, createNewPolygonBtnClick,
  removeActiveShapeBtnClick, resetCanvasEventsToDefault,
  removePolygonPointBtnClick,
} from '../canvas/facade';
import { downloadXML } from '../../downloadFile/downloadXML';
import { labelShape } from '../../canvas/labelPopUp/labelPopUpActions';
import { interruptAllCanvasEventsBeforeFunc, interruptAllCanvasEventsBeforeImageUpload } from './utils/buttonEventsMiddleware';

function assignButtonEvents() {
  window.createNewBndBox = interruptAllCanvasEventsBeforeFunc.bind(this, createNewBndBoxBtnClick);
  window.createNewPolygon = interruptAllCanvasEventsBeforeFunc.bind(this, createNewPolygonBtnClick);
  window.removePoint = removePolygonPointBtnClick;
  window.removeShape = interruptAllCanvasEventsBeforeFunc.bind(this, removeActiveShapeBtnClick);
  window.downloadXML = interruptAllCanvasEventsBeforeFunc.bind(this, downloadXML);
  window.cancel = interruptAllCanvasEventsBeforeFunc.bind(this, resetCanvasEventsToDefault);
  window.uploadImage = interruptAllCanvasEventsBeforeImageUpload;
  window.labelShape = labelShape;
}

export { assignButtonEvents as default };
