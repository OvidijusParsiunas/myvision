import { reassignReferenceToNewCanvas } from '../../../canvas/canvas.js';
import { interruptAllCanvasEvents } from '../../../canvas/mouseInteractions/mouseEvents/resetCanvasUtils/resetCanvasState.js';
import { removeActiveButtonPopover } from '../../globalStyling/buttons/popovers.js';
import { canSwitchImage } from '../imageList.js';
import isLeftMouseButtonClick from '../../utils/buttons/clickEvents.js';

function interruptAllCanvasEventsBeforeFuncWInputs(placeHolder, funcObj, input) {
  removeActiveButtonPopover();
  interruptAllCanvasEvents();
  funcObj.resetCanvasEventsToDefault();
  funcObj.uploadImageFiles(input);
}

function replaceExistingCanvas(func, func2, direction, event) {
  if (event && !isLeftMouseButtonClick(event)) return;
  removeActiveButtonPopover();
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
