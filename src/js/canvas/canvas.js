import { assignCanvasMouseEvents } from '../tools/toolkit/buttonEvents/facade';
import { assignCanvasForNewImageUpload } from '../tools/toolkit/buttonEvents/facadeWorkersUtils/uploadFile/uploadImage';
import { assignCanvasForDownloadingAnnotationsXML } from '../tools/toolkit/buttonEvents/facadeWorkersUtils/downloadFile/fileTypes/XML';
import assignResetCanvasEventsFuncToMouseEvents from '../tools/toolkit/buttonEvents/facadeWorkersUtils/resetCanvasEvents';
import { setBoundingBoxEditToolsToBeTransparent, createNewCanvas } from './utils/fabricUtils';
import { assignCanvasForLabelManipulation } from './objects/label/label';
import { assignCanvasForShapeFillManipulation } from './objects/allShapes/allShapes';
import { assignCanvasForResettingToDefaultAfterAddPoints } from './mouseInteractions/mouseEvents/resetCanvasUtils/resetCanvasAfterAddPoints';
import assignCanvasForResizeWindowResize from '../tools/toolkit/buttonEvents/facadeWorkersUtils/windowResize';

function constructCanvas() {
  const canvas = createNewCanvas();
  setBoundingBoxEditToolsToBeTransparent();
  assignCanvasMouseEvents(canvas);
  assignCanvasForNewImageUpload(canvas);
  assignCanvasForDownloadingAnnotationsXML(canvas);
  assignResetCanvasEventsFuncToMouseEvents(canvas);
  assignCanvasForShapeFillManipulation(canvas);
  assignCanvasForLabelManipulation(canvas);
  assignCanvasForResettingToDefaultAfterAddPoints(canvas);
  assignCanvasForResizeWindowResize(canvas);
}

export { constructCanvas as default };
