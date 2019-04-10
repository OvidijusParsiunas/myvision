// have a callback here that would set the properties into certain values
// no obbject changing logic in these files

function changeOjectPropertiesForRemovalePoints(canvas) {
  canvas.forEachObject((iteratedObj) => {
    if (iteratedObj.shapeName === 'bndBox') {
      iteratedObj.selectable = false;
    } else {
      iteratedObj.lockMovementX = true;
      iteratedObj.lockMovementY = true;
    }
    if (iteratedObj.shapeName === 'point') {
      iteratedObj.fill = 'red';
      iteratedObj.radius = 4;
    }
  });
  canvas.renderAll();
}

function setRemovePointsOnExistingPolygonMode(canvas) {
  changeOjectPropertiesForRemovalePoints(canvas);
  canvas.defaultCursor = 'default';
  canvas.hoverCursor = 'default';
}

export { setRemovePointsOnExistingPolygonMode as default };
