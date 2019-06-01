import {
  removePolygon, clearAllAddPointsData, isAddingPointsToPolygon, removePolygonPoints,
} from '../../../../canvas/objects/polygon/alterPolygon/alterPolygon';
import { clearPolygonData, isDrawingInProgress } from '../../../../canvas/objects/polygon/polygon';
import { removeEditedPolygonId } from '../../../../canvas/mouseInteractions/mouseEvents/eventWorkers/editPolygonEventsWorker';
import purgeCanvasMouseEvents from '../../../../canvas/mouseInteractions/mouseEvents/resetCanvasUtils/purgeAllMouseHandlers';
import assignAddPointsOnExistingPolygonEvents from '../../../../canvas/mouseInteractions/mouseEvents/eventHandlers/addPointsEventHandlers';
import setInitialStageOfAddPointsOnExistingPolygonMode from '../../../../canvas/mouseInteractions/cursorModes/initialiseAddPointsOnExistingPolygonMode';
import assignDrawPolygonEvents from '../../../../canvas/mouseInteractions/mouseEvents/eventHandlers/drawPolygonEventHandlers';
import {
  getAddingPolygonPointsState, getRemovingPolygonPointsState,
  setDefaultState, setRemovingPolygonPointsState,
} from '../facadeWorkersUtils/stateManager';

function initiateActiveShapeEvent(canvas) {
  // when removing point and finished removing all - auto move to add points mode
  if (isAddingPointsToPolygon()) {
    purgeCanvasMouseEvents(canvas);
    assignAddPointsOnExistingPolygonEvents(canvas);
    clearAllAddPointsData();
    setInitialStageOfAddPointsOnExistingPolygonMode(canvas);
  } else if (getAddingPolygonPointsState()) {
    clearAllAddPointsData();
  }
  if (isDrawingInProgress()) {
    canvas.remove(canvas.getActiveObject());
    if (getRemovingPolygonPointsState()) {
      purgeCanvasMouseEvents(canvas);
      assignDrawPolygonEvents(canvas, true);
      setDefaultState(false);
      setRemovingPolygonPointsState(true);
    }
  } else {
    removePolygon();
  }
  removePolygonPoints();
  clearPolygonData();
  removeEditedPolygonId();
}

export { initiateActiveShapeEvent as default };
