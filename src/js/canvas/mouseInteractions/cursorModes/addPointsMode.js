import { changePolygonPointsToWaitForAddingFirstPointImpl } from '../../objects/polygon/alterPolygon/changePointsStyle';
import { getPolygonEditingStatus } from '../../objects/polygon/alterPolygon/alterPolygon';

function setAddPointsMode(canvas) {
  changePolygonPointsToWaitForAddingFirstPointImpl(canvas);
  console.log('is: ' + getPolygonEditingStatus());
  canvas.defaultCursor = 'default';
  canvas.hoverCursor = 'default';
}

export { setAddPointsMode as default };
