import purgeCanvasMouseEvents from '../../../../canvas/mouseInteractions/mouseEvents/resetCanvasUtils/purgeAllMouseHandlers';
import {
  getCancelledReadyToDrawState, setRemovingPolygonPointsState,
  getRemovingPolygonPointsState, setRemovingPointsAfterCancelDrawState,
  getReadyToDrawShapeState, setCancelledReadyToDrawState, setDefaultState,
  getContinuousDrawingState, getAddingPolygonPointsState, setReadyToDrawShapeState,
  getLastDrawingModeState, setAddingPolygonPointsState, getPolygonDrawingInProgressState,
} from '../../../state';
import {
  setEditShapesButtonToActive, setEditShapesButtonToDefault,
  setRemovePointsButtonToActive, setRemovePointsButtonToDefault,
  setCreateBoundingBoxButtonToActive, setCreatePolygonButtonToActive,
} from '../../styling/state';
import { removeInvisiblePoint } from '../../../../canvas/objects/polygon/polygon';
import setRemovePointsOnExistingPolygonMode from '../../../../canvas/mouseInteractions/cursorModes/removePointsOnExistingPolygonMode';
import setRemovePointsOnDrawNewPolygonMode from '../../../../canvas/mouseInteractions/cursorModes/removePointsOnDrawNewPolygonMode';
import assignRemovePointsOnExistingPolygonEvents from '../../../../canvas/mouseInteractions/mouseEvents/eventHandlers/removePointsEventHandlers';
import { removeEditedPolygonId } from '../../../../canvas/mouseInteractions/mouseEvents/eventWorkers/defaultEventsWorker';
import assignRemovePointsOnDrawPolygonEvents from '../../../../canvas/mouseInteractions/mouseEvents/eventHandlers/removePointsOnDrawPolygonEventHandlers';
import assignDrawBoundingBoxEvents from '../../../../canvas/mouseInteractions/mouseEvents/eventHandlers/drawBndBoxEventHandlers';
import assignDrawPolygonEvents from '../../../../canvas/mouseInteractions/mouseEvents/eventHandlers/drawPolygonEventHandlers';
import assignDefaultEvents from '../../../../canvas/mouseInteractions/mouseEvents/eventHandlers/defaultEventHandlers';
import { setDefaultCursorModeAfterAlteringPolygonPoints } from '../../../../canvas/mouseInteractions/cursorModes/defaultMode';
import {
  resetAddPoints, cleanPolygonPointsArray, removePolygonPoints, getPolygonIdIfEditing,
} from '../../../../canvas/objects/polygon/alterPolygon/alterPolygon';
import { removeHighlightOfListLabel } from '../../../labelList/labelListHighlightUtils';

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
