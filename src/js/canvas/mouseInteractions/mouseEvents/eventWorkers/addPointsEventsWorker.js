import { removeEditedPolygonId } from './editPolygonEventsWorker';
import {
  removePolygonPoints, getPolygonEditingStatus, setEditablePolygon,
  getPolygonIdIfEditing, initializeAddNewPoints, addFirstPoint,
  addPoint, completePolygon, drawLineOnMouseMove, moveAddablePoint,
  addPointsMouseOver, resetAddPointProperties, addPointsMouseOut,
} from '../../../objects/polygon/alterPolygon/alterPolygon';
import { enableActiveObjectsAppearInFront, preventActiveObjectsAppearInFront } from '../../../utils/canvasUtils';
import { resetCanvasEventsToDefault, setContinuousDrawingModeToLast } from '../resetCanvasUtils/resetCanvasEventsFacade';
import {
  getContinuousDrawingState, getCancelledReadyToDrawState, getRemovingPointsAfterCancelDrawState,
  getCurrentZoomState, getDoubleScrollCanvasState,
} from '../../../../tools/toolkit/buttonEvents/facadeWorkersUtils/stateManager';

let selectedPolygonId = null;
let newPolygonSelected = false;
let canvas = null;
let addingPoints = false;
let selectedNothing = false;
let addFirstPointMode = false;
let coordinatesOfLastMouseHover = null;
let mouseIsDownOnTempPoint = false;

function isRightMouseButtonClicked(pointer) {
  if (coordinatesOfLastMouseHover.x !== pointer.x) {
    return true;
  }
  return false;
}

function mouseOverEvents(event) {
  addPointsMouseOver(event);
}

function setAddPointsEventsCanvas(canvasObj) {
  canvas = canvasObj;
  selectedPolygonId = getPolygonIdIfEditing();
  addingPoints = false;
  addFirstPointMode = false;
  resetAddPointProperties(canvasObj);
}

function prepareToAddPolygonPoints(event) {
  removePolygonPoints();
  removeEditedPolygonId();
  setEditablePolygon(canvas, event.target, false, false, true);
  selectedPolygonId = event.target.id;
  // should not be managed here
}

function moveAddPoints(event) {
  if (addingPoints) {
    moveAddablePoint(event);
  }
}

function mouseMove(event) {
  if (addingPoints) {
    const pointer = canvas.getPointer(event.e);
    coordinatesOfLastMouseHover = pointer;
    drawLineOnMouseMove(pointer);
  }
}

function pointMouseDownEvents(event) {
  if (!addingPoints) {
    if (event.target) {
      enableActiveObjectsAppearInFront(canvas);
      if (event.target.shapeName === 'point') {
        initializeAddNewPoints(event);
        addingPoints = true;
        addFirstPointMode = true;
      } else {
        if (event.target.shapeName === 'polygon') {
          newPolygonSelected = (event.target.id !== selectedPolygonId);
        }
        preventActiveObjectsAppearInFront(canvas);
      }
      selectedNothing = false;
    } else {
      selectedNothing = true;
    }
  } else if (addFirstPointMode) {
    if (!event.target || (event.target && (event.target.shapeName !== 'point' && event.target.shapeName !== 'initialAddPoint'))) {
      const pointer = canvas.getPointer(event.e);
      if (!isRightMouseButtonClicked(pointer)) {
        addFirstPoint(event);
        addFirstPointMode = false;
      }
    }
  } else if (event.target && event.target.shapeName === 'point') {
    addingPoints = false;
    completePolygon(event.target);
    if (getContinuousDrawingState()
    && (getCancelledReadyToDrawState() || getRemovingPointsAfterCancelDrawState())) {
      removePolygonPoints();
      setContinuousDrawingModeToLast();
    } else {
      resetCanvasEventsToDefault();
    }
  } else if (!event.target
      || (event.target && (event.target.shapeName !== 'initialAddPoint' && event.target.shapeName !== 'tempPoint'))) {
    const pointer = canvas.getPointer(event.e);
    if (!isRightMouseButtonClicked(pointer)) {
      addPoint(pointer);
    }
  } else if (event.target && event.target.shapeName === 'tempPoint') {
    mouseIsDownOnTempPoint = true;
  }
}

function pointMouseUpEvents(event) {
  mouseIsDownOnTempPoint = false;
  if (event.target && event.target.shapeName === 'polygon' && (newPolygonSelected || selectedNothing)) {
    prepareToAddPolygonPoints(event);
    selectedNothing = false;
    newPolygonSelected = false;
  } else if ((!event.target && getPolygonEditingStatus()) || (event.target && event.target.shapeName === 'bndBox')) {
    if (!addingPoints) {
      removePolygonPoints();
      selectedPolygonId = null;
    }
  }
}

function mouseOutEvents(event) {
  addPointsMouseOut(event);
}

function getSelectedPolygonIdForAddPoints() {
  return selectedPolygonId;
}
function getScrollWidth() {
  // create a div with the scroll
  const div = document.createElement('div');
  div.style.overflowY = 'scroll';
  div.style.width = '50px';
  div.style.height = '50px';

  // must put it in the document, otherwise sizes will be 0
  document.body.append(div);
  const scrollWidth = div.offsetWidth - div.clientWidth;
  div.remove();
  return scrollWidth * 2;
}

function topOverflowScroll(event, zoomOverflowElement) {
  const currentScrollTopOffset = zoomOverflowElement.scrollTop / getCurrentZoomState();
  const newPositionTop = canvas.getPointer(event.e).y - currentScrollTopOffset;
  if (mouseIsDownOnTempPoint && event.target && event.target.shapeName === 'tempPoint') {
    event.target.top = newPositionTop;
    moveAddablePoint(event);
  }
  drawLineOnMouseMove({ x: canvas.getPointer(event.e).x, y: newPositionTop });
}

function bottomOverflowScroll(event, zoomOverflowElement, stubHeight, scrollWidth) {
  const canvasHeight = stubHeight + scrollWidth;
  const canvasBottom = zoomOverflowElement.scrollTop + zoomOverflowElement.offsetHeight;
  const result = canvasHeight - canvasBottom;
  const newPositionTop = canvas.getPointer(event.e).y + (result / getCurrentZoomState());
  if (mouseIsDownOnTempPoint && event.target && event.target.shapeName === 'tempPoint') {
    event.target.top = newPositionTop;
    moveAddablePoint(event);
  }
  drawLineOnMouseMove({ x: canvas.getPointer(event.e).x, y: newPositionTop });
}

function defaultScroll(event) {
  const currentVerticalScrollDelta = event.e.deltaY / getCurrentZoomState();
  const newPositionTop = canvas.getPointer(event.e).y + currentVerticalScrollDelta;
  if (mouseIsDownOnTempPoint && event.target && event.target.shapeName === 'tempPoint') {
    event.target.top = newPositionTop;
    moveAddablePoint(event);
  }
  drawLineOnMouseMove({ x: canvas.getPointer(event.e).x, y: newPositionTop });
}

// didn't go for scrolling when resizing bounding box, because when holding lower corner
// and scrolling up above it, the lower corner doesn't change to upper corner, causing the rectangle
// to move the bottom corner to the top corner
function shapeScrollEvents(event) {
  const currentZoom = getCurrentZoomState();
  if (currentZoom > 1.00001) {
    const stubElement = document.getElementById('stub');
    const stubMarginTop = stubElement.style.marginTop;
    const stubHeightSubstring = stubMarginTop.substring(0, stubMarginTop.length - 2);
    const stubHeight = parseInt(stubHeightSubstring, 10);
    const zoomOverflowElement = document.getElementById('zoom-overflow');
    const currentBotLocation = zoomOverflowElement.scrollTop + zoomOverflowElement.offsetHeight;
    const futureBotLocation = currentBotLocation + event.e.deltaY;
    const scrollWidth = getDoubleScrollCanvasState() ? getScrollWidth() : getScrollWidth() / 2;
    if (zoomOverflowElement.scrollTop + event.e.deltaY < 0) {
      topOverflowScroll(event, zoomOverflowElement);
    } else if (futureBotLocation > stubHeight + scrollWidth) {
      bottomOverflowScroll(event, zoomOverflowElement, stubHeight, scrollWidth);
    } else {
      defaultScroll(event);
    }
  }
}

export {
  mouseMove,
  moveAddPoints,
  mouseOutEvents,
  mouseOverEvents,
  shapeScrollEvents,
  pointMouseUpEvents,
  pointMouseDownEvents,
  setAddPointsEventsCanvas,
  getSelectedPolygonIdForAddPoints,
};
