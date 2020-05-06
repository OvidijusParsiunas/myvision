import { isLabelling } from '../../../labellerModal/labellingProcess';
import {
  interruptAllCanvasEvents, interruptCanvasToStartAddPoints,
} from '../../../../canvas/mouseInteractions/mouseEvents/resetCanvasUtils/resetCanvasState';
import { reassignReferenceToNewCanvas } from '../../../../canvas/canvas';
import { getContinuousDrawingState, getRemovingPolygonPointsState, getPolygonDrawingInProgressState } from '../../../stateMachine';
import { canSwitchImage } from '../../../imageList/imageList';
import { removeActiveButtonPopover } from '../../../globalStyling/coreButtonPopovers';

function interruptAllCanvasEventsBeforeFunc(func) {
  removeActiveButtonPopover();
  interruptAllCanvasEvents();
  if (func) func();
}

function func1IfDrawRemovePointsElseInterruptAllWthFunc2(func1, func2) {
  removeActiveButtonPopover();
  if (getRemovingPolygonPointsState() && getPolygonDrawingInProgressState()) {
    if (func1) func1();
  } else if (func2) {
    interruptAllCanvasEvents();
    func2();
  }
}

function interruptAllCanvasEventsBeforeMultipleFunc(...funcs) {
  removeActiveButtonPopover();
  interruptAllCanvasEvents();
  funcs.forEach((func) => { func(); });
}

function interruptNewShapeDrawingWthFunc1OrExecFunc2(func1, func2) {
  removeActiveButtonPopover();
  if ((getPolygonDrawingInProgressState() || isLabelling()) && !getContinuousDrawingState()) {
    interruptAllCanvasEvents();
    func1();
  } else if (func2) {
    func2();
  }
}

function interruptAllCanvasEventsBeforeFuncWInputs(placeHolder, funcObj, input) {
  removeActiveButtonPopover();
  interruptAllCanvasEvents();
  funcObj.resetCanvasEventsToDefault();
  funcObj.uploadImagesInputClick(input);
}

function isElement(element) {
  return element instanceof Element || element instanceof HTMLDocument;
}

function doNothingIfLabellingInProgress(func, element) {
  if (isElement(element) && element.classList.contains('toolkit-button-disabled')) return;
  removeActiveButtonPopover();
  if (!isLabelling()) {
    if (func) func();
  }
}

function doNothingIfLabellingOrAddingNewPoints(func, element) {
  if (isElement(element) && element.classList.contains('toolkit-button-disabled')) return;
  removeActiveButtonPopover();
  if (!isLabelling() && !getPolygonDrawingInProgressState()) {
    interruptCanvasToStartAddPoints();
    if (func) func();
  }
}

function interruptAllCanvasEventsIfLabellingInProgress(func) {
  removeActiveButtonPopover();
  if (isLabelling()) {
    interruptAllCanvasEvents();
  }
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

function removeButtonPopIfActive(func) {
  removeActiveButtonPopover();
  if (func) func();
}

function removeButtonPopIfActiveWithParam(func, arg) {
  removeActiveButtonPopover();
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
