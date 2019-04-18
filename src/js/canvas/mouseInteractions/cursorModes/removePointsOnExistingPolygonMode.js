import { changeObjectsToPolygonPointsRemovaleImpl } from '../../objects/polygon/alterPolygon/changePointsStyle';

function setRemovePointsOnExistingPolygonMode(canvas) {
  changeObjectsToPolygonPointsRemovaleImpl(canvas);
  canvas.defaultCursor = 'default';
  canvas.hoverCursor = 'default';
}

export { setRemovePointsOnExistingPolygonMode as default };
