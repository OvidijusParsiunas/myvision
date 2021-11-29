import { changePolygonPointsToWaitForAddingFirstPointImpl } from '../../objects/polygon/alterPolygon/changePointsStyle.js';

function setAddPointsMode(canvas, startingPoint) {
  changePolygonPointsToWaitForAddingFirstPointImpl(canvas, startingPoint);
  canvas.defaultCursor = 'crosshair';
  canvas.hoverCursor = 'crosshair';
}

export { setAddPointsMode as default };
