import polygonProperties from '../../objects/polygon/properties';

function changeOjectPropertiesForRemovalePoints(canvas) {
  canvas.forEachObject((iteratedObj) => {
    if (iteratedObj.shapeName === 'bndBox') {
      iteratedObj.selectable = false;
    } else {
      iteratedObj.lockMovementX = true;
      iteratedObj.lockMovementY = true;
    }
    if (iteratedObj.shapeName === 'point') {
      iteratedObj.set(polygonProperties.editablePoint);
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
