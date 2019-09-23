import fabric from 'fabric';
import boundingBoxProperties from './properties';
import { prepareLabelShape } from '../../../tools/labellerPopUp/labellingProcess';
import { showLabelPopUp } from '../../../tools/labellerPopUp/style';
import { setDrawCursorMode } from '../../mouseInteractions/cursorModes/drawMode';
import {
  getMovableObjectsState, getAddingPolygonPointsState, getCurrentZoomState,
  setAddingPolygonPointsState, setReadyToDrawShapeState, getDoubleScrollCanvasState,
} from '../../../tools/toolkit/buttonEvents/facadeWorkersUtils/stateManager';

let canvas = null;
let createNewBoundingBoxBtnClicked = false;
let leftMouseBtnDown = false;
const boundingBoxProps = {};
let boundingBox = null;
let drawingFinished = false;
let finishDrawingBoundingBoxClick = null;

function instantiateNewBoundingBox() {
  if (createNewBoundingBoxBtnClicked) {
    leftMouseBtnDown = true;
    const pointer = canvas.getPointer(canvas.e);
    boundingBoxProps.origX = pointer.x;
    boundingBoxProps.origY = pointer.y;
    boundingBox = new fabric.Rect(boundingBoxProperties.tempBoundingBoxProps(boundingBoxProps));
    canvas.add(boundingBox);
  }
}

function clearBoundingBoxData() {
  drawingFinished = false;
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

function drawBoundingBox(event) {
  if (!leftMouseBtnDown) return;
  const pointer = canvas.getPointer(event.e);
  if (boundingBoxProps.origX > pointer.x) {
    boundingBox.set({ left: Math.abs(pointer.x) });
  }
  if (boundingBoxProps.origY > pointer.y) {
    boundingBox.set({ top: Math.abs(pointer.y) });
  }
  boundingBox.set({ width: Math.abs(boundingBoxProps.origX - pointer.x) });
  boundingBox.set({ height: Math.abs(boundingBoxProps.origY - pointer.y) });
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
    showLabelPopUp(pointer.x, pointer.y);
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
};
