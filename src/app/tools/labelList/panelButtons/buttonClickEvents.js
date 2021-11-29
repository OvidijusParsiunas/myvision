import interruptNewShapeDrawingWthFunc1OrExecFunc2 from './buttonMiddleWare.js';
import { resetCanvasEventsToDefault } from '../../toolkit/buttonClickEvents/facade.js';
import { removeActiveLabel } from '../removeLabels/removeLabels.js';

function removeActiveLabelBtnClick() {
  removeActiveLabel();
}

function initialiseLabelListButtonClickEvents() {
  window.removeLabel = interruptNewShapeDrawingWthFunc1OrExecFunc2.bind(this,
    resetCanvasEventsToDefault, removeActiveLabelBtnClick);
}

export { initialiseLabelListButtonClickEvents as default };
