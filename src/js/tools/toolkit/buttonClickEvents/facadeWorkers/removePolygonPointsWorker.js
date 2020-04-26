import purgeCanvasMouseEvents from '../../../../canvas/mouseInteractions/mouseEvents/resetCanvasUtils/purgeAllMouseHandlers';
import {
  getCancelledReadyToDrawState, setRemovingPolygonPointsState,
  getRemovingPolygonPointsState, setRemovingPointsAfterCancelDrawState,
  getReadyToDrawShapeState, setCancelledReadyToDrawState, setDefaultState,
  getContinuousDrawingState, getAddingPolygonPointsState, setReadyToDrawShapeState,
  getLastDrawingModeState, setAddingPolygonPointsState, getPolygonDrawingInProgressState,
} from '../../../stateMachine';
import { removeInvisiblePoint } from '../../../../canvas/objects/polygon/polygon';
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
  resetAddPoints, cleanPolygonPointsArray, removePolygonPoints,
} from '../../../../canvas/objects/polygon/alterPolygon/alterPolygon';
import { removeHighlightOfListLabel } from '../../../labelList/labelListHighlightUtils';
import { setButtonToActive, setButtonToDefault } from '../../styling/styling';

function setRemovePointsCursorMode(canvas) {
  const isDrawingPolygon = getPolygonDrawingInProgressState();
  if (isDrawingPolygon) {
    setRemovePointsOnDrawNewPolygonMode(canvas);
  } else if (!isDrawingPolygon) {
    setRemovePointsOnExistingPolygonMode(canvas);
  }
}

function assignRemovePointsEvents(canvas) {
  const isDrawingPolygon = getPolygonDrawingInProgressState();
  if (isDrawingPolygon) {
    removeInvisiblePoint();
    assignRemovePointsOnDrawPolygonEvents(canvas);
  } else if (!isDrawingPolygon) {
    assignRemovePointsOnExistingPolygonEvents(canvas);
  }
}

function discardRemovePointsEvents(canvas) {
  // is this still drawing after manually removing all polygon points
  const isDrawingPolygon = getPolygonDrawingInProgressState();
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
    if (getAddingPolygonPointsState()) {
      setAddingPolygonPointsState(false);
      resetAddPoints();
      // state machine would take care of this
      setButtonToDefault(document.getElementById('add-points-button'));
    }
    purgeCanvasMouseEvents(canvas);
    assignRemovePointsEvents(canvas);
    setRemovePointsCursorMode(canvas);
    if (getReadyToDrawShapeState()) {
      setCancelledReadyToDrawState(true);
      setRemovingPointsAfterCancelDrawState(true);
    }
    setButtonToActive(document.getElementById('remove-points-button'));
    setDefaultState(false);
    setReadyToDrawShapeState(false);
    setRemovingPolygonPointsState(true);
  } else {
    purgeCanvasMouseEvents(canvas);
    discardRemovePointsEvents(canvas);
    setButtonToDefault(document.getElementById('remove-points-button'));
    setRemovingPolygonPointsState(false);
  }
}

export { initiateRemovePolygonPointsEvents as default };
