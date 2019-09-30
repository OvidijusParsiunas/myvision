import fabric from 'fabric';
import { resetObjectCursors, waitingForLabelCursorMode } from '../../canvas/mouseInteractions/cursorModes/drawMode';
import { addLabelRef, setPolygonLabelOffsetProps } from '../../canvas/objects/label/label';
import labelProperties from '../../canvas/objects/label/properties';
import { getLabelPopUpText, hideLabelPopUp, resetPopUpLabelOptions } from './style';
import { addNewLabelToListFromPopUp } from '../labelList/labelList';
import { addToLabelOptions, getLabelColor } from '../labelList/labelOptions';
import { addShape } from '../../canvas/objects/allShapes/allShapes';

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

// this should be moved to another file
function findInitialLabelLocation(shape) {
  const locationObj = {};
  if (shape.shapeName === 'bndBox') {
    locationObj.left = shape.left + labelProperties.boundingBoxOffsetProperties().left;
    locationObj.top = shape.top;
  } else if (shape.shapeName === 'polygon') {
    const left = shape.points[0].x - labelProperties.pointOffsetProperties().left;
    const top = shape.points[0].y - labelProperties.pointOffsetProperties().top;
    locationObj.left = left;
    locationObj.top = top;
    setPolygonLabelOffsetProps(shape, shape.points[0]);
  }
  return locationObj;
}

function generateLabelShapeGroup(text) {
  targetShape.set('id', currentId);
  targetShape.set('shapeLabelText', text);
  const initialLocation = findInitialLabelLocation(targetShape);
  const textShape = new fabric.Text(text,
    labelProperties.getLabelProps(initialLocation, targetShape.shapeName));
  canvas.add(textShape);
  canvas.bringToFront(textShape);
  addToLabelOptions(textShape.text);
  const shapeColor = getLabelColor(textShape.text);
  addShape(targetShape, shapeColor, currentId);
  addLabelRef(textShape, currentId);
  addNewLabelToListFromPopUp(textShape.text, currentId, shapeColor.label);
  currentId += 1;
}

function getTrimmedLabelText() {
  const rawText = getLabelPopUpText();
  return rawText.trim();
}

function createLabelShape() {
  const text = getTrimmedLabelText();
  hideLabelPopUp();
  generateLabelShapeGroup(text);
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
