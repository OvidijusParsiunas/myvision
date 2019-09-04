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
// react when the user resizes the screen
// bug where the popup doesn't appear on the correct place after zooming or non zooming

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
  const zoomOverflowWrapperElement = document.getElementById('zoom-overflow-wrapper');
  if (heightOverflowed) {
    if (widthOverflowed) {
      zoomOverflowElement.style.maxWidth = `${newWidth + 1}px`;
      zoomOverflowElement.style.maxHeight = `${newHeight}px`;
      stubElement.style.marginTop = `${originalHeight - scrollWidth + 1}px`;
      stubElement.style.marginLeft = `${originalWidth - 2}px`;
      zoomOverflowWrapperElement.style.marginLeft = `${scrollWidth - 2}px`;
      zoomOverflowWrapperElement.style.marginTop = '0px';
      newHeight -= scrollWidth;
      newWidth -= scrollWidth;
    } else {
      zoomOverflowElement.style.maxHeight = `${newHeight}px`;
      stubElement.style.marginTop = `${originalHeight - scrollWidth + 1}px`;
      stubElement.style.marginLeft = `${originalWidth - 2}px`;
      zoomOverflowWrapperElement.style.marginLeft = `${scrollWidth - 2}px`;
      if (newWidth + scrollWidth > canvasProperties.maximumCanvasWidth) {
        zoomOverflowElement.style.maxWidth = `${newWidth + 1}px`;
        zoomOverflowWrapperElement.style.marginTop = '0px';
        newWidth -= scrollWidth;
      }
    }
  } else if (widthOverflowed) {
    zoomOverflowElement.style.maxWidth = `${newWidth + 1}px`;
    stubElement.style.marginTop = `${originalHeight - scrollWidth}px`;
    stubElement.style.marginLeft = `${originalWidth - 2}px`;
    zoomOverflowWrapperElement.style.marginTop = `${scrollWidth - 2}px`;
    // there could be an instance where the newHeight may not initially exceed
    // maximum canvas height, but after exceeding maxcanvas width, it might
    console.log(newHeight);
    console.log(scrollWidth);
    console.log(canvasProperties.maximumCanvasHeight);
    const canvasWrapperParentElement = document.getElementById('canvas-wrapper-parent');
    console.log(canvasWrapperParentElement.style.height);
    if (newHeight + (scrollWidth * 2) > canvasProperties.maximumCanvasHeight) {
      // give it a scrollbar
      console.log('called 5');
      zoomOverflowElement.style.maxHeight = `${newHeight}px`;
      zoomOverflowWrapperElement.style.marginTop = `${(scrollWidth / 2) - 2}px`;
      const overflowHeight = ((newHeight + (scrollWidth)) - canvasProperties.maximumCanvasHeight);
      zoomOverflowWrapperElement.style.marginLeft = `${scrollWidth - 2}px`;
      const totalSubtractHeight = overflowHeight * 2;
      newHeight -= (scrollWidth);
      newWidth -= scrollWidth;
    }
  } else {
    zoomOverflowWrapperElement.style.marginTop = '0px';
    zoomOverflowWrapperElement.style.marginLeft = '0px';
    zoomOverflowElement.style.maxWidth = 'none';
    zoomOverflowElement.style.maxHeight = 'none';
    stubElement.style.marginTop = '0px';
    stubElement.style.marginLeft = '0px';
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
