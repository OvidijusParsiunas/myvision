import { getCurrentZoomState } from '../../../tools/toolkit/buttonClickEvents/facadeWorkersUtils/stateMachine';
import { getImageProperties } from '../../../tools/toolkit/buttonClickEvents/facadeWorkersUtils/uploadFile/drawImageOnCanvas';

let rightBoundingBoxDelta = 0;

function validateAndFixOutOfBoundsPolygonShapePoints(polygon) {
  polygon.points.forEach((point) => {
    if (point.x < 0) { point.x = 0; }
    if (point.y < 0) { point.y = 0; }
  });
}

function preventRightOutOfBoundsBoundingBox(shape, canvas) {
  if (shape.left + shape.width > canvas.width - rightBoundingBoxDelta) {
    shape.left = Math.floor(canvas.width - shape.width - rightBoundingBoxDelta);
  }
}

function preventRightOutOfBoundsPolygon(shape, canvas) {
  if (shape.left + shape.width > canvas.width - 1.8) {
    shape.left = Math.floor(canvas.width - shape.width - 1.8);
  }
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
    if (shape.shapeName === 'bndBox') {
      preventRightOutOfBoundsBoundingBox(shape, canvas);
    } else if (shape.shapeName === 'polygon') {
      preventRightOutOfBoundsPolygon(shape, canvas);
    }
    // bottom
    if (shape.top + shape.height > canvas.height - 2) {
      shape.top = canvas.height - shape.height - 2;
    }
  }
}

function preventTopOutOfBoundsBoundingBoxOnExternalObject(shape) {
  if (shape.top < 0) {
    shape.top = 0;
  }
}

function preventTopOutOfBoundsPolygonOnExternalObject(shape) {
  if (shape.top < 0) {
    shape.points.forEach((point) => {
      if (point.y < 0) {
        point.y = 0;
      }
    });
  }
}

function preventLeftOutOfBoundsBoundingBoxOnExternalObject(shape) {
  if (shape.left < 0) {
    shape.left = 0;
  }
}

function preventLeftOutOfBoundsPolygonOnExternalObject(shape) {
  if (shape.left < 0) {
    shape.points.forEach((point) => {
      if (point.x < 0) {
        point.x = 0;
      }
    });
  }
}

function preventRightOutOfBoundsBoundingBoxOnExternalObject(shape, imageWidth) {
  if (shape.left + shape.width > imageWidth - rightBoundingBoxDelta) {
    shape.width = imageWidth - shape.left - 2.4;
  }
}

function preventRightOutOfBoundsPolygonOnExternalObject(shape, imageWidth) {
  if (shape.left + shape.width > imageWidth - 1.8) {
    shape.points.forEach((point) => {
      if (point.x + 1 > imageWidth - 1.8) {
        point.x -= 1.8;
      }
    });
  }
}

function preventBottomOutOfBoundsBoundingBoxOnExternalObject(shape, imageHeight) {
  if (shape.top + shape.height > imageHeight - 2) {
    shape.height = imageHeight - shape.top - 2;
  }
}

function preventBottomOutOfBoundsPolygonOnExternalObject(shape, imageHeight) {
  if (shape.top + shape.height > imageHeight - 2) {
    shape.points.forEach((point) => {
      if (point.y + 1 > imageHeight - 2) {
        point.y -= 1.8;
      }
    });
  }
}

function preventOutOfBoundsOnExternalSourceObject(shape, imageScalingDimensions,
  imageParameterDimensions) {
  const imageHeight = imageParameterDimensions.height * imageScalingDimensions.scaleY;
  const imageWidth = imageParameterDimensions.width * imageScalingDimensions.scaleX;
  shape.setCoords();
  if (shape.shapeName === 'bndBox') {
    preventTopOutOfBoundsBoundingBoxOnExternalObject(shape);
    preventLeftOutOfBoundsBoundingBoxOnExternalObject(shape);
    preventRightOutOfBoundsBoundingBoxOnExternalObject(shape, imageWidth);
    preventBottomOutOfBoundsBoundingBoxOnExternalObject(shape, imageHeight);
  } else if (shape.shapeName === 'polygon') {
    preventTopOutOfBoundsPolygonOnExternalObject(shape);
    preventLeftOutOfBoundsPolygonOnExternalObject(shape);
    preventRightOutOfBoundsPolygonOnExternalObject(shape, imageWidth);
    preventBottomOutOfBoundsPolygonOnExternalObject(shape, imageHeight);
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

function setRightBoundingBoxMovingDelta(delta) {
  rightBoundingBoxDelta = delta;
}

export {
  setRightBoundingBoxMovingDelta, preventOutOfBoundsShapes, preventOutOfBoundsPoints,
  preventOutOfBoundsOnExternalSourceObject, validateAndFixOutOfBoundsPolygonShapePoints,
};
