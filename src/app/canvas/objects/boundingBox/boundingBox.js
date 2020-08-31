import fabric from 'fabric';
import boundingBoxProperties from './properties';
import { prepareLabelShape } from '../../../tools/labellerModal/labellingProcess';
import { showLabellerModal } from '../../../tools/labellerModal/style';
import { setDrawCursorMode } from '../../mouseInteractions/cursorModes/drawMode';
import {
  removeCrosshair, moveCanvasCrosshairViaLastCanvasPositionAsync,
  setDrawWithCrosshairMode, moveCanvasCrosshair, moveCanvasCrosshairDefault,
} from '../../mouseInteractions/cursorModes/drawWithCrosshairMode';
import {
  setBoundingBoxDrawingInProgressState, getAddingPolygonPointsState,
  getCrosshairModeOnState, setSessionDirtyState, setReadyToDrawShapeState,
  getDoubleScrollCanvasState, getCurrentZoomState, setAddingPolygonPointsState,
  getMovableObjectsState, getBoundingBoxDrawingInProgressState, setcrosshairModeOnState,
} from '../../../tools/state';
import { getImageProperties } from '../../../tools/imageList/uploadImages/drawImageOnCanvas';
import { preventOutOfBoundsOnNewObject } from '../sharedUtils/newObjectBlockers';
import { setAddPointsButtonToDefault, setCreateBoundingBoxButtonToActive } from '../../../tools/toolkit/styling/state';
import { getScrollbarWidth } from '../../../tools/globalStyling/style';
import { getLastMouseMoveEvent } from '../../../keyEvents/mouse/mouseMove';
import { removeExecutedFunctionOnMouseOver, removeExecutedFunctionOnMouseOut } from '../../../keyEvents/mouse/mouseOverOut';

let canvas = null;
let createNewBoundingBoxBtnClicked = false;
let leftMouseBtnDown = false;
const boundingBoxProps = {};
let boundingBox = null;
let lastMouseEvent = null;
let drawingFinished = false;
let finishDrawingBoundingBoxClick = null;
let rightBoundingBoxDelta = 0;

function checkCanvasBoundaries(pointer) {
  if (getCurrentZoomState() > 1.00001) {
    const { height, width } = getImageProperties();
    const imageHeight = height * getCurrentZoomState();
    const imageWidth = width * getCurrentZoomState();
    if (pointer.x > imageWidth / getCurrentZoomState() - getCurrentZoomState()) {
      pointer.x = imageWidth / getCurrentZoomState() - 2;
    }
    if (pointer.y > imageHeight / getCurrentZoomState() - getCurrentZoomState()) {
      pointer.y = imageHeight / getCurrentZoomState() - 1.5;
    }
  } else {
    if (pointer.x > canvas.width - rightBoundingBoxDelta) {
      pointer.x = canvas.width - rightBoundingBoxDelta;
    }
    if (pointer.y > canvas.height - 1.5) {
      pointer.y = canvas.height - 1.5;
    }
  }
}

function instantiateNewBoundingBox() {
  if (createNewBoundingBoxBtnClicked && !getBoundingBoxDrawingInProgressState()) {
    let pointer = canvas.getPointer(lastMouseEvent.e);
    if (!pointer.x || !pointer.y) {
      const lastMouseMoveEvent = getLastMouseMoveEvent();
      const lastCanvasPointer = canvas.getPointer(lastMouseMoveEvent);
      if (!lastCanvasPointer.x || !lastCanvasPointer.y) return;
      pointer = canvas.getPointer(lastMouseMoveEvent);
    }
    checkCanvasBoundaries(pointer);
    leftMouseBtnDown = true;
    boundingBoxProps.origX = pointer.x < 0 ? 0 : pointer.x;
    boundingBoxProps.origY = pointer.y < 0 ? 0 : pointer.y;
    boundingBox = new fabric.Rect(boundingBoxProperties.tempBoundingBoxProps(boundingBoxProps));
    canvas.add(boundingBox);
    setBoundingBoxDrawingInProgressState(true);
  }
}

function deselectBoundingBox() {
  if (canvas) {
    canvas.discardActiveObject();
    canvas.renderAll();
  }
}

function setCursorMode(resetting) {
  setcrosshairModeOnState(true);
  if (getCrosshairModeOnState()) {
    setDrawWithCrosshairMode(canvas, resetting);
  } else {
    setDrawCursorMode(canvas);
  }
}

function resetDrawBoundingBoxMode() {
  setCreateBoundingBoxButtonToActive();
  setReadyToDrawShapeState(true);
  setCursorMode(true);
  createNewBoundingBoxBtnClicked = true;
  drawingFinished = false;
  setBoundingBoxDrawingInProgressState(false);
}

function clearBoundingBoxData() {
  if (getBoundingBoxDrawingInProgressState()) {
    canvas.remove(boundingBox);
    boundingBox = null;
    resetDrawBoundingBoxMode();
    leftMouseBtnDown = false;
  }
  setBoundingBoxDrawingInProgressState(false);
  removeExecutedFunctionOnMouseOver();
  removeExecutedFunctionOnMouseOut();
  removeCrosshair(canvas);
}

// if the right or bottom side of the drawn bounding box look a bit too far,
// then reduce the delta values

// confirm dimming timings are appropriate for redrawing the crosshair when the user closes a modal
//   otherwise use case statements to speed up the dimming in a variety of modes
// increase overall crosshair thickness for firefox
// create button to toggle crosshair in settings
// use a crosshairDisplayedStatus
// ----
// check if drawing on a small image and uploading bigger should keep crosshair at original position

let mouseMovedLeft = false;
let mouseMovedTop = false;

function drawBoundingBox(event) {
  lastMouseEvent = event;
  if (getCrosshairModeOnState()) moveCanvasCrosshair(event, canvas);
  if (!leftMouseBtnDown) return;
  const pointer = canvas.getPointer(event.e);
  if (getCurrentZoomState() > 1.00001) {
    const { height, width } = getImageProperties();
    const imageHeight = height * getCurrentZoomState();
    const imageWidth = width * getCurrentZoomState();
    // right
    if (boundingBoxProps.origX < pointer.x) {
      if (pointer.x > imageWidth / getCurrentZoomState() - getCurrentZoomState()) {
        boundingBox.set(
          { width: imageWidth / getCurrentZoomState() - boundingBoxProps.origX - 2 },
        );
      } else if (mouseMovedLeft) {
        boundingBox.set({ left: boundingBoxProps.origX });
        boundingBox.set({ width: pointer.x - boundingBoxProps.origX });
        mouseMovedLeft = false;
      } else {
        boundingBox.set({ width: pointer.x - boundingBoxProps.origX });
      }
    }
    // bottom
    if (boundingBoxProps.origY < pointer.y) {
      if (pointer.y > imageHeight / getCurrentZoomState() - getCurrentZoomState()) {
        boundingBox.set(
          { height: imageHeight / getCurrentZoomState() - boundingBoxProps.origY - 1.5 },
        );
      } else if (mouseMovedTop) {
        boundingBox.set({ top: boundingBoxProps.origY });
        boundingBox.set({ height: pointer.y - boundingBoxProps.origY - 1.5 });
        mouseMovedTop = false;
      } else {
        boundingBox.set({ height: pointer.y - boundingBoxProps.origY - 1.5 });
      }
    }
  } else {
    // right
    if (boundingBoxProps.origX < pointer.x) {
      if (pointer.x > canvas.width - rightBoundingBoxDelta) {
        boundingBox.set({
          width: Math.floor(canvas.width - boundingBoxProps.origX - rightBoundingBoxDelta),
        });
      } else if (mouseMovedLeft) {
        boundingBox.set({ left: boundingBoxProps.origX });
        boundingBox.set({ width: pointer.x - boundingBoxProps.origX + 0.5 });
        mouseMovedLeft = false;
      } else {
        boundingBox.set({ width: pointer.x - boundingBoxProps.origX + 0.5 });
      }
    }
    // bottom
    if (boundingBoxProps.origY < pointer.y) {
      if (pointer.y > canvas.height) {
        boundingBox.set({ height: canvas.height - boundingBoxProps.origY - 1.5 });
      } else if (mouseMovedTop) {
        boundingBox.set({ top: boundingBoxProps.origY });
        boundingBox.set({ height: pointer.y - boundingBoxProps.origY - 1.5 });
        mouseMovedTop = false;
      } else {
        boundingBox.set({ height: pointer.y - boundingBoxProps.origY - 1.5 });
      }
    }
  }
  // top
  if (boundingBoxProps.origY > pointer.y) {
    if (pointer.y < 0) {
      boundingBox.set(({ top: 0 }));
      boundingBox.set({ height: boundingBoxProps.origY });
    } else {
      boundingBox.set({ top: pointer.y });
      boundingBox.set({ height: boundingBoxProps.origY - pointer.y });
      mouseMovedTop = true;
    }
  }
  // left
  if (boundingBoxProps.origX > pointer.x) {
    if (pointer.x < 0) {
      boundingBox.set(({ left: 0 }));
      boundingBox.set(({ width: boundingBoxProps.origX }));
    } else {
      boundingBox.set({ left: pointer.x });
      boundingBox.set({ width: boundingBoxProps.origX - pointer.x });
      mouseMovedLeft = true;
    }
  }
  canvas.renderAll();
}

function lockMovementIfAssertedByState(boundingBoxObj) {
  if (!getMovableObjectsState()) {
    const immovableObjectProps = {
      lockMovementX: true,
      lockMovementY: true,
      hoverCursor: 'default',
    };
    boundingBoxObj.set(immovableObjectProps);
  }
}

function isBoundingBoxDrawingFinished() {
  return drawingFinished;
}

function finishDrawingBoundingBoxFunc() {
  if (leftMouseBtnDown && getBoundingBoxDrawingInProgressState()) {
    createNewBoundingBoxBtnClicked = false;
    leftMouseBtnDown = false;
    boundingBox.setCoords();
    boundingBox.set(boundingBoxProperties.finalBoundingBoxProps());
    lockMovementIfAssertedByState(boundingBox);
    drawingFinished = true;
    setReadyToDrawShapeState(false);
    prepareLabelShape(boundingBox, canvas);
    const pointer = canvas.getPointer(lastMouseEvent.e);
    showLabellerModal(pointer.x, pointer.y);
    setBoundingBoxDrawingInProgressState(false);
    boundingBox = null;
    setSessionDirtyState(true);
  }
}

function finishDrawingBoundingBox() {
  finishDrawingBoundingBoxClick();
}

function assignSetEditablePolygonOnClickFunc() {
  finishDrawingBoundingBoxClick = finishDrawingBoundingBoxFunc;
}

function skipMouseUpEvent() {
  canvas.__eventListeners['mouse:down'] = [];
  canvas.on('mouse:down', () => {
    instantiateNewBoundingBox();
  });
  assignSetEditablePolygonOnClickFunc();
}

function setRightBoundingBoxDrawingDelta(delta) {
  rightBoundingBoxDelta = delta;
}

function prepareCanvasForNewBoundingBox(canvasObj) {
  canvas = canvasObj;
  createNewBoundingBoxBtnClicked = true;
  drawingFinished = false;
  setCursorMode();
  setReadyToDrawShapeState(true);
  canvas.discardActiveObject();
  if (getAddingPolygonPointsState()) {
    setAddPointsButtonToDefault();
    setAddingPolygonPointsState(false);
    finishDrawingBoundingBoxClick = skipMouseUpEvent;
  } else {
    finishDrawingBoundingBoxClick = finishDrawingBoundingBoxFunc;
  }
}

function prepareCanvasForNewBoundingBoxesFromExternalSources(canvasObj) {
  canvas = canvasObj;
  setDrawCursorMode(canvas);
}

function topOverflowScroll(event, zoomOverflowElement) {
  const currentScrollTopOffset = zoomOverflowElement.scrollTop / getCurrentZoomState();
  const newPositionTop = canvas.getPointer(event.e).y - currentScrollTopOffset;
  if (boundingBoxProps.origY > newPositionTop) {
    boundingBox.set({ top: newPositionTop });
  } else if (boundingBoxProps.origY < newPositionTop) {
    boundingBox.set({ top: boundingBoxProps.origY });
  }
  boundingBox.set({ height: Math.abs(boundingBoxProps.origY - newPositionTop) });
}

function bottomOverflowScroll(event, zoomOverflowElement, stubHeight, scrollWidth) {
  const canvasHeight = stubHeight + scrollWidth;
  const canvasBottom = zoomOverflowElement.scrollTop + zoomOverflowElement.offsetHeight;
  const result = canvasHeight - canvasBottom;
  const newPositionTop = canvas.getPointer(event.e).y + (result / getCurrentZoomState());
  if (boundingBoxProps.origY > newPositionTop) {
    boundingBox.set({ top: newPositionTop });
  } else if (boundingBoxProps.origY < newPositionTop) {
    boundingBox.set({ top: boundingBoxProps.origY });
  }
  boundingBox.set({ height: Math.abs(boundingBoxProps.origY - newPositionTop) });
}

function defaultScroll(event) {
  const currentVerticalScrollDelta = event.e.deltaY / getCurrentZoomState();
  const newPositionTop = canvas.getPointer(event.e).y + currentVerticalScrollDelta;
  if (boundingBoxProps.origY > newPositionTop) {
    boundingBox.set({ top: newPositionTop });
  } else if (boundingBoxProps.origY < newPositionTop) {
    boundingBox.set({ top: boundingBoxProps.origY });
  }
  boundingBox.set({ height: Math.abs(boundingBoxProps.origY - newPositionTop) });
}

function shapeScrollEvents(event) {
  const currentZoom = getCurrentZoomState();
  if (leftMouseBtnDown) {
    if (currentZoom > 1.00001) {
      const stubElement = document.getElementById('stub');
      const stubMarginTop = stubElement.style.marginTop;
      const stubHeightSubstring = stubMarginTop.substring(0, stubMarginTop.length - 2);
      const stubHeight = parseInt(stubHeightSubstring, 10);
      const zoomOverflowElement = document.getElementById('zoom-overflow');
      const currentBotLocation = zoomOverflowElement.scrollTop + zoomOverflowElement.offsetHeight;
      const futureBotLocation = currentBotLocation + event.e.deltaY;
      // if the scrolling brings issues where the bottom of the bounding box is not at
      // the right position, then go with the original implementation:
      // 9ff478d8ac4e06eeae9d472ef49b3387682e12b6
      const scrollWidth = getDoubleScrollCanvasState() ? getScrollbarWidth() * 4
        : getScrollbarWidth() * 2;
      if (zoomOverflowElement.scrollTop + event.e.deltaY < 0) {
        topOverflowScroll(event, zoomOverflowElement);
      } else if (futureBotLocation > stubHeight + scrollWidth) {
        bottomOverflowScroll(event, zoomOverflowElement, stubHeight, scrollWidth);
      } else {
        defaultScroll(event);
      }
      canvas.renderAll();
    }
  }
  if (getCrosshairModeOnState() && currentZoom > 1.00001) {
    moveCanvasCrosshairViaLastCanvasPositionAsync(canvas, moveCanvasCrosshairDefault);
  }
}

function createNewBoundingBoxFromCoordinates(left, top, width, height,
  imageScalingDimensions, imageLengthDimensions) {
  boundingBoxProps.left = left;
  boundingBoxProps.top = top;
  boundingBoxProps.width = width;
  boundingBoxProps.height = height;
  boundingBoxProps.scaleX = imageScalingDimensions.scaleX;
  boundingBoxProps.scaleY = imageScalingDimensions.scaleY;
  const newBoundingBox = new fabric.Rect(
    boundingBoxProperties.getStandaloneBoundingBoxProperties(boundingBoxProps),
  );
  preventOutOfBoundsOnNewObject(newBoundingBox, imageScalingDimensions, imageLengthDimensions);
  lockMovementIfAssertedByState(newBoundingBox);
  return newBoundingBox;
}

export {
  drawBoundingBox,
  shapeScrollEvents,
  deselectBoundingBox,
  clearBoundingBoxData,
  resetDrawBoundingBoxMode,
  finishDrawingBoundingBox,
  instantiateNewBoundingBox,
  isBoundingBoxDrawingFinished,
  prepareCanvasForNewBoundingBox,
  setRightBoundingBoxDrawingDelta,
  createNewBoundingBoxFromCoordinates,
  prepareCanvasForNewBoundingBoxesFromExternalSources,
};
