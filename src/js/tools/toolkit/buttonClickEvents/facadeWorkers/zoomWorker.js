import { getCanvasProperties, getImageProperties, resizeCanvasAndImage } from '../facadeWorkersUtils/uploadImage/drawImageOnCanvas';
import { changeMovePolygonPathOffset } from '../../../../canvas/objects/polygon/alterPolygon/resetCoordinatesAfterMove';
import polygonProperties from '../../../../canvas/objects/polygon/properties';
import labelProperties from '../../../../canvas/objects/label/properties';
import { resizeAllObjectsDimensionsByDoubleScale } from '../../../../canvas/objects/objectsProperties/changeProperties';
import boundingBoxProps from '../../../../canvas/objects/boundingBox/properties';
import { setCurrentZoomState, getCurrentZoomState, setDoubleScrollCanvasState } from '../facadeWorkersUtils/stateMachine';
import { moveDrawCrosshair } from '../../../../canvas/objects/polygon/polygon';
import {
  changeElementPropertiesChromium, setDOMElementsChromium,
  initialiseVariablesChromium, setCanvasElementChromium,
} from '../facadeWorkersUtils/zoom/chromium';
import {
  changeElementPropertiesFirefox, setDOMElementsFirefox,
  initialiseVariablesFirefox, setCanvasElementFirefox,
} from '../facadeWorkersUtils/zoom/firefox';

let currentZoom = null;
let canvas = null;
let canvasProperties = null;
let imageProperties = null;

let stubElement;
let canvasElement;
let zoomOverflowElement;
let zoomOverflowWrapperElement;
let setNewCanvasElementForZoomFunc = null;
let changeElementPropertiesOnZoomFunc = null;

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

function setNewCanvasDimensions(changeElements) {
  let heightOverflowed = false;
  let widthOverflowed = false;
  let newCanvasWidth = imageProperties.width * currentZoom;
  const originalWidth = newCanvasWidth;
  let newCanvasHeight = imageProperties.height * currentZoom;
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
    changeElementPropertiesOnZoomFunc(heightOverflowed, widthOverflowed, originalWidth,
      originalHeight, newCanvasWidth, newCanvasHeight, canvasProperties, currentZoom);
  }
  return !widthOverflowed && !heightOverflowed;
}

function resetObjectsCoordinates() {
  canvas.forEachObject((iteratedObj) => {
    iteratedObj.setCoords();
  });
  canvas.renderAll();
}

function changeCanvas() {
  setNewCanvasDimensions(true);
  resetObjectsCoordinates();
  setCurrentZoomState(currentZoom);
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

function zoomIn() {
  timesZoomedIn += 1;
  currentZoom += 0.2;
  canvas.setZoom(currentZoom);
  zoomInObjects();
  reduceMovePolygonPathOffset();
  changeCanvas();
}

function calculateReduceShapeSizeFactor() {
  Object.keys(increaseShapeSizeRatios).forEach((key) => {
    const ratioToOriginalShapeSize = (1 / increaseShapeSizeRatios[key]);
    const originalShapeSizeToReducedShape = ratioToOriginalShapeSize - 1;
    reduceShapeSizeRatios[key] = ratioToOriginalShapeSize / originalShapeSizeToReducedShape;
  });
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
    canvasElement = document.getElementById('canvas-absolute-container-2');
    usingFirstCanvasWrapperInnerElement = false;
  } else {
    canvasElement = document.getElementById('canvas-absolute-container-1');
    usingFirstCanvasWrapperInnerElement = true;
  }
  setNewCanvasElementForZoomFunc(canvasElement);
}

function loadCanvasElements(browserSpecificSetterCallback) {
  stubElement = document.getElementById('stub');
  zoomOverflowElement = document.getElementById('zoom-overflow');
  canvasElement = document.getElementById('canvas-absolute-container-1');
  zoomOverflowWrapperElement = document.getElementById('zoom-overflow-wrapper');
  browserSpecificSetterCallback(stubElement, zoomOverflowElement,
    zoomOverflowWrapperElement, canvasElement);
}

function isFirefox() {
  return navigator.userAgent.toLowerCase().indexOf('firefox') > -1;
}

function initialiseZoomVariables(canvasObj) {
  canvas = canvasObj;
  // if firefox
  // if chromium
  // use callback here and choose the set canvas properties method
  currentZoom = getCurrentZoomState();
  if (isFirefox()) {
    initialiseVariablesFirefox(canvas);
    loadCanvasElements(setDOMElementsFirefox);
    setNewCanvasElementForZoomFunc = setCanvasElementFirefox;
    changeElementPropertiesOnZoomFunc = changeElementPropertiesFirefox;
  } else {
    initialiseVariablesChromium(canvas);
    loadCanvasElements(setDOMElementsChromium);
    setNewCanvasElementForZoomFunc = setCanvasElementChromium;
    changeElementPropertiesOnZoomFunc = changeElementPropertiesChromium;
  }
}

function initiateZoomOverflowScroll(event) {
  zoomOverflowElement.scrollTop += event.deltaY;
  zoomOverflowElement.scrollTop += event.deltaX;
  scrollWheelUsed = true;
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

export {
  zoomOutObjectOnImageSelect, switchCanvasWrapperInnerElement,
  zoomCanvas, initialiseZoomVariables, resetZoom, initiateZoomOverflowScroll,
};
