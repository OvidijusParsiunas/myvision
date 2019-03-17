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
  if (targetShape.shapeName === 'bndBoxTemp') {
    targetShape.set(
      {
        fill: 'rgba(255,0,0,0.1)',
        shapeName: 'bndBox',
      },
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
