import { getCanvasProperties, getImageProperties } from '../facadeWorkersUtils/uploadFile/uploadImage';

let currentZoom = 1;
let canvas = null;
let canvasProperties = null;
let imageProperties = null;
let stubElement;
let zoomOverflowWrapperElement;
let canvasElement;

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

function setStubElementProperties(width, height, marginLeft, marginTop) {
  stubElement.style.width = width;
  stubElement.style.height = height;
  stubElement.style.marginLeft = marginLeft;
  stubElement.style.marginTop = marginTop;
}

function loadCanvasElements() {
  stubElement = document.getElementById('stub');
  zoomOverflowWrapperElement = document.getElementById('zoom-overflow-wrapper');
  canvasElement = document.getElementById('canvas-wrapper-inner');
}

function setNewCanvasDimensions() {
  loadCanvasElements();
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
  if (heightOverflowed) {
    if (widthOverflowed) {
      stubElement.style.width = '';
      const stubMarginLeft = `${Math.round(originalWidth) - 2}px`;
      const stubMarginTop = `${Math.round(originalHeight) - scrollWidth - (currentZoom - 2)}px`;
      setStubElementProperties('', '', stubMarginLeft, stubMarginTop);
      zoomOverflowWrapperElement.style.width = '';
      zoomOverflowElement.style.maxWidth = '';
      zoomOverflowElement.style.width = `${newWidth + 1}px`;
      zoomOverflowElement.style.maxHeight = `${newHeight - 1}px`;
      // decide whether we should use - 1 or not depending on the browsers it works on
      zoomOverflowWrapperElement.style.marginTop = '0px';
      newHeight -= (scrollWidth + 1);
      newWidth -= (scrollWidth);
      canvasElement.style.top = `calc(50% - ${(scrollWidth / 2)}px)`;
      canvasElement.style.left = `calc(50% - ${Math.round(scrollWidth / 2) + 1}px)`;
      zoomOverflowWrapperElement.style.left = `calc(50% - ${Math.round(scrollWidth / 2)}px)`;
      zoomOverflowWrapperElement.style.marginLeft = `${scrollWidth / 2 - 1}px`;
      console.log('called');
    } else {
      zoomOverflowElement.style.maxHeight = `${newHeight}px`;
      zoomOverflowElement.style.width = `${originalWidth - 1}px`;
      zoomOverflowWrapperElement.style.marginLeft = `${scrollWidth + 1}px`;
      const stubMarginTop = `${originalHeight - scrollWidth - 1}px`;
      setStubElementProperties('', '', '', stubMarginTop);
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
          // refactor this and put it at a higher level
          console.log('called second bound');
          const stubWidth = `${Math.round(originalWidth) + 2}px`;
          setStubElementProperties(stubWidth, '', '', stubMarginTop);
          zoomOverflowElement.style.maxWidth = '';
          zoomOverflowElement.style.maxHeight = `${canvasProperties.maximumCanvasHeight}px`;
          zoomOverflowElement.style.width = `${canvasProperties.maximumCanvasWidth + 1}px`;
          newHeight -= scrollWidth;
          const verticalScrollOverlap = (originalWidth + scrollWidth - canvasProperties.maximumCanvasWidth + 1);
          newWidth -= verticalScrollOverlap;
          canvasElement.style.top = `calc(50% - ${(scrollWidth / 2)}px)`;
          canvasElement.style.left = `calc(50% - ${Math.round(scrollWidth / 2) + 1}px)`;
          zoomOverflowWrapperElement.style.left = `calc(50% - ${scrollWidth}px)`;
          zoomOverflowWrapperElement.style.width = '';
          zoomOverflowWrapperElement.style.marginLeft = `${scrollWidth - 1}px`;
        }
      }
    }
  } else if (widthOverflowed) {
    zoomOverflowElement.style.maxWidth = `${newWidth - 1}px`;
    let stubMarginLeft = `${originalWidth - 4}px`;
    let stubMarginTop = `${originalHeight - scrollWidth}px`;
    setStubElementProperties('', '', stubMarginLeft, stubMarginTop);
    zoomOverflowWrapperElement.style.marginTop = `${Math.round(scrollWidth / 2) - 1}px`;
    // there could be an instance where the newHeight may not initially exceed
    // maximum canvas height, but after exceeding maxcanvas width, it might
    if (newHeight + (scrollWidth * 2) > canvasProperties.maximumCanvasHeight) {
      console.log('base 1 overlap');
      canvasElement.style.top = `calc(50% - ${Math.round((scrollWidth / 2)) - 1}px)`;
      zoomOverflowWrapperElement.style.left = `calc(50% - ${scrollWidth / 2}px)`;
      zoomOverflowWrapperElement.style.marginTop = '';
      zoomOverflowWrapperElement.style.marginLeft = `${(scrollWidth / 2)}px`;
      const stubWidth = `${originalWidth}px`;
      setStubElementProperties(stubWidth, '', '', stubMarginTop);
      if (newHeight + (scrollWidth) > canvasProperties.maximumCanvasHeight - 2) {
        console.log('base 2 overlap');
        const stubHeight = `${scrollWidth}px`;
        stubMarginLeft = `${Math.round(originalWidth) - 2}px`;
        stubMarginTop = `${Math.round(originalHeight) - scrollWidth - (currentZoom - 1)}px`;
        setStubElementProperties('', stubHeight, stubMarginLeft, stubMarginTop);
        zoomOverflowElement.style.maxWidth = `${newWidth + 1}px`;
        zoomOverflowElement.style.maxHeight = `${Math.round(canvasProperties.maximumCanvasHeight) - 1}px`;
        const horizontalScrollOverlap = (Math.round(newHeight) + scrollWidth) - canvasProperties.maximumCanvasHeight + 1;
        newHeight -= horizontalScrollOverlap;
        newWidth -= (scrollWidth);
        canvasElement.style.top = `calc(50% - ${Math.round(scrollWidth / 2)}px)`;
        canvasElement.style.left = `calc(50% - ${scrollWidth / 2 + 1}px)`;
        zoomOverflowWrapperElement.style.left = `calc(50% - ${Math.round(scrollWidth / 2) - 1}px)`;
        zoomOverflowWrapperElement.style.marginLeft = `${Math.round(scrollWidth / 2) - 2}px`;
      }
    }
  } else {
    zoomOverflowWrapperElement.style.marginTop = '0px';
    zoomOverflowWrapperElement.style.marginLeft = '0px';
    zoomOverflowElement.style.maxWidth = 'none';
    zoomOverflowElement.style.maxHeight = 'none';
    setStubElementProperties('', '', '', '');
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
