import { reassignReferenceToNewCanvas } from '../../../canvas/canvas';
import { interruptAllCanvasEvents } from '../../../canvas/mouseInteractions/mouseEvents/resetCanvasUtils/resetCanvasState';
import { removeActiveButtonPopover } from '../../globalStyling/buttons/popovers';
import { canSwitchImage } from '../imageList';

function interruptAllCanvasEventsBeforeFuncWInputs(placeHolder, funcObj, input) {
  removeActiveButtonPopover();
  interruptAllCanvasEvents();
  funcObj.resetCanvasEventsToDefault();
  funcObj.uploadImageFiles(input);
}

function removeButtonPopoverIfActive(func) {
  removeActiveButtonPopover();
  if (func) func();
}

function replaceExistingCanvas(func, func2, direction) {
  removeActiveButtonPopover();
  if (canSwitchImage(direction)) {
    reassignReferenceToNewCanvas();
    interruptAllCanvasEvents();
    if (func) func(direction);
    if (func2) func2();
  }
}

export {
  interruptAllCanvasEventsBeforeFuncWInputs, removeButtonPopoverIfActive, replaceExistingCanvas,
};
