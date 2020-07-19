import { isLabelling } from '../../../labellerModal/labellingProcess';
import {
  interruptAllCanvasEvents, interruptCanvasToStartAddPoints,
} from '../../../../canvas/mouseInteractions/mouseEvents/resetCanvasUtils/resetCanvasState';
import { getContinuousDrawingState, getRemovingPolygonPointsState, getPolygonDrawingInProgressState } from '../../../state';
import { removeActiveButtonPopover } from '../../../globalStyling/buttons/popovers';

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

function removeButtonPopoverIfActive(func) {
  removeActiveButtonPopover();
  if (func) func();
}

export {
  removeButtonPopoverIfActive,
  doNothingIfLabellingInProgress,
  interruptAllCanvasEventsBeforeFunc,
  doNothingIfLabellingOrAddingNewPoints,
  interruptAllCanvasEventsBeforeMultipleFunc,
  interruptNewShapeDrawingWthFunc1OrExecFunc2,
  interruptAllCanvasEventsIfLabellingInProgress,
  func1IfDrawRemovePointsElseInterruptAllWthFunc2,
};
