import fabric from 'fabric';
import boundingBoxProperties from './properties';
import { prepareLabelShape } from '../../../tools/labellerPopUp/labellingProcess';
import { showLabelPopUp } from '../../../tools/labellerPopUp/style';
import { setDrawCursorMode } from '../../mouseInteractions/cursorModes/drawMode';
import { getMovableObjectsState } from '../../../tools/toolkit/buttonEvents/facadeWorkersUtils/stateManager';

let canvas = null;
let createNewBoundingBoxBtnClicked = false;
let leftMouseBtnDown = false;
const boundingBoxProps = {};
let boundingBox = null;

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

function prepareCanvasForNewBoundingBox(canvasObj) {
  canvas = canvasObj;
  if (canvas.backgroundImage) {
    createNewBoundingBoxBtnClicked = true;
    setDrawCursorMode(canvas);
    canvas.discardActiveObject();
  }
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

function finishDrawingBoundingBox(event) {
  if (leftMouseBtnDown) {
    createNewBoundingBoxBtnClicked = false;
    leftMouseBtnDown = false;
    boundingBox.setCoords();
    boundingBox.set(boundingBoxProperties.finalBoundingBoxProps);
    lockMovementIfAssertedByState(boundingBox);
    const pointer = canvas.getPointer(event.e);
    prepareLabelShape(boundingBox, canvas);
    showLabelPopUp(pointer.x, pointer.y);
  }
}

export {
  prepareCanvasForNewBoundingBox,
  instantiateNewBoundingBox,
  drawBoundingBox,
  finishDrawingBoundingBox,
};
