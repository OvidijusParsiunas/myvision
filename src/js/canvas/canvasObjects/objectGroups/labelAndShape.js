import { getLabelPopUpText, hideLabelPopUp } from '../../labelPopUp/manipulateLabelPopUp';

const labelKeyPairObj = {};
// rename everything to labelShape

const labellingState = { inProgress: false };
let targetShape = null;
let canvas = null;

function prepareLabelAndShapeGroup(shape, canvasObj) {
  targetShape = shape;
  canvas = canvasObj;
  labellingState.inProgress = true;
}

function removeTargetShape() {
  canvas.remove(targetShape);
  labellingState.inProgress = false;
}

function createLabelAndShapeGroup() {
  const text = getLabelPopUpText();
  hideLabelPopUp();
  // const textShape = new fabric.Text(text, getLabelProps(targetShape));
  labelKeyPairObj[targetShape[targetShape.id]] = text;
  // the rectangle final properties should be set before passed in here
}

export {
  prepareLabelAndShapeGroup, createLabelAndShapeGroup, removeTargetShape, labellingState,
};
