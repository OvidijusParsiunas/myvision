function prepareObjectsForEditablePolygonPoints(object) {
  if (object.shapeName === 'bndBox') {
    object.selectable = false;
  } else {
    object.lockMovementX = true;
    object.lockMovementY = true;
  }
}

function setObjectPropertiesToDefault(object) {
  if (object.shapeName === 'bndBox') {
    object.selectable = true;
  } else {
    object.lockMovementX = false;
    object.lockMovementY = false;
  }
}

export { prepareObjectsForEditablePolygonPoints, setObjectPropertiesToDefault };
