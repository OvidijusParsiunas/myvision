const labelObjects = {};

function addLabel(labelObj, id) {
  labelObjects[id] = labelObj;
}

function getLabelById(id) {
  return labelObjects[id];
}

export { getLabelById, addLabel };
