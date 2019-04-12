import { isLabelling } from '../../labellerPopUp/labellingProcess';
import interruptAllCanvasEvents from '../../../canvas/mouseInteractions/mouseEvents/resetCanvasUtils/resetCanvasState';

function interruptCanvasEventsBeforeFunc(func) {
  interruptAllCanvasEvents();
  if (func) func();
}

function interruptCanvasEventsBeforeFuncWParams(placeHolder, func, input) {
  interruptAllCanvasEvents();
  if (func) func(input);
}

function doNothingIfLabellingInProgress(func) {
  if (!isLabelling()) {
    if (func) func();
  }
}

function interruptAllCanvasEventsIfLabellingInProgress(func) {
  if (isLabelling()) {
    interruptAllCanvasEvents();
  }
  if (func) func();
}

export {
  interruptCanvasEventsBeforeFunc,
  interruptCanvasEventsBeforeFuncWParams,
  interruptAllCanvasEventsIfLabellingInProgress,
  doNothingIfLabellingInProgress,
};
