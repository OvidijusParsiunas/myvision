import purgeCanvasMouseEvents from '../../../../canvas/mouseInteractions/mouseEvents/resetCanvasUtils/purgeAllMouseHandlers';
import { setDefaultCursorModeAfterAlteringPolygonPoints, setDefaultCursorMode } from '../../../../canvas/mouseInteractions/cursorModes/defaultMode';
import assignDefaultEvents from '../../../../canvas/mouseInteractions/mouseEvents/eventHandlers/defaultEventHandlers';
import {
  setPolygonEditingButtonsToDefault, setEditShapesButtonToActive,
  setCreateBoundingBoxButtonToDefault, setCreatePolygonButtonToDefault,
} from '../../styling/state';
import {
  getCrosshairUsedOnCanvasState, setAlteringPolygonPointsState, 
  getDefaultState, getAddingPolygonPointsState, getLastDrawingModeState,
  setDefaultState, getAlteringPolygonPointsState, getContinuousDrawingState,
} from '../../../state';
import assignDrawBoundingBoxEvents from '../../../../canvas/mouseInteractions/mouseEvents/eventHandlers/drawBndBoxEventHandlers';
import assignDrawPolygonEvents from '../../../../canvas/mouseInteractions/mouseEvents/eventHandlers/drawPolygonEventHandlers';
import { getCurrentImage } from '../../../imageList/uploadImages/drawImageOnCanvas';
import { moveCrosshair } from '../../../../canvas/mouseInteractions/cursorModes/drawWithCrosshairMode';
import { executeFunctionOnceOnMouseOver } from '../../../../keyEvents/mouse/mouseOverOut';

// This function sets the new state of the canvas based on the current state
function setNewState(canvas) {
  if (getContinuousDrawingState()) { // If continuous drawing is enabled
    purgeCanvasMouseEvents(canvas); // Purge all mouse events from the canvas
    if (getLastDrawingModeState() === 'polygon') { // If the last drawing mode was polygon
      assignDrawPolygonEvents(canvas); // Assign draw polygon events to the canvas
    } else if (getLastDrawingModeState() === 'boundingBox') { // If the last drawing mode was bounding box
      assignDrawBoundingBoxEvents(canvas); // Assign draw bounding box events to the canvas
      if (getCrosshairUsedOnCanvasState()) { // If crosshair is used on the canvas
        executeFunctionOnceOnMouseOver(moveCrosshair); // Move the crosshair on mouse over
      }
    }
    setDefaultState(false); // Set default state to false
  } else { // If continuous drawing is disabled
    assignDefaultEvents(canvas, null, getAddingPolygonPointsState()); // Assign default events to the canvas
    setDefaultState(true); // Set default state to true
    if (getCurrentImage()) { // If there is a current image
      setEditShapesButtonToActive(); // Set edit shapes button to active
      setCreatePolygonButtonToDefault(); // Set create polygon button to default
      setCreateBoundingBoxButtonToDefault(); // Set create bounding box button to default
    }
  }
}

// This function resets the canvas events to the default state
function initiateResetCanvasEventsToDefaultEvent(canvas) {
  canvas.discardActiveObject(); // Discard the active object on the canvas
  if (!getDefaultState()) { // If the default state is false
    purgeCanvasMouseEvents(canvas); // Purge all mouse events from the canvas
    if (getAddingPolygonPointsState()) { // If adding polygon points is enabled
      setDefaultCursorModeAfterAlteringPolygonPoints(canvas); // Set default cursor mode after altering polygon points
    } else {
      setDefaultCursorMode(canvas); // Set default cursor mode
    }
    if (getAlteringPolygonPointsState()) { // If altering polygon points is enabled
      setPolygonEditingButtonsToDefault(); // Set polygon editing buttons to default
      setAlteringPolygonPointsState(false); // Set altering polygon points state to false
    }
    setNewState(canvas); // Set the new state of the canvas
  }
}

// Export the initiateResetCanvasEventsToDefaultEvent function as the default export
export { initiateResetCanvasEventsToDefaultEvent as default };
