import purgeCanvasMouseEvents from '../../../../canvas/mouseInteractions/mouseEvents/resetCanvasUtils/purgeAllMouseHandlers';
import { setDefaultCursorModeAfterAlteringPolygonPoints, setDefaultCursorMode } from '../../../../canvas/mouseInteractions/cursorModes/defaultMode';
import assignDefaultEvents from '../../../../canvas/mouseInteractions/mouseEvents/eventHandlers/defaultEventHandlers';
import {
  getRemovingPolygonPointsState, setRemovingPolygonPointsState,
  setAddingPolygonPointsState, getDefaultState, getAddingPolygonPointsState,
  getPolygonDrawingInProgressState, setDefaultState, getAlteringPolygonPointsState,
  setCancelledReadyToDrawState, getReadyToDrawShapeState, setAlteringPolygonPointsState,
} from '../../../stateMachine';
import {
  cleanPolygonPointsArray, resetAddPoints, isAddingPointsToPolygon, getPolygonIdIfEditing,
} from '../../../../canvas/objects/polygon/alterPolygon/alterPolygon';
import setInitialStageOfAddPointsOnExistingPolygonMode from '../../../../canvas/mouseInteractions/cursorModes/initialiseAddPointsOnExistingPolygonMode';
import assignAddPointsOnExistingPolygonEvents from '../../../../canvas/mouseInteractions/mouseEvents/eventHandlers/addPointsEventHandlers';
import { resetNewPolygonData } from '../../../../canvas/objects/polygon/polygon';
import {
  setRemovePointsButtonToDefault, setRemoveShapeButtonToDisabled,
  setPolygonEditingButtonsToDefault, setAddPointsButtonToDefault,
} from '../../styling/stateMachine';

function dismissAddPointsEvents(canvas) {
  if (isAddingPointsToPolygon()) {
    assignAddPointsOnExistingPolygonEvents(canvas);
    resetAddPoints();
    setInitialStageOfAddPointsOnExistingPolygonMode(canvas);
  }
  resetAddPoints();
  setAddPointsButtonToDefault();
  setAddingPolygonPointsState(false);
  purgeCanvasMouseEvents(canvas);
  setDefaultCursorModeAfterAlteringPolygonPoints(canvas);
  assignDefaultEvents(canvas, getPolygonIdIfEditing());
}

function dismissRemovePointsEvents(canvas) {
  if (getPolygonDrawingInProgressState()) { resetNewPolygonData(); }
  purgeCanvasMouseEvents(canvas);
  cleanPolygonPointsArray();
  setDefaultCursorModeAfterAlteringPolygonPoints(canvas);
  assignDefaultEvents(canvas, getPolygonIdIfEditing());
  setRemovePointsButtonToDefault();
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
      setPolygonEditingButtonsToDefault();
      setAlteringPolygonPointsState(false);
    }
    setDefaultState(true);
  }
}

export { initiateEditShapesEvent as default };
