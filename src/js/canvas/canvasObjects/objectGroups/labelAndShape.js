import { getLabelPopUpText, hideLabelPopUp } from '../../labelPopUp/manipulateLabelPopUp';
import setDefaultCursorMode from '../../../mouseEvents/canvas/cursorModes/defaultMode';

const labelKeyPairObj = {};

const labellingState = { inProgress: false };
let targetShape = null;
let canvas = null;
let currentId = 0;

function prepareLabelShape(shape, canvasObj) {
  targetShape = shape;
  canvas = canvasObj;
  labellingState.inProgress = true;
}

function removeTargetShape() {
  canvas.remove(targetShape);
  labellingState.inProgress = false;
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
}

export {
  prepareLabelShape, createLabelShape, removeTargetShape, labellingState,
};
