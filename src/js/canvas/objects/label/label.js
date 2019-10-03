import labelProperies from './properties';
import { removeLabelListItems } from '../../../tools/labelList/labelList';

let canvas = null;
// be careful about this as we will need to look into doing this for multiple
let labelObjects = {};

function addLabelRef(labelObj, id) {
  labelObjects[id] = labelObj;
}

function getLabelById(id) {
  return labelObjects[id];
}

function removeLabel(id) {
  canvas.remove(labelObjects[id]);
  delete labelObjects[id];
}

function setPolygonLabelOffsetProps(polygon, point) {
  polygon.labelOffsetLeft = polygon.left
    - (point.x - labelProperies.pointOffsetProperties().left);
  polygon.labelOffsetTop = polygon.top
    - (point.y - labelProperies.pointOffsetProperties().top);
}

function changeObjectLabelText(id, text) {
  labelObjects[id].text = text;
  canvas.renderAll();
}

function changeLabelVisibilityById(id) {
  labelObjects[id].visible = !labelObjects[id].visible;
  canvas.renderAll();
  return labelObjects[id].visible;
}

function setAllLabelsVisibilityProperty(state) {
  Object.keys(labelObjects).forEach((label) => {
    labelObjects[label].visible = state;
  });
  canvas.renderAll();
}

function assignCanvasForLabelManipulation(canvasObj) {
  canvas = canvasObj;
}

function removeAllLabels() {
  Object.keys(labelObjects).forEach((key) => {
    canvas.remove(labelObjects[key]);
  });
  labelObjects = {};
  removeLabelListItems();
}

export {
  setPolygonLabelOffsetProps, getLabelById, addLabelRef, removeLabel,
  setAllLabelsVisibilityProperty, changeObjectLabelText, removeAllLabels,
  assignCanvasForLabelManipulation, changeLabelVisibilityById,
};
