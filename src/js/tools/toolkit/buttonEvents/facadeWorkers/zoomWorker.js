import { getCanvasProperties, getImageProperties, resizeCanvasAndImage } from '../facadeWorkersUtils/uploadFile/uploadImage';
import { changeMovePolygonPathOffset } from '../../../../canvas/objects/polygon/alterPolygon/resetCoordinatesAfterMove';
import polygonProperties from '../../../../canvas/objects/polygon/properties';
import labelProperties from '../../../../canvas/objects/label/properties';
import { resizeAllObjects } from '../../../../canvas/objects/objectsProperties/changeProperties';
import boundingBoxProps from '../../../../canvas/objects/boundingBox/properties';
import { setCurrentZoomState, setDoubleScrollCanvasState } from '../facadeWorkersUtils/stateManager';
import { moveDrawCrosshair } from '../../../../canvas/objects/polygon/polygon';

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
let canReduceShapeSizes = true;
let canIncreaseShapeSizes = false;
let movedPolygonPathOffsetReduced = false;
let timesZoomedWithNoShapeReduction = 0;
let timesZoomedWithNoShapeIncrease = 0;
const reduceShapeSizeRatios = {};
const increaseShapeSizeRatios = {
  polygon: 0.104, point: 0.1, label: 0.08, bndBox: 0.104, popup: 0.1,
};

// explore zoomToPoint

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

function checkIfChangeShapeSizeOnZoomIn() {
  if (currentZoom > 3.9) {
    canReduceShapeSizes = false;
    timesZoomedWithNoShapeReduction += 1;
    return false;
  }
  return true;
}

function zoomInObjects() {
  if (canReduceShapeSizes) {
    if (timesZoomedWithNoShapeIncrease === 0) {
      if (!checkIfChangeShapeSizeOnZoomIn()) return;
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
      canIncreaseShapeSizes = true;
    } else {
      timesZoomedWithNoShapeIncrease -= 1;
    }
  } else {
    timesZoomedWithNoShapeReduction += 1;
  }
}

function checkIfChangeShapeSizeOnZoomout() {
  if (currentZoom < 1) {
    canIncreaseShapeSizes = false;
    timesZoomedWithNoShapeIncrease += 1;
    return false;
  }
  return true;
}

function zoomOutObjects() {
  if (canIncreaseShapeSizes) {
    if (timesZoomedWithNoShapeReduction === 0) {
      if (!checkIfChangeShapeSizeOnZoomout()) return;
      updateShapesPropertiesForZoomOut();
      canvas.forEachObject((iteratedObj) => {
        switch (iteratedObj.shapeName) {
          case 'polygon':
            iteratedObj.strokeWidth *= reduceShapeSizeRatios.polygon;
            iteratedObj.labelOffsetTop = iteratedObj.top
            - (iteratedObj.points[0].y - labelProperties.pointOffsetProperties().top);
            break;
          case 'tempPolygon':
          case 'addPointsLine':
            iteratedObj.strokeWidth *= reduceShapeSizeRatios.polygon;
            break;
          case 'point':
          case 'invisiblePoint':
          case 'firstPoint':
          case 'tempPoint':
          case 'initialAddPoint':
            iteratedObj.radius *= reduceShapeSizeRatios.point;
            iteratedObj.strokeWidth *= reduceShapeSizeRatios.point;
            if (iteratedObj.polygonMoved) {
              iteratedObj.left += 0.05;
              iteratedObj.top += 0.05;
            }
            break;
          case 'label':
            iteratedObj.fontSize *= reduceShapeSizeRatios.label;
            if (iteratedObj.attachedShape === 'polygon') {
              iteratedObj.top -= 0.5;
            }
            break;
          case 'bndBox':
            iteratedObj.strokeWidth *= reduceShapeSizeRatios.bndBox;
            break;
          default:
            break;
        }
      });
      canvas.renderAll();
      canReduceShapeSizes = true;
    } else {
      timesZoomedWithNoShapeReduction -= 1;
    }
  } else {
    timesZoomedWithNoShapeIncrease += 1;
  }
}

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
// upon moving a polygon, then zooming, the points seem to be in wrong place
// scroll when zoomed in using scroll
// click to finish editing the polygon

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

function loadCanvasElements() {
  stubElement = document.getElementById('stub');
  zoomOverflowElement = document.getElementById('zoom-overflow');
  zoomOverflowWrapperElement = document.getElementById('zoom-overflow-wrapper');
  canvasElement = document.getElementById('canvas-wrapper-inner');
}

function setAllElementPropertiesToDefault() {
  setZoomOverFlowElementProperties('', '', '');
  setStubElementProperties('', '', '', '');
  setZoomOverFlowWrapperElementProperties('', '', '', '', '');
  setCanvasElementProperties('', '');
}

function widthOverlapWithOneVerticalScrollBarOverlap(originalWidth, originalHeight, scrollWidth) {
  const zoomOverflowMaxWidth = `${newCanvasWidth + 1}px`;
  const zoomOverflowMaxHeight = `${Math.round(canvasProperties.maximumCanvasHeight) - 1}px`;
  const zoomOverflowWrapperLeft = `calc(50% - ${Math.round(scrollWidth / 2) - 1}px)`;
  const zoomOverflowWrapperMarginLeft = `${Math.round(scrollWidth / 2) - 2}px`;
  const stubHeight = `${scrollWidth}px`;
  const stubMarginLeft = `${Math.round(originalWidth) - 2}px`;
  const stubMarginTop = `${Math.round(originalHeight) - scrollWidth - (currentZoom - 1)}px`;
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

function widthOverflowDoubleVerticalScrollBarOverlap(originalWidth, originalHeight, scrollWidth) {
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

function widthOverflowDefault(originalWidth, originalHeight, scrollWidth) {
  const zoomOverflowMaxWidth = `${newCanvasWidth - 1}px`;
  const zoomOverflowWrapperMarginTop = `${Math.round(scrollWidth / 2) - 1}px`;
  const stubMarginLeft = `${originalWidth - 4}px`;
  const stubMarginTop = `${originalHeight - scrollWidth}px`;
  setZoomOverFlowElementProperties('', zoomOverflowMaxWidth, '');
  setZoomOverFlowWrapperElementProperties('', '', '', '', zoomOverflowWrapperMarginTop);
  setStubElementProperties('', '', stubMarginLeft, stubMarginTop);
  setCanvasElementProperties('', '');
}

function heightOverlapWithOneVerticalScrollBarOverlap(originalWidth, originalHeight, scrollWidth) {
  const zoomOverflowWidth = `${canvasProperties.maximumCanvasWidth + 1}px`;
  const zoomOverflowMaxHeight = `${canvasProperties.maximumCanvasHeight}px`;
  const zoomOverflowWrapperLeft = `calc(50% - ${scrollWidth}px)`;
  const zoomOverflowWrapperMarginLeft = `${scrollWidth - 1}px`;
  const stubWidth = `${Math.round(originalWidth) + 2}px`;
  const stubMarginTop = `${originalHeight - scrollWidth - 1}px`;
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

function heightOverflowDoubleVerticalScrollBarOverlap(originalWidth, originalHeight, scrollWidth) {
  const zoomOverflowWidth = `${originalWidth - 1}px`;
  const zoomOverflowMaxHeight = `${newCanvasHeight}px`;
  const zoomOverflowWrapperLeft = `calc(50% - ${scrollWidth / 2}px)`;
  const zoomOverflowWrapperWidth = `${originalWidth - 1}px`;
  const zoomOverflowWrapperMarginLeft = `${scrollWidth}px`;
  const canvasLeft = `calc(50% - ${(scrollWidth / 2) + 1}px)`;
  const stubMarginTop = `${originalHeight - scrollWidth - 1}px`;
  setZoomOverFlowElementProperties(zoomOverflowWidth, '', zoomOverflowMaxHeight);
  setZoomOverFlowWrapperElementProperties(zoomOverflowWrapperWidth, '', zoomOverflowWrapperLeft,
    zoomOverflowWrapperMarginLeft, '');
  setStubElementProperties('', '', '', stubMarginTop);
  setCanvasElementProperties(canvasLeft, '');
}

function heightOverflowDefault(originalWidth, originalHeight, scrollWidth) {
  const zoomOverflowWidth = `${originalWidth - 1}px`;
  const zoomOverflowMaxHeight = `${newCanvasHeight}px`;
  const zoomOverflowWrapperMarginLeft = `${scrollWidth + 1}px`;
  const stubMarginTop = `${originalHeight - scrollWidth - 1}px`;
  setZoomOverFlowElementProperties(zoomOverflowWidth, '', zoomOverflowMaxHeight);
  setZoomOverFlowWrapperElementProperties('', '', '', zoomOverflowWrapperMarginLeft, '');
  setStubElementProperties('', '', '', stubMarginTop);
  setCanvasElementProperties('', '');
}

function fullOverflowOfWidthAndHeight(originalWidth, originalHeight, scrollWidth) {
  const zoomOverflowWidth = `${newCanvasWidth + 1}px`;
  const zoomOverflowMaxHeight = `${newCanvasHeight - 1}px`;
  const zoomOverflowWrapperLeft = `calc(50% - ${Math.round(scrollWidth / 2)}px)`;
  const zoomOverflowWrapperMarginLeft = `${scrollWidth / 2 - 1}px`;
  const stubMarginLeft = `${Math.round(originalWidth) - 1}px`;
  const stubMarginTop = `${Math.round(originalHeight) - scrollWidth - (currentZoom - 1)}px`;
  const canvasLeft = `calc(50% - ${Math.round(scrollWidth / 2)}px)`;
  const canvasTop = `calc(50% - ${scrollWidth / 2}px)`;
  setZoomOverFlowElementProperties(zoomOverflowWidth, '', zoomOverflowMaxHeight);
  setZoomOverFlowWrapperElementProperties('', '', zoomOverflowWrapperLeft, zoomOverflowWrapperMarginLeft, '');
  setStubElementProperties('', '', stubMarginLeft, stubMarginTop);
  setCanvasElementProperties(canvasLeft, canvasTop);
  reduceCanvasDimensionsBy(scrollWidth + 2, scrollWidth + 1);
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
      setDoubleScrollCanvasState(true);
      fullOverflowOfWidthAndHeight(originalWidth, originalHeight, scrollWidth);
      console.log('horizontal and vertical overlap');
    } else {
      setDoubleScrollCanvasState(false);
      heightOverflowDefault(originalWidth, originalHeight, scrollWidth);
      console.log('vertical overlap default');
      if (Math.round(newCanvasWidth) + (scrollWidth * 2) >= canvasProperties.maximumCanvasWidth) {
        heightOverflowDoubleVerticalScrollBarOverlap(originalWidth, originalHeight, scrollWidth);
        console.log('vertical double scrollbar overlap');
        if (Math.round(newCanvasWidth) + scrollWidth >= canvasProperties.maximumCanvasWidth) {
          setDoubleScrollCanvasState(true);
          heightOverlapWithOneVerticalScrollBarOverlap(originalWidth, originalHeight, scrollWidth);
          console.log('vertical single scrollbar overlap');
        }
      }
    }
  } else if (widthOverflowed) {
    setDoubleScrollCanvasState(false);
    widthOverflowDefault(originalWidth, originalHeight, scrollWidth);
    console.log('horizontal overlap default');
    if (newCanvasHeight + (scrollWidth * 2) > canvasProperties.maximumCanvasHeight) {
      widthOverflowDoubleVerticalScrollBarOverlap(originalWidth, originalHeight, scrollWidth);
      console.log('horizontal double scrollbar overlap');
      if (newCanvasHeight + (scrollWidth) > canvasProperties.maximumCanvasHeight - 3) {
        setDoubleScrollCanvasState(true);
        widthOverlapWithOneVerticalScrollBarOverlap(originalWidth, originalHeight, scrollWidth);
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

function zoomCanvas(canvasObj, action, windowResize) {
  if (windowResize) {
    canvasProperties = getCanvasProperties();
    imageProperties = getImageProperties();
    setNewCanvasDimensions();
  } else {
    canvas = canvasObj;
    canvasProperties = getCanvasProperties();
    imageProperties = getImageProperties();
    calculateReduceShapeSizeFactor();
    if (action === 'in') {
      currentZoom += 0.2;
      canvas.setZoom(currentZoom);
      zoomInObjects();
      reduceMovePolygonPathOffset();
    } else if (action === 'out') {
      currentZoom -= 0.2;
      canvas.setZoom(currentZoom);
      zoomOutObjects();
      increaseMovePolygonPathOffset();
      if (currentZoom === 1) {
        const newFileSizeRatio = resizeCanvasAndImage();
        labelProperties.updatePolygonOffsetProperties(newFileSizeRatio);
        resizeAllObjects(canvas, newFileSizeRatio);
      }
    }
    setNewCanvasDimensions();
    resetObjectsCoordinates();
    setCurrentZoomState(currentZoom);
  }
}

let scrollWheelUsed = false;

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

window.zoomOverflowPrepareToScroll = () => {
};

let mouseDown = null;

window.scrollingSomething = (event) => {
  zoomOverflowElement.scrollTop += event.deltaY;
  zoomOverflowElement.scrollTop += event.deltaX;
  scrollWheelUsed = true;
};

window.mouseDown = () => {
  mouseDown = true;
};

window.mouseUp = () => {
  mouseDown = false;
};

window.zoomOverflowStopScrolling = () => {
};


// function resizeAllObjects() {
//   canvas.forEachObject((object) => {
//     console.log(object);
//   });
// }
//
// let lastFileStatus = null;
//
// window.windowResize = () => {
//   newFileStatus = resizeCanvasAndImage();
//   resizeAllObjects();
//   // zoomCanvas(canvas);
// };

export { zoomCanvas as default };
