import { resetObjectCursors, waitingForLabelCursorMode } from '../../canvas/mouseInteractions/cursorModes/drawMode';
import { getLabellerModalInputText, hideLabellerModal, resetLabellerModalOptions } from './style';
import { generateLabelShapeGroup } from '../../canvas/objects/allShapes/labelAndShapeBuilder';

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

function createLabelShape() {
  hideLabellerModal();
  generateLabelShapeGroup(targetShape, getLabellerModalInputText());
  resetObjectCursors(canvas);
  resetLabellerModalOptions();
  labellingState = false;
}

function isLabelling() {
  return labellingState;
}

export {
  prepareLabelShape, createLabelShape, removeTargetShape, isLabelling,
};
