import purgeCanvasMouseEvents from '../../../../canvas/mouseInteractions/mouseEvents/resetCanvasUtils/purgeAllMouseHandlers';
import { setAddingPolygonPointsState, getAddingPolygonPointsState, setDefaultState } from '../facadeWorkersUtils/stateManager';
import assignAddPointsOnExistingPolygonEvents from '../../../../canvas/mouseInteractions/mouseEvents/eventHandlers/addPointsEventHandlers';
import setInitialStageOfAddPointsOnExistingPolygonMode from '../../../../canvas/mouseInteractions/cursorModes/initialiseAddPointsOnExistingPolygonMode';
import { setDefaultCursorModeAfterAlteringPolygonPoints } from '../../../../canvas/mouseInteractions/cursorModes/defaultMode';
import { getSelectedPolygonIdForRemovingPoints } from '../../../../canvas/mouseInteractions/mouseEvents/eventWorkers/removePointsEventsWorker';
import assignDefaultEvents from '../../../../canvas/mouseInteractions/mouseEvents/eventHandlers/defaultEventHandlers';
import { resetAddPoints, isAddingPointsToPolygon } from '../../../../canvas/objects/polygon/alterPolygon/alterPolygon';

function discardAddPointsEvents(canvas) {
  setDefaultCursorModeAfterAlteringPolygonPoints(canvas);
  const currentlySelectedPolygonId = getSelectedPolygonIdForRemovingPoints();
  assignDefaultEvents(canvas, currentlySelectedPolygonId);
  setDefaultState(true);
}

function initiateAddPolygonPointsEvents(canvas) {
  canvas.discardActiveObject();
  if (!getAddingPolygonPointsState()) {
    purgeCanvasMouseEvents(canvas);
    assignAddPointsOnExistingPolygonEvents(canvas);
    setInitialStageOfAddPointsOnExistingPolygonMode(canvas);
    setDefaultState(false);
    setAddingPolygonPointsState(true);
  } else if (isAddingPointsToPolygon()) {
    purgeCanvasMouseEvents(canvas);
    assignAddPointsOnExistingPolygonEvents(canvas);
    resetAddPoints();
    setInitialStageOfAddPointsOnExistingPolygonMode(canvas);
  } else {
    resetAddPoints();
    purgeCanvasMouseEvents(canvas);
    discardAddPointsEvents(canvas);
    setAddingPolygonPointsState(false);
  }
}

export { initiateAddPolygonPointsEvents as default };
