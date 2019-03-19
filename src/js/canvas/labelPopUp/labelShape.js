import { getLabelPopUpText, hideLabelPopUp } from './manipulateLabelPopUp';
import setDefaultCursorMode from '../../mouseEvents/canvas/cursorModes/defaultMode';

const labelKeyPairObj = {};

let labellingState = false;
let targetShape = null;
let canvas = null;
let currentId = 0;

function prepareLabelShape(shape, canvasObj) {
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
  setDefaultCursorMode(canvas);
  hideLabelPopUp();
  targetShape.set('id', currentId);
  currentId += 1;
  // const textShape = new fabric.Text(text, getLabelProps(targetShape));
  labelKeyPairObj[targetShape[targetShape.id]] = text;
  // the rectangle final properties should be set before passed in here
  labellingState = false;
}

function getLabellingState() {
  return labellingState;
}

export {
  prepareLabelShape, createLabelShape, removeTargetShape, getLabellingState,
};
