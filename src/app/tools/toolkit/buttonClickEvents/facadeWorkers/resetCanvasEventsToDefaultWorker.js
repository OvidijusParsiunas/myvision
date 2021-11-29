import purgeCanvasMouseEvents from '../../../../canvas/mouseInteractions/mouseEvents/resetCanvasUtils/purgeAllMouseHandlers.js';
import { setDefaultCursorModeAfterAlteringPolygonPoints, setDefaultCursorMode } from '../../../../canvas/mouseInteractions/cursorModes/defaultMode.js';
import assignDefaultEvents from '../../../../canvas/mouseInteractions/mouseEvents/eventHandlers/defaultEventHandlers.js';
import {
  setPolygonEditingButtonsToDefault, setEditShapesButtonToActive,
  setCreateBoundingBoxButtonToDefault, setCreatePolygonButtonToDefault,
} from '../../styling/state.js';
import {
  getCrosshairUsedOnCanvasState, setAlteringPolygonPointsState,
  getDefaultState, getAddingPolygonPointsState, getLastDrawingModeState,
  setDefaultState, getAlteringPolygonPointsState, getContinuousDrawingState,
} from '../../../state.js';
import assignDrawBoundingBoxEvents from '../../../../canvas/mouseInteractions/mouseEvents/eventHandlers/drawBndBoxEventHandlers.js';
import assignDrawPolygonEvents from '../../../../canvas/mouseInteractions/mouseEvents/eventHandlers/drawPolygonEventHandlers.js';
import { getCurrentImage } from '../../../imageList/uploadImages/drawImageOnCanvas.js';
import { moveCrosshair } from '../../../../canvas/mouseInteractions/cursorModes/drawWithCrosshairMode.js';
import { executeFunctionOnceOnMouseOver } from '../../../../keyEvents/mouse/mouseOverOut.js';

function setNewState(canvas) {
  if (getContinuousDrawingState()) {
    purgeCanvasMouseEvents(canvas);
    if (getLastDrawingModeState() === 'polygon') {
      assignDrawPolygonEvents(canvas);
    } else if (getLastDrawingModeState() === 'boundingBox') {
      assignDrawBoundingBoxEvents(canvas);
      if (getCrosshairUsedOnCanvasState()) {
        executeFunctionOnceOnMouseOver(moveCrosshair);
      }
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
