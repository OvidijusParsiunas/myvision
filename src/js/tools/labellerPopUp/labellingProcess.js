import fabric from 'fabric';
import { resetObjectCursors, waitingForLabelCursorMode } from '../../canvas/mouseInteractions/cursorModes/drawMode';
import { addLabel } from '../../canvas/objects/label/label';
import { getLabelPopUpText, hideLabelPopUp } from './style';

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

function findInitialLabelLocation(shape) {
  const locationObj = {};
  if (shape.shapeName === 'bndBox') {
    locationObj.left = shape.left + 2;
    locationObj.top = shape.top;
  } else if (shape.shapeName === 'polygon') {
    const left = shape.points[0].x - 10;
    const top = shape.points[0].y - 12;
    locationObj.left = left;
    locationObj.top = top;
    shape.labelOffsetLeft = shape.left - left;
    shape.labelOffsetTop = shape.top - top;
  }
  return locationObj;
}

function getTextProperties(location) {
  return {
    fontSize: 10,
    fill: 'yellow',
    left: location.left,
    top: location.top,
    shapeName: 'label',
  };
}

function generateLabelShapeGroup(text) {
  targetShape.set({ id: currentId, labelPointId: 0 });
  const initialLocation = findInitialLabelLocation(targetShape);
  const textShape = new fabric.Text(text, getTextProperties(initialLocation));
  canvas.add(textShape);
  canvas.bringToFront(textShape);
  addLabel(textShape, currentId);
  currentId += 1;
}

function createLabelShape() {
  const text = getLabelPopUpText();
  hideLabelPopUp();
  generateLabelShapeGroup(text);
  resetObjectCursors(canvas);
  labellingState = false;
}

function isLabelling() {
  return labellingState;
}

export {
  prepareLabelShape, createLabelShape, removeTargetShape, isLabelling,
};
