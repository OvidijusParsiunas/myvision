function prepareObjectsForEditablePolygonPoints(object) {
  if (object.shapeName === 'bndBox') {
    object.selectable = false;
  } else {
    object.lockMovementX = true;
    object.lockMovementY = true;
  }
}

export { prepareObjectsForEditablePolygonPoints as default };
