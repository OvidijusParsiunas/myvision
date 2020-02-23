import { setDoubleScrollCanvasState } from '../stateManager';

let zoomOverflowWrapperElement;
let zoomOverflowElement;
let stubElement;
let canvasElement;

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
  canvasElement.style.left = left || '50%';
  canvasElement.style.top = top || '50%';
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
  const zoomOverflowMaxWidth = `${canvasProperties.maximumCanvasWidth - 2}px`;
  const zoomOverflowMaxHeight = `${Math.round(canvasProperties.maximumCanvasHeight - 3)}px`;
  const zoomOverflowWrapperLeft = `calc(50% - ${Math.round(scrollWidth / 2) - 3.5}px)`;
  const zoomOverflowWrapperMarginLeft = `${Math.round(scrollWidth / 2) - 2}px`;
  const stubMarginLeft = `${Math.round(originalWidth) - 6}px`;
  const stubMarginTop = `${originalHeight - 20.3}px`;
  const canvasLeft = `calc(50% - ${scrollWidth / 2 + 0.5}px)`;
  const canvasTop = `calc(50% - ${Math.round(scrollWidth / 2) + 1}px)`;
  const horizontalScrollOverlap = (Math.round(newCanvasHeight) + scrollWidth)
    - canvasProperties.maximumCanvasHeight + 1.8;
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
  const stubMarginTop = `${originalHeight - 17.8}px`;
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
  const stubMarginTop = `${originalHeight - 14}px`;
  setZoomOverFlowElementProperties('', zoomOverflowMaxWidth, '');
  setZoomOverFlowWrapperElementProperties('', '', zoomOverflowWrapperLeft, '', zoomOverflowWrapperMarginTop);
  setStubElementProperties('', '', stubMarginLeft, stubMarginTop);
  setCanvasElementProperties('', '');
  setDefaultZoomOverflowBackground();
}

function heightOverlapWithOneVerticalScrollBarOverlap(originalWidth, originalHeight) {
  const zoomOverflowWidth = `${canvasProperties.maximumCanvasWidth}px`;
  const zoomOverflowMaxHeight = `${canvasProperties.maximumCanvasHeight - 1}px`;
  const zoomOverflowWrapperLeft = `calc(50% - ${scrollWidth}px)`;
  const zoomOverflowWrapperMarginLeft = `${scrollWidth}px`;
  const stubWidth = `${Math.round(originalWidth) + 2.5}px`;
  const stubMarginTop = `${originalHeight - 18}px`;
  const canvasLeft = `calc(50% - ${Math.round(scrollWidth / 2)}px)`;
  const canvasTop = `calc(50% - ${Math.round(scrollWidth / 2) + 0.5}px)`;
  const verticalScrollOverlap = originalWidth + scrollWidth
    - canvasProperties.maximumCanvasWidth + 2.3;
  setZoomOverFlowElementProperties(zoomOverflowWidth, '', zoomOverflowMaxHeight);
  setZoomOverFlowWrapperElementProperties('', '', zoomOverflowWrapperLeft, zoomOverflowWrapperMarginLeft, '');
  setStubElementProperties(stubWidth, '', '', stubMarginTop);
  setCanvasElementProperties(canvasLeft, canvasTop);
  reduceCanvasDimensionsBy(verticalScrollOverlap, scrollWidth + 1.5);
  setDarkZoomOverflowBackground();
}

function heightOverflowDoubleVerticalScrollBarOverlap(originalWidth, originalHeight) {
  const zoomOverflowWidth = `${Math.round(originalWidth)}px`;
  const zoomOverflowMaxHeight = `${newCanvasHeight}px`;
  const zoomOverflowWrapperLeft = `calc(50% - ${scrollWidth / 2 - 1}px)`;
  const zoomOverflowWrapperWidth = `${originalWidth - 1}px`;
  const zoomOverflowWrapperMarginLeft = `${scrollWidth}px`;
  const canvasLeft = `calc(50% - ${scrollWidth / 2}px)`;
  const stubMarginTop = `${originalHeight - 17}px`;
  setZoomOverFlowElementProperties(zoomOverflowWidth, '', zoomOverflowMaxHeight);
  setZoomOverFlowWrapperElementProperties(zoomOverflowWrapperWidth, '', zoomOverflowWrapperLeft,
    zoomOverflowWrapperMarginLeft, '');
  setStubElementProperties('', '', '', stubMarginTop);
  setCanvasElementProperties(canvasLeft, '');
  setDarkZoomOverflowBackground();
}

function heightOverflowDefault(originalWidth, originalHeight) {
  const zoomOverflowWidth = `${Math.round(originalWidth) - 1}px`;
  const zoomOverflowMaxHeight = `${newCanvasHeight - 5.5}px`;
  const zoomOverflowWrapperMarginLeft = `${scrollWidth + 1}px`;
  const stubMarginTop = `${originalHeight - scrollWidth - 16}px`;
  setZoomOverFlowElementProperties(zoomOverflowWidth, '', zoomOverflowMaxHeight);
  setZoomOverFlowWrapperElementProperties('', '', '', zoomOverflowWrapperMarginLeft, '');
  setStubElementProperties('', '', '', stubMarginTop);
  setCanvasElementProperties('', '');
  setDarkZoomOverflowBackground();
}

// the use of current zoom may be the secret key for tighter zoom overflow wrap
function fullOverflowOfWidthAndHeight(originalWidth, originalHeight) {
  const zoomOverflowWidth = `${newCanvasWidth + 2}px`;
  const zoomOverflowMaxHeight = `${newCanvasHeight}px`;
  const zoomOverflowWrapperLeft = `calc(50% - ${Math.round(scrollWidth / 2) - 1}px)`;
  const zoomOverflowWrapperMarginLeft = `${scrollWidth / 2 - 1}px`;
  const stubMarginLeft = `${Math.round(originalWidth) - 3.6}px`;
  const stubMarginTop = `${Math.round(originalHeight) - 16.5 - (currentZoom)}px`;
  const canvasLeft = `calc(50% - ${Math.round(scrollWidth / 2)}px)`;
  const canvasTop = `calc(50% - ${Math.round(scrollWidth / 2)}px)`;
  setZoomOverFlowElementProperties(zoomOverflowWidth, '', zoomOverflowMaxHeight);
  setZoomOverFlowWrapperElementProperties('', '', zoomOverflowWrapperLeft, zoomOverflowWrapperMarginLeft, '');
  setStubElementProperties('', '', stubMarginLeft, stubMarginTop);
  setCanvasElementProperties(canvasLeft, canvasTop);
  reduceCanvasDimensionsBy(scrollWidth, scrollWidth + 1);
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
  setTempValues(newCanvasWidthArg, newCanvasHeightArg, canvasPropertiesArg, currentZoomArg);
  scrollWidth = getScrollWidth() / 2;
  if (heightOverflowed) {
    if (widthOverflowed) {
      setDoubleScrollCanvasState(true);
      fullOverflowOfWidthAndHeight(originalWidth, originalHeight);
      console.log('horizontal and vertical overlap');
    } else {
      setDoubleScrollCanvasState(false);
      heightOverflowDefault(originalWidth, originalHeight);
      console.log('vertical overlap default');
      if (Math.round(newCanvasWidth) + (scrollWidth * 2)
        >= canvasProperties.maximumCanvasWidth - 1) {
        heightOverflowDoubleVerticalScrollBarOverlap(originalWidth, originalHeight);
        console.log('vertical double scrollbar overlap');
        if (Math.round(newCanvasWidth) + scrollWidth >= canvasProperties.maximumCanvasWidth - 1) {
          setDoubleScrollCanvasState(true);
          heightOverlapWithOneVerticalScrollBarOverlap(originalWidth, originalHeight);
          console.log('vertical single scrollbar overlap');
        }
      }
    }
  } else if (widthOverflowed) {
    setDoubleScrollCanvasState(false);
    widthOverflowDefault(originalWidth, originalHeight);
    console.log('horizontal overlap default');
    if (newCanvasHeight + (scrollWidth * 2) > canvasProperties.maximumCanvasHeight - 1) {
      widthOverflowDoubleVerticalScrollBarOverlap(originalWidth, originalHeight);
      console.log('horizontal double scrollbar overlap');
      if (newCanvasHeight + (scrollWidth) > canvasProperties.maximumCanvasHeight) {
        setDoubleScrollCanvasState(true);
        widthOverlapWithOneVerticalScrollBarOverlap(originalWidth, originalHeight);
        console.log('horizontal single scrollbar overlap');
      }
    }
  } else {
    setDoubleScrollCanvasState(false);
    setAllElementPropertiesToDefault();
    console.log('set to default');
  }
  const finalImageDimensions = {
    width: newCanvasWidth,
    height: newCanvasHeight,
  };
  canvas.setDimensions(finalImageDimensions);
}

function setDOMElementsFirefox(stubElementArg, zoomOverflowElementArg,
  zoomOverflowWrapperElementArg, canvasElementArg) {
  stubElement = stubElementArg;
  zoomOverflowElement = zoomOverflowElementArg;
  zoomOverflowWrapperElement = zoomOverflowWrapperElementArg;
  canvasElement = canvasElementArg;
}

function setCanvasElementFirefox(newCanvasElement) {
  canvasElement = newCanvasElement;
}

function initialiseVariablesFirefox(canvasArg) {
  canvas = canvasArg;
}

export {
  initialiseVariablesFirefox, setCanvasElementFirefox,
  changeElementPropertiesFirefox, setDOMElementsFirefox,
};
