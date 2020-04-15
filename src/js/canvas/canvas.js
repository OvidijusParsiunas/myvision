import { assignCanvasForDrawingShapesViaCoordinates } from '../tools/toolkit/buttonClickEvents/facadeWorkersUtils/drawShapesViaCoordinates/drawShapesViaCoordinates';
import { assignCanvasMouseEvents } from '../tools/toolkit/buttonClickEvents/facade';
import { assignCanvasForDrawImageOnCanvas } from '../tools/toolkit/buttonClickEvents/facadeWorkersUtils/uploadImage/drawImageOnCanvas';
import assignResetCanvasEventsFuncToMouseEvents from '../tools/toolkit/buttonClickEvents/facadeWorkersUtils/resetCanvasEvents';
import { setBoundingBoxEditToolsToBeTransparent, createNewCanvas, reasignCanvas } from './utils/fabricUtils';
import { assignCanvasForLabelManipulation } from './objects/label/label';
import { assignCanvasForShapeFillManipulation } from './objects/allShapes/allShapes';
import { assignCanvasForResettingToDefaultAfterAddPoints } from './mouseInteractions/mouseEvents/resetCanvasUtils/resetCanvasAfterAddPoints';
import assignCanvasForResizeWhenWindowResize from '../tools/toolkit/buttonClickEvents/facadeWorkersUtils/windowResize';
import { assignCanvasForLabelAndShapeBuilder } from './objects/allShapes/labelAndShapeBuilder';
import { initialiseZoomVariables } from '../tools/toolkit/buttonClickEvents/facadeWorkers/zoomWorker';
import { assignCanvasForUtils, assignNewCanvasForUtils } from './utils/canvasUtils';

let currentCanvasInstance = null;

function repopulateCanvasReference(canvas) {
  assignCanvasMouseEvents(canvas);
  assignCanvasForDrawImageOnCanvas(canvas);
  assignResetCanvasEventsFuncToMouseEvents(canvas);
  assignCanvasForShapeFillManipulation(canvas);
  assignCanvasForLabelManipulation(canvas);
  assignCanvasForResettingToDefaultAfterAddPoints(canvas);
  assignCanvasForDrawingShapesViaCoordinates(canvas);
  assignCanvasForResizeWhenWindowResize(canvas);
  assignCanvasForLabelAndShapeBuilder(canvas);
  initialiseZoomVariables(canvas);
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
