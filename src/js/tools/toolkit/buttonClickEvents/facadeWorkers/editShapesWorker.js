import purgeCanvasMouseEvents from '../../../../canvas/mouseInteractions/mouseEvents/resetCanvasUtils/purgeAllMouseHandlers';
import { setDefaultCursorModeAfterAlteringPolygonPoints, setDefaultCursorMode } from '../../../../canvas/mouseInteractions/cursorModes/defaultMode';
import assignDefaultEvents from '../../../../canvas/mouseInteractions/mouseEvents/eventHandlers/defaultEventHandlers';
import {
  getRemovingPolygonPointsState, setRemovingPolygonPointsState,
  setAddingPolygonPointsState, getDefaultState, getAddingPolygonPointsState,
  getPolygonDrawingInProgressState, setDefaultState, getAlteringPolygonPointsState,
  setCancelledReadyToDrawState, getReadyToDrawShapeState, setAlteringPolygonPointsState,
} from '../facadeWorkersUtils/stateMachine';
import {
  cleanPolygonPointsArray, resetAddPoints, isAddingPointsToPolygon,
} from '../../../../canvas/objects/polygon/alterPolygon/alterPolygon';
import { getSelectedPolygonIdForRemovingPoints } from '../../../../canvas/mouseInteractions/mouseEvents/eventWorkers/removePointsEventsWorker';
import { getSelectedPolygonIdForAddPoints } from '../../../../canvas/mouseInteractions/mouseEvents/eventWorkers/addPointsEventsWorker';
import setInitialStageOfAddPointsOnExistingPolygonMode from '../../../../canvas/mouseInteractions/cursorModes/initialiseAddPointsOnExistingPolygonMode';
import assignAddPointsOnExistingPolygonEvents from '../../../../canvas/mouseInteractions/mouseEvents/eventHandlers/addPointsEventHandlers';
import { resetNewPolygonData } from '../../../../canvas/objects/polygon/polygon';

function dismissAddPointsEvents(canvas) {
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
}

function dismissRemovePointsEvents(canvas) {
  if (getPolygonDrawingInProgressState()) { resetNewPolygonData(); }
  purgeCanvasMouseEvents(canvas);
  cleanPolygonPointsArray();
  setDefaultCursorModeAfterAlteringPolygonPoints(canvas);
  const currentlySelectedPolygonId = getSelectedPolygonIdForRemovingPoints();
  assignDefaultEvents(canvas, currentlySelectedPolygonId);
  setRemovingPolygonPointsState(false);
}

function dismissOtherEvents(canvas) {
  if (getReadyToDrawShapeState()) {
    setCancelledReadyToDrawState(true);
  } else {
    setCancelledReadyToDrawState(false);
  }
  if (getPolygonDrawingInProgressState()) { resetNewPolygonData(); }
  purgeCanvasMouseEvents(canvas);
  assignDefaultEvents(canvas, null, getAddingPolygonPointsState());
  setDefaultCursorMode(canvas);
}

function initiateEditShapesEvent(canvas) {
  canvas.discardActiveObject();
  if (!getDefaultState()) {
    if (getAddingPolygonPointsState()) {
      dismissAddPointsEvents(canvas);
    } else if (getRemovingPolygonPointsState()) {
      dismissRemovePointsEvents(canvas);
    } else {
      dismissOtherEvents(canvas);
    }
    if (getAlteringPolygonPointsState()) {
      setAlteringPolygonPointsState(false);
    }
    setDefaultState(true);
  }
}

export { initiateEditShapesEvent as default };
