import { createNewBndBoxBtnClick, removeBndBoxBtnClick } from './boundingBox';
import { uploadImage } from './uploadImage';
import { downloadXML } from './downloadXML';

function assignButtonEvents() {
  window.createNewBndBox = createNewBndBoxBtnClick;
  window.removeBndBox = removeBndBoxBtnClick;
  window.uploadImage = uploadImage;
  window.downloadXML = downloadXML;
}

export { assignButtonEvents as default };
