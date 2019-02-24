import fabric from 'fabric';
import assignCanvasMouseEvents from './canvasMouseEvents';
import { assignCanvasForNewImageUpload } from './uploadFile';
import { assignCanvasForDownloadingAnnotationsXML } from './downloadXML';


function constructCanvas() {
  const canvas = new fabric.Canvas('c', { selection: false });
  fabric.Object.prototype.transparentCorners = false;
  assignCanvasMouseEvents(canvas);
  assignCanvasForNewImageUpload(canvas);
  assignCanvasForDownloadingAnnotationsXML(canvas);
}

export { constructCanvas as default };
