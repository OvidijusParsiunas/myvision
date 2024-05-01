// Initialize the rightBoundingBoxDelta variable to 0.
// This variable is used to adjust the width of bounding boxes.
let rightBoundingBoxDelta = 0;

// Prevent the top position of a shape from being less than 0.
// If the top position is less than 0, set it to 0.
function preventTopOutOfBoundsBoundingBoxOnNewObject(shape) {
  if (shape.top < 0) {
    shape.top = 0;
  }
}

// Prevent the y-coordinates of the points in a polygon from being less than 0.
// If any y-coordinate is less than 0, set it to 0.
function preventTopOutOfBoundsPolygonOnNewObject(shape) {
  if (shape.top < 0) {
    shape.points.forEach((point) => {
      if (point.y < 0) {
        point.y = 0;
      }
    });
  }
}

// Prevent the left position of a shape from being less than 0.
// If the left position is less than 0, set it to 0.
function preventLeftOutOfBoundsBoundingBoxOnNewObject(shape) {
  if (shape.left < 0) {
    shape.left = 0;
  }
}

// Prevent the x-coordinates of the points in a polygon from being less than 0.
// If any x-coordinate is less than 0, set it to 0.
function preventLeftOutOfBoundsPolygonOnNewObject(shape) {
  if (shape.left < 0) {
    shape.points.forEach((point) => {
      if (point.x < 0) {
        point.x = 0;
      }
    });
  }
}

// Prevent the right position of a bounding box from exceeding the image width.
// If the right position of the bounding box is greater than the image width minus the rightBoundingBoxDelta,
// set the width of the bounding box to the image width minus the left position minus 2.4.
function preventRightOutOfBoundsBoundingBoxOnNewObject(shape, imageWidth) {
  if (shape.left + shape.width > imageWidth - rightBoundingBoxDelta) {
    shape.width = imageWidth - shape.left - 2.4;
  }
}

// Prevent the right position of a polygon from exceeding the image width.
// If the right position of the polygon is greater than the image width minus 1.8,
// set the x-coordinate of the rightmost point to the image width minus 1.8.
function preventRightOutOfBoundsPolygonOnNewObject(shape, imageWidth) {
  if (shape.left + shape.width > imageWidth - 1.8) {
    shape.points.forEach((point) => {
      if (point.x + 1 > imageWidth - 1.8) {
        point.x -= 1.8;
      }
    });
  }
}

// Prevent the bottom position of a bounding box from exceeding the image height.
// If the bottom position of the bounding box is greater than the image height minus 2,
// set the height of the bounding box to the image height minus the top position minus 2.
function preventBottomOutOfBoundsBoundingBoxOnNewObject(shape, imageHeight) {
  if (shape.top + shape.height > imageHeight - 2) {
    shape.height = imageHeight - shape.top - 2;
  }
}

// Prevent the bottom position of a polygon from exceeding the image height.
// If the bottom position of the polygon is greater than the image height minus 2,
// set the y-coordinate of the bottommost point to the image height minus 2.
function preventBottomOutOfBoundsPolygonOnNewObject(shape, imageHeight) {
  if (shape.top + shape.height > imageHeight - 2) {
    shape.points.forEach((point) => {
      if (point.y + 1 > imageHeight - 2) {
        point.y -= 1.8;
      }
    });
  }
}

// Prevent a shape from exceeding the bounds of an image.
// If the shape is a bounding box, call the appropriate functions to prevent it from exceeding the bounds.
// If the shape is a polygon, call the appropriate functions to prevent it from exceeding the bounds.
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

// Set the rightBoundingBoxDelta variable to a new value.
function setRightBoundingBoxNewObjectDelta(delta) {
  rightBoundingBoxDelta = delta;
}

// Export the setRightBoundingBoxNewObjectDelta and preventOutOfBoundsOnNewObject functions.
export { setRightBoundingBoxNewObjectDelta, preventOutOfBoundsOnNewObject };

