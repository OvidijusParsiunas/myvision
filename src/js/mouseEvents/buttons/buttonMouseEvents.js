import { removeBndBoxBtnClick } from '../../canvas/canvasObjects/boundingBox';
import { clearPolygonData } from '../../canvas/canvasObjects/polygon';
import { uploadImage } from '../../uploadFile/uploadImage';
import { downloadXML } from '../../downloadFile/downloadXML';
import { createNewBndBoxBtnClick, createNewPolygonBtnClick } from '../canvas/facade';
import { labelShape, cancelLabellingProcess } from '../../canvas/labelPopUp/labelPopUpActions';

// this will need to be exported
function interruptAllCanvasEvents() {
  clearPolygonData();
  cancelLabellingProcess();
}

function interruptAllCanvasEventsBeforeFunc(funcName) {
  interruptAllCanvasEvents();
  funcName();
}

function interruptCanvasEventsBeforeImageUpload(input) {
  interruptAllCanvasEvents();
  uploadImage(input);
}

// check if downloadXML checks temp shapes
// deletion of polygon
function assignButtonEvents() {
  window.createNewBndBox = interruptAllCanvasEventsBeforeFunc.bind(this, createNewBndBoxBtnClick);
  window.createNewPolygon = interruptAllCanvasEventsBeforeFunc.bind(this, createNewPolygonBtnClick);
  window.removeBndBox = interruptAllCanvasEventsBeforeFunc.bind(this, removeBndBoxBtnClick);
  window.downloadXML = interruptAllCanvasEventsBeforeFunc.bind(this, downloadXML);
  window.uploadImage = interruptCanvasEventsBeforeImageUpload;
  window.labelShape = labelShape;
}

export { assignButtonEvents as default };
