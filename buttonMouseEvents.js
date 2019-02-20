import { createNewBndBoxBtnClick, removeBndBoxBtnClick } from './boundingBox';
import { readURL } from './uploadFile';

function assignButtonEvents() {
  window.createNewBndBox = createNewBndBoxBtnClick;
  window.removeBndBox = removeBndBoxBtnClick;
  window.readURL = readURL;
}

export { assignButtonEvents as default };
