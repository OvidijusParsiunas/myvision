let rightBoundingBoxDelta = 0;

function preventTopOutOfBoundsBoundingBoxOnNewObject(shape) {
  if (shape.top < 0) {
    shape.top = 0;
  }
}

function preventTopOutOfBoundsPolygonOnNewObject(shape) {
  if (shape.top < 0) {
    shape.points.forEach((point) => {
      if (point.y < 0) {
        point.y = 0;
      }
    });
  }
}

function preventLeftOutOfBoundsBoundingBoxOnNewObject(shape) {
  if (shape.left < 0) {
    shape.left = 0;
  }
}

function preventLeftOutOfBoundsPolygonOnNewObject(shape) {
  if (shape.left < 0) {
    shape.points.forEach((point) => {
      if (point.x < 0) {
        point.x = 0;
      }
    });
  }
}

function preventRightOutOfBoundsBoundingBoxOnNewObject(shape, imageWidth) {
  if (shape.left + shape.width > imageWidth - rightBoundingBoxDelta) {
    shape.width = imageWidth - shape.left - 2.4;
  }
}

function preventRightOutOfBoundsPolygonOnNewObject(shape, imageWidth) {
  if (shape.left + shape.width > imageWidth - 1.8) {
    shape.points.forEach((point) => {
      if (point.x + 1 > imageWidth - 1.8) {
        point.x -= 1.8;
      }
    });
  }
}

function preventBottomOutOfBoundsBoundingBoxOnNewObject(shape, imageHeight) {
  if (shape.top + shape.height > imageHeight - 2) {
    shape.height = imageHeight - shape.top - 2;
  }
}

function preventBottomOutOfBoundsPolygonOnNewObject(shape, imageHeight) {
  if (shape.top + shape.height > imageHeight - 2) {
    shape.points.forEach((point) => {
      if (point.y + 1 > imageHeight - 2) {
        point.y -= 1.8;
      }
    });
  }
}

function preventOutOfBoundsOnNewObject(shape, imageScalingDimensions, imageLengthDimensions) {
  const imageHeight = imageLengthDimensions.height * imageScalingDimensions.scaleY;
  const imageWidth = imageLengthDimensions.width * imageScalingDimensions.scaleX;
  shape.setCoords();
  if (shape.shapeName === 'bndBox') {
    preventRightOutOfBoundsBoundingBoxOnNewObject(shape, imageWidth);
    preventBottomOutOfBoundsBoundingBoxOnNewObject(shape, imageHeight);
    preventTopOutOfBoundsBoundingBoxOnNewObject(shape);
    preventLeftOutOfBoundsBoundingBoxOnNewObject(shape);
  } else if (shape.shapeName === 'polygon') {
    preventRightOutOfBoundsPolygonOnNewObject(shape, imageWidth);
    preventBottomOutOfBoundsPolygonOnNewObject(shape, imageHeight);
    preventTopOutOfBoundsPolygonOnNewObject(shape);
    preventLeftOutOfBoundsPolygonOnNewObject(shape);
  }
}

function setRightBoundingBoxNewObjectDelta(delta) {
  rightBoundingBoxDelta = delta;
}

export { setRightBoundingBoxNewObjectDelta, preventOutOfBoundsOnNewObject };
