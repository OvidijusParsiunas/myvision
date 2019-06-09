import { resetObjectCursors, waitingForLabelCursorMode } from '../../canvas/mouseInteractions/cursorModes/drawMode';
import { getLabelPopUpText, hideLabelPopUp } from './style';

const labelKeyPairObj = {};

let labellingState = false;
let targetShape = null;
let canvas = null;
let currentId = 0;

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
  const text = getLabelPopUpText();
  hideLabelPopUp();
  resetObjectCursors(canvas);
  targetShape.set('id', currentId);
  currentId += 1;
  // const textShape = new fabric.Text(text, getLabelProps(targetShape));
  labelKeyPairObj[targetShape[targetShape.id]] = text;
  // the rectangle final properties should be set before passed in here
  labellingState = false;
}

function isLabelling() {
  return labellingState;
}

export {
  prepareLabelShape, createLabelShape, removeTargetShape, isLabelling,
};
