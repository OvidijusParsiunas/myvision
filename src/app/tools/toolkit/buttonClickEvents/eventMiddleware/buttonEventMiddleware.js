import { isLabelling } from '../../../labellerModal/labellingProcess.js';
import {
  interruptAllCanvasEvents, interruptCanvasToStartAddPoints,
} from '../../../../canvas/mouseInteractions/mouseEvents/resetCanvasUtils/resetCanvasState.js';
import { getRemovingPolygonPointsState, getPolygonDrawingInProgressState } from '../../../state.js';
import { removeActiveButtonPopover } from '../../../globalStyling/buttons/popovers.js';
import isLeftMouseButtonClick from '../../../utils/buttons/clickEvents.js';
import isElement from '../../../utils/elementType.js';


function interruptAllCanvasEventsBeforeFunc(func, event) {
  if (event && !isLeftMouseButtonClick(event)) return;
  removeActiveButtonPopover();
  interruptAllCanvasEvents();
  if (func) func();
}

function func1IfDrawRemovePointsElseInterruptAllWthFunc2(func1, func2, event) {
  if (event && !isLeftMouseButtonClick(event)) return;
  removeActiveButtonPopover();
  if (getRemovingPolygonPointsState() && getPolygonDrawingInProgressState()) {
    if (func1) func1();
  } else if (func2) {
    interruptAllCanvasEvents();
    func2();
  }
}

function interruptAllCanvasEventsBeforeMultipleFunc(funcs, event) {
  if (event && !isLeftMouseButtonClick(event)) return;
  removeActiveButtonPopover();
  interruptAllCanvasEvents();
  funcs.forEach((func) => { func(); });
}

function doNothingIfLabellingInProgress(func, element, event) {
  if (event && !isLeftMouseButtonClick(event)) return;
  if (isElement(element) && element.classList.contains('toolkit-button-disabled')) return;
  removeActiveButtonPopover();
  if (!isLabelling()) {
    if (func) func();
  }
}

function doNothingIfLabellingOrAddingNewPoints(func, element, event) {
  if (event && !isLeftMouseButtonClick(event)) return;
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

export {
  doNothingIfLabellingInProgress,
  interruptAllCanvasEventsBeforeFunc,
  doNothingIfLabellingOrAddingNewPoints,
  interruptAllCanvasEventsBeforeMultipleFunc,
  interruptAllCanvasEventsIfLabellingInProgress,
  func1IfDrawRemovePointsElseInterruptAllWthFunc2,
};
