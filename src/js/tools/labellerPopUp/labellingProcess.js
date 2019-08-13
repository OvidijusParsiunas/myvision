import fabric from 'fabric';
import { resetObjectCursors, waitingForLabelCursorMode } from '../../canvas/mouseInteractions/cursorModes/drawMode';
import { addLabelRef, setPolygonLabelOffsetProps } from '../../canvas/objects/label/label';
import labelProperies from '../../canvas/objects/label/properties';
import { getLabelPopUpText, hideLabelPopUp } from './style';
import { addLabelToList } from '../labelList/labelList';
import { addToLabelOptions, getLabelOptions } from '../labelList/labelOptions';
import { addShapeRef } from '../../canvas/objects/allShapes/allShapes';

let labellingState = false;
let targetShape = null;
let canvas = null;
let currentId = 0;
let labelOptionsElement = null;

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
    locationObj.left = shape.left + labelProperies.boundingBoxOffsetProperties.left;
    locationObj.top = shape.top;
  } else if (shape.shapeName === 'polygon') {
    const left = shape.points[0].x - labelProperies.pointOffsetProperties.left;
    const top = shape.points[0].y - labelProperies.pointOffsetProperties.top;
    locationObj.left = left;
    locationObj.top = top;
    setPolygonLabelOffsetProps(shape, shape.points[0]);
  }
  return locationObj;
}

function generateLabelShapeGroup(text) {
  targetShape.set('id', currentId);
  const initialLocation = findInitialLabelLocation(targetShape);
  const textShape = new fabric.Text(text, labelProperies.getLabelProps(initialLocation));
  canvas.add(textShape);
  canvas.bringToFront(textShape);
  addShapeRef(targetShape, currentId);
  addLabelRef(textShape, currentId);
  addToLabelOptions(textShape.text);
  addLabelToList(textShape.text, currentId);
  currentId += 1;
}

function initialiseParentElement() {
  return document.createElement('div');
}

function addLabelToLists(labelText) {
  const labelElement = initialiseParentElement();
  labelElement.innerHTML = `<div class="labelDropdownOption" onClick="selectLabelOption(innerHTML)">${labelText}</div>`;
  const newRow = labelOptionsElement.insertRow(-1);
  const cell = newRow.insertCell(0);
  cell.appendChild(labelElement);
}

function purgeOptionsFromLabelElement() {
  labelOptionsElement = document.getElementById('popup-label-options');
  labelOptionsElement.innerHTML = '';
}

function resetLabelOptions() {
  purgeOptionsFromLabelElement();
  getLabelOptions().forEach((label) => { addLabelToLists(label.text); });
}

function createLabelShape() {
  const text = getLabelPopUpText();
  hideLabelPopUp();
  generateLabelShapeGroup(text);
  resetObjectCursors(canvas);
  resetLabelOptions();
  labellingState = false;
}

function isLabelling() {
  return labellingState;
}

export {
  prepareLabelShape, createLabelShape, removeTargetShape, isLabelling,
};
