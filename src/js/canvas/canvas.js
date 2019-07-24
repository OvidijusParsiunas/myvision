import { assignCanvasMouseEvents } from '../tools/toolkit/buttonEvents/facade';
import { assignCanvasForNewImageUpload } from '../tools/toolkit/buttonEvents/facadeWorkersUtils/uploadFile/uploadImage';
import { assignCanvasForDownloadingAnnotationsXML } from '../tools/toolkit/buttonEvents/facadeWorkersUtils/downloadFile/fileTypes/XML';
import assignResetCanvasEventsFuncToMouseEvents from '../tools/toolkit/buttonEvents/facadeWorkersUtils/resetCanvasEvents';
import { setBoundingBoxEditToolsToBeTransparent, createNewCanvas } from './utils/fabricUtils';
import { assignCanvasForLabelManipulation } from './objects/label/label';

function constructCanvas() {
  const canvas = createNewCanvas();
  setBoundingBoxEditToolsToBeTransparent();
  assignCanvasMouseEvents(canvas);
  assignCanvasForNewImageUpload(canvas);
  assignCanvasForDownloadingAnnotationsXML(canvas);
  assignResetCanvasEventsFuncToMouseEvents(canvas);
  assignCanvasForLabelManipulation(canvas);
}

export { constructCanvas as default };
