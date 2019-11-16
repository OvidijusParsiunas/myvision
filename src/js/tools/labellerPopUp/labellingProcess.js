import { resetObjectCursors, waitingForLabelCursorMode } from '../../canvas/mouseInteractions/cursorModes/drawMode';
import { getLabelPopUpText, hideLabelPopUp, resetPopUpLabelOptions } from './style';
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
  hideLabelPopUp();
  generateLabelShapeGroup(targetShape, getLabelPopUpText());
  resetObjectCursors(canvas);
  resetPopUpLabelOptions();
  labellingState = false;
}

function isLabelling() {
  return labellingState;
}

export {
  prepareLabelShape, createLabelShape, removeTargetShape, isLabelling,
};
