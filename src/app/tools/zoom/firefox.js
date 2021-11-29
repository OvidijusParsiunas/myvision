import { setDoubleScrollCanvasState } from '../state.js';
import { getCurrentCanvasContainerElement } from '../../canvas/utils/canvasUtils.js';
import { getScreenSizeDelta } from '../globalStyling/screenSizeDelta.js';

let zoomOverflowWrapperElement;
let zoomOverflowElement;
let stubElement;

let newCanvasWidth;
let newCanvasHeight;
let currentZoom = 1;
const scrollWidthDefault = 6;
let scrollWidth = scrollWidthDefault;

let canvasProperties = null;
let canvas = null;

function reduceCanvasDimensionsBy(width, height) {
  newCanvasWidth -= width;
  newCanvasHeight -= height;
}

function setCanvasElementProperties(left, top) {
  const canvasContainerElement = getCurrentCanvasContainerElement();
  canvasContainerElement.style.left = left || '50%';
  canvasContainerElement.style.top = top || '50%';
}

function setZoomOverFlowElementProperties(width, maxWidth, maxHeight) {
  zoomOverflowElement.style.width = width;
  zoomOverflowElement.style.maxWidth = maxWidth;
  zoomOverflowElement.style.maxHeight = maxHeight;
}

function setZoomOverFlowWrapperElementProperties(width, height, left, marginLeft, marginTop) {
  zoomOverflowWrapperElement.style.width = width;
  zoomOverflowWrapperElement.style.height = height;
  zoomOverflowWrapperElement.style.marginLeft = marginLeft;
  zoomOverflowWrapperElement.style.marginTop = marginTop;
  zoomOverflowWrapperElement.style.left = left || '50%';
}

function setStubElementProperties(width, height, marginLeft, marginTop) {
  stubElement.style.width = width;
  stubElement.style.height = height;
  stubElement.style.marginLeft = marginLeft;
  stubElement.style.marginTop = marginTop;
}

function setDarkZoomOverflowBackground() {
  zoomOverflowElement.style.backgroundColor = '#b1b1b1';
}

function setDefaultZoomOverflowBackground() {
  zoomOverflowElement.style.backgroundColor = '';
}

function setAllElementPropertiesToDefault(switchImage) {
  setZoomOverFlowElementProperties('', '', '');
  setStubElementProperties('', '', '', '');
  setZoomOverFlowWrapperElementProperties('', '', '', '', '');
  if (!switchImage) {
    setCanvasElementProperties('', '');
  }
  setDefaultZoomOverflowBackground();
}

function widthOverlapWithOneVerticalScrollBarOverlap(originalWidth, originalHeight) {
  const zoomOverflowMaxWidth = `${canvasProperties.maximumCanvasWidth - 1}px`;
  const zoomOverflowMaxHeight = `${Math.round(canvasProperties.maximumCanvasHeight - 2)}px`;
  const zoomOverflowWrapperLeft = `calc(50% - ${Math.round(scrollWidth / 2) - 2.5}px)`;
  const zoomOverflowWrapperMarginLeft = `${Math.round(scrollWidth / 2) - 2}px`;
  const stubMarginLeft = `${Math.round(originalWidth) - 5}px`;
  const stubMarginTop = `${originalHeight - 19}px`;
  const canvasLeft = `calc(50% - ${scrollWidth / 2}px)`;
  const canvasTop = `calc(50% - ${Math.round(scrollWidth / 2) + 0.5}px)`;
  const horizontalScrollOverlap = (Math.round(newCanvasHeight) + scrollWidth)
    - canvasProperties.maximumCanvasHeight + 2;
  setZoomOverFlowElementProperties('', zoomOverflowMaxWidth, zoomOverflowMaxHeight);
  setZoomOverFlowWrapperElementProperties('', '', zoomOverflowWrapperLeft, zoomOverflowWrapperMarginLeft, '');
  setStubElementProperties('', '', stubMarginLeft, stubMarginTop);
  setCanvasElementProperties(canvasLeft, canvasTop);
  reduceCanvasDimensionsBy(scrollWidth + 0.5, horizontalScrollOverlap);
  setDarkZoomOverflowBackground();
}

function widthOverflowDoubleVerticalScrollBarOverlap(originalWidth, originalHeight) {
  const zoomOverflowMaxWidth = `${newCanvasWidth - 1}px`;
  const zoomOverflowWrapperLeft = `calc(50% - ${scrollWidth / 2}px)`;
  const zoomOverflowWrapperMarginLeft = `${(scrollWidth / 2)}px`;
  const stubWidth = `${originalWidth - 0.5}px`;
  const stubMarginTop = `${originalHeight - 18}px`;
  const canvasTop = `calc(50% - ${Math.round((scrollWidth / 2))}px)`;
  setZoomOverFlowElementProperties('', zoomOverflowMaxWidth, '');
  setZoomOverFlowWrapperElementProperties('', '', zoomOverflowWrapperLeft, zoomOverflowWrapperMarginLeft, '');
  setStubElementProperties(stubWidth, '', '', stubMarginTop);
  setCanvasElementProperties('', canvasTop);
  setDarkZoomOverflowBackground();
}

function widthOverflowDefault(originalWidth, originalHeight) {
  const zoomOverflowMaxWidth = `${newCanvasWidth - 1}px`;
  const zoomOverflowWrapperLeft = 'calc(50% + 1px)';
  const zoomOverflowWrapperMarginTop = `${Math.round(scrollWidth / 2) - 1.5}px`;
  const stubMarginLeft = `${originalWidth - 4}px`;
  const stubMarginTop = `${originalHeight - 15}px`;
  setZoomOverFlowElementProperties('', zoomOverflowMaxWidth, '');
  setZoomOverFlowWrapperElementProperties('', '', zoomOverflowWrapperLeft, '', zoomOverflowWrapperMarginTop);
  setStubElementProperties('', '', stubMarginLeft, stubMarginTop);
  setCanvasElementProperties('', '');
  setDefaultZoomOverflowBackground();
}

function heightOverlapWithOneVerticalScrollBarOverlap(originalWidth, originalHeight) {
  const zoomOverflowWidth = `${canvasProperties.maximumCanvasWidth + 0.5}px`;
  const zoomOverflowMaxHeight = `${canvasProperties.maximumCanvasHeight - 1}px`;
  const zoomOverflowWrapperLeft = `calc(50% - ${scrollWidth}px)`;
  const zoomOverflowWrapperMarginLeft = `${scrollWidth}px`;
  const stubWidth = `${Math.round(originalWidth) + 1}px`;
  const stubMarginTop = `${originalHeight - 19}px`;
  const canvasLeft = `calc(50% - ${Math.round(scrollWidth / 2)}px)`;
  const canvasTop = `calc(50% - ${Math.round(scrollWidth / 2) + 0.5}px)`;
  const verticalScrollOverlap = originalWidth + scrollWidth
    - canvasProperties.maximumCanvasWidth + 0.5;
  setZoomOverFlowElementProperties(zoomOverflowWidth, '', zoomOverflowMaxHeight);
  setZoomOverFlowWrapperElementProperties('', '', zoomOverflowWrapperLeft, zoomOverflowWrapperMarginLeft, '');
  setStubElementProperties(stubWidth, '', '', stubMarginTop);
  setCanvasElementProperties(canvasLeft, canvasTop);
  reduceCanvasDimensionsBy(verticalScrollOverlap, scrollWidth + 1);
  setDarkZoomOverflowBackground();
}

function heightOverflowDoubleVerticalScrollBarOverlap(originalWidth, originalHeight) {
  const zoomOverflowWidth = `${Math.round(originalWidth)}px`;
  const zoomOverflowMaxHeight = `${newCanvasHeight}px`;
  const zoomOverflowWrapperLeft = `calc(50% - ${scrollWidth / 2 - 0.5}px)`;
  const zoomOverflowWrapperWidth = `${originalWidth - 1}px`;
  const zoomOverflowWrapperMarginLeft = `${scrollWidth}px`;
  const canvasLeft = `calc(50% - ${scrollWidth / 2}px)`;
  const stubMarginTop = `${originalHeight - 18}px`;
  setZoomOverFlowElementProperties(zoomOverflowWidth, '', zoomOverflowMaxHeight);
  setZoomOverFlowWrapperElementProperties(zoomOverflowWrapperWidth, '', zoomOverflowWrapperLeft,
    zoomOverflowWrapperMarginLeft, '');
  setStubElementProperties('', '', '', stubMarginTop);
  setCanvasElementProperties(canvasLeft, '');
  setDarkZoomOverflowBackground();
}

function heightOverflowDefault(originalWidth, originalHeight) {
  const zoomOverflowWidth = `${Math.round(originalWidth) - 1}px`;
  const zoomOverflowMaxHeight = `${newCanvasHeight}px`;
  const zoomOverflowWrapperMarginLeft = `${scrollWidth + 1}px`;
  // will need some work here if delta 1.2
  const stubMarginTop = getScreenSizeDelta() > 1.000001
    ? `${originalHeight - scrollWidth - (10 / getScreenSizeDelta())}px`
    : `${originalHeight - scrollWidth - 13}px`;
  setZoomOverFlowElementProperties(zoomOverflowWidth, '', zoomOverflowMaxHeight);
  setZoomOverFlowWrapperElementProperties('', '', '', zoomOverflowWrapperMarginLeft, '');
  setStubElementProperties('', '', '', stubMarginTop);
  setCanvasElementProperties('', '');
  setDarkZoomOverflowBackground();
}

// the use of current zoom may be the secret key for tighter zoom overflow wrap
function fullOverflowOfWidthAndHeight(originalWidth, originalHeight) {
  const zoomOverflowWidth = `${newCanvasWidth + 0.5}px`;
  const zoomOverflowMaxHeight = `${newCanvasHeight}px`;
  const zoomOverflowWrapperLeft = `calc(50% - ${Math.round(scrollWidth / 2) - 1.25}px)`;
  const zoomOverflowWrapperMarginLeft = `${scrollWidth / 2 - 1}px`;
  const stubMarginLeft = getScreenSizeDelta() > 1.000001
    ? `${Math.round(originalWidth) - (3 / getScreenSizeDelta())}px`
    : `${Math.round(originalWidth) - 4.5}px`;
  const stubMarginTop = `${Math.round(originalHeight) - 16.5 - (currentZoom)}px`;
  const canvasLeft = `calc(50% - ${Math.round(scrollWidth / 2)}px)`;
  const canvasTop = `calc(50% - ${Math.round(scrollWidth / 2) + 0.5}px)`;
  setZoomOverFlowElementProperties(zoomOverflowWidth, '', zoomOverflowMaxHeight);
  setZoomOverFlowWrapperElementProperties('', '', zoomOverflowWrapperLeft, zoomOverflowWrapperMarginLeft, '');
  setStubElementProperties('', '', stubMarginLeft, stubMarginTop);
  setCanvasElementProperties(canvasLeft, canvasTop);
  reduceCanvasDimensionsBy(scrollWidth + 0.25, scrollWidth + 0.2);
  setDarkZoomOverflowBackground();
}

function setTempValues(newCanvasWidthArg, newCanvasHeightArg, canvasPropertiesArg, currentZoomArg) {
  newCanvasWidth = newCanvasWidthArg;
  newCanvasHeight = newCanvasHeightArg;
  canvasProperties = canvasPropertiesArg;
  currentZoom = currentZoomArg;
}

function getScrollWidth() {
  // create a div with the scroll
  const div = document.createElement('div');
  div.style.overflowY = 'scroll';
  div.style.width = '50px';
  div.style.height = '50px';
  document.body.append(div);
  const browserScrollWidth = div.offsetWidth - div.clientWidth;
  div.remove();
  return browserScrollWidth;
}

function changeElementPropertiesFirefox(heightOverflowed, widthOverflowed, originalWidth,
  originalHeight, newCanvasWidthArg, newCanvasHeightArg, canvasPropertiesArg, currentZoomArg) {
  if (getScreenSizeDelta() > 1.000001) { newCanvasHeightArg += 1; }
  setTempValues(newCanvasWidthArg, newCanvasHeightArg, canvasPropertiesArg, currentZoomArg);
  scrollWidth = getScrollWidth() / 2;
  if (heightOverflowed) {
    if (widthOverflowed) {
      setDoubleScrollCanvasState(true);
      fullOverflowOfWidthAndHeight(originalWidth, originalHeight);
    } else {
      setDoubleScrollCanvasState(false);
      heightOverflowDefault(originalWidth, originalHeight);
      if (Math.round(newCanvasWidth) + (scrollWidth * 2)
        >= canvasProperties.maximumCanvasWidth - 1) {
        heightOverflowDoubleVerticalScrollBarOverlap(originalWidth, originalHeight);
        if (Math.round(newCanvasWidth) + scrollWidth >= canvasProperties.maximumCanvasWidth) {
          setDoubleScrollCanvasState(true);
          heightOverlapWithOneVerticalScrollBarOverlap(originalWidth, originalHeight);
        }
      }
    }
  } else if (widthOverflowed) {
    setDoubleScrollCanvasState(false);
    widthOverflowDefault(originalWidth, originalHeight);
    if (newCanvasHeight + (scrollWidth * 2) > canvasProperties.maximumCanvasHeight - 1) {
      widthOverflowDoubleVerticalScrollBarOverlap(originalWidth, originalHeight);
      if (newCanvasHeight + (scrollWidth) > canvasProperties.maximumCanvasHeight) {
        setDoubleScrollCanvasState(true);
        widthOverlapWithOneVerticalScrollBarOverlap(originalWidth, originalHeight);
      }
    }
  } else {
    setDoubleScrollCanvasState(false);
    setAllElementPropertiesToDefault();
  }
  const finalImageDimensions = {
    width: newCanvasWidth,
    height: newCanvasHeight,
  };
  canvas.setDimensions(finalImageDimensions);
}

function setDOMElementsFirefox(stubElementArg, zoomOverflowElementArg,
  zoomOverflowWrapperElementArg) {
  stubElement = stubElementArg;
  zoomOverflowElement = zoomOverflowElementArg;
  zoomOverflowWrapperElement = zoomOverflowWrapperElementArg;
}

function initialiseVariablesFirefox(canvasArg) {
  canvas = canvasArg;
}

export { initialiseVariablesFirefox, changeElementPropertiesFirefox, setDOMElementsFirefox };
