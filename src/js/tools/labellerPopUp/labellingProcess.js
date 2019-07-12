import fabric from 'fabric';
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


function generateText(text) {
  // generate text shape
  const textShape = new fabric.Text(text, getTextProperties(targetShape));
  // setting bndbox group
  if (targetShape.shapeName === 'bndBox') {
    const group = new fabric.Group([targetShape, textShape]);
    canvas.add(group);
    // setting polygin group
  } else if (targetShape.shapeName === 'polygon') {
    // const group = new fabric.Group([targetShape, textShape], polygonProperties.newPolygon);
    // canvas.add(group);
  }
  canvas.remove(targetShape);
}

// function generateText(text) {
//   // generate text shape
//   const textShape = new fabric.Text(text, getTextProperties(targetShape));
//
//   // setting bndbox group
//   if (targetShape.shapeName === 'bndBoxTemp') {
//     const group = new fabric.Group([textShape]);
//     group.addWithUpdate(targetShape);
//     canvas.add(group);
//     // setting polygin group
//   } else if (targetShape.shapeName === 'polygon') {
//     // const group = new fabric.Group([targetShape, textShape], polygonProperties.newPolygon);
//     // canvas.add(group);
//   }
//   // canvas.remove(targetShape);
// }

function createLabelShape() {
  const text = getLabelPopUpText();
  hideLabelPopUp();
  generateText(text);
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
