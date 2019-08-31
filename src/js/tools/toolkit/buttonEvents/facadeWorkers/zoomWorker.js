import { getCanvasProperties, getImageProperties } from '../facadeWorkersUtils/uploadFile/uploadImage';

let currentZoom = 1;
let canvas = null;
let canvasProperties = null;
let imageProperties = null;

function setNewCanvasDimensions() {
  let newWidth = imageProperties.width * currentZoom;
  let newHeight = imageProperties.height * currentZoom;
  if (canvasProperties.maximumCanvasHeight < newHeight) {
    newHeight = canvasProperties.maximumCanvasHeight;
  }
  if (canvasProperties.maximumCanvasWidth < newWidth) {
    newWidth = canvasProperties.maximumCanvasWidth;
  }
  const finalImageDimensions = {
    width: newWidth,
    height: newHeight,
  };
  canvas.setDimensions(finalImageDimensions);
}

function zoomCanvas(canvasObj, action) {
  canvas = canvasObj;
  canvasProperties = getCanvasProperties();
  imageProperties = getImageProperties();
  if (action === 'in') {
    currentZoom += 0.2;
    canvas.setZoom(currentZoom);
  }
  setNewCanvasDimensions();
}

window.zoomOverflowScroll = (element) => {
  canvas.viewportTransform[4] = -element.scrollLeft;
  canvas.requestRenderAll();
};

window.zoomOverflowPrepareToScroll = () => {
};

window.zoomOverflowStopScrolling = () => {
  console.log('stop scrolling');
};

export { zoomCanvas as default };
