import {
  getContinuousDrawingState, setContinuousDrawingState,
//  getDefaultState, getAlteringPolygonPointsState, setDefaultState,
} from '../facadeWorkersUtils/stateManager';
// import purgeCanvasMouseEvents from '../../../../canvas/mouseInteractions/mouseEvents/resetCanvasUtils/purgeAllMouseHandlers';
// import { setDefaultCursorModeWhenReadyToDrawShapes } from '../../../../canvas/mouseInteractions/cursorModes/defaultMode';
// import assignDefaultEvents from '../../../../canvas/mouseInteractions/mouseEvents/eventHandlers/defaultEventHandlers';
// import { isPolygonDrawingInProgress } from '../../../../canvas/objects/polygon/polygon';


// set functionality for if currently in the continuous drawing mode and wanted to cancel it
// should be furthered by only diabling it after one shape has been drawn to execute on
// the intuition of the fact that I am currently in the mode

// function discardAllDrawEvents(canvas) {
//   purgeCanvasMouseEvents(canvas);
//   setDefaultCursorModeWhenReadyToDrawShapes(canvas);
//   assignDefaultEvents(canvas);
//   setDefaultState(true);
// }

// still work needed to be done
// when removing, make sure to purge the rest of the code that was built for this

function changeContinuousDrawingState(canvas) {
  const continuousDrawingState = getContinuousDrawingState();
  if (continuousDrawingState) {
    setContinuousDrawingState(false);
    // if (!getDefaultState() && !getAlteringPolygonPointsState() && !isPolygonDrawingInProgress()) {
    //   discardAllDrawEvents(canvas);
    // }
  } else {
    setContinuousDrawingState(true);
  }
}

export { changeContinuousDrawingState as default };
