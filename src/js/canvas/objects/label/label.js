import labelProperies from './properties';

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
  // console.log(labelProperies.pointOffsetProperties());
  polygon.labelOffsetLeft = polygon.left
    - (point.x - labelProperies.pointOffsetProperties().left);
  polygon.labelOffsetTop = polygon.top
    - (point.y - labelProperies.pointOffsetProperties().top);
}

function changeLabelText(id, text) {
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

function removeAndRetrieveAllLabelRefs() {
  const labelRefs = {};
  Object.keys(labelObjects).forEach((key) => {
    labelRefs[key] = labelObjects[key];
    canvas.remove(labelObjects[key]);
  });
  labelObjects = {};
  return labelRefs;
}

function removeAllLabels() {
  Object.keys(labelObjects).forEach((key) => {
    canvas.remove(labelObjects[key]);
  });
  labelObjects = {};
}

export {
  setPolygonLabelOffsetProps, getLabelById, addLabelRef, removeLabel,
  setAllLabelsVisibilityProperty, changeLabelText, removeAllLabels,
  assignCanvasForLabelManipulation, changeLabelVisibilityById,
  removeAndRetrieveAllLabelRefs,
};
