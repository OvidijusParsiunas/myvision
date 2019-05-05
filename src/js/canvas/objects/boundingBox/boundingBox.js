import fabric from 'fabric';
import bndBoxProperties from './properties';
import { prepareLabelShape } from '../../../tools/labellerPopUp/labellingProcess';
import { showLabelPopUp } from '../../../tools/labellerPopUp/style';
import setDefaultCursorMode from '../../mouseInteractions/cursorModes/defaultMode';
import setDrawCursorMode from '../../mouseInteractions/cursorModes/drawMode';

let canvas = null;
let createNewBoundingBoxBtnClicked = false;
let leftMouseBtnDown = false;
const bndBoxProps = {};

function instantiateNewBndBox() {
  if (createNewBoundingBoxBtnClicked) {
    leftMouseBtnDown = true;
    const pointer = canvas.getPointer(canvas.e);
    bndBoxProps.origX = pointer.x;
    bndBoxProps.origY = pointer.y;
    bndBoxProps.rect = new fabric.Rect(bndBoxProperties.tempBndBoxProps(bndBoxProps, pointer));
    canvas.add(bndBoxProps.rect);
  }
}

function prepareCanvasForNewBndBox(canvasObj) {
  canvas = canvasObj;
  if (canvas.backgroundImage) {
    createNewBoundingBoxBtnClicked = true;
    setDrawCursorMode(canvas);
    canvas.discardActiveObject();
  }
}

function drawBndBox(event) {
  if (!leftMouseBtnDown) return;
  const pointer = canvas.getPointer(event.e);
  if (bndBoxProps.origX > pointer.x) {
    bndBoxProps.rect.set({ left: Math.abs(pointer.x) });
  }
  if (bndBoxProps.origY > pointer.y) {
    bndBoxProps.rect.set({ top: Math.abs(pointer.y) });
  }
  bndBoxProps.rect.set({ width: Math.abs(bndBoxProps.origX - pointer.x) });
  bndBoxProps.rect.set({ height: Math.abs(bndBoxProps.origY - pointer.y) });
  canvas.renderAll();
}

function finishDrawingBndBox(event) {
  if (leftMouseBtnDown) {
    createNewBoundingBoxBtnClicked = false;
    leftMouseBtnDown = false;
    bndBoxProps.rect.setCoords();
    bndBoxProps.rect.set(bndBoxProperties.finalBndBoxProps);
    setDefaultCursorMode(canvas);
    const pointer = canvas.getPointer(event.e);
    prepareLabelShape(bndBoxProps.rect, canvas);
    showLabelPopUp(pointer.x, pointer.y);
  }
}

export {
  prepareCanvasForNewBndBox,
  instantiateNewBndBox,
  drawBndBox,
  finishDrawingBndBox,
};
