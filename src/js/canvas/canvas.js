import { assignCanvasMouseEvents } from '../windowUtils/toolkit/buttonEvents/facade';
import { assignCanvasForNewImageUpload } from '../windowUtils/toolkit/buttonEvents/facadeWorkersUtils/uploadFile/uploadImage';
import { assignCanvasForDownloadingAnnotationsXML } from '../windowUtils/toolkit/buttonEvents/facadeWorkersUtils/downloadFile/fileTypes/XML';
import { setBoundingBoxEditToolsToBeTransparent, createNewCanvas } from './canvasUtils/fabricUtils';

function constructCanvas() {
  const canvas = createNewCanvas();
  setBoundingBoxEditToolsToBeTransparent();
  assignCanvasMouseEvents(canvas);
  assignCanvasForNewImageUpload(canvas);
  assignCanvasForDownloadingAnnotationsXML(canvas);
}

export { constructCanvas as default };
