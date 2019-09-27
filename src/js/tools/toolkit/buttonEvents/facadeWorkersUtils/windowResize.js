import { resizeCanvasAndImage, resizeCanvas } from './uploadFile/uploadImage';
import { resizeAllObjects } from '../../../../canvas/objects/objectsProperties/changeProperties';
import labelProperies from '../../../../canvas/objects/label/properties';
import { zoomCanvas } from '../facadeWorkers/zoomWorker';
import { getCurrentZoomState } from './stateManager';

let canvas = null;

window.windowResize = () => {
  if (getCurrentZoomState() > 1) {
    resizeCanvas();
    zoomCanvas(canvas, null, true);
  } else {
    const newFileSizeRatio = resizeCanvasAndImage();
    labelProperies.updatePolygonOffsetProperties(newFileSizeRatio);
    resizeAllObjects(newFileSizeRatio, canvas);
  }
};

function assignCanvasForResizeWhenWindowResize(canvasObj) {
  canvas = canvasObj;
}

export { assignCanvasForResizeWhenWindowResize as default };
