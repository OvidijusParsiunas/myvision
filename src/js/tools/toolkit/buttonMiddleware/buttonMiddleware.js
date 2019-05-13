import { isLabelling } from '../../labellerPopUp/labellingProcess';
import {
  interruptAllCanvasEventsNoPolygonPointRemoval, interruptAllCanvasEvents,
} from '../../../canvas/mouseInteractions/mouseEvents/resetCanvasUtils/resetCanvasState';

function interruptCanvasEventsBeforeFunc(func) {
  interruptAllCanvasEvents();
  if (func) func();
}

function interruptCanvasEventsNoPointRemovalBeforeFunc(func) {
  interruptAllCanvasEventsNoPolygonPointRemoval();
  if (func) func();
}

function interruptCanvasEventsAfterFunc(...funcs) {
  funcs.forEach((func) => { func(); });
  interruptAllCanvasEvents();
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
  interruptCanvasEventsAfterFunc,
  doNothingIfLabellingInProgress,
  // rename
  interruptCanvasEventsBeforeFuncWParams,
  interruptCanvasEventsNoPointRemovalBeforeFunc,
  interruptAllCanvasEventsIfLabellingInProgress,
};
