import { removeBndBoxBtnClick } from '../canvas/canvasObjects/boundingBox';
import { uploadImage } from '../uploadFile/uploadImage';
import { downloadXML } from '../downloadFile/downloadXML';
import { createNewBndBoxBtnClick, createNewPolygonBtnClick } from './canvasMouseEvents';

function assignButtonEvents() {
  window.createNewBndBox = createNewBndBoxBtnClick;
  window.createNewPolygon = createNewPolygonBtnClick;
  window.removeBndBox = removeBndBoxBtnClick;
  window.uploadImage = uploadImage;
  window.downloadXML = downloadXML;
}

export { assignButtonEvents as default };
