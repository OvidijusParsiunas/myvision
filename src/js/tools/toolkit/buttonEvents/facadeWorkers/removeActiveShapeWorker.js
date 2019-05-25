import { removePolygon, clearAllAddPointsData, isAddingPointsToPolygon } from '../../../../canvas/objects/polygon/alterPolygon/alterPolygon';
import { setAlteringPolygonPointsState } from '../facadeWorkersUtils/stateManager';

function initiateActiveShapeEvent(canvas) {
  if (isAddingPointsToPolygon()) {
    clearAllAddPointsData();
  }
  if (canvas.getActiveObject()) {
    canvas.remove(canvas.getActiveObject());
  } else {
    removePolygon();
  }
  setAlteringPolygonPointsState(false);
}

export { initiateActiveShapeEvent as default };
