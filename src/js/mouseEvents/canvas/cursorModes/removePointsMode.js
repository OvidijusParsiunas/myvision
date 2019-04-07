// have a callback here that would set the properties into certain values
// no obbject changing logic in these files
// rename canvas folder to mouseInteractions
// { move all to the canvas folder }
// rename events folder to mouseEvents

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

function setRemovePointsMode(canvas) {
  changeOjectPropertiesForRemovalePoints(canvas);
  canvas.defaultCursor = 'default';
  canvas.hoverCursor = 'default';
}

export { setRemovePointsMode as default };
