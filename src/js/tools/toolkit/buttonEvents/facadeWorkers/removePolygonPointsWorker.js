import purgeCanvasMouseEvents from '../../../../canvas/mouseInteractions/mouseEvents/resetCanvasUtils/purgeAllMouseHandlers';
import {
  getContinuousDrawingState, getAddingPolygonPointsState, setReadyToDrawShapeState,
  getLastDrawingModeState, setAddingPolygonPointsState,
  getRemovingPolygonPointsState, setRemovingPointsAfterCancelDrawState,
  getReadyToDrawShapeState, setCancelledReadyToDrawState, setDefaultState,
  getCancelledReadyToDrawState, setRemovingPolygonPointsState,
} from '../facadeWorkersUtils/stateManager';
import { isPolygonDrawingInProgress, removeInvisiblePoint } from '../../../../canvas/objects/polygon/polygon';
import setRemovePointsOnExistingPolygonMode from '../../../../canvas/mouseInteractions/cursorModes/removePointsOnExistingPolygonMode';
import setRemovePointsOnDrawNewPolygonMode from '../../../../canvas/mouseInteractions/cursorModes/removePointsOnDrawNewPolygonMode';
import assignRemovePointsOnExistingPolygonEvents from '../../../../canvas/mouseInteractions/mouseEvents/eventHandlers/removePointsEventHandlers';
import assignRemovePointsOnDrawPolygonEvents from '../../../../canvas/mouseInteractions/mouseEvents/eventHandlers/removePointsOnDrawPolygonEventHandlers';
import assignDrawBoundingBoxEvents from '../../../../canvas/mouseInteractions/mouseEvents/eventHandlers/drawBndBoxEventHandlers';
import assignDrawPolygonEvents from '../../../../canvas/mouseInteractions/mouseEvents/eventHandlers/drawPolygonEventHandlers';
import assignDefaultEvents from '../../../../canvas/mouseInteractions/mouseEvents/eventHandlers/defaultEventHandlers';
import { setDefaultCursorModeAfterAlteringPolygonPoints } from '../../../../canvas/mouseInteractions/cursorModes/defaultMode';
import { getSelectedPolygonIdForRemovingPoints } from '../../../../canvas/mouseInteractions/mouseEvents/eventWorkers/removePointsEventsWorker';
import {
  resetAddPoints, isAddingPointsToPolygon,
  cleanPolygonPointsArray, removePolygonPoints,
} from '../../../../canvas/objects/polygon/alterPolygon/alterPolygon';
import { removeHighlightOfListLabel } from '../../../labelList/highlightLabelList';

function setRemovePointsCursorMode(canvas) {
  const isDrawingPolygon = isPolygonDrawingInProgress();
  if (isDrawingPolygon) {
    setRemovePointsOnDrawNewPolygonMode(canvas);
  } else if (!isDrawingPolygon) {
    setRemovePointsOnExistingPolygonMode(canvas);
  }
}

function assignRemovePointsEvents(canvas, interruptedAddPoints) {
  const isDrawingPolygon = isPolygonDrawingInProgress();
  if (isDrawingPolygon) {
    removeInvisiblePoint();
    assignRemovePointsOnDrawPolygonEvents(canvas);
  } else if (!isDrawingPolygon) {
    assignRemovePointsOnExistingPolygonEvents(canvas, interruptedAddPoints);
  }
}

function discardRemovePointsEvents(canvas) {
  // is this still drawing after manually removing all polygon points
  const isDrawingPolygon = isPolygonDrawingInProgress();
  if (isDrawingPolygon) {
    assignDrawPolygonEvents(canvas, true);
    setDefaultState(false);
  } else if (getContinuousDrawingState() && getCancelledReadyToDrawState()) {
    cleanPolygonPointsArray();
    removePolygonPoints();
    if (getLastDrawingModeState() === 'polygon') {
      assignDrawPolygonEvents(canvas);
    } else if (getLastDrawingModeState() === 'boundingBox') {
      assignDrawBoundingBoxEvents(canvas);
    }
  } else {
    cleanPolygonPointsArray();
    setDefaultCursorModeAfterAlteringPolygonPoints(canvas);
    const currentlySelectedPolygonId = getSelectedPolygonIdForRemovingPoints();
    assignDefaultEvents(canvas, currentlySelectedPolygonId);
    setDefaultState(true);
  }
}

// split up to more readable
function initiateRemovePolygonPointsEvents(canvas) {
  canvas.discardActiveObject();
  removeHighlightOfListLabel();
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
    if (getReadyToDrawShapeState()) {
      setCancelledReadyToDrawState(true);
      setRemovingPointsAfterCancelDrawState(true);
    }
    setDefaultState(false);
    setReadyToDrawShapeState(false);
    setRemovingPolygonPointsState(true);
  } else {
    purgeCanvasMouseEvents(canvas);
    discardRemovePointsEvents(canvas);
    setRemovingPolygonPointsState(false);
  }
}

export { initiateRemovePolygonPointsEvents as default };
