import { assignCanvasMouseEvents } from '../tools/toolkit/buttonEvents/facade';
import { assignCanvasForNewImageUpload } from '../tools/toolkit/buttonEvents/facadeWorkersUtils/uploadFile/uploadImage';
import { assignCanvasForDownloadingAnnotationsXML } from '../tools/toolkit/buttonEvents/facadeWorkersUtils/downloadFile/fileTypes/XML';
import { setBoundingBoxEditToolsToBeTransparent, createNewCanvas } from './utils/fabricUtils';

function constructCanvas() {
  const canvas = createNewCanvas();
  setBoundingBoxEditToolsToBeTransparent();
  assignCanvasMouseEvents(canvas);
  assignCanvasForNewImageUpload(canvas);
  assignCanvasForDownloadingAnnotationsXML(canvas);
}

export { constructCanvas as default };
