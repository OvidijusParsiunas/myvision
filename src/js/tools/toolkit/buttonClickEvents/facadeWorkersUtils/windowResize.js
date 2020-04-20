import { resizeCanvasAndImage, resizeCanvas, getCurrentImage } from './uploadImage/drawImageOnCanvas';
import { resizeAllObjectsDimensionsByDoubleScale } from '../../../../canvas/objects/objectsProperties/changeProperties';
import labelProperies from '../../../../canvas/objects/label/properties';
import { zoomCanvas } from '../facadeWorkers/zoomWorker';
import { getCurrentZoomState } from '../../../stateMachine';
import { validateFullModalVisibile } from '../../../shapeLabellerModal/style';

let canvas = null;

window.windowResize = () => {
  if (getCurrentZoomState() > 1) {
    resizeCanvas();
    zoomCanvas(canvas, null, true);
  } else if (getCurrentImage()) {
    const newFileSizeRatio = resizeCanvasAndImage();
    labelProperies.updatePolygonOffsetProperties(newFileSizeRatio);
    resizeAllObjectsDimensionsByDoubleScale(newFileSizeRatio, canvas);
  }
  const isWindowResized = true;
  validateFullModalVisibile(isWindowResized);
};

function assignCanvasForResizeWhenWindowResize(canvasObj) {
  canvas = canvasObj;
}

export { assignCanvasForResizeWhenWindowResize as default };
