import { isLabelling } from '../../labellerPopUp/labellingProcess';
import {
  interruptCanvasEventsNoPolygonPointRemoval, interruptAllCanvasEvents,
} from '../../../canvas/mouseInteractions/mouseEvents/resetCanvasUtils/resetCanvasState';

function interruptAllCanvasEventsBeforeFunc(func) {
  interruptAllCanvasEvents();
  if (func) func();
}

function interruptCanvasEventsNoPointRemovalBeforeFunc(func) {
  interruptCanvasEventsNoPolygonPointRemoval();
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
  interruptAllCanvasEventsBeforeFunc,
  interruptCanvasEventsAfterFunc,
  doNothingIfLabellingInProgress,
  // rename
  interruptCanvasEventsBeforeFuncWParams,
  interruptCanvasEventsNoPointRemovalBeforeFunc,
  interruptAllCanvasEventsIfLabellingInProgress,
};
