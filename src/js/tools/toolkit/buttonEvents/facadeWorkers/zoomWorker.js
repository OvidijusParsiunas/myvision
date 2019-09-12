import { getCanvasProperties, getImageProperties } from '../facadeWorkersUtils/uploadFile/uploadImage';

let currentZoom = 1;
let canvas = null;
let canvasProperties = null;
let imageProperties = null;
let stubElement;
let zoomOverflowWrapperElement;
let zoomOverflowElement;
let canvasElement;
let newCanvasWidth;
let newCanvasHeight;

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
function reduceCanvasDimensionsBy(width, height) {
  newCanvasWidth -= width;
  newCanvasHeight -= height;
}

function setCanvasElementProperties(left, top) {
  canvasElement.style.left = left;
  canvasElement.style.top = top;
}

function setZoomOverFlowElementProperties(width, maxWidth, maxHeight) {
  zoomOverflowElement.style.width = width;
  zoomOverflowElement.style.maxWidth = maxWidth;
  zoomOverflowElement.style.maxHeight = maxHeight;
}

function setZoomOverFlowWrapperElementProperties(width, height, marginLeft, marginTop) {
  zoomOverflowWrapperElement.style.width = width;
  zoomOverflowWrapperElement.style.height = height;
  zoomOverflowWrapperElement.style.marginLeft = marginLeft;
  zoomOverflowWrapperElement.style.marginTop = marginTop;
}

function setStubElementProperties(width, height, left, marginLeft, marginTop) {
  stubElement.style.width = width;
  stubElement.style.height = height;
  stubElement.style.marginLeft = marginLeft;
  stubElement.style.marginTop = marginTop;
}

function loadCanvasElements() {
  stubElement = document.getElementById('stub');
  zoomOverflowElement = document.getElementById('zoom-overflow');
  zoomOverflowWrapperElement = document.getElementById('zoom-overflow-wrapper');
  canvasElement = document.getElementById('canvas-wrapper-inner');
}

function setNewCanvasDimensions() {
  loadCanvasElements();
  const scrollWidth = getScrollWidth();
  let heightOverflowed = false;
  let widthOverflowed = false;
  newCanvasWidth = imageProperties.width * currentZoom;
  const originalWidth = newCanvasWidth;
  newCanvasHeight = imageProperties.height * currentZoom;
  const originalHeight = newCanvasHeight;
  if (canvasProperties.maximumCanvasHeight < newCanvasHeight) {
    newCanvasHeight = canvasProperties.maximumCanvasHeight;
    heightOverflowed = true;
  }
  if (canvasProperties.maximumCanvasWidth < newCanvasWidth) {
    newCanvasWidth = canvasProperties.maximumCanvasWidth;
    widthOverflowed = true;
  }
  if (heightOverflowed) {
    if (widthOverflowed) {
      const stubMarginLeft = `${Math.round(originalWidth) - 2}px`;
      const stubMarginTop = `${Math.round(originalHeight) - scrollWidth - (currentZoom - 2)}px`;
      setStubElementProperties('', '', stubMarginLeft, stubMarginTop);
      const zoomOverflowWrapperLeft = `calc(50% - ${Math.round(scrollWidth / 2)}px)`;
      const zoomOverflowWrapperMarginLeft = `${scrollWidth / 2 - 1}px`;
      setZoomOverFlowWrapperElementProperties('', '', zoomOverflowWrapperLeft, zoomOverflowWrapperMarginLeft, '');
      const zoomOverflowWidth = `${newCanvasWidth + 1}px`;
      const zoomOverflowMaxHeight = `${newCanvasHeight - 1}px`;
      setZoomOverFlowElementProperties(zoomOverflowWidth, '', zoomOverflowMaxHeight);
      const canvasLeft = `calc(50% - ${Math.round(scrollWidth / 2) + 1}px)`;
      const canvasTop = `calc(50% - ${(scrollWidth / 2)}px)`;
      setCanvasElementProperties(canvasLeft, canvasTop);
      reduceCanvasDimensionsBy(scrollWidth, scrollWidth + 1);
      console.log('called');
    } else {
      let zoomOverflowWidth = `${originalWidth - 1}px`;
      let zoomOverflowMaxHeight = `${newCanvasHeight}px`;
      setZoomOverFlowElementProperties(zoomOverflowWidth, '', zoomOverflowMaxHeight);
      let zoomOverflowWrapperMarginLeft = `${scrollWidth + 1}px`;
      setZoomOverFlowWrapperElementProperties('', '', '', zoomOverflowWrapperMarginLeft, '');
      const stubMarginTop = `${originalHeight - scrollWidth - 1}px`;
      setStubElementProperties('', '', '', stubMarginTop);
      console.log(scrollWidth);
      if (Math.round(newCanvasWidth) + (scrollWidth * 2) >= canvasProperties.maximumCanvasWidth) {
        let canvasLeft = `calc(50% - ${(scrollWidth / 2) + 1}px)`;
        setCanvasElementProperties(canvasLeft, '');
        let zoomOverflowWrapperLeft = `calc(50% - ${scrollWidth / 2}px)`;
        const zoomOverflowWrapperWidth = `${originalWidth - 1}px`;
        zoomOverflowWrapperMarginLeft = `${scrollWidth}px`;
        setZoomOverFlowWrapperElementProperties(zoomOverflowWrapperWidth, '', zoomOverflowWrapperLeft,
          zoomOverflowWrapperMarginLeft, '');
        console.log('width called');
        if (Math.round(newCanvasWidth) + scrollWidth >= canvasProperties.maximumCanvasWidth) {
          // refactor this and put it at a higher level
          const stubWidth = `${Math.round(originalWidth) + 2}px`;
          setStubElementProperties(stubWidth, '', '', stubMarginTop);
          zoomOverflowWidth = `${canvasProperties.maximumCanvasWidth + 1}px`;
          zoomOverflowMaxHeight = `${canvasProperties.maximumCanvasHeight}px`;
          setZoomOverFlowElementProperties(zoomOverflowWidth, '', zoomOverflowMaxHeight);
          canvasLeft = `calc(50% - ${(scrollWidth / 2)}px)`;
          const canvasTop = `calc(50% - ${Math.round(scrollWidth / 2) + 1}px)`;
          setCanvasElementProperties(canvasLeft, canvasTop);
          zoomOverflowWrapperLeft = `calc(50% - ${scrollWidth}px)`;
          zoomOverflowWrapperMarginLeft = `${scrollWidth - 1}px`;
          setZoomOverFlowWrapperElementProperties('', '', zoomOverflowWrapperLeft, zoomOverflowWrapperMarginLeft, '');
          const verticalScrollOverlap = originalWidth + scrollWidth
            - canvasProperties.maximumCanvasWidth + 1;
          reduceCanvasDimensionsBy(verticalScrollOverlap, scrollWidth);
          console.log('called second bound');
        }
      }
    }
  } else if (widthOverflowed) {
    let zoomOverflowMaxWidth = `${newCanvasWidth - 1}px`;
    setZoomOverFlowElementProperties('', zoomOverflowMaxWidth, '');
    let stubMarginLeft = `${originalWidth - 4}px`;
    let stubMarginTop = `${originalHeight - scrollWidth}px`;
    setStubElementProperties('', '', stubMarginLeft, stubMarginTop);
    const zoomOverflowWrapperMarginTop = `${Math.round(scrollWidth / 2) - 1}px`;
    setZoomOverFlowWrapperElementProperties('', '', '', '', zoomOverflowWrapperMarginTop);
    // there could be an instance where the newCanvasHeight may not initially exceed
    // maximum canvas height, but after exceeding maxcanvas width, it might
    if (newCanvasHeight + (scrollWidth * 2) > canvasProperties.maximumCanvasHeight) {
      let canvasTop = `calc(50% - ${Math.round((scrollWidth / 2)) - 1}px)`;
      setCanvasElementProperties('', canvasTop);
      let zoomOverflowWrapperLeft = `calc(50% - ${scrollWidth / 2}px)`;
      let zoomOverflowWrapperMarginLeft = `calc(50% - ${scrollWidth / 2}px)`;
      setZoomOverFlowWrapperElementProperties('', '', zoomOverflowWrapperLeft, zoomOverflowWrapperMarginLeft, '');
      const stubWidth = `${originalWidth}px`;
      setStubElementProperties(stubWidth, '', '', stubMarginTop);
      console.log('base 1 overlap');
      if (newCanvasHeight + (scrollWidth) > canvasProperties.maximumCanvasHeight - 2) {
        const stubHeight = `${scrollWidth}px`;
        stubMarginLeft = `${Math.round(originalWidth) - 2}px`;
        stubMarginTop = `${Math.round(originalHeight) - scrollWidth - (currentZoom - 1)}px`;
        setStubElementProperties('', stubHeight, stubMarginLeft, stubMarginTop);
        zoomOverflowMaxWidth = `${newCanvasWidth + 1}px`;
        const zoomOverflowMaxHeight = `${Math.round(canvasProperties.maximumCanvasHeight) - 1}px`;
        setZoomOverFlowElementProperties('', zoomOverflowMaxWidth, zoomOverflowMaxHeight);
        const canvasLeft = `calc(50% - ${scrollWidth / 2 + 1}px)`;
        canvasTop = `calc(50% - ${Math.round(scrollWidth / 2)}px)`;
        setCanvasElementProperties(canvasLeft, canvasTop);
        zoomOverflowWrapperLeft = `calc(50% - ${Math.round(scrollWidth / 2) - 1}px)`;
        zoomOverflowWrapperMarginLeft = `${Math.round(scrollWidth / 2) - 2}px`;
        setZoomOverFlowWrapperElementProperties('', '', zoomOverflowWrapperLeft, zoomOverflowWrapperMarginLeft, '');
        const horizontalScrollOverlap = (Math.round(newCanvasHeight) + scrollWidth)
          - canvasProperties.maximumCanvasHeight + 1;
        reduceCanvasDimensionsBy(scrollWidth, horizontalScrollOverlap);
        console.log('base 2 overlap');
      }
    }
  } else {
    setZoomOverFlowElementProperties('', '', '');
    setStubElementProperties('', '', '', '');
    setZoomOverFlowWrapperElementProperties('', '', '', '', '');
  }
  const finalImageDimensions = {
    width: newCanvasWidth,
    height: newCanvasHeight,
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
