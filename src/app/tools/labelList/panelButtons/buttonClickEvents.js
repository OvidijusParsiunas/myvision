import interruptNewShapeDrawingWthFunc1OrExecFunc2 from './buttonMiddleWare';
import { resetCanvasEventsToDefault } from '../../toolkit/buttonClickEvents/facade';
import { removeActiveLabel } from '../removeLabels/removeLabels';

function removeActiveShapeBtnClick() {
//   removeActiveLabel(canvas);
}

function initialiseImageListButtonClickEvents() {
  window.removeShape = interruptNewShapeDrawingWthFunc1OrExecFunc2.bind(this,
    resetCanvasEventsToDefault, removeActiveShapeBtnClick);
}

export { initialiseImageListButtonClickEvents as default };
