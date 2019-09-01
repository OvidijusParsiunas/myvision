import { getCanvasProperties, getImageProperties } from '../facadeWorkersUtils/uploadFile/uploadImage';

let currentZoom = 1;
let canvas = null;
let canvasProperties = null;
let imageProperties = null;

function displayZoomMetrics() {
  //
}

function getScrollWidth() {
  // create a div with the scroll
  const div = document.createElement('div');
  div.style.overflowY = 'scroll';
  div.style.width = '50px';
  div.style.height = '50px';

  // must put it in the document, otherwise sizes will be 0
  document.body.append(div);
  const scrollWidth = div.offsetWidth - div.clientWidth;
  div.remove();
  return scrollWidth;
}

// option to always highlight

function setNewCanvasDimensions() {
  const scrollWidth = getScrollWidth();
  const zoomOverflowElement = document.getElementById('zoom-overflow');
  let heightOverflowed = false;
  let widthOverflowed = false;
  let newWidth = imageProperties.width * currentZoom;
  const originalWidth = newWidth;
  let newHeight = imageProperties.height * currentZoom;
  const originalHeight = newHeight;
  if (canvasProperties.maximumCanvasHeight < newHeight) {
    newHeight = canvasProperties.maximumCanvasHeight;
    heightOverflowed = true;
  }
  if (canvasProperties.maximumCanvasWidth < newWidth) {
    newWidth = canvasProperties.maximumCanvasWidth;
    widthOverflowed = true;
  }
  const stubElement = document.getElementById('stub');
  if (heightOverflowed) {
    if (widthOverflowed) {
      zoomOverflowElement.style.maxWidth = `${newWidth + 1}px`;
      zoomOverflowElement.style.maxHeight = `${newHeight + 1}px`;
      stubElement.style.marginTop = `${originalHeight - scrollWidth + 1}px`;
      stubElement.style.marginLeft = `${originalWidth - 2}px`;
      newHeight -= scrollWidth;
      newWidth -= scrollWidth;
    } else {
      zoomOverflowElement.style.maxHeight = `${newHeight + 2}px`;
      stubElement.style.marginTop = `${originalHeight - scrollWidth + 1}px`;
      stubElement.style.marginLeft = `${originalWidth - 2}px`;
      if (newWidth + scrollWidth > canvasProperties.maximumCanvasWidth) {
        zoomOverflowElement.style.maxWidth = `${newWidth + 1}px`;
        newHeight -= scrollWidth;
        newWidth -= scrollWidth;
      }
    }
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
  } else if (action === 'out') {
    currentZoom -= 0.2;
    canvas.setZoom(currentZoom);
  }
  setNewCanvasDimensions();
}

window.zoomOverflowScroll = (element) => {
  canvas.viewportTransform[4] = -element.scrollLeft;
  canvas.viewportTransform[5] = -element.scrollTop;
  canvas.requestRenderAll();
};

window.zoomOverflowPrepareToScroll = () => {
};

window.zoomOverflowStopScrolling = () => {
};

export { zoomCanvas as default };
