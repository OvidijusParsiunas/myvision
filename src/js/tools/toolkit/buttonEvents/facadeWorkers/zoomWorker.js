import { getCanvasProperties } from '../facadeWorkersUtils/uploadFile/uploadImage';

let currentZoom = 1;

function zoomCanvas(canvas, action) {
  const canvasProperties = getCanvasProperties();
  if (action === 'in') {
    currentZoom += 1;
    canvas.setDimensions({
      width: canvasProperties.width * currentZoom,
      height: canvasProperties.height * currentZoom,
    });
    canvas.setZoom(currentZoom);
  }
}

export { zoomCanvas as default };
