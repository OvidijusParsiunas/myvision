import { getLabelPopUpText, hideLabelPopUp } from './manipulateLabelPopUp';
import setDefaultCursorMode from '../../mouseEvents/canvas/cursorModes/defaultMode';
import bndBoxProperties from '../canvasObjects/boundingBox/boundingBoxProperties';

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
  if (targetShape.shapeName === 'bndBoxTemp') {
    targetShape.set(
      bndBoxProperties.finalBndBoxProps,
    );
  }
  currentId += 1;
  // const textShape = new fabric.Text(text, getLabelProps(targetShape));
  labelKeyPairObj[targetShape[targetShape.id]] = text;
  // the rectangle final properties should be set before passed in here
  labellingState.inProgress = false;
}

export {
  prepareLabelShape, createLabelShape, removeTargetShape, labellingState,
};
