import { changePolygonPointsToWaitForAddingFirstPointImpl } from '../../objects/polygon/alterPolygon/changePointsStyle';

function setAddPointsMode(canvas) {
  changePolygonPointsToWaitForAddingFirstPointImpl(canvas);
  canvas.defaultCursor = 'default';
  canvas.hoverCursor = 'default';
}

export { setAddPointsMode as default };
