import interruptNewShapeDrawingWthFunc1OrExecFunc2 from './buttonMiddleWare';
import { resetCanvasEventsToDefault } from '../../toolkit/buttonClickEvents/facade';
import { removeActiveLabel } from '../removeLabels/removeLabels';

// change labels-list naming convention to label-list

function removeActiveShapeBtnClick() {
  removeActiveLabel();
}

function initialiseLabelListButtonClickEvents() {
  window.removeLabel = interruptNewShapeDrawingWthFunc1OrExecFunc2.bind(this,
    resetCanvasEventsToDefault, removeActiveShapeBtnClick);
}

export { initialiseLabelListButtonClickEvents as default };
