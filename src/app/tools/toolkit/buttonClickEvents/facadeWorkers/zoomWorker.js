import {
  resizeCanvasAndImage, removeCanvasOuterMargin,
  getCanvasProperties, getImageProperties, enableCanvasOuterMargin,
} from '../../../imageList/uploadImages/drawImageOnCanvas.js';
import { changeMovePolygonPathOffset } from '../../../../canvas/objects/polygon/alterPolygon/resetCoordinatesAfterMove.js';
import polygonProperties from '../../../../canvas/objects/polygon/properties.js';
import labelProperties from '../../../../canvas/objects/label/properties.js';
import { resizeAllObjectsDimensionsByDoubleScale } from '../../../../canvas/objects/objectsProperties/changeProperties.js';
import boundingBoxProps from '../../../../canvas/objects/boundingBox/properties.js';
import {
  setDoubleScrollCanvasState, getCurrentZoomState,
  getCrosshairUsedOnCanvasState, setCurrentZoomState,
} from '../../../state.js';
import { scrolledViaScrollbar } from '../../../../canvas/objects/polygon/polygon.js';
import { changeElementPropertiesChromium, setDOMElementsChromium, initialiseVariablesChromium } from '../../../zoom/chromium.js';
import { changeElementPropertiesFirefox, setDOMElementsFirefox, initialiseVariablesFirefox } from '../../../zoom/firefox.js';
import IS_FIREFOX from '../../../utils/browserType.js';
import { getCurrentCanvasContainerElement } from '../../../../canvas/utils/canvasUtils.js';
import {
  setZoomInButtonToDefault, setZoomInButtonToDisabled,
  setZoomOutButtonToDefault, setZoomOutButtonToDisabled,
} from '../../styling/state.js';
import { setCrosshairAfterZoom, resetCanvasCrosshairStrokeWidth } from '../../../../canvas/mouseInteractions/cursorModes/drawWithCrosshairMode.js';
import crosshairProps from '../../../../canvas/objects/crosshair/properties.js';

let currentZoom = null;
let canvas = null;
let canvasProperties = null;
let imageProperties = null;

let stubElement;
let zoomOverflowElement;
let zoomOverflowWrapperElement;
let changeElementPropertiesOnZoomFunc = null;

let timesZoomedIn = 0;
let scrollWheelUsed = false;
let movedPolygonPathOffsetReduced = false;

const reduceShapeSizeRatios = {};
const increaseShapeSizeRatios = {
  polygon: 0.104, point: 0.1, label: 0.08, bndBox: 0.104, popup: 0.1, crosshair: 0.104,
};

function updateShapesPropertiesForZoomOut() {
  polygonProperties.setZoomOutProperties(
    reduceShapeSizeRatios.point, reduceShapeSizeRatios.polygon,
  );
  labelProperties.setZoomOutProperties(reduceShapeSizeRatios.label);
  boundingBoxProps.setZoomOutProperties(reduceShapeSizeRatios.bndBox);
  crosshairProps.setZoomOutProperties(reduceShapeSizeRatios.crosshair);
}

function calculateNewShapeSizeRatios() {
  polygonProperties.setZoomInProperties(
    increaseShapeSizeRatios.point, increaseShapeSizeRatios.polygon,
  );
  labelProperties.setZoomInProperties(increaseShapeSizeRatios.label);
  boundingBoxProps.setZoomInProperties(increaseShapeSizeRatios.bndBox);
  crosshairProps.setZoomInProperties(increaseShapeSizeRatios.crosshair);
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
      case 'crosshairLine':
        iteratedObj.strokeWidth -= iteratedObj.strokeWidth * increaseShapeSizeRatios.crosshair;
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
    case 'crosshairLine':
      object.strokeWidth *= reduceShapeSizeRatios.crosshair;
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
  if (currentZoom === 1) {
    newCanvasWidth = Math.ceil(newCanvasWidth);
    newCanvasHeight = Math.ceil(newCanvasHeight);
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
  enableCanvasOuterMargin();
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
  setZoomInButtonToDefault();
  setZoomOutButtonToDisabled();
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
      enableCanvasOuterMargin();
      const newFileSizeRatio = resizeCanvasAndImage();
      labelProperties.updatePolygonOffsetProperties(newFileSizeRatio);
      resizeAllObjectsDimensionsByDoubleScale(newFileSizeRatio, canvas);
      canvas.setZoom(currentZoom);
      setZoomOutButtonToDisabled();
    } else if (setNewCanvasDimensions() && imageProperties.scaleX < 1) {
      resetCanvasToDefault();
    } else {
      setZoomInButtonToDefault();
      canvas.setZoom(currentZoom);
    }
  }
  changeCanvas();
}

function zoomIn() {
  if (currentZoom < 1.0001) removeCanvasOuterMargin();
  timesZoomedIn += 1;
  currentZoom += 0.2;
  canvas.setZoom(currentZoom);
  zoomInObjects();
  reduceMovePolygonPathOffset();
  changeCanvas();
  setZoomOutButtonToDefault();
  if (currentZoom >= 3.69999) {
    setZoomInButtonToDisabled();
  }
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
    } else if (action === 'out' && currentZoom > 1.0001) {
      zoomOut();
    }
    if (getCrosshairUsedOnCanvasState()) setCrosshairAfterZoom();
  }
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
  enableCanvasOuterMargin();
  setZoomOutButtonToDisabled();
  if (getCrosshairUsedOnCanvasState()) {
    setCrosshairAfterZoom();
    resetCanvasCrosshairStrokeWidth(canvas);
  }
  return timesNeededToZoomOut;
}

function zoomOutObjectOnImageSelect(previousShapes, previousLabels, timesToZoomOut) {
  while (timesToZoomOut !== 0) {
    timesToZoomOut -= 1;
    zoomOutObjectsOnImageSelect(previousShapes, previousLabels);
  }
}

function loadCanvasElements(browserSpecificSetterCallback) {
  stubElement = document.getElementById('stub');
  zoomOverflowElement = document.getElementById('zoom-overflow');
  zoomOverflowWrapperElement = document.getElementById('zoom-overflow-wrapper');
  browserSpecificSetterCallback(stubElement, zoomOverflowElement, zoomOverflowWrapperElement);
}

function initialiseZoomVariables(canvasObj) {
  canvas = canvasObj;
  currentZoom = getCurrentZoomState();
  if (IS_FIREFOX) {
    initialiseVariablesFirefox(canvas);
    loadCanvasElements(setDOMElementsFirefox);
    changeElementPropertiesOnZoomFunc = changeElementPropertiesFirefox;
  } else {
    initialiseVariablesChromium(canvas);
    loadCanvasElements(setDOMElementsChromium);
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
    scrolledViaScrollbar(element);
  } else {
    scrollWheelUsed = false;
  }
  resetObjectsCoordinates();
};

export {
  zoomOutObjectOnImageSelect, zoomCanvas, resetZoom,
  initialiseZoomVariables, initiateZoomOverflowScroll,
};
