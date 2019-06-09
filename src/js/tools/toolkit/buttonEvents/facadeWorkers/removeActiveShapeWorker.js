import {
  removePolygon, clearAllAddPointsData, isAddingPointsToPolygon, removePolygonPoints,
} from '../../../../canvas/objects/polygon/alterPolygon/alterPolygon';
import { resetNewPolygonData } from '../../../../canvas/objects/polygon/polygon';
import { removeEditedPolygonId } from '../../../../canvas/mouseInteractions/mouseEvents/eventWorkers/editPolygonEventsWorker';
import purgeCanvasMouseEvents from '../../../../canvas/mouseInteractions/mouseEvents/resetCanvasUtils/purgeAllMouseHandlers';
import assignAddPointsOnExistingPolygonEvents from '../../../../canvas/mouseInteractions/mouseEvents/eventHandlers/addPointsEventHandlers';
import setInitialStageOfAddPointsOnExistingPolygonMode from '../../../../canvas/mouseInteractions/cursorModes/initialiseAddPointsOnExistingPolygonMode';
import { getAddingPolygonPointsState } from '../facadeWorkersUtils/stateManager';

function removeBoundingBox(canvas) {
  const activeObect = canvas.getActiveObject();
  if (activeObect && activeObect.shapeName === 'bndBox') {
    canvas.remove(activeObect);
    return true;
  }
  return false;
}

function removeActiveShapeEvent(canvas) {
  if (!removeBoundingBox(canvas)) {
    if (isAddingPointsToPolygon()) {
      purgeCanvasMouseEvents(canvas);
      assignAddPointsOnExistingPolygonEvents(canvas);
      clearAllAddPointsData();
      setInitialStageOfAddPointsOnExistingPolygonMode(canvas);
    } else if (getAddingPolygonPointsState()) {
      clearAllAddPointsData();
    }
    removePolygon();
    removePolygonPoints();
    resetNewPolygonData();
    removeEditedPolygonId();
  }
}

export { removeActiveShapeEvent as default };
