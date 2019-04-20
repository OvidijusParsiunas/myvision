import { changePolygonPointsPropertiesToDefault } from '../../objects/polygon/alterPolygon/alterPolygon';

function setDefaultCursorMode(canvas, alteringPolygonPoints) {
  console.log('called');
  if (alteringPolygonPoints) {
    changePolygonPointsPropertiesToDefault();
  } else {
    canvas.forEachObject((iteratedObj) => {
      iteratedObj.selectable = true;
    });
  }
  canvas.defaultCursor = 'default';
  canvas.hoverCursor = 'move';
  canvas.renderAll();
}

export { setDefaultCursorMode as default };
