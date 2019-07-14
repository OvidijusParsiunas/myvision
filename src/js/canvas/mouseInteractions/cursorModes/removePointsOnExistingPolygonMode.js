import { setObjectsHoverCursorToDefault } from '../../objects/objectsProperties/changeProperties';
import { getContinuousDrawingState } from '../../../tools/toolkit/buttonEvents/facadeWorkersUtils/stateManager';

function setRemovePointsOnExistingPolygonMode(canvas) {
  canvas.defaultCursor = 'default';
  canvas.hoverCursor = 'default';
  if (getContinuousDrawingState()) {
    setObjectsHoverCursorToDefault(canvas);
  }
}

export { setRemovePointsOnExistingPolygonMode as default };
