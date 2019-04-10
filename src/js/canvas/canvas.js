import fabric from 'fabric';
import { assignCanvasMouseEvents } from '../utils/toolkit/buttonEvents/facade';
import { assignCanvasForNewImageUpload } from '../utils/toolkit/buttonEvents/eventWorkersUtils/uploadFile/uploadImage';
import { assignCanvasForDownloadingAnnotationsXML } from '../utils/toolkit/buttonEvents/eventWorkersUtils/downloadFile/fileTypes/XML';

function constructCanvas() {
  const canvas = new fabric.Canvas('c', { selection: false });
  fabric.Object.prototype.transparentCorners = false;
  assignCanvasMouseEvents(canvas);
  assignCanvasForNewImageUpload(canvas);
  assignCanvasForDownloadingAnnotationsXML(canvas);
}

export { constructCanvas as default };
