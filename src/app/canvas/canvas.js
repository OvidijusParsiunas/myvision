import { assignCanvasForDrawingShapesViaCoordinates } from './utils/drawShapesViaCoordinates/drawShapesViaCoordinates.js';
import { assignCanvasMouseEvents } from '../tools/toolkit/buttonClickEvents/facade.js';
import assignResetCanvasEventsFuncToMouseEvents from '../tools/toolkit/buttonClickEvents/facadeWorkersUtils/resetCanvasEvents.js';
import { setBoundingBoxEditToolsToBeTransparent, createNewCanvas, reasignCanvas } from './utils/fabricUtils.js';
import { assignCanvasForLabelManipulation } from './objects/label/label.js';
import { assignCanvasForShapeFillManipulation } from './objects/allShapes/allShapes.js';
import { assignCanvasForResettingToDefaultAfterAddPoints } from './mouseInteractions/mouseEvents/resetCanvasUtils/resetCanvasAfterAddPoints.js';
import assignCanvasForResizeWhenWindowResize from '../tools/globalStyling/windowResize.js';
import { assignCanvasForLabelAndShapeBuilder } from './objects/allShapes/labelAndShapeBuilder.js';
import { assignCanvasToDimWindowService } from '../tools/dimWindow/dimWindowService.js';
import { initialiseZoomVariables } from '../tools/toolkit/buttonClickEvents/facadeWorkers/zoomWorker.js';
import { assignCanvasForUtils, assignNewCanvasForUtils } from './utils/canvasUtils.js';
import { assignCanvasForSettingsPopup } from '../tools/settingsPopup/init.js';
import { assignCanvasForHotKeys } from '../keyEvents/keyboard/hotKeys.js';
import assignCanvasForLabelList from '../tools/labelList/canvasManagement.js';
import assignCanvasForImageList from '../tools/imageList/canvasManagement.js';

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
  assignCanvasForSettingsPopup(canvas);
  assignCanvasForLabelList(canvas);
  assignCanvasForImageList(canvas);
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
