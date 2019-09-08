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
// need to click twice on polygon for points to be above label
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
  const canvasElement = document.getElementById('canvas-wrapper-inner');
  if (heightOverflowed) {
    if (widthOverflowed) {
      zoomOverflowWrapperElement.style.width = '';
      zoomOverflowElement.style.width = `${newWidth}px`;
      zoomOverflowElement.style.maxHeight = `${newHeight - 1}px`;
      stubElement.style.marginTop = `${originalHeight - scrollWidth - 1}px`;
      stubElement.style.marginLeft = `${originalWidth - 5}px`;
      zoomOverflowWrapperElement.style.marginTop = '0px';
      newHeight -= scrollWidth;
      newWidth -= scrollWidth;
      canvasElement.style.top = `calc(50% - ${(scrollWidth / 2)}px)`;
      canvasElement.style.left = `calc(50% - ${scrollWidth / 2 + 1}px)`;
      zoomOverflowWrapperElement.style.left = `calc(50% - ${scrollWidth / 2}px)`;
      zoomOverflowWrapperElement.style.marginLeft = `${scrollWidth / 2 - 1}px`;
      console.log('called');
    } else {
      zoomOverflowElement.style.maxHeight = `${newHeight}px`;
      zoomOverflowElement.style.width = `${originalWidth - 1}px`;
      stubElement.style.marginTop = `${originalHeight - scrollWidth - 1}px`;
      zoomOverflowWrapperElement.style.marginLeft = `${scrollWidth + 1}px`;
      console.log(scrollWidth);
      if (Math.round(newWidth) + (scrollWidth * 2) >= canvasProperties.maximumCanvasWidth) {
        console.log('width called');
        // canvasElement.style.top = '48.2%';
        // canvasElement.style.left = '48%';
        canvasElement.style.left = `calc(50% - ${(scrollWidth / 2) + 1}px)`;
        zoomOverflowWrapperElement.style.left = `calc(50% - ${scrollWidth / 2}px)`;
        zoomOverflowWrapperElement.style.width = `${originalWidth - 1}px`;
        zoomOverflowWrapperElement.style.marginTop = '0px';
        zoomOverflowWrapperElement.style.marginLeft = `${scrollWidth}px`;
        if (Math.round(newWidth) + scrollWidth >= canvasProperties.maximumCanvasWidth) {
          console.log('called second bound');
          const verticalScrollOverlap = ((Math.round(newWidth) + scrollWidth) - canvasProperties.maximumCanvasWidth + 2);
          stubElement.style.width = `${originalWidth + 2}px`;
          zoomOverflowElement.style.maxWidth = `${canvasProperties.maximumCanvasWidth}px`;
          zoomOverflowElement.style.maxHeight = `${canvasProperties.maximumCanvasHeight}px`;
          zoomOverflowElement.style.width = '';
          newHeight -= scrollWidth;
          newWidth -= verticalScrollOverlap;
          canvasElement.style.top = `calc(50% - ${(scrollWidth / 2)}px)`;
          canvasElement.style.left = `calc(50% - ${scrollWidth / 2}px)`;
          zoomOverflowWrapperElement.style.left = `calc(50% - ${scrollWidth}px)`;
          zoomOverflowWrapperElement.style.width = '';
          zoomOverflowWrapperElement.style.marginLeft = `${scrollWidth - 1}px`;
        }
        // zoomOverflowElement.style.maxWidth = `${newWidth + 1}px`;
        // zoomOverflowWrapperElement.style.marginTop = '0px';
        // newWidth -= scrollWidth;
        // newHeight -= scrollWidth;
      }
    }
  } else if (widthOverflowed) {
    zoomOverflowElement.style.maxWidth = `${newWidth - 1}px`;
    stubElement.style.marginTop = `${originalHeight - scrollWidth}px`;
    stubElement.style.marginLeft = `${originalWidth - 4}px`;
    zoomOverflowWrapperElement.style.marginTop = `${(scrollWidth) / 2}px`;
    // there could be an instance where the newHeight may not initially exceed
    // maximum canvas height, but after exceeding maxcanvas width, it might
    const canvasWrapperParentElement = document.getElementById('canvas-wrapper-parent');
    console.log(canvasWrapperParentElement.style.height);
    if (newHeight + (scrollWidth * 2) > canvasProperties.maximumCanvasHeight) {
      console.log('base 1 overlap');
      canvasElement.style.top = `calc(50% - ${(scrollWidth / 2)}px)`;
      zoomOverflowWrapperElement.style.left = `calc(50% - ${scrollWidth / 2}px)`;
      zoomOverflowWrapperElement.style.marginTop = '0px';
      zoomOverflowWrapperElement.style.marginLeft = `${(scrollWidth / 2)}px`;
      stubElement.style.marginLeft = `${originalWidth - 20}px`;
      if (newHeight + (scrollWidth) > canvasProperties.maximumCanvasHeight) {
        console.log('base 2 overlap');
        stubElement.style.marginLeft = `${originalWidth - 2}px`;
        stubElement.style.height = '13px';
        zoomOverflowElement.style.maxWidth = `${newWidth + 1}px`;
        zoomOverflowElement.style.maxHeight = `${canvasProperties.maximumCanvasHeight}px`;
        const horizontalScrollOverlap = (newHeight + scrollWidth) - canvasProperties.maximumCanvasHeight;
        newHeight -= horizontalScrollOverlap;
        newWidth -= scrollWidth;
        canvasElement.style.top = `calc(50% - ${(scrollWidth / 2)}px)`;
        canvasElement.style.left = `calc(50% - ${scrollWidth / 2}px)`;
        zoomOverflowWrapperElement.style.left = `calc(50% - ${scrollWidth / 2}px)`;
        zoomOverflowWrapperElement.style.marginLeft = `${scrollWidth / 2 - 1}px`;
      }
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
