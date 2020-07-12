import purgeCanvasMouseEvents from '../../../../canvas/mouseInteractions/mouseEvents/resetCanvasUtils/purgeAllMouseHandlers';
import { setDefaultCursorModeAfterAlteringPolygonPoints, setDefaultCursorMode } from '../../../../canvas/mouseInteractions/cursorModes/defaultMode';
import assignDefaultEvents from '../../../../canvas/mouseInteractions/mouseEvents/eventHandlers/defaultEventHandlers';
import {
  setCancelledReadyToDrawState, getReadyToDrawShapeState, setAlteringPolygonPointsState,
  getBoundingBoxDrawingInProgressState, getAddingPolygonPointsState, setReadyToDrawShapeState,
  setAddingPolygonPointsState, getDefaultState, setDefaultState, setRemovingPolygonPointsState,
  getPolygonDrawingInProgressState, getAlteringPolygonPointsState, getRemovingPolygonPointsState,
} from '../../../state';
import {
  cleanPolygonPointsArray, resetAddPoints, isAddingPointsToPolygon, getPolygonIdIfEditing,
} from '../../../../canvas/objects/polygon/alterPolygon/alterPolygon';
import setInitialStageOfAddPointsOnExistingPolygonMode from '../../../../canvas/mouseInteractions/cursorModes/initialiseAddPointsOnExistingPolygonMode';
import assignAddPointsOnExistingPolygonEvents from '../../../../canvas/mouseInteractions/mouseEvents/eventHandlers/addPointsEventHandlers';
import { resetNewPolygonData } from '../../../../canvas/objects/polygon/polygon';
import {
  setPolygonEditingButtonsToDefault, setRemoveShapeButtonToDisabled, setEditShapesButtonToActive,
} from '../../styling/state';
import { clearBoundingBoxData } from '../../../../canvas/objects/boundingBox/boundingBox';

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
  assignDefaultEvents(canvas, getPolygonIdIfEditing());
}

function dismissRemovePointsEvents(canvas) {
  if (getPolygonDrawingInProgressState()) {
    resetNewPolygonData();
    setRemoveShapeButtonToDisabled();
  }
  purgeCanvasMouseEvents(canvas);
  cleanPolygonPointsArray();
  setDefaultCursorModeAfterAlteringPolygonPoints(canvas);
  assignDefaultEvents(canvas, getPolygonIdIfEditing());
  setRemovingPolygonPointsState(false);
}

function dismissOtherEvents(canvas) {
  if (getReadyToDrawShapeState()) {
    setCancelledReadyToDrawState(true);
  } else {
    setCancelledReadyToDrawState(false);
  }
  if (getPolygonDrawingInProgressState()) {
    resetNewPolygonData();
    setRemoveShapeButtonToDisabled();
  }
  if (getBoundingBoxDrawingInProgressState()) {
    clearBoundingBoxData();
  }
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
    setEditShapesButtonToActive();
    setReadyToDrawShapeState(false);
    setDefaultState(true);
  }
  setPolygonEditingButtonsToDefault();
}

export { initiateEditShapesEvent as default };
