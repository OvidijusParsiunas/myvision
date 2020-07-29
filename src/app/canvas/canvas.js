import { assignCanvasForDrawingShapesViaCoordinates } from './utils/drawShapesViaCoordinates/drawShapesViaCoordinates';
import { assignCanvasMouseEvents } from '../tools/toolkit/buttonClickEvents/facade';
import assignResetCanvasEventsFuncToMouseEvents from '../tools/toolkit/buttonClickEvents/facadeWorkersUtils/resetCanvasEvents';
import { setBoundingBoxEditToolsToBeTransparent, createNewCanvas, reasignCanvas } from './utils/fabricUtils';
import { assignCanvasForLabelManipulation } from './objects/label/label';
import { assignCanvasForShapeFillManipulation } from './objects/allShapes/allShapes';
import { assignCanvasForResettingToDefaultAfterAddPoints } from './mouseInteractions/mouseEvents/resetCanvasUtils/resetCanvasAfterAddPoints';
import assignCanvasForResizeWhenWindowResize from '../tools/globalStyling/windowResize';
import { assignCanvasForLabelAndShapeBuilder } from './objects/allShapes/labelAndShapeBuilder';
import { assignCanvasToDimWindowService } from '../tools/dimWindow/dimWindowService';
import { assignCanvasForUtils, assignNewCanvasForUtils } from './utils/canvasUtils';
import { assignCanvasForHotKeys } from '../keyEvents/keyboard/hotKeys';

let currentCanvasInstance = null;

function repopulateCanvasReference(canvas) {
  assignCanvasMouseEvents(canvas);
  assignCanvasForHotKeys(canvas);
  assignCanvasToDimWindowService(canvas);
  assignCanvasForLabelManipulation(canvas);
  assignCanvasForShapeFillManipulation(canvas);
  assignResetCanvasEventsFuncToMouseEvents(canvas);
  assignCanvasForResettingToDefaultAfterAddPoints(canvas);
  assignCanvasForDrawingShapesViaCoordinates(canvas);
  assignCanvasForResizeWhenWindowResize(canvas);
  assignCanvasForLabelAndShapeBuilder(canvas);
}

function constructCanvas() {
  setBoundingBoxEditToolsToBeTransparent();
  currentCanvasInstance = createNewCanvas();
  assignCanvasForUtils(currentCanvasInstance);
  repopulateCanvasReference(currentCanvasInstance);
}

function reassignReferenceToNewCanvas() {
  currentCanvasInstance = reasignCanvas();
  assignNewCanvasForUtils(currentCanvasInstance);
  repopulateCanvasReference(currentCanvasInstance);
}

export { constructCanvas, reassignReferenceToNewCanvas };
