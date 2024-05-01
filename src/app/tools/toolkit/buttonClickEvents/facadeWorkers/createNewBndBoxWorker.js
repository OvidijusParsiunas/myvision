import { useEffect } from 'react';
import {
  executeFunctionOnceOnMouseOver,
  getCrosshairUsedOnCanvasState,
  purgeCanvasMouseEvents,
  setAlteringPolygonPointsState,
  setCreateBoundingBoxButtonToActive,
  setDefaultState,
  setEditShapesButtonToDefault,
  setHasDrawnShapeState,
  setLastDrawingModeState,
  setPolygonEditingButtonsToDefault,
  setAlteringPolygonPointsState,
} from '../../../state';
import assignDrawBoundingBoxEvents from '../../../../canvas/mouseInteractions/mouseEvents/eventHandlers/drawBndBoxEventHandlers';
import moveCrosshair from '../../../../canvas/mouseInteractions/cursorModes/drawWithCrosshairMode';

function initiateCreateNewBndBoxEvents(canvas) {
  if (!canvas) return null;

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
  }

  useEffect(() => {
    return () => {
      // handle side effects of changing the state here
    };
  }, []);

  return <canvas ref={canvas} />;
}

export default initiateCreateNewBndBoxEvents;
