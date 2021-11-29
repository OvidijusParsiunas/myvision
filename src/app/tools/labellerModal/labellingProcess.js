import { resetObjectCursors as resetObjectCursorsForDefaultDraw } from '../../canvas/mouseInteractions/cursorModes/drawMode.js';
import { setAllObjectsToUneditable as resetObjectCursorsForCrosshairDraw } from '../../canvas/mouseInteractions/cursorModes/drawWithCrosshairMode.js';
import { getLabellerModalInputText, hideLabellerModal, resetLabellerModalOptions } from './style.js';
import { generateLabelShapeGroup } from '../../canvas/objects/allShapes/labelAndShapeBuilder.js';
import waitingForLabelCursorMode from '../../canvas/mouseInteractions/cursorModes/waitingForLabelSubmissionMode.js';
import { getCrosshairUsedOnCanvasState } from '../state.js';

let labellingState = false;
let targetShape = null;
let canvas = null;

function prepareLabelShape(shape, canvasObj) {
  waitingForLabelCursorMode(canvasObj);
  targetShape = shape;
  canvas = canvasObj;
  labellingState = true;
}

function removeTargetShape() {
  canvas.remove(targetShape);
  labellingState = false;
}

function setCursorMode() {
  if (getCrosshairUsedOnCanvasState()) {
    resetObjectCursorsForCrosshairDraw(canvas);
  } else {
    resetObjectCursorsForDefaultDraw(canvas);
  }
}

function createLabelShape() {
  hideLabellerModal();
  generateLabelShapeGroup(targetShape, getLabellerModalInputText());
  setCursorMode();
  resetLabellerModalOptions();
  labellingState = false;
}

function isLabelling() {
  return labellingState;
}

export {
  prepareLabelShape, createLabelShape, removeTargetShape, isLabelling,
};
