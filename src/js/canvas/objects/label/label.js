import labelProperies from './properties';

let canvas = null;
// be careful about this as we will need to look into doing this for multiple
const labelObjects = {};

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
    - (point.x - labelProperies.pointOffsetProperties.left);
  polygon.labelOffsetTop = polygon.top
    - (point.y - labelProperies.pointOffsetProperties.top);
}

function changeObjectLabelText(id, text) {
  labelObjects[id].text = text;
  canvas.renderAll();
}

function changeLabelVisibilityById(id) {
  labelObjects[id].visible = !labelObjects[id].visible;
  canvas.renderAll();
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

export {
  setPolygonLabelOffsetProps, getLabelById, addLabelRef,
  setAllLabelsVisibilityProperty, removeLabel, changeObjectLabelText,
  assignCanvasForLabelManipulation, changeLabelVisibilityById,
};
