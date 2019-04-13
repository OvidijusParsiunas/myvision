import polygonProperties from '../../objects/polygon/properties';

function changeOjectPropertiesForAddingPoints(canvas) {
  canvas.forEachObject((iteratedObj) => {
    if (iteratedObj.shapeName === 'point') {
      iteratedObj.set(polygonProperties.disabledButton);
      iteratedObj.selectable = false;
    }
  });
  canvas.renderAll();
}

function setAddPointsMode(canvas) {
  changeOjectPropertiesForAddingPoints(canvas);
  canvas.defaultCursor = 'default';
  canvas.hoverCursor = 'default';
}

export { setAddPointsMode as default };
