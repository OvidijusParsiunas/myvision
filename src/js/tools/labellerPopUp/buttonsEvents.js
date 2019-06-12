import { createLabelShape, removeTargetShape, isLabelling } from './labellingProcess';
import { resetCanvasEventsToDefault } from '../toolkit/buttonEvents/facade';
import { hideLabelPopUp } from './style';
import { getContinuousDrawingState } from '../toolkit/buttonEvents/facadeWorkersUtils/stateManager';
import { isPolygonDrawingFinished, resetDrawPolygonMode } from '../../canvas/objects/polygon/polygon';
import { isBoundingBoxDrawingFinished, resetDrawBoundingBoxMode } from '../../canvas/objects/boundingBox/boundingBox';

function labelShape() {
  createLabelShape();
  if (!getContinuousDrawingState()) {
    resetCanvasEventsToDefault();
  } else if (isPolygonDrawingFinished()) {
    resetDrawPolygonMode();
  } else if (isBoundingBoxDrawingFinished()) {
    resetDrawBoundingBoxMode();
  }
}

function cancelLabellingProcess() {
  if (isLabelling()) {
    hideLabelPopUp();
    removeTargetShape();
  }
}

export { labelShape, cancelLabellingProcess };
