import { interruptAllCanvasEvents } from '../../../canvas/mouseInteractions/mouseEvents/resetCanvasUtils/resetCanvasState';
import { removeActiveButtonPopover } from '../../globalStyling/buttons/popovers';
import { reassignReferenceToNewCanvas } from '../../../canvas/canvas';
import isLeftMouseButtonClick from '../../utils/buttons/clickEvents';
import { canSwitchImage } from '../imageList';

function interruptAllCanvasEventsBeforeFuncWInputs(_, funcObj, input, event) {
  removeActiveButtonPopover();
  interruptAllCanvasEvents();
  funcObj.resetCanvasEventsToDefault();
  funcObj.uploadImageFiles(input);
  event.target.value = ''; // resetting to prevent Chrome issue of not being able to upload same file twice
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
