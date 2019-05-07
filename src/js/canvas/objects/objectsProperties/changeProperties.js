function prepareObjectsForEditablePolygonPoints(object) {
  if (object.shapeName === 'bndBox') {
    object.selectable = false;
  } else {
    object.lockMovementX = true;
    object.lockMovementY = true;
  }
}

function setObjectPropertiesToDefault(object) {
  if (object.shapeName !== 'bndBox') {
    object.lockMovementX = false;
    object.lockMovementY = false;
  }
  object.selectable = true;
}

export { prepareObjectsForEditablePolygonPoints, setObjectPropertiesToDefault };
