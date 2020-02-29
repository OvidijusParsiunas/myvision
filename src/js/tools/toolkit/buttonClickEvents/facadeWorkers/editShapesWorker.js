import purgeCanvasMouseEvents from '../../../../canvas/mouseInteractions/mouseEvents/resetCanvasUtils/purgeAllMouseHandlers';
import { setDefaultCursorModeAfterAlteringPolygonPoints, setDefaultCursorMode } from '../../../../canvas/mouseInteractions/cursorModes/defaultMode';
import assignDefaultEvents from '../../../../canvas/mouseInteractions/mouseEvents/eventHandlers/defaultEventHandlers';
import {
  getRemovingPolygonPointsState, setRemovingPolygonPointsState,
  setAddingPolygonPointsState, getDefaultState, getAddingPolygonPointsState,
  setDefaultState, getAlteringPolygonPointsState, setAlteringPolygonPointsState,
} from '../facadeWorkersUtils/stateManager';
import {
  cleanPolygonPointsArray, resetAddPoints, isAddingPointsToPolygon,
} from '../../../../canvas/objects/polygon/alterPolygon/alterPolygon';
import { getSelectedPolygonIdForRemovingPoints } from '../../../../canvas/mouseInteractions/mouseEvents/eventWorkers/removePointsEventsWorker';
import { getSelectedPolygonIdForAddPoints } from '../../../../canvas/mouseInteractions/mouseEvents/eventWorkers/addPointsEventsWorker';
import setInitialStageOfAddPointsOnExistingPolygonMode from '../../../../canvas/mouseInteractions/cursorModes/initialiseAddPointsOnExistingPolygonMode';
import assignAddPointsOnExistingPolygonEvents from '../../../../canvas/mouseInteractions/mouseEvents/eventHandlers/addPointsEventHandlers';

function initiateEditShapesEvent(canvas) {
  canvas.discardActiveObject();
  if (!getDefaultState()) {
    if (getAddingPolygonPointsState()) {
      if (isAddingPointsToPolygon()) {
        assignAddPointsOnExistingPolygonEvents(canvas);
        resetAddPoints();
        setInitialStageOfAddPointsOnExistingPolygonMode(canvas);
      }
      resetAddPoints();
      setAddingPolygonPointsState(false);
      purgeCanvasMouseEvents(canvas);
      setDefaultCursorModeAfterAlteringPolygonPoints(canvas);
      const currentlySelectedPolygonId = getSelectedPolygonIdForAddPoints();
      assignDefaultEvents(canvas, currentlySelectedPolygonId);
    } else if (getRemovingPolygonPointsState()) {
      purgeCanvasMouseEvents(canvas);
      cleanPolygonPointsArray();
      setDefaultCursorModeAfterAlteringPolygonPoints(canvas);
      const currentlySelectedPolygonId = getSelectedPolygonIdForRemovingPoints();
      assignDefaultEvents(canvas, currentlySelectedPolygonId);
      setRemovingPolygonPointsState(false);
    } else {
      purgeCanvasMouseEvents(canvas);
      assignDefaultEvents(canvas, null, getAddingPolygonPointsState());
      setDefaultCursorMode(canvas);
    }
    if (getAlteringPolygonPointsState()) {
      setAlteringPolygonPointsState(false);
    }
    setDefaultState(true);
  }
}

export { initiateEditShapesEvent as default };
