import { getMovableObjectsState } from '../../../tools/state.js';
import { setPolygonLabelOffsetProps } from '../label/label.js';

function prepareObjectsForEditablePolygonPoints(object, isDrawing) {
  if (isDrawing) {
    if (object.shapeName !== 'bndBox') {
      object.perPixelTargetFind = true;
    }
  }
  if (object.shapeName === 'bndBox') {
    object.selectable = false;
  } else {
    object.lockMovementX = true;
    object.lockMovementY = true;
  }
}

function setObjectPropertiesToDefault(object) {
  if (getMovableObjectsState() || (object.shapeName !== 'bndBox' && object.shapeName !== 'polygon')) {
    object.lockMovementX = false;
    object.lockMovementY = false;
    object.hoverCursor = 'move';
  } else if (object.shapeName === 'bndBox') {
    object.lockMovementX = true;
    object.lockMovementY = true;
    object.hoverCursor = 'default';
  }
  object.selectable = true;
}

function setObjectPropertiesToDefaultWhenReadyToDraw(canvas) {
  canvas.forEachObject((iteratedObj) => {
    if (getMovableObjectsState()) {
      iteratedObj.lockMovementX = false;
      iteratedObj.lockMovementY = false;
      iteratedObj.hoverCursor = 'move';
    } else {
      iteratedObj.lockMovementX = true;
      iteratedObj.lockMovementY = true;
      iteratedObj.hoverCursor = 'default';
    }
    iteratedObj.selectable = true;
  });
}

function setObjectsHoverCursorToDefault(canvas) {
  canvas.forEachObject((iteratedObj) => {
    iteratedObj.hoverCursor = 'default';
  });
}

function resetPolygonSelectableArea(currentPolygon) {
  const newPosition = currentPolygon._calcDimensions();
  currentPolygon.set({
    left: newPosition.left,
    top: newPosition.top,
    height: newPosition.height,
    width: newPosition.width,
    pathOffset: {
      x: newPosition.left + newPosition.width / 2,
      y: newPosition.top + newPosition.height / 2,
    },
  });
  currentPolygon.setCoords();
}

function crosshair(object, canvas) {
  if (object.orientation === 'x') {
    object.set({ y2: canvas.height });
  } else if (object.orientation === 'y') {
    object.set({ x2: canvas.width });
  }
}

function resizeAllObjectsDimensionsByDoubleScale(newFileSizeRatio, canvas) {
  canvas.forEachObject((object) => {
    switch (object.shapeName) {
      case 'polygon':
        object.points.forEach((point) => {
          point.x *= newFileSizeRatio.width;
          point.y *= newFileSizeRatio.height;
        });
        resetPolygonSelectableArea(object, newFileSizeRatio);
        setPolygonLabelOffsetProps(object, object.points[0]);
        break;
      case 'tempPolygon':
        object.points.forEach((point) => {
          point.x *= newFileSizeRatio.width;
          point.y *= newFileSizeRatio.height;
        });
        break;
      case 'point':
      case 'invisiblePoint':
      case 'firstPoint':
      case 'tempPoint':
      case 'initialAddPoint':
      case 'label':
        object.top *= newFileSizeRatio.height;
        object.left *= newFileSizeRatio.width;
        break;
      case 'addPointsLine':
        object.top *= newFileSizeRatio.height;
        object.left *= newFileSizeRatio.width;
        object.height *= newFileSizeRatio.height;
        object.width *= newFileSizeRatio.width;
        object.x1 *= newFileSizeRatio.width;
        object.x2 *= newFileSizeRatio.width;
        object.y1 *= newFileSizeRatio.height;
        object.y2 *= newFileSizeRatio.height;
        break;
      case 'bndBox':
        object.height *= newFileSizeRatio.height;
        object.width *= newFileSizeRatio.width;
        object.top *= newFileSizeRatio.height;
        object.left *= newFileSizeRatio.width;
        break;
      default:
        break;
    }
    if (object.shapeName === 'crosshairLine') {
      crosshair(object, canvas);
    } else {
      object.setCoords();
    }
  });
  canvas.renderAll();
}

function resizeLabelDimensionsBySingleScale(object, newFileSizeRatio) {
  object.top *= newFileSizeRatio;
  object.left *= newFileSizeRatio;
}

function resizeAllPassedObjectsDimensionsBySingleScale(object, newFileSizeRatio) {
  switch (object.shapeName) {
    case 'polygon':
      object.points.forEach((point) => {
        point.x *= newFileSizeRatio;
        point.y *= newFileSizeRatio;
      });
      resetPolygonSelectableArea(object);
      setPolygonLabelOffsetProps(object, object.points[0]);
      break;
    case 'tempPolygon':
      object.points.forEach((point) => {
        point.x *= newFileSizeRatio;
        point.y *= newFileSizeRatio;
      });
      break;
    case 'point':
    case 'invisiblePoint':
    case 'firstPoint':
    case 'tempPoint':
    case 'initialAddPoint':
    case 'label':
      resizeLabelDimensionsBySingleScale(object, newFileSizeRatio);
      break;
    case 'addPointsLine':
      object.top *= newFileSizeRatio;
      object.left *= newFileSizeRatio;
      object.height *= newFileSizeRatio;
      object.width *= newFileSizeRatio;
      object.x1 *= newFileSizeRatio;
      object.x2 *= newFileSizeRatio;
      object.y1 *= newFileSizeRatio;
      object.y2 *= newFileSizeRatio;
      break;
    case 'bndBox':
      object.height *= newFileSizeRatio;
      object.width *= newFileSizeRatio;
      object.top *= newFileSizeRatio;
      object.left *= newFileSizeRatio;
      break;
    default:
      break;
  }
  object.setCoords();
}

export {
  setObjectPropertiesToDefault,
  setObjectsHoverCursorToDefault,
  resizeLabelDimensionsBySingleScale,
  prepareObjectsForEditablePolygonPoints,
  resizeAllObjectsDimensionsByDoubleScale,
  setObjectPropertiesToDefaultWhenReadyToDraw,
  resizeAllPassedObjectsDimensionsBySingleScale,
};
