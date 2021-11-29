import { getCurrentZoomState } from '../../../tools/state.js';
import { getImageProperties } from '../../../tools/imageList/uploadImages/drawImageOnCanvas.js';

let rightBoundingBoxDelta = 0;

function validateAndFixOutOfBoundsPolygonShapePointsAfterMove(polygon) {
  polygon.points.forEach((point) => {
    if (point.x < 0) { point.x = 0; }
    if (point.y < 0) { point.y = 0; }
  });
}

function preventRightOutOfBoundsBoundingBoxOnMove(shape, canvas) {
  if (shape.left + shape.width > canvas.width - rightBoundingBoxDelta) {
    shape.left = Math.floor(canvas.width - shape.width - rightBoundingBoxDelta);
  }
}

function preventRightOutOfBoundsPolygonOnMove(shape, canvas) {
  if (shape.left + shape.width > canvas.width - 1.8) {
    shape.left = Math.floor(canvas.width - shape.width - 1.8);
  }
}

function preventOutOfBoundsShapesOnMove(shape, canvas) {
  shape.setCoords();
  // multiple if statements because of corners
  if (getCurrentZoomState() > 1.00001) {
    const { height, width } = getImageProperties();
    const imageHeight = height * getCurrentZoomState();
    const imageWidth = width * getCurrentZoomState();
    // right
    if (shape.left + shape.width > imageWidth / getCurrentZoomState()
    - (getCurrentZoomState())) {
      shape.left = imageWidth / getCurrentZoomState() - shape.width - 2;
    }
    // bottom
    if (shape.top + shape.height > imageHeight / getCurrentZoomState()
    - getCurrentZoomState()) {
      shape.top = imageHeight / getCurrentZoomState() - shape.height - 2;
    }
  } else {
    // right
    if (shape.shapeName === 'bndBox') {
      preventRightOutOfBoundsBoundingBoxOnMove(shape, canvas);
    } else if (shape.shapeName === 'polygon') {
      preventRightOutOfBoundsPolygonOnMove(shape, canvas);
    }
    // bottom
    if (shape.top + shape.height > canvas.height - 2) {
      shape.top = canvas.height - shape.height - 2;
    }
  }
  // top
  if (shape.top < 0) {
    shape.top = 0;
  }
  // left
  if (shape.left < 0) {
    shape.left = 0;
  }
}

function preventOutOfBoundsPointsOnMove(shape, canvas) {
  shape.setCoords();
  // multiple if statements because of corners
  if (getCurrentZoomState() > 1.00001) {
    const { height, width } = getImageProperties();
    const imageHeight = height * getCurrentZoomState();
    const imageWidth = width * getCurrentZoomState();
    // right
    if (shape.left + shape.width / 2
      > imageWidth / getCurrentZoomState() + 0.75) {
      shape.left = imageWidth / getCurrentZoomState() - shape.width / 2;
    }
    // bottom
    if (shape.top + shape.height / 2
      > imageHeight / getCurrentZoomState() + 1) {
      shape.top = imageHeight / getCurrentZoomState() - shape.height / 2 + 1;
    }
  } else {
    // right
    if (shape.left + shape.width / 2 > canvas.width + 1.5) {
      shape.left = canvas.width - shape.width / 2 + 1.5;
    }
    // bottom
    if (shape.top + shape.height / 2 > canvas.height + 1.5) {
      shape.top = canvas.height - shape.height / 2 + 1.5;
    }
  }
  // top
  if (shape.top + shape.height / 2 < 0) {
    shape.top = 0;
  }
  // left
  if (shape.left + shape.width / 2 < 0) {
    shape.left = 0;
  }
}

function setRightBoundingBoxMovingDelta(delta) {
  rightBoundingBoxDelta = delta;
}

export {
  setRightBoundingBoxMovingDelta, preventOutOfBoundsPointsOnMove,
  validateAndFixOutOfBoundsPolygonShapePointsAfterMove, preventOutOfBoundsShapesOnMove,
};
