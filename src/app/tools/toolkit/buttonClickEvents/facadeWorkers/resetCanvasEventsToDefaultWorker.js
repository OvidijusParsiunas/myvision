import purgeCanvasMouseEvents from '../../../../canvas/mouseInteractions/mouseEvents/resetCanvasUtils/purgeAllMouseHandlers';
import { setDefaultCursorModeAfterAlteringPolygonPoints, setDefaultCursorMode } from '../../../../canvas/mouseInteractions/cursorModes/defaultMode';
import assignDefaultEvents from '../../../../canvas/mouseInteractions/mouseEvents/eventHandlers/defaultEventHandlers';
import {
  setPolygonEditingButtonsToDefault, setEditShapesButtonToActive,
  setCreateBoundingBoxButtonToDefault, setCreatePolygonButtonToDefault,
} from '../../styling/state';
import {
  setDefaultState, getAlteringPolygonPointsState, setAlteringPolygonPointsState,
  getDefaultState, getAddingPolygonPointsState, getLastDrawingModeState, getContinuousDrawingState,
} from '../../../state';
import assignDrawBoundingBoxEvents from '../../../../canvas/mouseInteractions/mouseEvents/eventHandlers/drawBndBoxEventHandlers';
import assignDrawPolygonEvents from '../../../../canvas/mouseInteractions/mouseEvents/eventHandlers/drawPolygonEventHandlers';
import { getCurrentImage } from '../../../imageList/uploadImages/drawImageOnCanvas';
import { moveCanvasCrosshairViaLastCanvasPositionAsync } from '../../../../canvas/mouseInteractions/cursorModes/drawWithCrosshairMode';

const IS_CROSSHAIR_MODE_ON = true;

function setNewState(canvas) {
  if (getContinuousDrawingState()) {
    purgeCanvasMouseEvents(canvas);
    if (getLastDrawingModeState() === 'polygon') {
      assignDrawPolygonEvents(canvas);
    } else if (getLastDrawingModeState() === 'boundingBox') {
      assignDrawBoundingBoxEvents(canvas);
      // redraw crosshair after mouse move has been triggered when switching images with keyboard
      if (IS_CROSSHAIR_MODE_ON) moveCanvasCrosshairViaLastCanvasPositionAsync(canvas);
    }
    setDefaultState(false);
  } else {
    assignDefaultEvents(canvas, null, getAddingPolygonPointsState());
    setDefaultState(true);
    if (getCurrentImage()) {
      setEditShapesButtonToActive();
      setCreatePolygonButtonToDefault();
      setCreateBoundingBoxButtonToDefault();
    }
  }
}

function initiateResetCanvasEventsToDefaultEvent(canvas) {
  canvas.discardActiveObject();
  if (!getDefaultState()) {
    purgeCanvasMouseEvents(canvas);
    if (getAddingPolygonPointsState()) {
      setDefaultCursorModeAfterAlteringPolygonPoints(canvas);
    } else {
      setDefaultCursorMode(canvas);
    }
    if (getAlteringPolygonPointsState()) {
      setPolygonEditingButtonsToDefault();
      setAlteringPolygonPointsState(false);
    }
    setNewState(canvas);
  }
}

export { initiateResetCanvasEventsToDefaultEvent as default };
