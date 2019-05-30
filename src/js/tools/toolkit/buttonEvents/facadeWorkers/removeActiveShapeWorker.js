import {
  removePolygon, clearAllAddPointsData, isAddingPointsToPolygon, removePolygonPoints,
} from '../../../../canvas/objects/polygon/alterPolygon/alterPolygon';
import { clearPolygonData } from '../../../../canvas/objects/polygon/polygon';
import { removeEditedPolygonId } from '../../../../canvas/mouseInteractions/mouseEvents/eventWorkers/editPolygonEventsWorker';

function initiateActiveShapeEvent(canvas) {
  if (isAddingPointsToPolygon()) {
    clearAllAddPointsData();
  }
  if (canvas.getActiveObject()) {
    canvas.remove(canvas.getActiveObject());
  } else {
    removePolygon();
  }
  removePolygonPoints();
  clearPolygonData();
  removeEditedPolygonId();
}

export { initiateActiveShapeEvent as default };
