import { assignCanvasMouseEvents } from '../tools/toolkit/buttonEvents/facade';
import { assignCanvasForDrawImageOnCanvas } from '../tools/toolkit/buttonEvents/facadeWorkersUtils/uploadFile/drawImageOnCanvas';
import { assignCanvasForDownloadingAnnotationsXML } from '../tools/toolkit/buttonEvents/facadeWorkersUtils/downloadFile/fileTypes/XML';
import assignResetCanvasEventsFuncToMouseEvents from '../tools/toolkit/buttonEvents/facadeWorkersUtils/resetCanvasEvents';
import { setBoundingBoxEditToolsToBeTransparent, createNewCanvas, reasignCanvas } from './utils/fabricUtils';
import { assignCanvasForLabelManipulation } from './objects/label/label';
import { assignCanvasForShapeFillManipulation } from './objects/allShapes/allShapes';
import { assignCanvasForResettingToDefaultAfterAddPoints } from './mouseInteractions/mouseEvents/resetCanvasUtils/resetCanvasAfterAddPoints';
import assignCanvasForResizeWhenWindowResize from '../tools/toolkit/buttonEvents/facadeWorkersUtils/windowResize';
import { assignCanvasForLabelAndShapeBuilder } from './objects/allShapes/labelAndShapeBuilder';
import { initialiseZoomVariables } from '../tools/toolkit/buttonEvents/facadeWorkers/zoomWorker';
import { assignCanvasForUtils, assignNewCanvasForUtils } from './utils/canvasUtils';

let currentCanvasInstance = null;

function repopulateCanvasReference(canvas) {
  assignCanvasMouseEvents(canvas);
  assignCanvasForDrawImageOnCanvas(canvas);
  assignCanvasForDownloadingAnnotationsXML(canvas);
  assignResetCanvasEventsFuncToMouseEvents(canvas);
  assignCanvasForShapeFillManipulation(canvas);
  assignCanvasForLabelManipulation(canvas);
  assignCanvasForResettingToDefaultAfterAddPoints(canvas);
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
