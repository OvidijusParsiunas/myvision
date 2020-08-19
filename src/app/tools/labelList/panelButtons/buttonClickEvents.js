import interruptNewShapeDrawingWthFunc1OrExecFunc2 from './buttonMiddleWare';
import { resetCanvasEventsToDefault } from '../../toolkit/buttonClickEvents/facade';
import { removeActiveLabel } from '../removeLabels/removeLabels';

function removeActiveLabelBtnClick() {
  removeActiveLabel();
}

function initialiseLabelListButtonClickEvents() {
  window.removeLabel = interruptNewShapeDrawingWthFunc1OrExecFunc2.bind(this,
    resetCanvasEventsToDefault, removeActiveLabelBtnClick);
}

export { initialiseLabelListButtonClickEvents as default };
