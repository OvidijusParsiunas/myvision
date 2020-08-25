import { resetObjectCursors as resetObjectCursorsForDefaultDraw } from '../../canvas/mouseInteractions/cursorModes/drawMode';
import { setAllObjectsToUneditable as resetObjectCursorsForCrosshairDraw } from '../../canvas/mouseInteractions/cursorModes/drawWithCrosshairMode';
import { getLabellerModalInputText, hideLabellerModal, resetLabellerModalOptions } from './style';
import { generateLabelShapeGroup } from '../../canvas/objects/allShapes/labelAndShapeBuilder';
import waitingForLabelCursorMode from '../../canvas/mouseInteractions/cursorModes/waitingForLabelSubmissionMode';

let labellingState = false;
let targetShape = null;
let canvas = null;
const IS_CROSSHAIR_MODE_ON = true;

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
  // && getBoundingBoxDrawingInProgress
  if (IS_CROSSHAIR_MODE_ON) {
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
