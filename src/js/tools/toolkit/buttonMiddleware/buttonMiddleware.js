import { isLabelling } from '../../labellerPopUp/labellingProcess';
import {
  interruptAllCanvasEvents, interruptCanvasToStartAddPoints,
} from '../../../canvas/mouseInteractions/mouseEvents/resetCanvasUtils/resetCanvasState';
import { isPolygonDrawingInProgress } from '../../../canvas/objects/polygon/polygon';
import { getContinuousDrawingState } from '../buttonEvents/facadeWorkersUtils/stateManager';

function interruptAllCanvasEventsBeforeFunc(func) {
  interruptAllCanvasEvents();
  if (func) func();
}

function interruptAllCanvasEventsBeforeMultipleFunc(...funcs) {
  interruptAllCanvasEvents();
  funcs.forEach((func) => { func(); });
}

function interruptNewShapeDrawingWthFunc1OrExecFunc2(func1, func2) {
  if ((isPolygonDrawingInProgress() || isLabelling()) && !getContinuousDrawingState()) {
    interruptAllCanvasEvents();
    func1();
  } else if (func2) {
    func2();
  }
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
  interruptAllCanvasEventsBeforeFunc,
  doNothingIfLabellingOrAddingNewPoints,
  interruptAllCanvasEventsBeforeFuncWInputs,
  interruptAllCanvasEventsBeforeMultipleFunc,
  interruptNewShapeDrawingWthFunc1OrExecFunc2,
  interruptAllCanvasEventsIfLabellingInProgress,
};
