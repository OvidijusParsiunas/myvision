import {
  removePolygon, clearAllAddPointsData, isAddingPointsToPolygon, removePolygonPoints,
} from '../../../../canvas/objects/polygon/alterPolygon/alterPolygon';
import { clearPolygonData } from '../../../../canvas/objects/polygon/polygon';
import { removeEditedPolygonId } from '../../../../canvas/mouseInteractions/mouseEvents/eventWorkers/editPolygonEventsWorker';
import purgeCanvasMouseEvents from '../../../../canvas/mouseInteractions/mouseEvents/resetCanvasUtils/purgeAllMouseHandlers';
import assignAddPointsOnExistingPolygonEvents from '../../../../canvas/mouseInteractions/mouseEvents/eventHandlers/addPointsEventHandlers';
import setInitialStageOfAddPointsOnExistingPolygonMode from '../../../../canvas/mouseInteractions/cursorModes/initialiseAddPointsOnExistingPolygonMode';
import { getAddingPolygonPointsState } from '../facadeWorkersUtils/stateManager';

function removeActiveShapeEvent(canvas) {
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
  clearPolygonData();
  removeEditedPolygonId();
}

export { removeActiveShapeEvent as default };
