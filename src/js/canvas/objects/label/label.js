import labelProperies from './properties';

// be careful about this as we will need to look into doing this for multiple
const labelObjects = {};

function addLabel(labelObj, id) {
  labelObjects[id] = labelObj;
}

function getLabelById(id) {
  return labelObjects[id];
}

function removeLabel(id, canvas) {
  canvas.remove(labelObjects[id]);
  delete labelObjects[id];
}

function setPolygonLabelOffsetProps(polygon, point) {
  polygon.labelOffsetLeft = polygon.left
    - (point.x - labelProperies.offsetCoordinates.left);
  polygon.labelOffsetTop = polygon.top
    - (point.y - labelProperies.offsetCoordinates.top);
}

function setLabelsVisibility(state, canvas) {
  Object.keys(labelObjects).forEach((label) => {
    labelObjects[label].visible = state;
  });
  canvas.renderAll();
}

export {
  getLabelById, addLabel, removeLabel,
  setPolygonLabelOffsetProps, setLabelsVisibility,
};
