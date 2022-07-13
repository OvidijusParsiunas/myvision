import { reassignReferenceToNewCanvas } from '../../../canvas/canvas';
import { interruptAllCanvasEvents } from '../../../canvas/mouseInteractions/mouseEvents/resetCanvasUtils/resetCanvasState';
import { canSwitchImage } from '../imageList';
import isLeftMouseButtonClick from '../../utils/buttons/clickEvents';

function interruptAllCanvasEventsBeforeFuncWInputs(placeHolder, funcObj, input) {
  interruptAllCanvasEvents();
  funcObj.resetCanvasEventsToDefault();
  funcObj.uploadImageFiles(input);
}

function replaceExistingCanvas(func, func2, direction, event) {
  if (event && !isLeftMouseButtonClick(event)) return;
  if (canSwitchImage(direction)) {
    reassignReferenceToNewCanvas();
    interruptAllCanvasEvents();
    if (func) func(direction);
    if (func2) func2();
  }
}

export {
  interruptAllCanvasEventsBeforeFuncWInputs, replaceExistingCanvas,
};
