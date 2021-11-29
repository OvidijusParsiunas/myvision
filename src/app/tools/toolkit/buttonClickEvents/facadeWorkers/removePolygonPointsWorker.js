import purgeCanvasMouseEvents from '../../../../canvas/mouseInteractions/mouseEvents/resetCanvasUtils/purgeAllMouseHandlers.js';
import {
  getCancelledReadyToDrawState, setRemovingPolygonPointsState,
  getRemovingPolygonPointsState, setRemovingPointsAfterCancelDrawState,
  getReadyToDrawShapeState, setCancelledReadyToDrawState, setDefaultState,
  getContinuousDrawingState, getAddingPolygonPointsState, setReadyToDrawShapeState,
  getLastDrawingModeState, setAddingPolygonPointsState, getPolygonDrawingInProgressState,
} from '../../../state.js';
import {
  setEditShapesButtonToActive, setEditShapesButtonToDefault,
  setRemovePointsButtonToActive, setRemovePointsButtonToDefault,
  setCreateBoundingBoxButtonToActive, setCreatePolygonButtonToActive,
} from '../../styling/state.js';
import { removeInvisiblePoint } from '../../../../canvas/objects/polygon/polygon.js';
import setRemovePointsOnExistingPolygonMode from '../../../../canvas/mouseInteractions/cursorModes/removePointsOnExistingPolygonMode.js';
import setRemovePointsOnDrawNewPolygonMode from '../../../../canvas/mouseInteractions/cursorModes/removePointsOnDrawNewPolygonMode.js';
import assignRemovePointsOnExistingPolygonEvents from '../../../../canvas/mouseInteractions/mouseEvents/eventHandlers/removePointsEventHandlers.js';
import { removeEditedPolygonId } from '../../../../canvas/mouseInteractions/mouseEvents/eventWorkers/defaultEventsWorker.js';
import assignRemovePointsOnDrawPolygonEvents from '../../../../canvas/mouseInteractions/mouseEvents/eventHandlers/removePointsOnDrawPolygonEventHandlers.js';
import assignDrawBoundingBoxEvents from '../../../../canvas/mouseInteractions/mouseEvents/eventHandlers/drawBndBoxEventHandlers.js';
import assignDrawPolygonEvents from '../../../../canvas/mouseInteractions/mouseEvents/eventHandlers/drawPolygonEventHandlers.js';
import assignDefaultEvents from '../../../../canvas/mouseInteractions/mouseEvents/eventHandlers/defaultEventHandlers.js';
import { setDefaultCursorModeAfterAlteringPolygonPoints } from '../../../../canvas/mouseInteractions/cursorModes/defaultMode.js';
import {
  resetAddPoints, cleanPolygonPointsArray, removePolygonPoints, getPolygonIdIfEditing,
} from '../../../../canvas/objects/polygon/alterPolygon/alterPolygon.js';
import { removeHighlightOfListLabel } from '../../../labelList/labelListHighlightUtils.js';

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
    setEditShapesButtonToDefault();
    setDefaultState(false);
  } else if (getContinuousDrawingState() && getCancelledReadyToDrawState()) {
    cleanPolygonPointsArray();
    removePolygonPoints();
    if (getLastDrawingModeState() === 'polygon') {
      assignDrawPolygonEvents(canvas);
      setCreatePolygonButtonToActive();
    } else if (getLastDrawingModeState() === 'boundingBox') {
      assignDrawBoundingBoxEvents(canvas);
      setCreateBoundingBoxButtonToActive();
    }
  } else {
    cleanPolygonPointsArray();
    setDefaultCursorModeAfterAlteringPolygonPoints(canvas);
    assignDefaultEvents(canvas, getPolygonIdIfEditing());
    setEditShapesButtonToActive();
    setDefaultState(true);
  }
}

// split up to more readable
function initiateRemovePolygonPointsEvents(canvas) {
  canvas.discardActiveObject();
  removeHighlightOfListLabel();
  removeEditedPolygonId();
  if (!getRemovingPolygonPointsState()) {
    if (getAddingPolygonPointsState()) {
      setAddingPolygonPointsState(false);
      resetAddPoints();
    }
    purgeCanvasMouseEvents(canvas);
    assignRemovePointsEvents(canvas);
    setRemovePointsCursorMode(canvas);
    if (getReadyToDrawShapeState()) {
      setCancelledReadyToDrawState(true);
      setRemovingPointsAfterCancelDrawState(true);
    }
    setRemovePointsButtonToActive();
    setEditShapesButtonToDefault();
    setDefaultState(false);
    setReadyToDrawShapeState(false);
    setRemovingPolygonPointsState(true);
  } else {
    purgeCanvasMouseEvents(canvas);
    discardRemovePointsEvents(canvas);
    setRemovePointsButtonToDefault();
    setRemovingPolygonPointsState(false);
  }
}

export { initiateRemovePolygonPointsEvents as default };
