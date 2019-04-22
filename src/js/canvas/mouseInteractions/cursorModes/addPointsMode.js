import { changePolygonPointsToWaitForAddingFirstPointImpl } from '../../objects/polygon/alterPolygon/changePointsStyle';

function setAddPointsMode(canvas) {
  changePolygonPointsToWaitForAddingFirstPointImpl(canvas);
  canvas.defaultCursor = 'crosshair';
  canvas.hoverCursor = 'crosshair';
}

export { setAddPointsMode as default };
