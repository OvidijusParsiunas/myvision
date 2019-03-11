import fabric from 'fabric';
import { getTempBndBoxProps } from './boundingBox/boundingBoxProperties';
import { prepareLabelAndShapeGroup } from './objectGroups/labelAndShape';
import { showLabelPopUp } from '../labelPopUp/manipulateLabelPopUp';
import setDefaultCursorMode from '../../mouseEvents/canvas/cursorModes/defaultMode';
import setDrawCursorMode from '../../mouseEvents/canvas/cursorModes/drawMode';
// import { getFinalBndBoxProps } from '../boundingBox/boundingBoxProperties';

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
    bndBoxProps.rect = new fabric.Rect(getTempBndBoxProps(bndBoxProps, pointer));
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
    bndBoxProps.rect.selectable = false;
    setDefaultCursorMode(canvas);
    const pointer = canvas.getPointer(event.e);
    prepareLabelAndShapeGroup(bndBoxProps.rect, canvas);
    showLabelPopUp(pointer.x, pointer.y);
  }
}

function highlightBndBox(event) {
  if (event.target && event.target.shapeName === 'bndBox') {
    event.target._objects[0].set('fill', 'rgba(255,0,0,0.2)');
    canvas.renderAll();
  }
}

function removeBndBoxHighlight(event) {
  if (event.target && event.target.shapeName === 'bndBox') {
    event.target._objects[0].set('fill', 'rgba(255,0,0,0');
    canvas.renderAll();
  }
}

export {
  prepareCanvasForNewBndBox,
  instantiateNewBndBox,
  drawBndBox,
  finishDrawingBndBox,
  highlightBndBox,
  removeBndBoxHighlight,
};
