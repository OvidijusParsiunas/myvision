import { getCanvasProperties } from '../facadeWorkersUtils/uploadFile/uploadImage';

let currentZoom = 1;
let canvas = null;
let canvasProperties = null;

function zoomCanvas(canvasObj, action) {
  canvas = canvasObj;
  canvasProperties = getCanvasProperties();
  if (action === 'in') {
    currentZoom += 1;
    canvas.setZoom(currentZoom);
  }
}

window.changeCanvasOnScroll = () => {
};

export { zoomCanvas as default };
