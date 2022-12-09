const widthDelta = 3.5;
const heightDelta = 2;

function adjustBoundingBoxCoordinates(left, top, width, height, imageDimensions) {
  const {
    scaleX, scaleY, originalWidth, originalHeight,
  } = imageDimensions;
  if (left + width > originalWidth - widthDelta / scaleX) {
    width = originalWidth - left;
  }
  if (top + height > originalHeight - heightDelta / scaleY) {
    height = originalHeight - top;
  }
  return {
    finalLeft: left,
    finalTop: top,
    finalWidth: width,
    finalHeight: height,
  };
}

function roundNumberToDecimalPlaces(number, roundingValue) {
  return Math.round(number * roundingValue) / roundingValue;
}

function calculateBoundingBoxCoordinates(boundingBox, imageDimensions, roundingValue) {
  let left = boundingBox.left / imageDimensions.scaleX;
  let top = boundingBox.top / imageDimensions.scaleY;
  let width = boundingBox.width / imageDimensions.scaleX;
  let height = boundingBox.height / imageDimensions.scaleY;
  if (roundingValue !== undefined && roundingValue !== null) {
    left = roundNumberToDecimalPlaces(left, roundingValue);
    top = roundNumberToDecimalPlaces(top, roundingValue);
    width = roundNumberToDecimalPlaces(width, roundingValue);
    height = roundNumberToDecimalPlaces(height, roundingValue);
  }
  return {
    left, top, width, height,
  };
}

function floorNumber(number, roundingValue) {
  if (roundingValue === null) { return number; }
  return Math.floor(number * roundingValue) / roundingValue;
}

function getRoundingValue(decimalPlaces) {
  if (decimalPlaces === 0) { return 1; }
  if (decimalPlaces === null || decimalPlaces === undefined) { return null; }
  let roundingValue = 1;
  while (decimalPlaces > 0) {
    roundingValue *= 10;
    decimalPlaces -= 1;
  }
  return roundingValue;
}

function adjustIncorrectBoundingBoxCoordinates(boundingBox, imageDimensions, decimalPlaces) {
  const roundingValue = getRoundingValue(decimalPlaces);
  const {
    left, top, width, height,
  } = calculateBoundingBoxCoordinates(boundingBox, imageDimensions, roundingValue);
  const finalCoordinates = adjustBoundingBoxCoordinates(
    left, top, width, height, imageDimensions,
  );
  return {
    left: finalCoordinates.finalLeft,
    top: finalCoordinates.finalTop,
    width: finalCoordinates.finalWidth,
    height: finalCoordinates.finalHeight,
  };
}

function adjustIncorrectPolygonPointCoordinates(polygonPoint, imageDimensions, decimalPlaces) {
  const roundingValue = getRoundingValue(decimalPlaces);
  let pointX = polygonPoint.x / imageDimensions.scaleX;
  let pointY = polygonPoint.y / imageDimensions.scaleY;
  const {
    scaleX, scaleY, originalWidth, originalHeight,
  } = imageDimensions;
  if (pointX > originalWidth - widthDelta / scaleX) {
    pointX = originalWidth;
  }
  if (pointY > originalHeight - heightDelta / scaleY) {
    pointY = originalHeight;
  }
  return {
    pointX: floorNumber(pointX, roundingValue),
    pointY: floorNumber(pointY, roundingValue),
  };
}

export {
  getRoundingValue,
  roundNumberToDecimalPlaces,
  adjustIncorrectBoundingBoxCoordinates,
  adjustIncorrectPolygonPointCoordinates,
};
