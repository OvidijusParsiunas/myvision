import purgeCanvasMouseEvents from '../../../../canvas/mouseInteractions/mouseEvents/resetCanvasUtils/purgeAllMouseHandlers';
import assignDrawBoundingBoxEvents from '../../../../canvas/mouseInteractions/mouseEvents/eventHandlers/drawBndBoxEventHandlers';
import { setPolygonEditingButtonsToDefault, setEditShapesButtonToDefault, setCreateBoundingBoxButtonToActive } from '../../styling/state';
import {
  setDefaultState, setAlteringPolygonPointsState,
  setLastDrawingModeState, setHasDrawnShapeState,
} from '../../../state';
import { moveCanvasCrosshairViaLastCanvasPositionAsync } from '../../../../canvas/mouseInteractions/cursorModes/drawWithCrosshairMode';

const IS_CROSSHAIR_MODE_ON = true;

function initiateCreateNewBndBoxEvents(canvas) {
  // cancel drawing polygon
  // or hold on since polygons will not be drawin with no canvas
  if (canvas.backgroundImage) {
    purgeCanvasMouseEvents(canvas);
    assignDrawBoundingBoxEvents(canvas);
    // redraw crosshair after mouse move has been triggered when switching images with keyboard
    if (IS_CROSSHAIR_MODE_ON) { moveCanvasCrosshairViaLastCanvasPositionAsync(); }
    setEditShapesButtonToDefault();
    setDefaultState(false);
    setCreateBoundingBoxButtonToActive();
    setPolygonEditingButtonsToDefault();
    setAlteringPolygonPointsState(false);
    setLastDrawingModeState('boundingBox');
    setHasDrawnShapeState(false);
  }
}

export { initiateCreateNewBndBoxEvents as default };
