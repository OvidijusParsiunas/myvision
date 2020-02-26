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

export { adjustIncorrectBoundingBoxCoordinates as default };
