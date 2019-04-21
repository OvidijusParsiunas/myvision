import polygonProperties from '../../objects/polygon/properties';

// change
function changeOjectPropertiesForChoosingInitialPoint(canvas) {
  canvas.forEachObject((iteratedObj) => {
    if (iteratedObj.shapeName === 'bndBox') {
      iteratedObj.selectable = false;
    } else {
      iteratedObj.lockMovementX = true;
      iteratedObj.lockMovementY = true;
    }
    if (iteratedObj.shapeName === 'point') {
      iteratedObj.set(polygonProperties.additionalPoint);
    }
  });
  canvas.renderAll();
}

function setInitialStageOfAddPointsOnExistingPolygonMode(canvas) {
  changeOjectPropertiesForChoosingInitialPoint(canvas);
  canvas.defaultCursor = 'default';
  canvas.hoverCursor = 'default';
}

export { setInitialStageOfAddPointsOnExistingPolygonMode as default };
