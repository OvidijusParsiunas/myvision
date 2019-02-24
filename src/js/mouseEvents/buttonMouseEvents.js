import { createNewBndBoxBtnClick, removeBndBoxBtnClick } from '../canvas/canvasObjects/boundingBox';
import { uploadImage } from '../uploadFile/uploadImage';
import { downloadXML } from '../downloadFile/downloadXML';

function assignButtonEvents() {
  window.createNewBndBox = createNewBndBoxBtnClick;
  window.removeBndBox = removeBndBoxBtnClick;
  window.uploadImage = uploadImage;
  window.downloadXML = downloadXML;
}

export { assignButtonEvents as default };
