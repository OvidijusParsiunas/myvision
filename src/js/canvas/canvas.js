import { assignCanvasMouseEvents } from '../tools/toolkit/buttonEvents/facade';
import { assignCanvasForDrawImageOnCanvas } from '../tools/toolkit/buttonEvents/facadeWorkersUtils/uploadFile/drawImageOnCanvas';
import { assignCanvasForDownloadingAnnotationsXML } from '../tools/toolkit/buttonEvents/facadeWorkersUtils/downloadFile/fileTypes/XML';
import assignResetCanvasEventsFuncToMouseEvents from '../tools/toolkit/buttonEvents/facadeWorkersUtils/resetCanvasEvents';
import { setBoundingBoxEditToolsToBeTransparent, createNewCanvas } from './utils/fabricUtils';
import { assignCanvasForLabelManipulation } from './objects/label/label';
import { assignCanvasForShapeFillManipulation } from './objects/allShapes/allShapes';
import { assignCanvasForResettingToDefaultAfterAddPoints } from './mouseInteractions/mouseEvents/resetCanvasUtils/resetCanvasAfterAddPoints';
import assignCanvasForResizeWhenWindowResize from '../tools/toolkit/buttonEvents/facadeWorkersUtils/windowResize';
import { initialiseZoomVariables } from '../tools/toolkit/buttonEvents/facadeWorkers/zoomWorker';

function constructCanvas() {
  const canvas = createNewCanvas();
  setBoundingBoxEditToolsToBeTransparent();
  assignCanvasMouseEvents(canvas);
  assignCanvasForDrawImageOnCanvas(canvas);
  assignCanvasForDownloadingAnnotationsXML(canvas);
  assignResetCanvasEventsFuncToMouseEvents(canvas);
  assignCanvasForShapeFillManipulation(canvas);
  assignCanvasForLabelManipulation(canvas);
  assignCanvasForResettingToDefaultAfterAddPoints(canvas);
  assignCanvasForResizeWhenWindowResize(canvas);
  initialiseZoomVariables(canvas);
}

export { constructCanvas as default };
