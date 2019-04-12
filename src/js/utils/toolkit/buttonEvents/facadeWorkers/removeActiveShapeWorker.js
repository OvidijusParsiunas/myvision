import { removePolygon } from '../../../../canvas/objects/polygon/alterPolygon/alterPolygon';
import { setRemovingPointsState } from '../facadeWorkersUtils/stateManager';

function initiateActiveShapeEvent(canvas) {
  if (canvas.getActiveObject()) {
    canvas.remove(canvas.getActiveObject());
  } else {
    removePolygon();
  }
  setRemovingPointsState(false);
}

export { initiateActiveShapeEvent as default };
