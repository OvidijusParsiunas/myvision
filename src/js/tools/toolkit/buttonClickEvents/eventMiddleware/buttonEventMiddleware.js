import { isLabelling } from '../../../shapeLabellerModal/labellingProcess';
import {
  interruptAllCanvasEvents, interruptCanvasToStartAddPoints,
} from '../../../../canvas/mouseInteractions/mouseEvents/resetCanvasUtils/resetCanvasState';
import { reassignReferenceToNewCanvas } from '../../../../canvas/canvas';
import { getContinuousDrawingState, getRemovingPolygonPointsState, getPolygonDrawingInProgressState } from '../../../stateMachine';
import { canSwitchImage } from '../../../imageList/imageList';
import { removeActiveButtonPopup } from '../../buttonHoverEvents/buttonHoverEvents';

function interruptAllCanvasEventsBeforeFunc(func) {
  removeActiveButtonPopup();
  interruptAllCanvasEvents();
  if (func) func();
}

function func1IfDrawRemovePointsElseInterruptAllWthFunc2(func1, func2) {
  removeActiveButtonPopup();
  if (getRemovingPolygonPointsState() && getPolygonDrawingInProgressState()) {
    if (func1) func1();
  } else if (func2) {
    interruptAllCanvasEvents();
    func2();
  }
}

function interruptAllCanvasEventsBeforeMultipleFunc(...funcs) {
  removeActiveButtonPopup();
  interruptAllCanvasEvents();
  funcs.forEach((func) => { func(); });
}

function interruptNewShapeDrawingWthFunc1OrExecFunc2(func1, func2) {
  removeActiveButtonPopup();
  if ((getPolygonDrawingInProgressState() || isLabelling()) && !getContinuousDrawingState()) {
    interruptAllCanvasEvents();
    func1();
  } else if (func2) {
    func2();
  }
}

function interruptAllCanvasEventsBeforeFuncWInputs(placeHolder, funcObj, input) {
  removeActiveButtonPopup();
  interruptAllCanvasEvents();
  funcObj.resetCanvasEventsToDefault();
  funcObj.uploadImageInputClick(input);
}

function doNothingIfLabellingInProgress(func) {
  removeActiveButtonPopup();
  if (!isLabelling()) {
    if (func) func();
  }
}

function doNothingIfLabellingOrAddingNewPoints(func) {
  removeActiveButtonPopup();
  if (!isLabelling() && !getPolygonDrawingInProgressState()) {
    interruptCanvasToStartAddPoints();
    if (func) func();
  }
}

function interruptAllCanvasEventsIfLabellingInProgress(func) {
  removeActiveButtonPopup();
  if (isLabelling()) {
    interruptAllCanvasEvents();
  }
  if (func) func();
}

function replaceExistingCanvas(func, func2, direction) {
  removeActiveButtonPopup();
  if (canSwitchImage(direction)) {
    reassignReferenceToNewCanvas();
    interruptAllCanvasEvents();
    if (func) func(direction);
    if (func2) func2();
  }
}

function removeButtonPopIfActive(func) {
  removeActiveButtonPopup();
  if (func) func();
}

function removeButtonPopIfActiveWithParam(func, arg) {
  removeActiveButtonPopup();
  func(arg);
}

export {
  replaceExistingCanvas,
  removeButtonPopIfActive,
  doNothingIfLabellingInProgress,
  removeButtonPopIfActiveWithParam,
  interruptAllCanvasEventsBeforeFunc,
  doNothingIfLabellingOrAddingNewPoints,
  interruptAllCanvasEventsBeforeFuncWInputs,
  interruptAllCanvasEventsBeforeMultipleFunc,
  interruptNewShapeDrawingWthFunc1OrExecFunc2,
  interruptAllCanvasEventsIfLabellingInProgress,
  func1IfDrawRemovePointsElseInterruptAllWthFunc2,
};
