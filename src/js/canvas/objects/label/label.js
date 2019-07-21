import labelProperies from './properties';

const labelObjects = {};

function addLabel(labelObj, id) {
  labelObjects[id] = labelObj;
}

function getLabelById(id) {
  return labelObjects[id];
}

function setPolygonLabelOffsetProps(polygon, point, labelPointId) {
  polygon.labelOffsetLeft = polygon.left
    - (point.x - labelProperies.offsetCoordinates.left);
  polygon.labelOffsetTop = polygon.top
    - (point.y - labelProperies.offsetCoordinates.top);
  polygon.labelPointId = labelPointId;
}

export { getLabelById, addLabel, setPolygonLabelOffsetProps };
