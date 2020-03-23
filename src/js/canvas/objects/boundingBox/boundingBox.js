import fabric from 'fabric';
import boundingBoxProperties from './properties';
import { prepareLabelShape } from '../../../tools/shapeLabellerModal/labellingProcess';
import { showShapeLabellerModal } from '../../../tools/shapeLabellerModal/style';
import { setDrawCursorMode } from '../../mouseInteractions/cursorModes/drawMode';
import {
  getMovableObjectsState, getAddingPolygonPointsState, getCurrentZoomState,
  setAddingPolygonPointsState, setReadyToDrawShapeState, getDoubleScrollCanvasState,
} from '../../../tools/toolkit/buttonClickEvents/facadeWorkersUtils/stateMachine';
import { getImageProperties } from '../../../tools/toolkit/buttonClickEvents/facadeWorkersUtils/uploadFile/drawImageOnCanvas';
import { preventOutOfBoundsOnExternalSourceObject } from '../sharedUtils/moveBlockers';

let canvas = null;
let createNewBoundingBoxBtnClicked = false;
let leftMouseBtnDown = false;
const boundingBoxProps = {};
let boundingBox = null;
let drawingFinished = false;
let finishDrawingBoundingBoxClick = null;
let rightBoundingBoxDelta = 0;

function instantiateNewBoundingBox() {
  if (createNewBoundingBoxBtnClicked) {
    leftMouseBtnDown = true;
    const pointer = canvas.getPointer(canvas.e);
    boundingBoxProps.origX = pointer.x < 0 ? 0 : pointer.x;
    boundingBoxProps.origY = pointer.y < 0 ? 0 : pointer.y;
    boundingBox = new fabric.Rect(boundingBoxProperties.tempBoundingBoxProps(boundingBoxProps));
    canvas.add(boundingBox);
  }
}

function clearBoundingBoxData() {
  drawingFinished = true;
}

function deselectBoundingBox() {
  if (canvas) {
    canvas.discardActiveObject();
    canvas.renderAll();
  }
}

function resetDrawBoundingBoxMode() {
  setReadyToDrawShapeState(true);
  setDrawCursorMode(canvas);
  createNewBoundingBoxBtnClicked = true;
  drawingFinished = false;
}

// check whether the results are truncated

// if the right or bottom side of the drawn bounding box look a bit too far,
// then reduce the delta values

let mouseMovedLeft = false;
let mouseMovedTop = false;

function drawBoundingBox(event) {
  if (!leftMouseBtnDown) return;
  const pointer = canvas.getPointer(event.e);
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

function finishDrawingBoundingBoxFunc(event) {
  if (leftMouseBtnDown) {
    createNewBoundingBoxBtnClicked = false;
    leftMouseBtnDown = false;
    boundingBox.setCoords();
    boundingBox.set(boundingBoxProperties.finalBoundingBoxProps());
    lockMovementIfAssertedByState(boundingBox);
    drawingFinished = true;
    setReadyToDrawShapeState(false);
    prepareLabelShape(boundingBox, canvas);
    const pointer = canvas.getPointer(event.e);
    showShapeLabellerModal(pointer.x, pointer.y);
  }
}

function finishDrawingBoundingBox(event) {
  finishDrawingBoundingBoxClick(event);
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
  setDrawCursorMode(canvas);
  setReadyToDrawShapeState(true);
  canvas.discardActiveObject();
  if (getAddingPolygonPointsState()) {
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
  if (leftMouseBtnDown) {
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
      canvas.renderAll();
    }
  }
}

function createNewBoundingBoxFromCoordinates(left, top, width, height,
  imageScalingDimensions, imageParameterDimensions) {
  boundingBoxProps.left = left;
  boundingBoxProps.top = top;
  boundingBoxProps.width = width;
  boundingBoxProps.height = height;
  boundingBoxProps.scaleX = imageScalingDimensions.scaleX;
  boundingBoxProps.scaleY = imageScalingDimensions.scaleY;
  const newBoundingBox = new fabric.Rect(
    boundingBoxProperties.getStandaloneBoundingBoxProperties(boundingBoxProps),
  );
  preventOutOfBoundsOnExternalSourceObject(newBoundingBox, imageScalingDimensions,
    imageParameterDimensions);
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
