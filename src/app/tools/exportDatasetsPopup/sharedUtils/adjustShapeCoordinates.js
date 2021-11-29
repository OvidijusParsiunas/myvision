import boundingBoxProps from '../../../canvas/objects/boundingBox/properties.js';

const widthDelta = 3.5;
const heightDelta = 2;

function adjustBoundingBoxCoordinates(left, top, width, height, imageDimensions) {
  const {
    scaleX, scaleY, originalWidth, originalHeight,
  } = imageDimensions;
  if (left + width > originalWidth - widthDelta / scaleX) {
    width = originalWidth - left;
  } else {
    width += boundingBoxProps.getStandaloneBoundingBoxProperties(imageDimensions).strokeWidth;
  }
  if (top + height > originalHeight - heightDelta / scaleY) {
    height = originalHeight - top;
  } else {
    height += boundingBoxProps.getStandaloneBoundingBoxProperties(imageDimensions).strokeWidth;
  }
  return {
    finalLeft: left,
    finalTop: top,
    finalWidth: width,
    finalHeight: height,
  };
}

function calculateBoundingBoxCoordinates(boundingBox, imageDimensions) {
  const left = boundingBox.left / imageDimensions.scaleX;
  const top = boundingBox.top / imageDimensions.scaleY;
  const width = boundingBox.width / imageDimensions.scaleX;
  const height = boundingBox.height / imageDimensions.scaleY;
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

function roundNumberToDecimalPlaces(number, decimalPlaces) {
  const roundingValue = getRoundingValue(decimalPlaces);
  return floorNumber(number, roundingValue);
}

function ceilNumber(number, roundingValue) {
  if (roundingValue === null) { return number; }
  return Math.ceil(number * roundingValue) / roundingValue;
}

function adjustIncorrectBoundingBoxCoordinates(boundingBox, imageDimensions, decimalPlaces) {
  const roundingValue = getRoundingValue(decimalPlaces);
  const {
    left, top, width, height,
  } = { ...calculateBoundingBoxCoordinates(boundingBox, imageDimensions, roundingValue) };
  const finalCoordinates = adjustBoundingBoxCoordinates(
    left, top, width, height, imageDimensions, roundingValue,
  );
  return {
    left: floorNumber(finalCoordinates.finalLeft, roundingValue),
    top: floorNumber(finalCoordinates.finalTop, roundingValue),
    width: ceilNumber(finalCoordinates.finalWidth, roundingValue),
    height: ceilNumber(finalCoordinates.finalHeight, roundingValue),
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
  roundNumberToDecimalPlaces,
  adjustIncorrectBoundingBoxCoordinates,
  adjustIncorrectPolygonPointCoordinates,
};
