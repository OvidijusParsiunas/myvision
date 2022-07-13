import purgeCanvasMouseEvents from '../../../../canvas/mouseInteractions/mouseEvents/resetCanvasUtils/purgeAllMouseHandlers';
import assignDrawBoundingBoxEvents from '../../../../canvas/mouseInteractions/mouseEvents/eventHandlers/drawBndBoxEventHandlers';
import {
  setAlteringPolygonPointsState, setLastDrawingModeState, setDefaultState,
  setHasDrawnShapeState, getCrosshairUsedOnCanvasState,
} from '../../../state';
import { moveCrosshair } from '../../../../canvas/mouseInteractions/cursorModes/drawWithCrosshairMode';
import { executeFunctionOnceOnMouseOver } from '../../../../keyEvents/mouse/mouseOverOut';

function initiateCreateNewBndBoxEvents(canvas) {
  // cancel drawing polygon
  // or hold on since polygons will not be drawin with no canvas
  if (canvas.backgroundImage) {
    purgeCanvasMouseEvents(canvas);
    assignDrawBoundingBoxEvents(canvas);
    if (getCrosshairUsedOnCanvasState()) executeFunctionOnceOnMouseOver(moveCrosshair);
    setDefaultState(false);
    setAlteringPolygonPointsState(false);
    setLastDrawingModeState('boundingBox');
    setHasDrawnShapeState(false);
  }
}

export { initiateCreateNewBndBoxEvents as default };
