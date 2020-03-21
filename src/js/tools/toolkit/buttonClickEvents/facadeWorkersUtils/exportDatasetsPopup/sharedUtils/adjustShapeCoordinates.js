import boundingBoxProps from '../../../../../../canvas/objects/boundingBox/properties';

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
  return Math.floor(number * roundingValue) / roundingValue;
}

function getRoundingValue(decimalPlaces) {
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

function adjustIncorrectBoundingBoxCoordinates(boundingBox, imageDimensions, decimalPlaces) {
  const roundingValue = getRoundingValue(decimalPlaces);
  const {
    left, top, width, height,
  } = { ...calculateBoundingBoxCoordinates(boundingBox, imageDimensions, roundingValue) };
  const finalCoordinates = adjustBoundingBoxCoordinates(
    left, top, width, height, imageDimensions, roundingValue,
  );
  return {
    left: floorNumber(finalCoordinates.finalLeft, decimalPlaces),
    top: floorNumber(finalCoordinates.finalTop, decimalPlaces),
    width: floorNumber(finalCoordinates.finalWidth, decimalPlaces),
    height: floorNumber(finalCoordinates.finalHeight, decimalPlaces),
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
