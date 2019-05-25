import { isLabelling } from '../../labellerPopUp/labellingProcess';
import {
  interruptCanvasEventsNoPolygonPointRemoval, interruptAllCanvasEvents,
} from '../../../canvas/mouseInteractions/mouseEvents/resetCanvasUtils/resetCanvasState';

function interruptAllCanvasEventsBeforeFunc(func) {
  interruptAllCanvasEvents();
  if (func) func();
}

function interruptAllCanvasEventsBeforeMultipleFunc(...funcs) {
  interruptAllCanvasEvents();
  funcs.forEach((func) => { func(); });
}

function interruptCanvasEventsNoPointRemovalBeforeFunc(func) {
  interruptCanvasEventsNoPolygonPointRemoval();
  if (func) func();
}

function interruptCanvasEventsAfterFunc(...funcs) {
  funcs.forEach((func) => { func(); });
  interruptAllCanvasEvents();
}

function interruptAllCanvasEventsBeforeFuncWInputs(placeHolder, funcObj, input) {
  interruptAllCanvasEvents();
  funcObj.resetCanvasEventsToDefault();
  funcObj.uploadImageBtnClick(input);
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
  doNothingIfLabellingInProgress,
  interruptCanvasEventsAfterFunc,
  interruptAllCanvasEventsBeforeFunc,
  interruptAllCanvasEventsBeforeFuncWInputs,
  interruptAllCanvasEventsBeforeMultipleFunc,
  interruptCanvasEventsNoPointRemovalBeforeFunc,
  interruptAllCanvasEventsIfLabellingInProgress,
};
