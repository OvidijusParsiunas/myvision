import purgeCanvasMouseEvents from '../../../../canvas/mouseInteractions/mouseEvents/resetCanvasUtils/purgeAllMouseHandlers';
import {
  setDefaultState, getRemovingPolygonPointsState, setRemovingPolygonPointsState,
  getAddingPolygonPointsState, setAddingPolygonPointsState,
} from '../facadeWorkersUtils/stateManager';
import { isDrawingInProgress } from '../../../../canvas/objects/polygon/polygon';
import setRemovePointsOnExistingPolygonMode from '../../../../canvas/mouseInteractions/cursorModes/removePointsOnExistingPolygonMode';
import setRemovePointsOnDrawNewPolygonMode from '../../../../canvas/mouseInteractions/cursorModes/removePointsOnDrawNewPolygonMode';
import assignRemovePointsOnExistingPolygonEvents from '../../../../canvas/mouseInteractions/mouseEvents/eventHandlers/removePointsEventHandlers';
import assignRemovePointsOnDrawPolygonEvents from '../../../../canvas/mouseInteractions/mouseEvents/eventHandlers/removePointsOnDrawPolygonEventHandlers';
import assignDrawPolygonEvents from '../../../../canvas/mouseInteractions/mouseEvents/eventHandlers/drawPolygonEventHandlers';
import assignDefaultEvents from '../../../../canvas/mouseInteractions/mouseEvents/eventHandlers/defaultEventHandlers';
import setDefaultCursorMode from '../../../../canvas/mouseInteractions/cursorModes/defaultMode';
import { getSelectedPolygonIdForRemovingPoints } from '../../../../canvas/mouseInteractions/mouseEvents/eventWorkers/removePointsEventsWorker';
import { resetAddPoints, isAddingPointsToPolygon, cleanPolygonPointsArray } from '../../../../canvas/objects/polygon/alterPolygon/alterPolygon';

function setRemovePointsCursorMode(canvas) {
  const drawing = isDrawingInProgress();
  if (drawing) {
    setRemovePointsOnDrawNewPolygonMode(canvas);
  } else if (!drawing) {
    setRemovePointsOnExistingPolygonMode(canvas);
  }
}

function assignRemovePointsEvents(canvas, interruptedAddPoints) {
  const drawing = isDrawingInProgress();
  if (drawing) {
    assignRemovePointsOnDrawPolygonEvents(canvas);
  } else if (!drawing) {
    assignRemovePointsOnExistingPolygonEvents(canvas, interruptedAddPoints);
  }
}

function discardRemovePointsEvents(canvas) {
  // is this still drawing after manually removing all polygon points
  const drawing = isDrawingInProgress();
  if (drawing) {
    assignDrawPolygonEvents(canvas, true);
    setDefaultState(false);
  } else {
    cleanPolygonPointsArray();
    setDefaultCursorMode(canvas, true);
    const currentlySelectedPolygonId = getSelectedPolygonIdForRemovingPoints();
    assignDefaultEvents(canvas, currentlySelectedPolygonId);
    setDefaultState(true);
  }
}

// split up to more readable
function initiateRemovePolygonPointsEvents(canvas) {
  canvas.discardActiveObject();
  if (!getRemovingPolygonPointsState()) {
    let assignedEvents = false;
    if (getAddingPolygonPointsState()) {
      if (isAddingPointsToPolygon()) {
        resetAddPoints();
        purgeCanvasMouseEvents(canvas);
        assignRemovePointsEvents(canvas, true);
        assignedEvents = true;
      } else {
        resetAddPoints();
      }
      setAddingPolygonPointsState(false);
    }
    if (!assignedEvents) {
      purgeCanvasMouseEvents(canvas);
      assignRemovePointsEvents(canvas);
    }
    setRemovePointsCursorMode(canvas);
    setDefaultState(false);
    setRemovingPolygonPointsState(true);
  } else {
    purgeCanvasMouseEvents(canvas);
    discardRemovePointsEvents(canvas);
    setRemovingPolygonPointsState(false);
  }
}

export { initiateRemovePolygonPointsEvents as default };
