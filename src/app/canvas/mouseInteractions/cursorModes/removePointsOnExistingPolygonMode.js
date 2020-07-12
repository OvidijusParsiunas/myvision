import { setObjectsHoverCursorToDefault } from '../../objects/objectsProperties/changeProperties';

function setRemovePointsOnExistingPolygonMode(canvas) {
  canvas.defaultCursor = 'default';
  canvas.hoverCursor = 'default';
  setObjectsHoverCursorToDefault(canvas);
}

export { setRemovePointsOnExistingPolygonMode as default };
