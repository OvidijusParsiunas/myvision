import { downloadXML } from '../../downloadFile/downloadXML';
import { createNewBndBoxBtnClick, createNewPolygonBtnClick, removeActiveShapeBtnClick } from '../canvas/facade';
import { labelShape } from '../../canvas/labelPopUp/labelPopUpActions';
import { interruptAllCanvasEventsBeforeFunc, interruptAllCanvasEventsBeforeImageUpload } from './utils/buttonEventsMiddleware';

// deletion of polygon
function assignButtonEvents() {
  window.createNewBndBox = interruptAllCanvasEventsBeforeFunc.bind(this, createNewBndBoxBtnClick);
  window.createNewPolygon = interruptAllCanvasEventsBeforeFunc.bind(this, createNewPolygonBtnClick);
  window.removeBndBox = interruptAllCanvasEventsBeforeFunc.bind(this, removeActiveShapeBtnClick);
  window.downloadXML = interruptAllCanvasEventsBeforeFunc.bind(this, downloadXML);
  window.uploadImage = interruptAllCanvasEventsBeforeImageUpload;
  window.labelShape = labelShape;
}

export { assignButtonEvents as default };
