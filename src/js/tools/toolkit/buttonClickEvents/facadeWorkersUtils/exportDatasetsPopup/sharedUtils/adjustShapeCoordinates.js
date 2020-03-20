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
    width += Math.round(
      boundingBoxProps.getStandaloneBoundingBoxProperties(imageDimensions).strokeWidth,
    );
  }
  if (top + height > originalHeight - heightDelta / scaleY) {
    height = originalHeight - top;
  } else {
    height += Math.round(
      boundingBoxProps.getStandaloneBoundingBoxProperties(imageDimensions).strokeWidth,
    );
  }
  return {
    finalLeft: left,
    finalTop: top,
    finalWidth: width,
    finalHeight: height,
  };
}

function calculateBoundingBoxCoordinates(boundingBox, imageDimensions) {
  const left = Math.round(boundingBox.left / imageDimensions.scaleX);
  const top = Math.round(boundingBox.top / imageDimensions.scaleY);
  const width = Math.round(boundingBox.width / imageDimensions.scaleX);
  const height = Math.round(boundingBox.height / imageDimensions.scaleY);
  return {
    left, top, width, height,
  };
}

function adjustIncorrectBoundingBoxCoordinates(boundingBox, imageDimensions) {
  const {
    left, top, width, height,
  } = { ...calculateBoundingBoxCoordinates(boundingBox, imageDimensions) };
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

function adjustIncorrectPolygonPointCoordinates(polygonPoint, imageDimensions) {
  let pointX = Math.round((polygonPoint.x / imageDimensions.scaleX) * 100) / 100;
  let pointY = Math.round((polygonPoint.y / imageDimensions.scaleY) * 100) / 100;
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
    pointX,
    pointY,
  };
}

export { adjustIncorrectBoundingBoxCoordinates, adjustIncorrectPolygonPointCoordinates };
