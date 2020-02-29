import { getCurrentZoomState } from '../../../tools/toolkit/buttonClickEvents/facadeWorkersUtils/stateMachine';
import { getImageProperties } from '../../../tools/toolkit/buttonClickEvents/facadeWorkersUtils/uploadFile/drawImageOnCanvas';

function validateAndFixOutOfBoundsPolygonShapePoints(polygon) {
  polygon.points.forEach((point) => {
    if (point.x < 0) { point.x = 0; }
    if (point.y < 0) { point.y = 0; }
  });
}

function preventOutOfBoundsShapes(shape, canvas) {
  shape.setCoords();
  // multiple if statements because of corners
  // top
  if (shape.top < 0) {
    shape.top = 0;
  }
  // left
  if (shape.left < 0) {
    shape.left = 0;
  }
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
    if (shape.left + shape.width > canvas.width - 2.3) {
      shape.left = Math.floor(canvas.width - shape.width - 2.3);
    }
    // bottom
    if (shape.top + shape.height > canvas.height - 2) {
      shape.top = canvas.height - shape.height - 2;
    }
  }
}

function preventOutOfBoundsPoints(shape, canvas) {
  shape.setCoords();
  // multiple if statements because of corners
  // top
  if (shape.top + shape.height / 2 < 0) {
    shape.top = 0;
  }
  // left
  if (shape.left + shape.width / 2 < 0) {
    shape.left = 0;
  }
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
}

export {
  preventOutOfBoundsPoints, validateAndFixOutOfBoundsPolygonShapePoints, preventOutOfBoundsShapes,
};
