import { assignCanvasMouseEvents } from '../utils/toolkit/buttonEvents/facade';
import { assignCanvasForNewImageUpload } from '../utils/toolkit/buttonEvents/facadeWorkersUtils/uploadFile/uploadImage';
import { assignCanvasForDownloadingAnnotationsXML } from '../utils/toolkit/buttonEvents/facadeWorkersUtils/downloadFile/fileTypes/XML';
import { setBoundingBoxEditToolsToBeTransparent, createNewCanvas } from './canvasUtils/fabricUtils';

function constructCanvas() {
  const canvas = createNewCanvas();
  setBoundingBoxEditToolsToBeTransparent();
  assignCanvasMouseEvents(canvas);
  assignCanvasForNewImageUpload(canvas);
  assignCanvasForDownloadingAnnotationsXML(canvas);
}

export { constructCanvas as default };
