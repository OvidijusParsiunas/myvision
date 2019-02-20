import { createNewBndBoxBtnClick, removeBndBoxBtnClick } from './boundingBox';

function assignButtonEvents() {
  window.createNewBndBox = createNewBndBoxBtnClick;
  window.removeBndBox = removeBndBoxBtnClick;
}

export { assignButtonEvents as default };
