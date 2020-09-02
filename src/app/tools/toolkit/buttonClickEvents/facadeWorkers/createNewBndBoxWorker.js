import purgeCanvasMouseEvents from '../../../../canvas/mouseInteractions/mouseEvents/resetCanvasUtils/purgeAllMouseHandlers';
import assignDrawBoundingBoxEvents from '../../../../canvas/mouseInteractions/mouseEvents/eventHandlers/drawBndBoxEventHandlers';
import { setPolygonEditingButtonsToDefault, setEditShapesButtonToDefault, setCreateBoundingBoxButtonToActive } from '../../styling/state';
import {
  setAlteringPolygonPointsState, setLastDrawingModeState,
  setHasDrawnShapeState, getCrosshairUsedOnCanvasState, setDefaultState,
} from '../../../state';
import { moveCrosshair } from '../../../../canvas/mouseInteractions/cursorModes/drawWithCrosshairMode';
import { executeFunctionOnceOnMouseOver } from '../../../../keyEvents/mouse/mouseOverOut';

function displayCrosshairButton() {
  document.getElementById('button-container').classList.toggle('section1');
}

function initiateCreateNewBndBoxEvents(canvas) {
  // cancel drawing polygon
  // or hold on since polygons will not be drawin with no canvas
  if (canvas.backgroundImage) {
    purgeCanvasMouseEvents(canvas);
    assignDrawBoundingBoxEvents(canvas);
    if (getCrosshairUsedOnCanvasState()) executeFunctionOnceOnMouseOver(moveCrosshair);
    setEditShapesButtonToDefault();
    setDefaultState(false);
    setCreateBoundingBoxButtonToActive();
    setPolygonEditingButtonsToDefault();
    setAlteringPolygonPointsState(false);
    setLastDrawingModeState('boundingBox');
    setHasDrawnShapeState(false);
    displayCrosshairButton();
  }
}

export { initiateCreateNewBndBoxEvents as default };
