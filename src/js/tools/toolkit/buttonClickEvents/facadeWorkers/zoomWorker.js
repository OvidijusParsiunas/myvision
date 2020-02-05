import { getCanvasProperties, getImageProperties, resizeCanvasAndImage } from '../facadeWorkersUtils/uploadFile/drawImageOnCanvas';
import { changeMovePolygonPathOffset } from '../../../../canvas/objects/polygon/alterPolygon/resetCoordinatesAfterMove';
import polygonProperties from '../../../../canvas/objects/polygon/properties';
import labelProperties from '../../../../canvas/objects/label/properties';
import { resizeAllObjectsDimensionsByDoubleScale } from '../../../../canvas/objects/objectsProperties/changeProperties';
import boundingBoxProps from '../../../../canvas/objects/boundingBox/properties';
import { setCurrentZoomState, getCurrentZoomState, setDoubleScrollCanvasState } from '../facadeWorkersUtils/stateManager';
import { moveDrawCrosshair } from '../../../../canvas/objects/polygon/polygon';

let currentZoom = null;
let canvas = null;
let canvasProperties = null;
let imageProperties = null;
let stubElement;
let zoomOverflowWrapperElement;
let zoomOverflowElement;
let canvasElement;
let newCanvasWidth;
let newCanvasHeight;
let scrollWidth = 0;
let timesZoomedIn = 0;
let scrollWheelUsed = false;
let movedPolygonPathOffsetReduced = false;
let usingFirstCanvasWrapperInnerElement = true;
const reduceShapeSizeRatios = {};
const increaseShapeSizeRatios = {
  polygon: 0.104, point: 0.1, label: 0.08, bndBox: 0.104, popup: 0.1,
};

function updateShapesPropertiesForZoomOut() {
  polygonProperties.setZoomOutProperties(
    reduceShapeSizeRatios.point, reduceShapeSizeRatios.polygon,
  );
  labelProperties.setZoomOutProperties(reduceShapeSizeRatios.label);
  boundingBoxProps.setZoomOutProperties(reduceShapeSizeRatios.bndBox);
}

function calculateNewShapeSizeRatios() {
  polygonProperties.setZoomInProperties(
    increaseShapeSizeRatios.point, increaseShapeSizeRatios.polygon,
  );
  labelProperties.setZoomInProperties(increaseShapeSizeRatios.label);
  boundingBoxProps.setZoomInProperties(increaseShapeSizeRatios.bndBox);
}

function zoomInObjects() {
  calculateNewShapeSizeRatios();
  canvas.forEachObject((iteratedObj) => {
    switch (iteratedObj.shapeName) {
      case 'polygon':
        iteratedObj.strokeWidth -= iteratedObj.strokeWidth * increaseShapeSizeRatios.polygon;
        iteratedObj.labelOffsetTop = iteratedObj.top
        - (iteratedObj.points[0].y - labelProperties.pointOffsetProperties().top);
        break;
      case 'tempPolygon':
      case 'addPointsLine':
        iteratedObj.strokeWidth -= iteratedObj.strokeWidth * increaseShapeSizeRatios.polygon;
        break;
      case 'point':
      case 'invisiblePoint':
      case 'firstPoint':
      case 'tempPoint':
      case 'initialAddPoint':
        iteratedObj.radius -= iteratedObj.radius * increaseShapeSizeRatios.point;
        iteratedObj.strokeWidth -= iteratedObj.strokeWidth * increaseShapeSizeRatios.point;
        if (iteratedObj.polygonMoved) {
          iteratedObj.left -= 0.05;
          iteratedObj.top -= 0.05;
        }
        break;
      case 'label':
        iteratedObj.fontSize -= iteratedObj.fontSize * increaseShapeSizeRatios.label;
        if (iteratedObj.attachedShape === 'polygon') {
          iteratedObj.top += 0.5;
        }
        break;
      case 'bndBox':
        iteratedObj.strokeWidth -= iteratedObj.strokeWidth * increaseShapeSizeRatios.bndBox;
        break;
      default:
        break;
    }
  });
  canvas.renderAll();
}

function zoomOutLabel(label) {
  label.fontSize *= reduceShapeSizeRatios.label;
  if (label.attachedShape === 'polygon') {
    label.top -= 0.5;
  }
}

function zoomOutObject(object) {
  switch (object.shapeName) {
    case 'polygon':
      object.strokeWidth *= reduceShapeSizeRatios.polygon;
      object.labelOffsetTop = object.top
      - (object.points[0].y - labelProperties.pointOffsetProperties().top);
      break;
    case 'tempPolygon':
    case 'addPointsLine':
      object.strokeWidth *= reduceShapeSizeRatios.polygon;
      break;
    case 'point':
    case 'invisiblePoint':
    case 'firstPoint':
    case 'tempPoint':
    case 'initialAddPoint':
      object.radius *= reduceShapeSizeRatios.point;
      object.strokeWidth *= reduceShapeSizeRatios.point;
      if (object.polygonMoved) {
        object.left += 0.05;
        object.top += 0.05;
      }
      break;
    case 'label':
      zoomOutLabel(object);
      break;
    case 'bndBox':
      object.strokeWidth *= reduceShapeSizeRatios.bndBox;
      break;
    default:
      break;
  }
}

function zoomOutObjects() {
  updateShapesPropertiesForZoomOut();
  canvas.forEachObject((iteratedObj) => {
    zoomOutObject(iteratedObj);
  });
  canvas.renderAll();
}

function zoomOutObjectsOnImageSelect(previousShapes, previousLabels) {
  Object.keys(previousShapes).forEach((key) => {
    zoomOutObject(previousShapes[key].shapeRef);
    zoomOutLabel(previousLabels[key]);
  });
}

// show the zoom percentage as a little fade just like google chrome resolution on resize
function displayZoomMetrics() {
  //
}

// explore zoomToPoint
// option to always highlight
// need to click twice on polygon for points to be above label

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

function setAllElementPropertiesToDefault(switchImage) {
  setZoomOverFlowElementProperties('', '', '');
  setStubElementProperties('', '', '', '');
  setZoomOverFlowWrapperElementProperties('', '', '', '', '');
  if (!switchImage) {
    setCanvasElementProperties('', '');
  }
}

function widthOverlapWithOneVerticalScrollBarOverlap(originalWidth, originalHeight) {
  const zoomOverflowMaxWidth = `${newCanvasWidth + 1}px`;
  const zoomOverflowMaxHeight = `${Math.round(canvasProperties.maximumCanvasHeight) - 1}px`;
  const zoomOverflowWrapperLeft = `calc(50% - ${Math.round(scrollWidth / 2) - 1}px)`;
  const zoomOverflowWrapperMarginLeft = `${Math.round(scrollWidth / 2) - 2}px`;
  const stubHeight = `${scrollWidth}px`;
  const stubMarginLeft = `${Math.round(originalWidth) - 3}px`;
  const stubMarginTop = `${Math.round(originalHeight) - 17 - (currentZoom - 1)}px`;
  const canvasLeft = `calc(50% - ${scrollWidth / 2 + 1}px)`;
  const canvasTop = `calc(50% - ${Math.round(scrollWidth / 2)}px)`;
  const horizontalScrollOverlap = (Math.round(newCanvasHeight) + scrollWidth)
    - canvasProperties.maximumCanvasHeight + 1;
  setZoomOverFlowElementProperties('', zoomOverflowMaxWidth, zoomOverflowMaxHeight);
  setZoomOverFlowWrapperElementProperties('', '', zoomOverflowWrapperLeft, zoomOverflowWrapperMarginLeft, '');
  setStubElementProperties('', stubHeight, stubMarginLeft, stubMarginTop);
  setCanvasElementProperties(canvasLeft, canvasTop);
  reduceCanvasDimensionsBy(scrollWidth, horizontalScrollOverlap);
}

function widthOverflowDoubleVerticalScrollBarOverlap(originalWidth, originalHeight) {
  const zoomOverflowMaxWidth = `${newCanvasWidth - 1}px`;
  const zoomOverflowWrapperLeft = `calc(50% - ${scrollWidth / 2}px)`;
  const zoomOverflowWrapperMarginLeft = `${(scrollWidth / 2)}px`;
  const stubWidth = `${originalWidth}px`;
  const stubMarginTop = `${originalHeight - scrollWidth}px`;
  const canvasTop = `calc(50% - ${Math.round((scrollWidth / 2)) - 1}px)`;
  setZoomOverFlowElementProperties('', zoomOverflowMaxWidth, '');
  setZoomOverFlowWrapperElementProperties('', '', zoomOverflowWrapperLeft, zoomOverflowWrapperMarginLeft, '');
  setStubElementProperties(stubWidth, '', '', stubMarginTop);
  setCanvasElementProperties('', canvasTop);
}

function widthOverflowDefault(originalWidth, originalHeight) {
  const zoomOverflowMaxWidth = `${newCanvasWidth - 1}px`;
  const zoomOverflowWrapperMarginTop = `${Math.round(scrollWidth / 2) - 1}px`;
  const stubMarginLeft = `${originalWidth - 4}px`;
  const stubMarginTop = `${originalHeight - 17}px`;
  setZoomOverFlowElementProperties('', zoomOverflowMaxWidth, '');
  setZoomOverFlowWrapperElementProperties('', '', '', '', zoomOverflowWrapperMarginTop);
  setStubElementProperties('', '', stubMarginLeft, stubMarginTop);
  setCanvasElementProperties('', '');
}

function heightOverlapWithOneVerticalScrollBarOverlap(originalWidth, originalHeight) {
  const zoomOverflowWidth = `${canvasProperties.maximumCanvasWidth + 1}px`;
  const zoomOverflowMaxHeight = `${canvasProperties.maximumCanvasHeight}px`;
  const zoomOverflowWrapperLeft = `calc(50% - ${scrollWidth}px)`;
  const zoomOverflowWrapperMarginLeft = `${scrollWidth - 1}px`;
  const stubWidth = `${Math.round(originalWidth) + 2}px`;
  const stubMarginTop = `${originalHeight - 17 - 1}px`;
  const canvasLeft = `calc(50% - ${Math.round(scrollWidth / 2)}px)`;
  const canvasTop = `calc(50% - ${Math.round(scrollWidth / 2)}px)`;
  const verticalScrollOverlap = originalWidth + scrollWidth
    - canvasProperties.maximumCanvasWidth + 1;
  setZoomOverFlowElementProperties(zoomOverflowWidth, '', zoomOverflowMaxHeight);
  setZoomOverFlowWrapperElementProperties('', '', zoomOverflowWrapperLeft, zoomOverflowWrapperMarginLeft, '');
  setStubElementProperties(stubWidth, '', '', stubMarginTop);
  setCanvasElementProperties(canvasLeft, canvasTop);
  reduceCanvasDimensionsBy(verticalScrollOverlap, scrollWidth);
}

function heightOverflowDoubleVerticalScrollBarOverlap(originalWidth, originalHeight) {
  const zoomOverflowWidth = `${originalWidth - 1}px`;
  const zoomOverflowMaxHeight = `${newCanvasHeight}px`;
  const zoomOverflowWrapperLeft = `calc(50% - ${scrollWidth / 2}px)`;
  const zoomOverflowWrapperWidth = `${originalWidth - 1}px`;
  const zoomOverflowWrapperMarginLeft = `${scrollWidth}px`;
  const canvasLeft = `calc(50% - ${(scrollWidth / 2) + 1}px)`;
  const stubMarginTop = `${originalHeight - 17 - 1}px`;
  setZoomOverFlowElementProperties(zoomOverflowWidth, '', zoomOverflowMaxHeight);
  setZoomOverFlowWrapperElementProperties(zoomOverflowWrapperWidth, '', zoomOverflowWrapperLeft,
    zoomOverflowWrapperMarginLeft, '');
  setStubElementProperties('', '', '', stubMarginTop);
  setCanvasElementProperties(canvasLeft, '');
}

function heightOverflowDefault(originalWidth, originalHeight) {
  const zoomOverflowWidth = `${Math.round(originalWidth) - 1}px`;
  const zoomOverflowMaxHeight = `${newCanvasHeight}px`;
  const zoomOverflowWrapperMarginLeft = `${scrollWidth + 1}px`;
  const stubMarginTop = `${originalHeight - scrollWidth - 15}px`;
  setZoomOverFlowElementProperties(zoomOverflowWidth, '', zoomOverflowMaxHeight);
  setZoomOverFlowWrapperElementProperties('', '', '', zoomOverflowWrapperMarginLeft, '');
  setStubElementProperties('', '', '', stubMarginTop);
  setCanvasElementProperties('', '');
}

function fullOverflowOfWidthAndHeight(originalWidth, originalHeight) {
  const zoomOverflowWidth = `${newCanvasWidth + 1}px`;
  const zoomOverflowMaxHeight = `${newCanvasHeight}px`;
  const zoomOverflowWrapperLeft = `calc(50% - ${Math.round(scrollWidth / 2)}px)`;
  const zoomOverflowWrapperMarginLeft = `${scrollWidth / 2 - 1}px`;
  const stubMarginLeft = `${Math.round(originalWidth) - 1}px`;
  const stubMarginTop = `${Math.round(originalHeight) - 17 - (currentZoom + 1)}px`;
  const canvasLeft = `calc(50% - ${Math.round(scrollWidth / 2)}px)`;
  const canvasTop = `calc(50% - ${scrollWidth / 2}px)`;
  setZoomOverFlowElementProperties(zoomOverflowWidth, '', zoomOverflowMaxHeight);
  setZoomOverFlowWrapperElementProperties('', '', zoomOverflowWrapperLeft, zoomOverflowWrapperMarginLeft, '');
  setStubElementProperties('', '', stubMarginLeft, stubMarginTop);
  setCanvasElementProperties(canvasLeft, canvasTop);
  reduceCanvasDimensionsBy(scrollWidth + 2, scrollWidth + 1);
}

function changeElementProperties(heightOverflowed, widthOverflowed, originalWidth,
  originalHeight) {
  if (heightOverflowed) {
    if (widthOverflowed) {
      setDoubleScrollCanvasState(true);
      fullOverflowOfWidthAndHeight(originalWidth, originalHeight);
      console.log('horizontal and vertical overlap');
    } else {
      setDoubleScrollCanvasState(false);
      heightOverflowDefault(originalWidth, originalHeight);
      console.log('vertical overlap default');
      if (Math.round(newCanvasWidth) + (scrollWidth * 2) >= canvasProperties.maximumCanvasWidth - 1) {
        heightOverflowDoubleVerticalScrollBarOverlap(originalWidth, originalHeight);
        console.log('vertical double scrollbar overlap');
        if (Math.round(newCanvasWidth) + scrollWidth >= canvasProperties.maximumCanvasWidth) {
          setDoubleScrollCanvasState(true);
          heightOverlapWithOneVerticalScrollBarOverlap(originalWidth, originalHeight);
          console.log('vertical single scrollbar overlap');
        }
      }
    }
    const finalImageDimensions = {
      width: newCanvasWidth,
      height: newCanvasHeight,
    };
    canvas.setDimensions(finalImageDimensions);
  } else if (widthOverflowed) {
    setDoubleScrollCanvasState(false);
    widthOverflowDefault(originalWidth, originalHeight);
    console.log('horizontal overlap default');
    if (newCanvasHeight + (scrollWidth * 2) > canvasProperties.maximumCanvasHeight) {
      widthOverflowDoubleVerticalScrollBarOverlap(originalWidth, originalHeight);
      console.log('horizontal double scrollbar overlap');
      if (newCanvasHeight + (scrollWidth) > canvasProperties.maximumCanvasHeight - 3) {
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
    height: newCanvasHeight - 4,
  };
  canvas.setDimensions(finalImageDimensions);
}

function setNewCanvasDimensions(changeElements) {
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
  if (changeElements) {
    changeElementProperties(heightOverflowed, widthOverflowed, originalWidth, originalHeight);
  }
  return !widthOverflowed && !heightOverflowed;
}

function resetObjectsCoordinates() {
  canvas.forEachObject((iteratedObj) => {
    iteratedObj.setCoords();
  });
  canvas.renderAll();
}

function calculateReduceShapeSizeFactor() {
  Object.keys(increaseShapeSizeRatios).forEach((key) => {
    const ratioToOriginalShapeSize = (1 / increaseShapeSizeRatios[key]);
    const originalShapeSizeToReducedShape = ratioToOriginalShapeSize - 1;
    reduceShapeSizeRatios[key] = ratioToOriginalShapeSize / originalShapeSizeToReducedShape;
  });
}

function reduceMovePolygonPathOffset() {
  if (currentZoom > 2 && !movedPolygonPathOffsetReduced) {
    changeMovePolygonPathOffset(0.6);
    movedPolygonPathOffsetReduced = true;
  }
}

function increaseMovePolygonPathOffset() {
  if (currentZoom <= 2 && movedPolygonPathOffsetReduced) {
    changeMovePolygonPathOffset(0);
    movedPolygonPathOffsetReduced = false;
  }
}

function changeCanvas() {
  setNewCanvasDimensions(true);
  resetObjectsCoordinates();
  setCurrentZoomState(currentZoom);
}

function resetCanvasToDefault() {
  currentZoom = 1;
  canvas.setZoom(currentZoom);
  while (timesZoomedIn !== 0) {
    timesZoomedIn -= 1;
    zoomOutObjects();
    increaseMovePolygonPathOffset();
  }
  const newFileSizeRatio = resizeCanvasAndImage();
  labelProperties.updatePolygonOffsetProperties(newFileSizeRatio);
  resizeAllObjectsDimensionsByDoubleScale(newFileSizeRatio, canvas);
  movedPolygonPathOffsetReduced = false;
}

function zoomIn() {
  timesZoomedIn += 1;
  currentZoom += 0.2;
  canvas.setZoom(currentZoom);
  zoomInObjects();
  reduceMovePolygonPathOffset();
  changeCanvas();
}

function zoomOut() {
  if (!stubElement.style.marginTop && imageProperties.scaleX < 1) {
    resetCanvasToDefault();
  } else {
    timesZoomedIn -= 1;
    currentZoom -= 0.2;
    zoomOutObjects();
    increaseMovePolygonPathOffset();
    if (currentZoom < 1.0001) {
      const newFileSizeRatio = resizeCanvasAndImage();
      labelProperties.updatePolygonOffsetProperties(newFileSizeRatio);
      resizeAllObjectsDimensionsByDoubleScale(newFileSizeRatio, canvas);
      canvas.setZoom(currentZoom);
    } else if (setNewCanvasDimensions() && imageProperties.scaleX < 1) {
      resetCanvasToDefault();
    } else {
      canvas.setZoom(currentZoom);
    }
  }
  changeCanvas();
}

// first parameter still required?
function zoomCanvas(canvasObj, action, windowResize) {
  if (windowResize) {
    canvasProperties = getCanvasProperties();
    imageProperties = getImageProperties();
    setNewCanvasDimensions(true);
  } else {
    canvasProperties = getCanvasProperties();
    imageProperties = getImageProperties();
    calculateReduceShapeSizeFactor();
    if (action === 'in' && currentZoom < 3.7) {
      zoomIn();
      if (currentZoom >= 3.9) {
        console.log('should grey out the zoom in button');
      }
    } else if (action === 'out' && currentZoom > 1.0001) {
      zoomOut();
    }
  }
}

function getScrollWidth() {
  
  return 6;
}

function loadCanvasElements() {
  stubElement = document.getElementById('stub');
  zoomOverflowElement = document.getElementById('zoom-overflow');
  zoomOverflowWrapperElement = document.getElementById('zoom-overflow-wrapper');
  canvasElement = document.getElementById('canvas-wrapper-inner');
}

function initialiseZoomVariables(canvasObj) {
  canvas = canvasObj;
  scrollWidth = getScrollWidth();
  currentZoom = getCurrentZoomState();
  loadCanvasElements();
}

function resetZoom(switchImage) {
  currentZoom = 1;
  const timesNeededToZoomOut = timesZoomedIn;
  while (timesZoomedIn !== 0) {
    timesZoomedIn -= 1;
    updateShapesPropertiesForZoomOut();
    increaseMovePolygonPathOffset();
  }
  setAllElementPropertiesToDefault(switchImage);
  setDoubleScrollCanvasState(false);
  setCurrentZoomState(currentZoom);
  return timesNeededToZoomOut;
}

function zoomOutObjectOnImageSelect(previousShapes, previousLabels, timesToZoomOut) {
  while (timesToZoomOut !== 0) {
    timesToZoomOut -= 1;
    zoomOutObjectsOnImageSelect(previousShapes, previousLabels);
  }
}

function switchCanvasWrapperInnerElement() {
  if (usingFirstCanvasWrapperInnerElement) {
    canvasElement = document.getElementById('canvas-wrapper-inner2');
    usingFirstCanvasWrapperInnerElement = false;
  } else {
    canvasElement = document.getElementById('canvas-wrapper-inner');
    usingFirstCanvasWrapperInnerElement = true;
  }
}

window.zoomOverflowScroll = (element) => {
  canvas.viewportTransform[4] = -element.scrollLeft;
  canvas.viewportTransform[5] = -element.scrollTop;
  if (!scrollWheelUsed) {
    moveDrawCrosshair(element);
  } else {
    scrollWheelUsed = false;
  }
  resetObjectsCoordinates();
};

function initiateZoomOverflowScroll(event) {
  zoomOverflowElement.scrollTop += event.deltaY;
  zoomOverflowElement.scrollTop += event.deltaX;
  scrollWheelUsed = true;
}

export {
  zoomOutObjectOnImageSelect, switchCanvasWrapperInnerElement,
  zoomCanvas, initialiseZoomVariables, resetZoom, initiateZoomOverflowScroll,
};
