import { isLabelling } from '../../labellerPopUp/labellingProcess';
import {
  interruptAllCanvasEvents, interruptCanvasToStartAddPoints,
} from '../../../canvas/mouseInteractions/mouseEvents/resetCanvasUtils/resetCanvasState';

function interruptAllCanvasEventsBeforeFunc(func) {
  interruptAllCanvasEvents();
  if (func) func();
}

function interruptAllCanvasEventsBeforeMultipleFunc(...funcs) {
  interruptAllCanvasEvents();
  funcs.forEach((func) => { func(); });
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

function doNothingIfLabellingOrAddingNewPoints(func) {
  if (!isLabelling()) {
    interruptCanvasToStartAddPoints();
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
  doNothingIfLabellingOrAddingNewPoints,
  interruptAllCanvasEventsBeforeFuncWInputs,
  interruptAllCanvasEventsBeforeMultipleFunc,
  interruptAllCanvasEventsIfLabellingInProgress,
};
