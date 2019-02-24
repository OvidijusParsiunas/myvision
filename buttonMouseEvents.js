import { createNewBndBoxBtnClick, removeBndBoxBtnClick } from './boundingBox';
import { readURL } from './uploadFile';
import { downloadXML } from './downloadXML';

function assignButtonEvents() {
  window.createNewBndBox = createNewBndBoxBtnClick;
  window.removeBndBox = removeBndBoxBtnClick;
  window.readURL = readURL;
  window.downloadXML = downloadXML;
}

export { assignButtonEvents as default };
