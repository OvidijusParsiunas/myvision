import fabric from 'fabric';
import { resetObjectCursors, waitingForLabelCursorMode } from '../../canvas/mouseInteractions/cursorModes/drawMode';
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

function getTextProperties(shape) {
  return {
    fontSize: 10,
    fill: 'yellow',
    left: shape.left,
    top: shape.top,
    width: shape.width,
    height: shape.height,
  };
}

function generateLabelShapeGroup(text) {
  targetShape.set('id', currentId);
  const textShape = new fabric.Text(text, getTextProperties(targetShape));
  const group = new fabric.Group([targetShape, textShape], { shapeName: targetShape.shapeName });
  canvas.add(group);
  canvas.remove(targetShape);
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
